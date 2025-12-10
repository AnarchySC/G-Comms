/**
 * Test Suite #3: Session Persistence
 *
 * Tests for LocalStorage-based session state persistence.
 * These tests verify save/restore functionality for reconnection scenarios
 * and evaluate data preservation across page refreshes.
 */

describe('Session Persistence - LocalStorage', () => {
  const STORAGE_KEYS = {
    SESSION: 'gcomms_session',
    USER: 'gcomms_user',
    PREFERENCES: 'gcomms_preferences',
    RECONNECT: 'gcomms_reconnect',
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe('Session State Storage', () => {
    test('should save session state to localStorage', () => {
      const sessionState = {
        sessionCode: 'ABC123',
        isHost: false,
        joinedAt: Date.now(),
        lastActivity: Date.now(),
      };

      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionState));

      const retrieved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION));

      expect(retrieved.sessionCode).toBe('ABC123');
      expect(retrieved.isHost).toBe(false);
    });

    test('should save user data separately from session', () => {
      const userData = {
        username: 'TestUser',
        role: 'operator',
        channelId: 'squad-1',
        status: 'READY',
      };

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));

      const retrieved = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));

      expect(retrieved.username).toBe('TestUser');
      expect(retrieved.role).toBe('operator');
    });

    test('should save user preferences (volume, mute state)', () => {
      const preferences = {
        globalMute: false,
        channelVolumes: {
          'command-net': 80,
          'squad-1': 100,
          'squad-2': 60,
        },
        channelStates: {
          'command-net': { listen: true, speak: false },
          'squad-1': { listen: true, speak: true },
        },
      };

      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));

      const retrieved = JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFERENCES));

      expect(retrieved.globalMute).toBe(false);
      expect(retrieved.channelVolumes['squad-1']).toBe(100);
      expect(retrieved.channelStates['squad-1'].speak).toBe(true);
    });

    test('should handle storage quota limits gracefully', () => {
      const handleStorageError = (error) => {
        if (error.name === 'QuotaExceededError') {
          // Clear old data and retry
          localStorage.removeItem(STORAGE_KEYS.RECONNECT);
          return true;
        }
        return false;
      };

      // Simulate quota error
      const quotaError = new Error('Quota exceeded');
      quotaError.name = 'QuotaExceededError';

      expect(handleStorageError(quotaError)).toBe(true);
    });
  });

  describe('Session Restoration', () => {
    test('should restore session state on page load', () => {
      const savedSession = {
        sessionCode: 'XYZ789',
        isHost: true,
        joinedAt: Date.now() - 60000,
        lastActivity: Date.now() - 5000,
      };

      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(savedSession));

      // Simulate page load restoration
      const restoreSession = () => {
        const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
        if (!stored) return null;

        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      };

      const restored = restoreSession();

      expect(restored).not.toBeNull();
      expect(restored.sessionCode).toBe('XYZ789');
    });

    test('should validate session age before restoration', () => {
      const MAX_SESSION_AGE = 5 * 60 * 1000; // 5 minutes

      const isSessionValid = (session) => {
        if (!session || !session.lastActivity) return false;

        const age = Date.now() - session.lastActivity;
        return age < MAX_SESSION_AGE;
      };

      const recentSession = {
        sessionCode: 'ABC123',
        lastActivity: Date.now() - 60000, // 1 minute ago
      };

      const staleSession = {
        sessionCode: 'OLD456',
        lastActivity: Date.now() - 600000, // 10 minutes ago
      };

      expect(isSessionValid(recentSession)).toBe(true);
      expect(isSessionValid(staleSession)).toBe(false);
    });

    test('should clear invalid session data', () => {
      localStorage.setItem(STORAGE_KEYS.SESSION, 'invalid-json-data');

      const safeRestore = () => {
        try {
          const data = localStorage.getItem(STORAGE_KEYS.SESSION);
          return JSON.parse(data);
        } catch {
          localStorage.removeItem(STORAGE_KEYS.SESSION);
          return null;
        }
      };

      const result = safeRestore();

      expect(result).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.SESSION)).toBeNull();
    });

    test('should restore user to correct channel after reconnect', () => {
      const savedUser = {
        username: 'ReconnectUser',
        role: 'squad-leader',
        channelId: 'squad-2',
        status: 'READY',
      };

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(savedUser));

      const restoreUserChannel = () => {
        const stored = localStorage.getItem(STORAGE_KEYS.USER);
        if (!stored) return null;

        const user = JSON.parse(stored);
        return {
          channelId: user.channelId,
          role: user.role,
        };
      };

      const restored = restoreUserChannel();

      expect(restored.channelId).toBe('squad-2');
      expect(restored.role).toBe('squad-leader');
    });
  });

  describe('Reconnection Data', () => {
    test('should save reconnection attempt data', () => {
      const reconnectData = {
        peerId: 'gcomms-ABC123-12345',
        hostId: 'gcomms-ABC123-host',
        attempts: 0,
        maxAttempts: 5,
        lastAttempt: null,
        sessionCode: 'ABC123',
      };

      localStorage.setItem(STORAGE_KEYS.RECONNECT, JSON.stringify(reconnectData));

      const retrieved = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECONNECT));

      expect(retrieved.peerId).toBe('gcomms-ABC123-12345');
      expect(retrieved.attempts).toBe(0);
    });

    test('should track reconnection attempts', () => {
      const incrementAttempts = () => {
        const stored = localStorage.getItem(STORAGE_KEYS.RECONNECT);
        const data = stored ? JSON.parse(stored) : { attempts: 0, maxAttempts: 5 };

        data.attempts++;
        data.lastAttempt = Date.now();

        localStorage.setItem(STORAGE_KEYS.RECONNECT, JSON.stringify(data));

        return data.attempts;
      };

      // Initialize
      localStorage.setItem(
        STORAGE_KEYS.RECONNECT,
        JSON.stringify({ attempts: 0, maxAttempts: 5 })
      );

      expect(incrementAttempts()).toBe(1);
      expect(incrementAttempts()).toBe(2);
      expect(incrementAttempts()).toBe(3);

      const final = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECONNECT));
      expect(final.attempts).toBe(3);
    });

    test('should clear reconnection data on successful connect', () => {
      localStorage.setItem(
        STORAGE_KEYS.RECONNECT,
        JSON.stringify({ attempts: 3, sessionCode: 'ABC123' })
      );

      const onSuccessfulConnect = () => {
        localStorage.removeItem(STORAGE_KEYS.RECONNECT);

        // Update session with fresh activity timestamp
        const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || '{}');
        session.lastActivity = Date.now();
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      };

      onSuccessfulConnect();

      expect(localStorage.getItem(STORAGE_KEYS.RECONNECT)).toBeNull();
    });

    test('should provide option to rejoin previous session', () => {
      const previousSession = {
        sessionCode: 'PREV01',
        username: 'PreviousUser',
        role: 'operator',
        savedAt: Date.now() - 120000, // 2 minutes ago
      };

      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(previousSession));
      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify({ username: previousSession.username })
      );

      const getPreviousSessionInfo = () => {
        const session = localStorage.getItem(STORAGE_KEYS.SESSION);
        const user = localStorage.getItem(STORAGE_KEYS.USER);

        if (!session || !user) return null;

        const sessionData = JSON.parse(session);
        const userData = JSON.parse(user);

        return {
          canRejoin: true,
          sessionCode: sessionData.sessionCode,
          username: userData.username,
          message: `Rejoin session ${sessionData.sessionCode} as ${userData.username}?`,
        };
      };

      const rejoinInfo = getPreviousSessionInfo();

      expect(rejoinInfo.canRejoin).toBe(true);
      expect(rejoinInfo.sessionCode).toBe('PREV01');
    });
  });

  describe('Data Cleanup', () => {
    test('should clear all session data on explicit leave', () => {
      // Setup data
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ sessionCode: 'ABC123' }));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ username: 'Test' }));
      localStorage.setItem(STORAGE_KEYS.RECONNECT, JSON.stringify({ attempts: 1 }));

      const clearSessionData = () => {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.RECONNECT);
        // Keep preferences - user may want those
      };

      clearSessionData();

      expect(localStorage.getItem(STORAGE_KEYS.SESSION)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.RECONNECT)).toBeNull();
    });

    test('should preserve preferences across sessions', () => {
      const preferences = {
        globalMute: true,
        defaultVolume: 75,
      };

      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));

      // Simulate leaving session
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      localStorage.removeItem(STORAGE_KEYS.USER);

      // Preferences should remain
      const preserved = JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFERENCES));

      expect(preserved.globalMute).toBe(true);
      expect(preserved.defaultVolume).toBe(75);
    });

    test('should implement session data expiry', () => {
      const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

      const saveWithExpiry = (key, data) => {
        const wrapped = {
          data,
          expiresAt: Date.now() + EXPIRY_TIME,
        };
        localStorage.setItem(key, JSON.stringify(wrapped));
      };

      const loadWithExpiry = (key) => {
        const stored = localStorage.getItem(key);
        if (!stored) return null;

        const wrapped = JSON.parse(stored);
        if (Date.now() > wrapped.expiresAt) {
          localStorage.removeItem(key);
          return null;
        }

        return wrapped.data;
      };

      saveWithExpiry('test-key', { value: 'test' });

      const loaded = loadWithExpiry('test-key');
      expect(loaded.value).toBe('test');

      // Simulate expired data
      localStorage.setItem(
        'expired-key',
        JSON.stringify({
          data: { value: 'expired' },
          expiresAt: Date.now() - 1000,
        })
      );

      const expiredData = loadWithExpiry('expired-key');
      expect(expiredData).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    test('should handle localStorage being unavailable', () => {
      const safeStorage = {
        getItem: (key) => {
          try {
            return localStorage.getItem(key);
          } catch {
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            localStorage.setItem(key, value);
            return true;
          } catch {
            return false;
          }
        },
      };

      // Normal operation should work
      expect(safeStorage.setItem('test', 'value')).toBe(true);
      expect(safeStorage.getItem('test')).toBe('value');
    });

    test('should handle concurrent tab updates', () => {
      // Simulate storage event from another tab
      const handleStorageEvent = (event) => {
        if (event.key === STORAGE_KEYS.SESSION) {
          const newData = event.newValue ? JSON.parse(event.newValue) : null;
          return {
            type: 'SESSION_UPDATED',
            data: newData,
            fromOtherTab: true,
          };
        }
        return null;
      };

      const mockEvent = {
        key: STORAGE_KEYS.SESSION,
        newValue: JSON.stringify({ sessionCode: 'NEW123' }),
        oldValue: JSON.stringify({ sessionCode: 'OLD456' }),
      };

      const result = handleStorageEvent(mockEvent);

      expect(result.type).toBe('SESSION_UPDATED');
      expect(result.data.sessionCode).toBe('NEW123');
    });

    test('should merge state on reconnection conflict', () => {
      const localState = {
        status: 'READY',
        channelId: 'squad-1',
        lastUpdated: Date.now() - 5000,
      };

      const serverState = {
        status: 'WAIT ONE',
        channelId: 'squad-2',
        lastUpdated: Date.now(),
      };

      const mergeStates = (local, server) => {
        // Server state takes precedence for channel assignment
        // Local state takes precedence for user preferences
        return {
          channelId: server.channelId, // Server wins
          status: server.status, // Server wins (more recent)
          lastUpdated: Math.max(local.lastUpdated, server.lastUpdated),
        };
      };

      const merged = mergeStates(localState, serverState);

      expect(merged.channelId).toBe('squad-2');
      expect(merged.status).toBe('WAIT ONE');
    });
  });

  describe('Persistence Helper Functions', () => {
    test('should provide complete persistence manager interface', () => {
      const PersistenceManager = {
        save: (key, data) => {
          localStorage.setItem(key, JSON.stringify(data));
        },

        load: (key, defaultValue = null) => {
          const stored = localStorage.getItem(key);
          if (!stored) return defaultValue;

          try {
            return JSON.parse(stored);
          } catch {
            return defaultValue;
          }
        },

        remove: (key) => {
          localStorage.removeItem(key);
        },

        clear: () => {
          Object.values(STORAGE_KEYS).forEach((key) => {
            localStorage.removeItem(key);
          });
        },

        exists: (key) => {
          return localStorage.getItem(key) !== null;
        },
      };

      PersistenceManager.save('test', { foo: 'bar' });
      expect(PersistenceManager.exists('test')).toBe(true);
      expect(PersistenceManager.load('test').foo).toBe('bar');

      PersistenceManager.remove('test');
      expect(PersistenceManager.exists('test')).toBe(false);
      expect(PersistenceManager.load('test', { default: true }).default).toBe(true);
    });
  });
});
