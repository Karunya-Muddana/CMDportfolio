/**
 * Configuration file for Karunya CLI OS
 * Contains backend URLs, timing constants, and system configuration
 */

export const CONFIG = {
  // Backend API endpoint
  BACKEND_URL: 'https://flask-1yw5.onrender.com/chat',
  
  // Timing configuration (in milliseconds)
  TIMING: {
    BOOT_SEQUENCE: 7000,          // Total boot sequence duration
    ASCII_LINE_DELAY: 220,         // Delay between ASCII art lines
    CHAR_TYPE_MIN: 50,             // Minimum character typing delay
    CHAR_TYPE_MAX: 60,             // Maximum character typing delay
    LINE_SPACING: 200,             // Delay between output lines
    AI_THINKING_MIN: 2500,         // Minimum AI processing delay
    AI_THINKING_MAX: 3500,         // Maximum AI processing delay
    CURSOR_PULSE: 600,             // Cursor blink cycle (half of 1.2s)
    CONNECTION_TEST: 1500,         // Backend connection test delay
    VOLTAGE_DIP: 150,              // Screen dim effect duration
  },
  
  // Color palette
  COLORS: {
    BACKGROUND: '#1B1B1B',
    GOLD: '#F8B400',
    GREEN: '#00FF88',
    CYAN: '#00FFFF',
    RED: '#E63946',
    WHITE: '#FFFFFF',
  },
  
  // System configuration
  SYSTEM: {
    NAME: 'Karunya CLI OS',
    VERSION: '2.0.0',
    BUILD_DATE: '2025-11-07',
    DEVELOPER: 'Karunya Muddana',
    ROLE: 'Backend & AI Developer',
    LOCATION: 'Hyderabad, India',
  },
  
  // Contact information
  CONTACT: {
    EMAIL: 'karunya.muddana@outlook.com',
    GITHUB: 'github.com/Karunya-Muddana',
    LINKEDIN: 'linkedin.com/in/karunya-muddana-32b118269',
  },
  
  // Feature flags
  FEATURES: {
    AI_MODE_ENABLED: true,
    MATRIX_BACKGROUND: true,
    CRT_EFFECTS: true,
    MOBILE_SHORTCUTS: true,
    DEVICE_TILT: true,
  },
} as const;

export default CONFIG;
