/**
 * Jest Test Setup for G-COMMS
 *
 * This file sets up the testing environment with necessary mocks
 * for WebRTC, PeerJS, and browser APIs.
 */

// Mock WebRTC APIs
global.RTCPeerConnection = jest.fn().mockImplementation(() => ({
  createOffer: jest.fn().mockResolvedValue({ type: 'offer', sdp: 'mock-sdp' }),
  createAnswer: jest.fn().mockResolvedValue({ type: 'answer', sdp: 'mock-sdp' }),
  setLocalDescription: jest.fn().mockResolvedValue(undefined),
  setRemoteDescription: jest.fn().mockResolvedValue(undefined),
  addTrack: jest.fn(),
  addIceCandidate: jest.fn().mockResolvedValue(undefined),
  close: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  connectionState: 'connected',
  iceConnectionState: 'connected',
  signalingState: 'stable',
}));

global.RTCSessionDescription = jest.fn().mockImplementation((init) => init);
global.RTCIceCandidate = jest.fn().mockImplementation((init) => init);

// Mock MediaStream
global.MediaStream = jest.fn().mockImplementation(() => ({
  getTracks: jest.fn().mockReturnValue([]),
  getAudioTracks: jest.fn().mockReturnValue([{
    enabled: true,
    stop: jest.fn(),
    kind: 'audio',
  }]),
  getVideoTracks: jest.fn().mockReturnValue([]),
  addTrack: jest.fn(),
  removeTrack: jest.fn(),
}));

// Mock getUserMedia
global.navigator.mediaDevices = {
  getUserMedia: jest.fn().mockResolvedValue(new MediaStream()),
  enumerateDevices: jest.fn().mockResolvedValue([
    { kind: 'audioinput', deviceId: 'default', label: 'Default Microphone' },
  ]),
};

// Mock AudioContext for audio processing
global.AudioContext = jest.fn().mockImplementation(() => ({
  createMediaStreamSource: jest.fn().mockReturnValue({
    connect: jest.fn(),
    disconnect: jest.fn(),
  }),
  createAnalyser: jest.fn().mockReturnValue({
    fftSize: 256,
    frequencyBinCount: 128,
    getByteFrequencyData: jest.fn(),
    connect: jest.fn(),
    disconnect: jest.fn(),
  }),
  createOscillator: jest.fn().mockReturnValue({
    type: 'sine',
    frequency: { setValueAtTime: jest.fn(), linearRampToValueAtTime: jest.fn() },
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  }),
  createGain: jest.fn().mockReturnValue({
    gain: { setValueAtTime: jest.fn(), linearRampToValueAtTime: jest.fn() },
    connect: jest.fn(),
  }),
  destination: {},
  currentTime: 0,
  close: jest.fn(),
  state: 'running',
  resume: jest.fn().mockResolvedValue(undefined),
}));

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: jest.fn((key) => localStorageMock.store[key] || null),
  setItem: jest.fn((key, value) => {
    localStorageMock.store[key] = value.toString();
  }),
  removeItem: jest.fn((key) => {
    delete localStorageMock.store[key];
  }),
  clear: jest.fn(() => {
    localStorageMock.store = {};
  }),
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock Wake Lock API
global.navigator.wakeLock = {
  request: jest.fn().mockResolvedValue({
    released: false,
    release: jest.fn().mockResolvedValue(undefined),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});

// Console error/warn suppression for cleaner test output (optional)
// Uncomment if needed:
// global.console.error = jest.fn();
// global.console.warn = jest.fn();
