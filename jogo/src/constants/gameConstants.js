// src/constants/gameConstants.js

export const GAME_CONSTANTS = {
  // Canvas
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  
  // Physics
  GRAVITY: 0.8,
  JUMP_FORCE: -15,
  MOVE_SPEED: 5,
  FRICTION: 0.8,
  
  // Player
  PLAYER_WIDTH: 30,
  PLAYER_HEIGHT: 30,
  INITIAL_LIVES: 3,
  INVULNERABILITY_TIME: 120, // frames (2 seconds at 60fps)
  
  // Platforms
  PLATFORM_HEIGHT: 20,
  MIN_PLATFORM_WIDTH: 60,
  MAX_PLATFORM_WIDTH: 120,
  PLATFORM_SPACING: 120,
  MAX_PLATFORMS: 50,
  MAX_PLATFORM_SPEED: 2,
  
  // Camera
  CAMERA_FOLLOW_SPEED: 0.1,
  CAMERA_OFFSET: 0.7, // 70% down from top
  
  // Game
  FPS: 60,
  DEATH_FALL_DISTANCE: 200,
  SCORE_MULTIPLIER: 10,
  
  // Colors
  COLORS: {
    SKY: '#87CEEB',
    PLAYER: '#4ECDC4',
    PLAYER_INVULNERABLE: '#FF6B6B',
    PLAYER_EYES: '#FFFFFF',
    PLAYER_PUPILS: '#000000',
    CLOUD: '#FFFFFF',
    CLOUD_BORDER: '#DDDDDD',
    WOOD: '#8B4513',
    WOOD_BORDER: '#654321'
  }
};

export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver'
};

export const PLATFORM_TYPES = {
  CLOUD: 'cloud',
  WOOD: 'wood',
  METAL: 'metal'
};

export const INPUT_KEYS = {
  LEFT: ['ArrowLeft', 'a', 'A'],
  RIGHT: ['ArrowRight', 'd', 'D'],
  JUMP: [' ', 'ArrowUp', 'w', 'W'],
  PAUSE: ['Escape', 'p', 'P']
};
