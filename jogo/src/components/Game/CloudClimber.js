// src/components/Game/CloudClimber.js

import React, { useRef, useEffect } from 'react';
import { Player } from '../../game/Player.js';
import { PlatformFactory } from '../../game/Platform.js';
import { Camera } from '../../game/Camera.js';
import { InputManager } from '../../game/Input.js';
import { CollisionDetector } from '../../game/Collision.js';
import { Renderer } from '../../game/Renderer.js';
import { GameStateManager } from '../../game/GameState.js';
import { GAME_CONSTANTS, GAME_STATES } from '../../constants/gameConstants.js';
import GameUI from './GameUI.js';

const CloudClimber = () => {
  // Refs para objetos do jogo
  const canvasRef = useRef(null);
  const gameStateRef = useRef(null);
  const playerRef = useRef(null);
  const cameraRef = useRef(null);
  const platformsRef = useRef([]);
  const inputRef = useRef(null);
  const rendererRef = useRef(null);
  const gameLoopRef = useRef(null);

  // State para forçar re-render da UI
  const [gameData, setGameData] = React.useState({});

  // Inicializar jogo
  const initializeGame = () => {
    // Inicializar sistemas
    gameStateRef.current = new GameStateManager();
    playerRef.current = new Player();
    cameraRef.current = new Camera();
    inputRef.current = new InputManager();
    
    if (canvasRef.current) {
      rendererRef.current = new Renderer(canvasRef.current);
    }

    // Gerar plataformas
    platformsRef.current = PlatformFactory.generatePlatforms();

    // Configurar listener de mudança de estado
    gameStateRef.current.addStateChangeListener((newState, oldState) => {
      setGameData({ ...gameStateRef.current.getGameData() });
    });

    // Estado inicial
    setGameData({ ...gameStateRef.current.getGameData() });
  };

  // Loop principal do jogo
  const gameLoop = () => {
    if (!gameStateRef.current || !gameStateRef.current.isState(GAME_STATES.PLAYING)) {
      return;
    }

    const gameState = gameStateRef.current;
    const player = playerRef.current;
    const camera = cameraRef.current;
    const platforms = platformsRef.current;
    const input = inputRef.current;
    const renderer = rendererRef.current;

    // Atualizar input
    input.update();
    const controls = input.getControlState();

    // Verificar pause
    if (controls.pause) {
      gameState.togglePause();
      return;
    }

    // Processar controles do jogador
    if (controls.left) {
      player.moveLeft();
    }
    if (controls.right) {
      player.moveRight();
    }
    if (controls.jump) {
      player.jump();
    }

    // Atualizar jogador
    player.update();

    // Atualizar plataformas
    platforms.forEach(platform => platform.update());

    // Verificar colisões
    CollisionDetector.checkAllPlatformCollisions(player, platforms);

    // Verificar se jogador caiu
    if (player.hasFallenTooFar(camera.y) && !player.invulnerable) {
      handlePlayerDeath();
      return;
    }

    // Atualizar câmera
    camera.update(player);

    // Atualizar pontuação
    const currentScore = player.calculateScore();
    gameState.updateScore(currentScore);

    // Atualizar tempo de jogo
    gameState.updateGameTime();

    // Renderizar tudo
    if (renderer) {
      renderer.clear();
      renderer.renderBackground(camera);
      renderer.renderPlatforms(platforms, camera);
      renderer.renderPlayer(player, camera);
      
      const gameData = gameState.getGameData();
      renderer.renderHUD(gameData.score, gameData.lives, Math.floor(gameData.score / 10));
    }

    // Atualizar UI React
    setGameData({ ...gameState.getGameData() });
  };

  // Manipular morte do jogador
  const handlePlayerDeath = () => {
    const gameState = gameStateRef.current;
    const hasLivesLeft = gameState.loseLife();

    if (hasLivesLeft) {
      // Respawn do jogador
      const nearestPlatform = CollisionDetector.findNearestPlatform(
        playerRef.current, 
        platformsRef.current
      );

      if (nearestPlatform) {
        const center = nearestPlatform.getCenter();
        playerRef.current.respawn(center.x - playerRef.current.width / 2, nearestPlatform.y - 35);
      } else {
        // Reset para posição inicial
        playerRef.current.reset();
        cameraRef.current.reset();
      }

      // Shake da câmera
      cameraRef.current.shake(10, 30);
    }
    // Se não tem vidas, GameStateManager já mudou para GAME_OVER
  };

  // Iniciar novo jogo
  const startNewGame = () => {
    playerRef.current.reset();
    cameraRef.current.reset();
    platformsRef.current = PlatformFactory.generatePlatforms();
    gameStateRef.current.setState(GAME_STATES.PLAYING);
  };

  // Voltar ao menu
  const returnToMenu = () => {
    gameStateRef.current.setState(GAME_STATES.MENU);
  };

  // Pausar/continuar jogo
  const togglePause = () => {
    gameStateRef.current.togglePause();
  };

  // Setup inicial e cleanup
  useEffect(() => {
    initializeGame();

    return () => {
      // Cleanup
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      if (inputRef.current) {
        inputRef.current.destroy();
      }
    };
  }, []);

  // Gerenciar loop do jogo
  useEffect(() => {
    if (gameStateRef.current && gameStateRef.current.isState(GAME_STATES.PLAYING)) {
      gameLoopRef.current = setInterval(gameLoop, 1000 / GAME_CONSTANTS.FPS);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameData]); // Dependência no gameData para re-avaliar quando estado muda

  // Renderizar overlay de pause
  const renderPauseOverlay = () => {
    if (gameStateRef.current && gameStateRef.current.isState(GAME_STATES.PAUSED)) {
      if (rendererRef.current) {
        rendererRef.current.renderPauseScreen();
      }
    }
  };

  // Effect para renderizar pause overlay
  useEffect(() => {
    if (gameStateRef.current && gameStateRef.current.isState(GAME_STATES.PAUSED)) {
      const interval = setInterval(() => {
        if (rendererRef.current) {
          rendererRef.current.renderPauseScreen();
        }
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [gameData]);

  const currentState = gameStateRef.current ? gameStateRef.current.getState() : GAME_STATES.MENU;
  const stats = gameStateRef.current ? gameStateRef.current.getGameStats() : {};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-800">Cloud Climber</h1>
        
        {/* Interface do usuário */}
        <GameUI
          gameState={currentState}
          gameStats={stats}
          onStartGame={startNewGame}
          onReturnToMenu={returnToMenu}
          onTogglePause={togglePause}
        />

        {/* Canvas do jogo */}
        {(currentState === GAME_STATES.PLAYING || currentState === GAME_STATES.PAUSED) && (
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width
