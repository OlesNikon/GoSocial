package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/OlesNikon/social/internal/auth"
	"github.com/OlesNikon/social/internal/ratelimiter"
	"github.com/OlesNikon/social/internal/store"
	"github.com/OlesNikon/social/internal/store/cache"
	"go.uber.org/zap"
)

func newTestApplication(t *testing.T, cfg config) *application {
	t.Helper()
	logger := zap.Must(zap.NewProduction()).Sugar()
	mockStore := store.NewMockStore()
	mockCacheStore := &cache.MockUserStore{}

	testAuth := &auth.TestAuthenticator{}

	// Initialize rate limiter if enabled
	var rateLimiter ratelimiter.Limiter
	if cfg.ratelimiter.Enabled {
		rateLimiter = ratelimiter.NewFixedWindowRateLimiter(
			cfg.ratelimiter.RequestsPerTimeFrame,
			cfg.ratelimiter.TimeFrame,
		)
	}

	return &application{
		logger:        logger,
		store:         mockStore,
		cacheStorage:  cache.Storage{Users: mockCacheStore},
		authenticator: testAuth,
		config:        cfg,
		ratelimiter:   rateLimiter,
	}
}

func executeRequest(req *http.Request, mux http.Handler) *httptest.ResponseRecorder {
	rr := httptest.NewRecorder()
	mux.ServeHTTP(rr, req)

	return rr
}
