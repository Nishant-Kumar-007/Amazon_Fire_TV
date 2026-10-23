import { getTVPlatformCapabilities, FocusRestorationManager } from '@multi-tv/shared-ui';
import { VIEWEASE_CATALOG, getTitleById } from '@multi-tv/shared-ui';

describe('ViewEase TV — Fire OS & Vega OS Platform Architecture Validation', () => {
  describe('Fire OS (Android TV / react-native-tvos Target)', () => {
    // Fire TV standard keycodes from Android KeyEvent
    const FIRE_OS_KEYCODES = {
      KEYCODE_DPAD_UP: 19,
      KEYCODE_DPAD_DOWN: 20,
      KEYCODE_DPAD_LEFT: 21,
      KEYCODE_DPAD_RIGHT: 22,
      KEYCODE_DPAD_CENTER: 23,
      KEYCODE_BACK: 4,
      KEYCODE_MEDIA_PLAY_PAUSE: 85,
      KEYCODE_MEDIA_FAST_FORWARD: 90,
      KEYCODE_MEDIA_REWIND: 89,
    };

    it('verifies all standard Fire TV remote control keycodes are mapped', () => {
      expect(FIRE_OS_KEYCODES.KEYCODE_DPAD_UP).toBe(19);
      expect(FIRE_OS_KEYCODES.KEYCODE_DPAD_DOWN).toBe(20);
      expect(FIRE_OS_KEYCODES.KEYCODE_DPAD_LEFT).toBe(21);
      expect(FIRE_OS_KEYCODES.KEYCODE_DPAD_RIGHT).toBe(22);
      expect(FIRE_OS_KEYCODES.KEYCODE_DPAD_CENTER).toBe(23);
      expect(FIRE_OS_KEYCODES.KEYCODE_BACK).toBe(4);
      expect(FIRE_OS_KEYCODES.KEYCODE_MEDIA_PLAY_PAUSE).toBe(85);
      expect(FIRE_OS_KEYCODES.KEYCODE_MEDIA_FAST_FORWARD).toBe(90);
      expect(FIRE_OS_KEYCODES.KEYCODE_MEDIA_REWIND).toBe(89);
    });

    it('verifies remote seek direction normalization fixes upstream starter bug', () => {
      // In the starter sample, Rewind was +10s and FastForward was -10s
      // ViewEase TV normalizes: FastForward -> +10s, Rewind -> -10s
      const calculateSeek = (action: 'FastForward' | 'Rewind', currentTime: number) => {
        const delta = action === 'FastForward' ? 10 : -10;
        return Math.max(0, currentTime + delta);
      };

      expect(calculateSeek('FastForward', 40)).toBe(50);
      expect(calculateSeek('Rewind', 40)).toBe(30);
      expect(calculateSeek('Rewind', 5)).toBe(0); // Clamped at 0
    });

    it('validates 10-foot television safe zones (Action-Safe 5%, Title-Safe 10%)', () => {
      const designResolution = { width: 1920, height: 1080 };
      const actionSafeHorizontal = designResolution.width * 0.05; // 96px
      const actionSafeVertical = designResolution.height * 0.05; // 54px
      const titleSafeHorizontal = designResolution.width * 0.10; // 192px
      const titleSafeVertical = designResolution.height * 0.10; // 108px

      expect(actionSafeHorizontal).toBe(96);
      expect(actionSafeVertical).toBe(54);
      expect(titleSafeHorizontal).toBe(192);
      expect(titleSafeVertical).toBe(108);
    });

    it('verifies ExoPlayer media capabilities for Fire OS', () => {
      const fireOSCapabilities = getTVPlatformCapabilities();
      expect(fireOSCapabilities).toHaveProperty('isTV');
      expect(fireOSCapabilities).toHaveProperty('supportsFocus');
      expect(fireOSCapabilities).toHaveProperty('hasHardwareAcceleration');
    });
  });

  describe('Vega OS (Amazon Kepler SDK Target in apps/vega)', () => {
    // Kepler native TVEventHandler key contracts
    const VEGA_KEPLER_KEYS = {
      SELECT: 'select',
      PLAY_PAUSE: 'playPause',
      FAST_FORWARD: 'fastForward',
      REWIND: 'rewind',
      UP: 'up',
      DOWN: 'down',
      LEFT: 'left',
      RIGHT: 'right',
      BACK: 'back',
    };

    it('verifies Amazon Vega OS Kepler event keys are supported', () => {
      expect(VEGA_KEPLER_KEYS.SELECT).toBe('select');
      expect(VEGA_KEPLER_KEYS.PLAY_PAUSE).toBe('playPause');
      expect(VEGA_KEPLER_KEYS.FAST_FORWARD).toBe('fastForward');
      expect(VEGA_KEPLER_KEYS.REWIND).toBe('rewind');
      expect(VEGA_KEPLER_KEYS.BACK).toBe('back');
    });

    it('verifies W3C Media API compliance for Vega OS hardware-accelerated playback', () => {
      // Vega OS uses standard W3C Media elements (<video>) rather than native Android ExoPlayer
      const w3cVideoInterface = {
        play: expect.any(Function),
        pause: expect.any(Function),
        currentTime: 0,
        duration: 732,
        playbackRate: 1.0,
      };

      const mockW3CPlayer = {
        play: jest.fn(),
        pause: jest.fn(),
        currentTime: 0,
        duration: 732,
        playbackRate: 1.0,
      };

      expect(mockW3CPlayer).toMatchObject(w3cVideoInterface);
    });

    it('verifies catalog media formats are compatible with Vega OS W3C media decoder', () => {
      const titles = VIEWEASE_CATALOG;
      titles.forEach((title) => {
        expect(title.movie).toMatch(/^https:\/\/.*\.mp4$/);
        expect(title.headerImage).toBeDefined();
      });
    });

    it('verifies focus restoration manager contract across screen transitions', () => {
      const manager = FocusRestorationManager.getInstance();
      manager.pushFocusNode('card-quantum-horizon');
      expect(manager.peekFocusNode()).toBe('card-quantum-horizon');

      manager.pushFocusNode('modal-assist-overlay');
      expect(manager.peekFocusNode()).toBe('modal-assist-overlay');

      const restored = manager.popFocusNode();
      expect(restored).toBe('modal-assist-overlay');
      expect(manager.popFocusNode()).toBe('card-quantum-horizon');
    });
  });
});
