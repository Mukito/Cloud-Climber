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
        borderColor = GAME_CONSTANTS.COLORS.CLOUD_BORDER;
        break;
      case PLATFORM_TYPES.WOOD:
        fillColor = GAME_CONSTANTS.COLORS.WOOD;
        borderColor = GAME_CONSTANTS.COLORS.WOOD_BORDER;
        break;
      default:
        fillColor = GAME_CONSTANTS.COLORS.WOOD;
        borderColor = GAME_CONSTANTS.COLORS.WOOD_BORDER;
    }

    // Renderizar plataforma
    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(platform.x, screenY, platform.width, platform.height);
    
    // Borda da plataforma
    this.ctx.strokeStyle = borderColor;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(platform.x, screenY, platform.width, platform.height);

    // Efeito especial para nuvens
    if (platform.type === PLATFORM_TYPES.CLOUD) {
      this.renderCloudEffect(platform, screenY);
    }
  }

  // Renderizar efeito de nuvem
  renderCloudEffect(platform, screenY) {
    const numPuffs = Math.floor(platform.width / 20);
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    
    for (let i = 0; i < numPuffs; i++) {
      const x = platform.x + (i + 0.5) * (platform.width / numPuffs);
      const radius = 8;
      
      this.ctx.beginPath();
      this.ctx.arc(x, screenY + 5, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // Renderizar todas as plataformas
  renderPlatforms(platforms, camera) {
    platforms.forEach(platform => {
      this.renderPlatform(platform, camera);
    });
  }

  // Renderizar fundo com paralaxe
  renderBackground(camera) {
    const parallaxFactor = 0.3;
    const bgOffset = camera.y * parallaxFactor;
    
    // Gradiente de fundo
    const gradient = this.ctx.createLinearGradient(0, bgOffset, 0, this.canvas.height + bgOffset);
    gradient.addColorStop(0, '#87CEEB'); // Azul céu
    gradient.addColorStop(0.7, '#B0E0E6'); // Azul mais claro
    gradient.addColorStop(1, '#F0F8FF'); // Quase branco
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Nuvens de fundo
    this.renderBackgroundClouds(bgOffset);
  }

  // Renderizar nuvens decorativas de fundo
  renderBackgroundClouds(offset) {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    
    const clouds = [
      { x: 100, y: 100, size: 30 },
      { x: 600, y: 200, size: 40 },
      { x: 300, y: 300, size: 35 },
      { x: 700, y: 400, size: 25 }
    ];

    clouds.forEach(cloud => {
      const y = cloud.y + offset * 0.5;
      if (y > -50 && y < this.canvas.height + 50) {
        this.renderBackgroundCloud(cloud.x, y, cloud.size);
      }
    });
  }

  // Renderizar uma nuvem de fundo
  renderBackgroundCloud(x, y, size) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.arc(x + size * 0.6, y, size * 0.8, 0, Math.PI * 2);
    this.ctx.arc(x - size * 0.6, y, size * 0.8, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // Renderizar HUD (interface)
  renderHUD(score, lives, height) {
    const padding = 20;
    const fontSize = 18;
    
    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;

    // Pontuação
    const scoreText = `Pontuação: ${score}`;
    this.ctx.strokeText(scoreText, padding, padding + fontSize);
    this.ctx.fillText(scoreText, padding, padding + fontSize);

    // Vidas
    const livesText = `Vidas: ${'❤️'.repeat(lives)}`;
    this.ctx.strokeText(livesText, this.canvas.width - 150, padding + fontSize);
    this.ctx.fillText(livesText, this.canvas.width - 150, padding + fontSize);

    // Altura atual
    const heightText = `Altura: ${height}m`;
    this.ctx.strokeText(heightText, padding, this.canvas.height - padding);
    this.ctx.fillText(heightText, padding, this.canvas.height - padding);
  }

  // Renderizar efeitos de partículas (opcional)
  renderParticles(particles, camera) {
    particles.forEach(particle => {
      const screenY = particle.y - camera.y;
      
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillRect(particle.x, screenY, particle.size, particle.size);
    });
    
    this.ctx.globalAlpha = 1; // Reset alpha
  }

  // Renderizar indicador de direção (seta apontando para próxima plataforma)
  renderDirectionIndicator(player, nearestPlatform, camera) {
    if (!nearestPlatform) return;

    const playerCenterX = player.x + player.width / 2;
    const platformCenterX = nearestPlatform.x + nearestPlatform.width / 2;
    const distance = Math.abs(platformCenterX - playerCenterX);

    // Só mostrar se a plataforma estiver longe
    if (distance > 100) {
      const screenY = player.y - camera.y - 30;
      const direction = platformCenterX > playerCenterX ? 1 : -1;
      const arrowX = player.x + player.width / 2 + (direction * 40);

      this.renderArrow(arrowX, screenY, direction);
    }
  }

  // Renderizar seta direcional
  renderArrow(x, y, direction) {
    this.ctx.fillStyle = '#FFD700'; // Dourado
    this.ctx.strokeStyle = '#FFA500'; // Laranja
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x - direction * 15, y - 10);
    this.ctx.lineTo(x - direction * 15, y + 10);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  // Renderizar tela de game over
  renderGameOverScreen(finalScore, highScore) {
    // Overlay semi-transparente
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Texto Game Over
    this.ctx.font = 'bold 48px Arial';
    this.ctx.fillStyle = '#FF0000';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 50);

    // Pontuação final
    this.ctx.font = '24px Arial';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillText(`Pontuação Final: ${finalScore}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
    
    if (highScore > 0) {
      this.ctx.fillText(`Recorde: ${highScore}`, this.canvas.width / 2, this.canvas.height / 2 + 50);
    }

    // Reset text align
    this.ctx.textAlign = 'left';
  }

  // Renderizar tela de pausa
  renderPauseScreen() {
    // Overlay semi-transparente
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Texto Pause
    this.ctx.font = 'bold 36px Arial';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PAUSADO', this.canvas.width / 2, this.canvas.height / 2);
    
    this.ctx.font = '18px Arial';
    this.ctx.fillText('Pressione P ou ESC para continuar', this.canvas.width / 2, this.canvas.height / 2 + 40);

    // Reset text align
    this.ctx.textAlign = 'left';
  }
}
