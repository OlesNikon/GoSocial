package main

import (
	"net/http"
	"testing"

	"github.com/OlesNikon/social/internal/store/cache"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestGetUser(t *testing.T) {
	t.Run("should not allow unauthenticated requests", func(t *testing.T) {
		app := newTestApplication(t, config{
			redisCfg: redisConfig{enabled: true},
		})
		mux := app.mount()

		req, err := http.NewRequest(http.MethodGet, "/v1/users/1", nil)
		assert.NoError(t, err)

		rr := executeRequest(req, mux)
		assert.Equal(t, http.StatusUnauthorized, rr.Code)
	})

	t.Run("should reject requests with invalid bearer token", func(t *testing.T) {
		app := newTestApplication(t, config{
			redisCfg: redisConfig{enabled: true},
		})
		mux := app.mount()

		req, err := http.NewRequest(http.MethodGet, "/v1/users/1", nil)
		assert.NoError(t, err)
		req.Header.Set("Authorization", "Bearer invalid-token")

		rr := executeRequest(req, mux)
		assert.Equal(t, http.StatusUnauthorized, rr.Code)
	})

	t.Run("should return 400 for invalid user ID", func(t *testing.T) {
		app := newTestApplication(t, config{
			redisCfg: redisConfig{enabled: true},
		})
		mux := app.mount()
		mockCacheStore := app.cacheStorage.Users.(*cache.MockUserStore)

		testToken, err := app.authenticator.GenerateToken(nil)
		assert.NoError(t, err)

		// Mock expectations for token validation
		mockCacheStore.On("Get", int64(42)).Return(nil, nil).Once()
		mockCacheStore.On("Set", mock.Anything).Return(nil).Once()

		req, err := http.NewRequest(http.MethodGet, "/v1/users/invalid", nil)
		assert.NoError(t, err)
		req.Header.Set("Authorization", "Bearer "+testToken)

		rr := executeRequest(req, mux)
		assert.Equal(t, http.StatusBadRequest, rr.Code)
	})

	t.Run("should allow authenticated requests with cache enabled", func(t *testing.T) {
		app := newTestApplication(t, config{
			redisCfg: redisConfig{enabled: true},
		})
		mux := app.mount()
		mockCacheStore := app.cacheStorage.Users.(*cache.MockUserStore)

		testToken, err := app.authenticator.GenerateToken(nil)
		assert.NoError(t, err)

		// Mock expectations for token validation (user ID 42 from token)
		mockCacheStore.On("Get", int64(42)).Return(nil, nil).Once()
		mockCacheStore.On("Set", mock.Anything).Return(nil).Once()

		// Mock expectations for the requested user (user ID 1)
		mockCacheStore.On("Get", int64(1)).Return(nil, nil).Once()
		mockCacheStore.On("Set", mock.Anything).Return(nil).Once()

		req, err := http.NewRequest(http.MethodGet, "/v1/users/1", nil)
		assert.NoError(t, err)
		req.Header.Set("Authorization", "Bearer "+testToken)

		rr := executeRequest(req, mux)
		assert.Equal(t, http.StatusOK, rr.Code)

		mockCacheStore.AssertExpectations(t)
	})

	t.Run("should hit cache and set user if cache miss", func(t *testing.T) {
		app := newTestApplication(t, config{
			redisCfg: redisConfig{enabled: true},
		})
		mux := app.mount()
		mockCacheStore := app.cacheStorage.Users.(*cache.MockUserStore)

		testToken, err := app.authenticator.GenerateToken(nil)
		assert.NoError(t, err)

		// Mock expectations for token validation
		mockCacheStore.On("Get", int64(42)).Return(nil, nil).Once()
		mockCacheStore.On("Set", mock.Anything).Return(nil).Once()

		// Mock expectations for the requested user
		mockCacheStore.On("Get", int64(1)).Return(nil, nil).Once()
		mockCacheStore.On("Set", mock.Anything).Return(nil).Once()

		req, err := http.NewRequest(http.MethodGet, "/v1/users/1", nil)
		assert.NoError(t, err)
		req.Header.Set("Authorization", "Bearer "+testToken)

		rr := executeRequest(req, mux)
		assert.Equal(t, http.StatusOK, rr.Code)

		mockCacheStore.AssertNumberOfCalls(t, "Get", 2)
		mockCacheStore.AssertNumberOfCalls(t, "Set", 2)
		mockCacheStore.AssertExpectations(t)
	})

	t.Run("should NOT hit cache when cache is disabled", func(t *testing.T) {
		app := newTestApplication(t, config{
			redisCfg: redisConfig{enabled: false},
		})
		mux := app.mount()
		mockCacheStore := app.cacheStorage.Users.(*cache.MockUserStore)

		testToken, err := app.authenticator.GenerateToken(nil)
		assert.NoError(t, err)

		req, err := http.NewRequest(http.MethodGet, "/v1/users/1", nil)
		assert.NoError(t, err)
		req.Header.Set("Authorization", "Bearer "+testToken)

		rr := executeRequest(req, mux)
		assert.Equal(t, http.StatusOK, rr.Code)

		mockCacheStore.AssertNotCalled(t, "Get")
		mockCacheStore.AssertNotCalled(t, "Set")
	})
}

func TestGetUserFollowers(t *testing.T) {
	t.Run("should require authentication", func(t *testing.T) {
		app := newTestApplication(t, config{
			redisCfg: redisConfig{enabled: false},
		})
		mux := app.mount()

		req, err := http.NewRequest(http.MethodGet, "/v1/users/1/followers", nil)
		assert.NoError(t, err)

		rr := executeRequest(req, mux)
		assert.Equal(t, http.StatusUnauthorized, rr.Code)
	})
}
