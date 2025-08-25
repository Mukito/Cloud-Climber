// src/game/Camera.js

import { GAME_CONSTANTS } from '../constants/gameConstants.js';

export class Camera {
  constructor() {
    this.y = 0;
    this.targetY = 0;
    this.followSpeed = GAME_CONSTANTS.CAMERA_FOLLOW_SPEED;
    this.offset = GAME_CONSTANTS.CAMERA_OFFSET;
  }

  // Atualizar posição da câmera seguindo o jogador
  update(player) {
    // Calcular posição alvo baseada no jogador
    this.targetY = player.y - (GAME_CONSTANTS.CANVAS_HEIGHT * this.offset);
    
    // Suavizar movimento da câmera
    this.y += (this.targetY - this.y) * this.followSpeed;
  }

  // Atualizar com seguimento instantâneo (para respawn)
  snapToPlayer(player) {
    this.targetY = player.y - (GAME_CONSTANTS.CANVAS_HEIGHT * this.offset);
    this.y = this.targetY;
  }

  // Obter posição Y da câmera
  getY() {
    return this.y;
  }

  // Verificar se um objeto está visível na tela
  isVisible(objectY, objectHeight = 0) {
    const screenTop = this.y;
    const screenBottom = this.y + GAME_CONSTANTS.CANVAS_HEIGHT;
    const objectTop = objectY;
    const objectBottom = objectY + objectHeight;

    return objectBottom > screenTop - 50 && objectTop < screenBottom + 50;
  }

  // Converter coordenadas do mundo para coordenadas da tela
  worldToScreen(worldY) {
    return worldY - this.y;
  }

  // Converter coordenadas da tela para coordenadas do mundo
  screenToWorld(screenY) {
    return screenY + this.y;
  }

  // Reset da câmera
  reset() {
    this.y = 0;
    this.targetY = 0;
  }

  // Definir velocidade de seguimento
  setFollowSpeed(speed) {
    this.followSpeed = Math.max(0, Math.min(1, speed));
  }

  // Definir offset da câmera
  setOffset(offset) {
    this.offset = Math.max(0, Math.min(1, offset));
  }

  // Shake da câmera (efeito especial)
  shake(intensity = 5, duration = 30) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeTimer = 0;
  }

  // Atualizar shake da câmera
  updateShake() {
    if (this.shakeDuration > 0) {
      const shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      const shakeY = (Math.random() - 0.5) * this.shakeIntensity;
      
      this.y += shakeY;
      
      this.shakeTimer++;
      if (this.shakeTimer >= this.shakeDuration) {
        this.shakeDuration = 0;
        this.shakeTimer = 0;
        this.shakeIntensity = 0;
      }
    }
  }
}
