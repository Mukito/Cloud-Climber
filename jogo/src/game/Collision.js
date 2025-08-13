// src/game/Collision.js

export class CollisionDetector {
  // Verificar colisão entre dois retângulos
  static isColliding(rect1, rect2) {
    return rect1.left < rect2.right &&
           rect1.right > rect2.left &&
           rect1.top < rect2.bottom &&
           rect1.bottom > rect2.top;
  }

  // Verificar se jogador está colidindo com plataforma
  static checkPlayerPlatformCollision(player, platform) {
    const playerBounds = player.getBounds();
    const platformBounds = platform.getBounds();

    if (this.isColliding(playerBounds, platformBounds)) {
      return {
        isColliding: true,
        side: this.getCollisionSide(playerBounds, platformBounds, player.velocityY)
      };
    }

    return { isColliding: false, side: null };
  }

  // Determinar qual lado da colisão ocorreu
  static getCollisionSide(playerBounds, platformBounds, playerVelocityY) {
    const playerCenterY = playerBounds.top + (playerBounds.bottom - playerBounds.top) / 2;
    const platformCenterY = platformBounds.top + (platformBounds.bottom - platformBounds.top) / 2;

    // Se jogador está caindo e está acima da plataforma
    if (playerVelocityY > 0 && playerCenterY < platformCenterY) {
      return 'top';
    }

    // Verificar colisões laterais
    const playerCenterX = playerBounds.left + (playerBounds.right - playerBounds.left) / 2;
    const platformCenterX = platformBounds.left + (platformBounds.right - platformBounds.left) / 2;

    if (playerCenterX < platformCenterX) {
      return 'left';
    } else {
      return 'right';
    }
  }

  // Processar colisão jogador-plataforma
  static handlePlayerPlatformCollision(player, platform) {
    const collision = this.checkPlayerPlatformCollision(player, platform);

    if (collision.isColliding) {
      switch (collision.side) {
        case 'top':
          // Jogador aterrissa na plataforma
          player.landOnPlatform(platform.y);
          return true;
          
        case 'left':
        case 'right':
          // Colisão lateral - empurrar jogador para fora
          if (collision.side === 'left') {
            player.x = platform.x - player.width;
          } else {
            player.x = platform.x + platform.width;
          }
          player.velocityX = 0;
          return false;
          
        default:
          return false;
      }
    }

    return false;
  }

  // Verificar colisões entre jogador e todas as plataformas
  static checkAllPlatformCollisions(player, platforms) {
    let landedOnPlatform = false;
    
    // Reset do estado de chão
    player.onGround = false;

    // Verificar colisão com cada plataforma
    for (const platform of platforms) {
      if (this.handlePlayerPlatformCollision(player, platform)) {
        landedOnPlatform = true;
        break; // Para na primeira plataforma encontrada
      }
    }

    return landedOnPlatform;
  }

  // Encontrar plataforma mais próxima para respawn
  static findNearestPlatform(player, platforms, maxDistance = 200) {
    let nearestPlatform = null;
    let nearestDistance = Infinity;

    for (const platform of platforms) {
      // Calcular distância vertical
      const distance = Math.abs(platform.y - player.y);
      
      // Verificar se está dentro da distância máxima e se é mais próxima
      if (distance < maxDistance && distance < nearestDistance) {
        // Verificar se a plataforma está abaixo ou no mesmo nível
        if (platform.y >= player.y - 100) {
          nearestDistance = distance;
          nearestPlatform = platform;
        }
      }
    }

    return nearestPlatform;
  }

  // Verificar se jogador pode aterrissar numa plataforma específica
  static canLandOnPlatform(player, platform) {
    const playerBounds = player.getBounds();
    const platformBounds = platform.getBounds();

    // Verificar se jogador está acima da plataforma
    if (playerBounds.bottom <= platformBounds.top) {
      // Verificar se há sobreposição horizontal
      const horizontalOverlap = Math.min(playerBounds.right, platformBounds.right) - 
                               Math.max(playerBounds.left, platformBounds.left);
      
      return horizontalOverlap > 0;
    }

    return false;
  }

  // Prever colisão futura (útil para IA ou prevenção de bugs)
  static predictCollision(player, platform, steps = 1) {
    // Simular posição futura do jogador
    const futureX = player.x + player.velocityX * steps;
    const futureY = player.y + player.velocityY * steps;
    
    const futureBounds = {
      left: futureX,
      right: futureX + player.width,
      top: futureY,
      bottom: futureY + player.height
    };

    return this.isColliding(futureBounds, platform.getBounds());
  }
}
