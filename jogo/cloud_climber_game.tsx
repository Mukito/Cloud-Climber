import React, { useState, useEffect, useCallback, useRef } from 'react';

const CloudClimber = () => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const keysRef = useRef({});
  
  // Game state
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'gameOver'
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);
  
  // Game objects
  const playerRef = useRef({
    x: 400,
    y: 500,
    width: 30,
    height: 30,
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    invulnerable: false,
    invulnerabilityTime: 0
  });
  
  const cameraRef = useRef({ y: 0 });
  const platformsRef = useRef([]);
  
  const GRAVITY = 0.8;
  const JUMP_FORCE = -15;
  const MOVE_SPEED = 5;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  
  // Initialize platforms
  const initializePlatforms = useCallback(() => {
    const platforms = [];
    // Starting platform
    platforms.push({
      x: 350,
      y: 550,
      width: 100,
      height: 20,
      velocityX: 0,
      type: 'wood'
    });
    
    // Generate platforms going up
    for (let i = 1; i < 50; i++) {
      const y = 550 - i * 120;
      const width = Math.random() * 60 + 60; // 60-120 width
      const x = Math.random() * (CANVAS_WIDTH - width);
      const moveSpeed = Math.random() * 2 - 1; // -1 to 1
      const type = Math.random() > 0.5 ? 'cloud' : 'wood';
      
      platforms.push({
        x: x,
        y: y,
        width: width,
        height: 20,
        velocityX: moveSpeed,
        type: type
      });
    }
    platformsRef.current = platforms;
  }, []);
  
  // Reset game
  const resetGame = useCallback(() => {
    playerRef.current = {
      x: 400,
      y: 500,
      width: 30,
      height: 30,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      invulnerable: false,
      invulnerabilityTime: 0
    };
    cameraRef.current = { y: 0 };
    setLives(3);
    setScore(0);
    initializePlatforms();
  }, [initializePlatforms]);
  
  // Respawn player
  const respawnPlayer = useCallback(() => {
    if (lives <= 1) {
      setGameState('gameOver');
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }
    
    setLives(prev => prev - 1);
    
    // Find a safe platform to respawn on
    const playerY = playerRef.current.y;
    const safePlatform = platformsRef.current.find(platform => 
      platform.y > playerY - 200 && platform.y < playerY + 100
    );
    
    if (safePlatform) {
      playerRef.current.x = safePlatform.x + safePlatform.width / 2;
      playerRef.current.y = safePlatform.y - 35;
    } else {
      playerRef.current.x = 400;
      playerRef.current.y = 500;
    }
    
    playerRef.current.velocityX = 0;
    playerRef.current.velocityY = 0;
    playerRef.current.invulnerable = true;
    playerRef.current.invulnerabilityTime = 120; // 2 seconds at 60fps
  }, [lives, score, highScore]);
  
  // Handle input
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key] = true;
    };
    
    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Game loop
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const player = playerRef.current;
    const camera = cameraRef.current;
    const platforms = platformsRef.current;
    
    // Handle input
    if (keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A']) {
      player.velocityX = -MOVE_SPEED;
    } else if (keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) {
      player.velocityX = MOVE_SPEED;
    } else {
      player.velocityX *= 0.8; // Friction
    }
    
    if ((keysRef.current[' '] || keysRef.current['ArrowUp'] || keysRef.current['w'] || keysRef.current['W']) && player.onGround) {
      player.velocityY = JUMP_FORCE;
      player.onGround = false;
    }
    
    // Update invulnerability
    if (player.invulnerable) {
      player.invulnerabilityTime--;
      if (player.invulnerabilityTime <= 0) {
        player.invulnerable = false;
      }
    }
    
    // Apply gravity
    player.velocityY += GRAVITY;
    
    // Update player position
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    // Keep player in bounds horizontally
    if (player.x < 0) player.x = 0;
    if (player.x > CANVAS_WIDTH - player.width) player.x = CANVAS_WIDTH - player.width;
    
    // Update camera
    const targetCameraY = player.y - CANVAS_HEIGHT * 0.7;
    camera.y += (targetCameraY - camera.y) * 0.1;
    
    // Update score based on height
    const currentHeight = Math.max(0, Math.floor((550 - player.y) / 10));
    setScore(prev => Math.max(prev, currentHeight));
    
    // Check for death (falling too far)
    if (player.y > camera.y + CANVAS_HEIGHT + 200 && !player.invulnerable) {
      respawnPlayer();
      return;
    }
    
    // Update platforms
    platforms.forEach(platform => {
      platform.x += platform.velocityX;
      
      // Bounce platforms off edges
      if (platform.x <= 0 || platform.x + platform.width >= CANVAS_WIDTH) {
        platform.velocityX *= -1;
      }
    });
    
    // Collision detection
    player.onGround = false;
    platforms.forEach(platform => {
      // Check collision
      if (player.x < platform.x + platform.width &&
          player.x + player.width > platform.x &&
          player.y < platform.y + platform.height &&
          player.y + player.height > platform.y) {
        
        // Landing on top of platform
        if (player.velocityY > 0 && player.y < platform.y) {
          player.y = platform.y - player.height;
          player.velocityY = 0;
          player.onGround = true;
        }
      }
    });
    
    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw platforms
    platforms.forEach(platform => {
      const screenY = platform.y - camera.y;
      if (screenY > -50 && screenY < CANVAS_HEIGHT + 50) {
        if (platform.type === 'cloud') {
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#DDDDDD';
        } else {
          ctx.fillStyle = '#8B4513';
          ctx.strokeStyle = '#654321';
        }
        
        ctx.fillRect(platform.x, screenY, platform.width, platform.height);
        ctx.strokeRect(platform.x, screenY, platform.width, platform.height);
      }
    });
    
    // Draw player
    const playerScreenY = player.y - camera.y;
    if (player.invulnerable && Math.floor(player.invulnerabilityTime / 10) % 2) {
      ctx.fillStyle = '#FF6B6B'; // Flashing red when invulnerable
    } else {
      ctx.fillStyle = '#4ECDC4';
    }
    ctx.fillRect(player.x, playerScreenY, player.width, player.height);
    
    // Draw eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(player.x + 5, playerScreenY + 5, 6, 6);
    ctx.fillRect(player.x + 19, playerScreenY + 5, 6, 6);
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x + 7, playerScreenY + 7, 2, 2);
    ctx.fillRect(player.x + 21, playerScreenY + 7, 2, 2);
  }, [gameState, respawnPlayer]);
  
  // Start game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(gameLoop, 1000 / 60); // 60 FPS
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);
  
  const startGame = () => {
    resetGame();
    setGameState('playing');
  };
  
  const backToMenu = () => {
    setGameState('menu');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-800">Cloud Climber</h1>
        
        {gameState === 'menu' && (
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-2xl mb-4">Como Jogar:</h2>
              <p className="mb-2">🏃 Use ← → ou A/D para mover</p>
              <p className="mb-2">⬆️ Use ESPAÇO, ↑ ou W para pular</p>
              <p className="mb-2">🎯 Escale o máximo que conseguir!</p>
              <p className="mb-4">❤️ Você tem 3 vidas</p>
              {highScore > 0 && (
                <p className="text-lg font-semibold text-green-600">
                  Recorde: {highScore} pontos
                </p>
              )}
            </div>
            <button
              onClick={startGame}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
            >
              Começar Jogo
            </button>
          </div>
        )}
        
        {gameState === 'playing' && (
          <div>
            <div className="flex justify-between items-center mb-4 text-lg font-semibold">
              <div className="text-blue-600">Pontuação: {score}</div>
              <div className="text-red-600 flex items-center">
                Vidas: {Array(lives).fill('❤️').join('')}
              </div>
            </div>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border-4 border-gray-300 bg-sky-200"
            />
            <p className="text-center mt-2 text-gray-600">
              Use ← → (ou A/D) para mover e ESPAÇO (ou ↑/W) para pular
            </p>
          </div>
        )}
        
        {gameState === 'gameOver' && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Game Over!</h2>
            <p className="text-xl mb-2">Pontuação Final: {score}</p>
            {score === highScore && score > 0 && (
              <p className="text-lg font-semibold text-green-600 mb-4">🏆 Novo Recorde!</p>
            )}
            {highScore > 0 && score !== highScore && (
              <p className="text-lg text-gray-600 mb-4">Recorde: {highScore}</p>
            )}
            <div className="space-x-4">
              <button
                onClick={startGame}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Jogar Novamente
              </button>
              <button
                onClick={backToMenu}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Menu Principal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudClimber;
