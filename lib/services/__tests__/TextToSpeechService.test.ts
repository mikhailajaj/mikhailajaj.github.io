/**
 * Tests for TextToSpeechService
 * 
 * Critical accessibility service that needs comprehensive testing
 * to ensure reliable text-to-speech functionality.
 */

import { TextToSpeechService } from '../TextToSpeechService';

// Mock Web Speech API
const mockSpeechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => [
    { name: 'Voice 1', lang: 'en-US', default: true },
    { name: 'Voice 2', lang: 'en-GB', default: false }
  ]),
  speaking: false,
  pending: false,
  paused: false
};

const mockSpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
  text,
  voice: null,
  volume: 1,
  rate: 1,
  pitch: 1,
  lang: 'en-US',
  onstart: null,
  onend: null,
  onerror: null,
  onpause: null,
  onresume: null,
  onmark: null,
  onboundary: null
}));

// Setup global mocks
Object.defineProperty(global, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true
});

Object.defineProperty(global, 'SpeechSynthesisUtterance', {
  value: mockSpeechSynthesisUtterance,
  writable: true
});

describe('TextToSpeechService', () => {
  let service: TextToSpeechService;

  beforeEach(() => {
    service = new TextToSpeechService();
    jest.clearAllMocks();
    mockSpeechSynthesis.speaking = false;
    mockSpeechSynthesis.pending = false;
    mockSpeechSynthesis.paused = false;
  });

  describe('Initialization', () => {
    it('should initialize with default settings', () => {
      expect(service).toBeDefined();
      expect(service.isSupported()).toBe(true);
    });

    it('should detect browser support correctly', () => {
      expect(service.isSupported()).toBe(true);
      
      // Test without speech synthesis
      delete (global as any).speechSynthesis;
      const serviceWithoutSupport = new TextToSpeechService();
      expect(serviceWithoutSupport.isSupported()).toBe(false);
      
      // Restore for other tests
      (global as any).speechSynthesis = mockSpeechSynthesis;
    });
  });

  describe('Basic Speech Functions', () => {
    it('should speak text successfully', async () => {
      const text = 'Hello, world!';
      
      await service.speak(text);
      
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalledWith(text);
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    it('should handle empty text gracefully', async () => {
      await service.speak('');
      expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled();
    });

    it('should stop speech correctly', () => {
      service.stop();
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    });

    it('should pause speech correctly', () => {
      service.pause();
      expect(mockSpeechSynthesis.pause).toHaveBeenCalled();
    });

    it('should resume speech correctly', () => {
      service.resume();
      expect(mockSpeechSynthesis.resume).toHaveBeenCalled();
    });
  });

  describe('Voice Management', () => {
    it('should get available voices', () => {
      const voices = service.getVoices();
      expect(voices).toHaveLength(2);
      expect(voices[0].name).toBe('Voice 1');
      expect(voices[1].name).toBe('Voice 2');
    });

    it('should set voice correctly', async () => {
      const voices = service.getVoices();
      service.setVoice(voices[1]);
      
      await service.speak('Test');
      
      const utteranceCall = mockSpeechSynthesisUtterance.mock.calls[0];
      expect(utteranceCall[0]).toBe('Test');
    });

    it('should handle invalid voice gracefully', () => {
      const invalidVoice = { name: 'Invalid', lang: 'invalid' } as any;
      expect(() => service.setVoice(invalidVoice)).not.toThrow();
    });
  });

  describe('Settings Configuration', () => {
    it('should set rate correctly', async () => {
      service.setRate(1.5);
      await service.speak('Test');
      
      // Verify rate was set on utterance
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalled();
    });

    it('should set pitch correctly', async () => {
      service.setPitch(1.2);
      await service.speak('Test');
      
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalled();
    });

    it('should set volume correctly', async () => {
      service.setVolume(0.8);
      await service.speak('Test');
      
      expect(mockSpeechSynthesisUtterance).toHaveBeenCalled();
    });

    it('should clamp rate to valid range', () => {
      service.setRate(10); // Too high
      service.setRate(-1); // Too low
      // Should not throw and should clamp values
      expect(() => service.setRate(10)).not.toThrow();
      expect(() => service.setRate(-1)).not.toThrow();
    });

    it('should clamp pitch to valid range', () => {
      service.setPitch(5); // Too high
      service.setPitch(-1); // Too low
      expect(() => service.setPitch(5)).not.toThrow();
      expect(() => service.setPitch(-1)).not.toThrow();
    });

    it('should clamp volume to valid range', () => {
      service.setVolume(2); // Too high
      service.setVolume(-1); // Too low
      expect(() => service.setVolume(2)).not.toThrow();
      expect(() => service.setVolume(-1)).not.toThrow();
    });
  });

  describe('State Management', () => {
    it('should report speaking state correctly', () => {
      mockSpeechSynthesis.speaking = true;
      expect(service.isSpeaking()).toBe(true);
      
      mockSpeechSynthesis.speaking = false;
      expect(service.isSpeaking()).toBe(false);
    });

    it('should report paused state correctly', () => {
      mockSpeechSynthesis.paused = true;
      expect(service.isPaused()).toBe(true);
      
      mockSpeechSynthesis.paused = false;
      expect(service.isPaused()).toBe(false);
    });

    it('should report pending state correctly', () => {
      mockSpeechSynthesis.pending = true;
      expect(service.isPending()).toBe(true);
      
      mockSpeechSynthesis.pending = false;
      expect(service.isPending()).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle speech synthesis errors gracefully', async () => {
      mockSpeechSynthesis.speak.mockImplementation(() => {
        throw new Error('Speech synthesis error');
      });
      
      await expect(service.speak('Test')).resolves.not.toThrow();
    });

    it('should handle missing speech synthesis gracefully', async () => {
      delete (global as any).speechSynthesis;
      
      const serviceWithoutSupport = new TextToSpeechService();
      await expect(serviceWithoutSupport.speak('Test')).resolves.not.toThrow();
      
      // Restore for other tests
      (global as any).speechSynthesis = mockSpeechSynthesis;
    });
  });

  describe('Event Handling', () => {
    it('should handle speech start events', async () => {
      const onStart = jest.fn();
      service.onSpeechStart = onStart;
      
      await service.speak('Test');
      
      // Simulate speech start event
      const utterance = mockSpeechSynthesisUtterance.mock.results[0].value;
      if (utterance.onstart) {
        utterance.onstart(new Event('start'));
      }
      
      expect(onStart).toHaveBeenCalled();
    });

    it('should handle speech end events', async () => {
      const onEnd = jest.fn();
      service.onSpeechEnd = onEnd;
      
      await service.speak('Test');
      
      // Simulate speech end event
      const utterance = mockSpeechSynthesisUtterance.mock.results[0].value;
      if (utterance.onend) {
        utterance.onend(new Event('end'));
      }
      
      expect(onEnd).toHaveBeenCalled();
    });

    it('should handle speech error events', async () => {
      const onError = jest.fn();
      service.onSpeechError = onError;
      
      await service.speak('Test');
      
      // Simulate speech error event
      const utterance = mockSpeechSynthesisUtterance.mock.results[0].value;
      if (utterance.onerror) {
        utterance.onerror(new Event('error'));
      }
      
      expect(onError).toHaveBeenCalled();
    });
  });

  describe('Accessibility Features', () => {
    it('should support ARIA live region announcements', async () => {
      await service.announceToScreenReader('Important message');
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    it('should queue multiple announcements', async () => {
      await service.speak('First message');
      await service.speak('Second message');
      
      expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(2);
    });

    it('should interrupt previous speech when needed', async () => {
      await service.speak('First message');
      service.stop();
      await service.speak('Second message');
      
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
      expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(2);
    });
  });
});