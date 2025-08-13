// src/game/Player.js

import { GAME_CONSTANTS } from '../constants/gameConstants.js';

export class Player {
  constructor(x = 400, y = 500) {
    this.x = x;
    this.y = y;
    this.width = GAME_CONSTANTS.PLAYER_WIDTH;
    this.height = GAME_CONSTANTS.PLAYER_HEIGHT;
    this.velocityX = 0;
    this.velocityY = 0;
    this.onGround = false;
    this.invulnerable = false;
    this.invulnerabilityTime = 0;
    this.lastSafePlatformY = y;
  }

  // Atualizar posição do jogador
  update() {
    // Aplicar gravidade
    this.velocityY += GAME_CONSTANTS.GRAVITY;
    
    // Atualizar posição
    this.x += this.velocityX;
    this.y += this.velocityY;
    
    // Manter dentro dos limites horizontais
    this.keepInBounds();
    
    // Atualizar invulnerabilidade
    this.updateInvulnerability();
    
    // Aplicar fricção
    this.velocityX *= GAME_CONSTANTS.FRICTION;
  }

  // Mover para a esquerda
  moveLeft() {
    this.velocityX = -GAME_CONSTANTS.MOVE_SPEED;
  }

  // Mover para a direita
  moveRight() {
    this.velocityX = GAME_CONSTANTS.MOVE_SPEED;
  }

  // Pular (apenas se estiver no chão)
  jump() {
    if (this.onGround) {
      this.velocityY = GAME_CONSTANTS.JUMP_FORCE;
      this.onGround = false;
    }
  }

  // Aterrissar numa plataforma
  landOnPlatform(platformY) {
    this.y = platformY - this.height;
    this.velocityY = 0;
    this.onGround = true;
    this.lastSafePlatformY = Math.min(this.lastSafePlatformY, this.y);
  }

  // Manter dentro dos limites da tela
  keepInBounds() {
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > GAME_CONSTANTS.CANVAS_WIDTH - this.width) {
      this.x = GAME_CONSTANTS.CANVAS_WIDTH - this.width;
    }
  }

  // Ativar invulnerabilidade
  makeInvulnerable() {
    this.invulnerable = true;
    this.invulnerabilityTime = GAME_CONSTANTS.INVULNERABILITY_TIME;
  }

  // Atualizar estado de invulnerabilidade
  updateInvulnerability() {
    if (this.invulnerable) {
      this.invulnerabilityTime--;
      if (this.invulnerabilityTime <= 0) {
        this.invulnerable = false;
      }
    }
  }

  // Verificar se caiu muito baixo
  hasFallenTooFar(cameraY) {
    return this.y > cameraY + GAME_CONSTANTS.CANVAS_HEIGHT + GAME_CONSTANTS.DEATH_FALL_DISTANCE;
  }

  // Respawnar numa posição segura
  respawn(x, y) {
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.makeInvulnerable();
  }

  // Reset para posição inicial
  reset() {
    this.x = 400;
    this.y = 500;
    this.velocityX = 0;
    this.velocityY = 0;
    this.onGround = false;
    this.invulnerable = false;
    this.invulnerabilityTime = 0;
    this.lastSafePlatformY = 500;
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

  // Calcular pontuação baseada na altura
  calculateScore(initialY = 500) {
    return Math.max(0, Math.floor((initialY - this.y) / GAME_CONSTANTS.SCORE_MULTIPLIER));
  }

  // Verificar se está piscando (durante invulnerabilidade)
  isFlashing() {
    return this.invulnerable && Math.floor(this.invulnerabilityTime / 10) % 2;
  }
}
