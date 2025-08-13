// src/game/Renderer.js

import { GAME_CONSTANTS, PLATFORM_TYPES } from '../constants/gameConstants.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = GAME_CONSTANTS.CANVAS_WIDTH;
    this.canvas.height = GAME_CONSTANTS.CANVAS_HEIGHT;
  }

  // Limpar tela com cor de fundo
  clear() {
    this.ctx.fillStyle = GAME_CONSTANTS.COLORS.SKY;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Renderizar jogador
  renderPlayer(player, camera) {
    const screenY = player.y - camera.y;
    
    // Escolher cor baseada no estado de invulnerabilidade
    const color = player.isFlashing() ? 
      GAME_CONSTANTS.COLORS.PLAYER_INVULNERABLE : 
      GAME_CONSTANTS.COLORS.PLAYER;

    // Corpo do jogador
    this.ctx.fillStyle = color;
    this.ctx.fillRect(player.x, screenY, player.width, player.height);

    // Olhos
    this.renderPlayerEyes(player, screenY);
  }

  // Renderizar olhos do jogador
  renderPlayerEyes(player, screenY) {
    const eyeSize = 6;
    const pupilSize = 2;
    const eyeOffsetX = 5;
    const eyeOffsetY = 5;
    const eyeSpacing = 14;

    // Olhos brancos
    this.ctx.fillStyle = GAME_CONSTANTS.COLORS.PLAYER_EYES;
    this.ctx.fillRect(player.x + eyeOffsetX, screenY + eyeOffsetY, eyeSize, eyeSize);
    this.ctx.fillRect(player.x + eyeOffsetX + eyeSpacing, screenY + eyeOffsetY, eyeSize, eyeSize);

    // Pupilas pretas
    this.ctx.fillStyle = GAME_CONSTANTS.COLORS.PLAYER_PUPILS;
    this.ctx.fillRect(player.x + eyeOffsetX + 2, screenY + eyeOffsetY + 2, pupilSize, pupilSize);
    this.ctx.fillRect(player.x + eyeOffsetX + eyeSpacing + 2, screenY + eyeOffsetY + 2, pupilSize, pupilSize);
  }

  // Renderizar plataforma
  renderPlatform(platform, camera) {
    const screenY = platform.y - camera.y;

    // Verificar se está visível na tela
    if (!platform.isVisible(camera.y)) {
      return;
    }

    // Escolher cores baseado no tipo
    let fillColor, borderColor;
    
    switch (platform.type) {
      case PLATFORM_TYPES.CLOUD:
        fillColor = GAME_CONSTANTS.COLORS.CLOUD;
        borderColor = GAME_CONSTANTS
