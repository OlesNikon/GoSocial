package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/OlesNikon/social/internal/ratelimiter"
	"github.com/stretchr/testify/assert"
)

func TestRateLimiterMiddleware(t *testing.T) {
	t.Run("should enforce rate limits correctly", func(t *testing.T) {
		cfg := config{
			ratelimiter: ratelimiter.Config{
				RequestsPerTimeFrame: 20,
				TimeFrame:            time.Second * 5,
				Enabled:              true,
			},
			addr: ":8080",
			auth: authConfig{
				basic: basicConfig{
					user: "admin",
					pass: "admin",
				},
			},
		}

		app := newTestApplication(t, cfg)
		ts := httptest.NewServer(app.mount())
		defer ts.Close()

		client := &http.Client{}
		mockIP := "192.168.1.1"
		marginOfError := 2

		for i := 0; i < cfg.ratelimiter.RequestsPerTimeFrame+marginOfError; i++ {
			req, err := http.NewRequest("GET", ts.URL+"/v1/health", nil)
			assert.NoError(t, err)

			req.Header.Set("X-Forwarded-For", mockIP)
			req.SetBasicAuth("admin", "admin")

			resp, err := client.Do(req)
			assert.NoError(t, err)
			defer resp.Body.Close()

			if i < cfg.ratelimiter.RequestsPerTimeFrame {
				assert.Equal(t, http.StatusOK, resp.StatusCode,
					"Expected status OK on request %d", i+1)
			} else {
				assert.Equal(t, http.StatusTooManyRequests, resp.StatusCode,
					"Expected status Too Many Requests on request %d", i+1)
			}
		}
	})

	t.Run("should track different IPs separately", func(t *testing.T) {
		cfg := config{
			ratelimiter: ratelimiter.Config{
				RequestsPerTimeFrame: 5,
				TimeFrame:            time.Second * 5,
				Enabled:              true,
			},
			addr: ":8080",
			auth: authConfig{
				basic: basicConfig{
					user: "admin",
					pass: "admin",
				},
			},
		}

		app := newTestApplication(t, cfg)
		ts := httptest.NewServer(app.mount())
		defer ts.Close()

		client := &http.Client{}

		// Test with first IP
		for i := 0; i < 5; i++ {
			req, err := http.NewRequest("GET", ts.URL+"/v1/health", nil)
			assert.NoError(t, err)
			req.Header.Set("X-Forwarded-For", "192.168.1.1")
			req.SetBasicAuth("admin", "admin")

			resp, err := client.Do(req)
			assert.NoError(t, err)
			resp.Body.Close()
			assert.Equal(t, http.StatusOK, resp.StatusCode)
		}

		// Test with second IP - should still be allowed
		for i := 0; i < 5; i++ {
			req, err := http.NewRequest("GET", ts.URL+"/v1/health", nil)
			assert.NoError(t, err)
			req.Header.Set("X-Forwarded-For", "192.168.1.2")
			req.SetBasicAuth("admin", "admin")

			resp, err := client.Do(req)
			assert.NoError(t, err)
			resp.Body.Close()
			assert.Equal(t, http.StatusOK, resp.StatusCode)
		}

		// First IP should now be rate limited
		req, err := http.NewRequest("GET", ts.URL+"/v1/health", nil)
		assert.NoError(t, err)
		req.Header.Set("X-Forwarded-For", "192.168.1.1")
		req.SetBasicAuth("admin", "admin")

		resp, err := client.Do(req)
		assert.NoError(t, err)
		resp.Body.Close()
		assert.Equal(t, http.StatusTooManyRequests, resp.StatusCode)
	})

	t.Run("should not enforce rate limits when disabled", func(t *testing.T) {
		cfg := config{
			ratelimiter: ratelimiter.Config{
				RequestsPerTimeFrame: 5,
				TimeFrame:            time.Second * 5,
				Enabled:              false, // Disabled
			},
			addr: ":8080",
			auth: authConfig{
				basic: basicConfig{
					user: "admin",
					pass: "admin",
				},
			},
		}

		app := newTestApplication(t, cfg)
		ts := httptest.NewServer(app.mount())
		defer ts.Close()

		client := &http.Client{}
		mockIP := "192.168.1.1"

		// Send more requests than the limit
		for i := 0; i < 10; i++ {
			req, err := http.NewRequest("GET", ts.URL+"/v1/health", nil)
			assert.NoError(t, err)

			req.Header.Set("X-Forwarded-For", mockIP)
			req.SetBasicAuth("admin", "admin")

			resp, err := client.Do(req)
			assert.NoError(t, err)
			resp.Body.Close()

			// All requests should succeed since rate limiting is disabled
			assert.Equal(t, http.StatusOK, resp.StatusCode)
		}
	})
}
