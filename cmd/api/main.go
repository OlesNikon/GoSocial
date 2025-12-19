package main

import (
	"expvar"
	"runtime"
	"time"

	_ "github.com/OlesNikon/social/docs"
	"github.com/OlesNikon/social/internal/auth"
	"github.com/OlesNikon/social/internal/db"
	"github.com/OlesNikon/social/internal/env"
	"github.com/OlesNikon/social/internal/mailer"
	"github.com/OlesNikon/social/internal/ratelimiter"
	"github.com/OlesNikon/social/internal/store"
	"github.com/OlesNikon/social/internal/store/cache"
	"github.com/go-redis/redis/v8"
	"go.uber.org/zap"
)

const version = "0.0.1"

//	@title			Gopher Social API
//	@description	API for Gopher Social, a social network for gophers
//	@termsOfService	http://swagger.io/terms/

//	@contact.name	API Support
//	@contact.url	http://www.swagger.io/support
//	@contact.email	support@swagger.io

//	@license.name	Apache 2.0
//	@license.url	http://www.apache.org/licenses/LICENSE-2.0.html

//	@host		localhost:8080
//	@BasePath	/v1

//	@securityDefinitions.apiKey	ApiKeyAuth
//	@in							header
//	@name						Authorization
//	@description				Description for what is this security definition being used

func main() {
	cfg := config{
		addr:        env.GetString("ADDR", ":8080"),
		apiURL:      env.GetString("EXTERNAL_URL", "localhost:8080"),
		frontendURL: env.GetString("FRONTEND_URL", "http://localhost:5173"),
		db: dbConfig{
			addr:         env.GetString("DB_ADDR", "postgres://admin:adminpassword@localhost/socialnetwork?sslmode=disable"),
			maxOpenConns: env.GetInt("DB_MAX_OPEN_CONNS", 30),
			maxIdleConns: env.GetInt("DB_MAX_IDLE_CONNS", 30),
			maxIdleTime:  env.GetString("DB_MAX_IDLE_TIME", "15m"),
		},
		redisCfg: redisConfig{
			addr:    env.GetString("REDIS_ADDR", "localhost:6379"),
			pw:      env.GetString("REDIS_PW", ""),
			db:      env.GetInt("REDIS_DB", 0),
			enabled: env.GetBool("REDIS_ENABLED", false),
		},
		env: env.GetString("ENV", "development"),
		mail: mailConfig{
			exp:       time.Hour * 24 * 3, // 3 days
			fromEmail: env.GetString("FROM_EMAIL", "no-reply@gophersocial.com"),
			sendGrid: sendGridConfig{
				apiKey: env.GetString("SENDGRID_API_KEY", ""),
			},
		},
		auth: authConfig{
			basic: basicConfig{
				user: env.GetString("AUTH_BASIC_USER", "admin"),
				pass: env.GetString("AUTH_BASIC_PASS", "admin"),
			},
			token: tokenConfig{
				secret: env.GetString("AUTH_TOKEN_SECRET", "example"),
				exp:    time.Hour * 24 * 3, // 3 days
				iss:    "gophersocial",
			},
		},
		ratelimiter: ratelimiter.Config{
			RequestsPerTimeFrame: env.GetInt("RATELIMITER_REQUESTS_COUNT", 100),
			TimeFrame:            time.Second * 5,
			Enabled:              env.GetBool("RATE_LIMIT_ENABLED", true),
		},
	}

	logger := zap.Must(zap.NewProduction()).Sugar()
	defer logger.Sync()

	db, err := db.New(
		cfg.db.addr,
		cfg.db.maxOpenConns,
		cfg.db.maxIdleConns,
		cfg.db.maxIdleTime,
	)
	if err != nil {
		logger.Fatal(err)
	}

	defer db.Close()
	logger.Info("database connection pool established")

	var rdb *redis.Client
	if cfg.redisCfg.enabled {
		rdb = cache.NewRedisClient(
			cfg.redisCfg.addr,
			cfg.redisCfg.pw,
			cfg.redisCfg.db,
		)
		logger.Info("redis cache connection established")

		defer rdb.Close()
	}

	ratelimiter := ratelimiter.NewFixedWindowRateLimiter(
		cfg.ratelimiter.RequestsPerTimeFrame,
		cfg.ratelimiter.TimeFrame,
	)

	store := store.NewStorage(db)
	cacheStorage := cache.NewRedisStorage(rdb)

	mailer := mailer.NewSendGrid(
		cfg.mail.sendGrid.apiKey,
		cfg.mail.fromEmail,
	)

	tokenHost := cfg.auth.token.iss
	jwtAuthenticator := auth.NewJWTAuthenticator(cfg.auth.token.secret, tokenHost, tokenHost)

	app := &application{
		config:        cfg,
		store:         store,
		cacheStorage:  cacheStorage,
		logger:        logger,
		mailer:        mailer,
		authenticator: jwtAuthenticator,
		ratelimiter:   ratelimiter,
	}

	expvar.NewString("version").Set(version)
	expvar.Publish("database", expvar.Func(func() any {
		return db.Stats()
	}))
	expvar.Publish("goroutines", expvar.Func(func() any {
		return runtime.NumGoroutine()
	}))

	mux := app.mount()
	logger.Fatal(app.run(mux))
}
