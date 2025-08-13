// src/game/Platform.js

import { GAME_CONSTANTS, PLATFORM_TYPES } from '../constants/gameConstants.js';

export class Platform {
  constructor(x, y, width, type = PLATFORM_TYPES.CLOUD) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = GAME_CONSTANTS.PLATFORM_HEIGHT;
    this.type = type;
    this.velocityX = this.generateRandomVelocity();
    this.originalX = x;
  }

  // Gerar velocidade aleatória
  generateRandomVelocity() {
    return (Math.random() * GAME_CONSTANTS.MAX_PLATFORM_SPEED * 2) - GAME_CONSTANTS.MAX_PLATFORM_SPEED;
  }

  // Atualizar posição da plataforma
  update() {
    this.x += this.velocityX;
    this.handleBoundaryCollision();
  }

  // Verificar colisão com bordas e inverter direção
  handleBoundaryCollision() {
    if (this.x <= 0 || this.x + this.width >= GAME_CONSTANTS.CANVAS_WIDTH) {
      this.velocityX *= -1;
      
      // Garantir que a plataforma não saia dos limites
      if (this.x < 0) {
        this.x = 0;
      } else if (this.x + this.width > GAME_CONSTANTS.CANVAS_WIDTH) {
        this.x = GAME_CONSTANTS.CANVAS_WIDTH - this.width;
      }
    }
  }

  // Obter retângulo de colisão
  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    };
  }

  // Verificar se está visível na tela
  isVisible(cameraY) {
    const screenY = this.y - cameraY;
    return screenY > -50 && screenY < GAME_CONSTANTS.CANVAS_HEIGHT + 50;
  }

  // Obter centro da plataforma
  getCenter() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
  }

  // Verificar se um ponto está sobre a plataforma
  isPointAbove(x, y) {
    return x >= this.x && 
           x <= this.x + this.width && 
           y <= this.y;
  }
}

// Factory para criar plataformas
export class PlatformFactory {
  static createStartingPlatform() {
    return new Platform(350, 550, 100, PLATFORM_TYPES.WOOD);
  }

  static createRandomPlatform(y) {
    const width = Math.random() * 
      (GAME_CONSTANTS.MAX_PLATFORM_WIDTH - GAME_CONSTANTS.MIN_PLATFORM_WIDTH) + 
      GAME_CONSTANTS.MIN_PLATFORM_WIDTH;
    
    const x = Math.random() * (GAME_CONSTANTS.CANVAS_WIDTH - width);
    const type = Math.random() > 0.5 ? PLATFORM_TYPES.CLOUD : PLATFORM_TYPES.WOOD;
    
    return new Platform(x, y, width, type);
  }

  static generatePlatforms(count = GAME_CONSTANTS.MAX_PLATFORMS) {
    const platforms = [];
    
    // Plataforma inicial
    platforms.push(this.createStartingPlatform());
    
    // Gerar plataformas subindo
    for (let i = 1; i < count; i++) {
      const y = 550 - i * GAME_CONSTANTS.PLATFORM_SPACING;
      platforms.push(this.createRandomPlatform(y));
    }
    
    return platforms;
  }
}
