// src/game/GameState.js

import { GAME_STATES } from '../constants/gameConstants.js';

export class GameStateManager {
  constructor() {
    this.currentState = GAME_STATES.MENU;
    this.previousState = null;
    this.stateChangeListeners = [];
    this.gameData = this.initializeGameData();
  }

  // Inicializar dados do jogo
  initializeGameData() {
    return {
      score: 0,
      lives: 3,
      highScore: this.loadHighScore(),
      level: 1,
      startTime: null,
      gameTime: 0,
      isPaused: false
    };
  }

  // Carregar recorde do localStorage (se disponível)
  loadHighScore() {
    try {
      return parseInt(localStorage.getItem('cloudClimberHighScore')) || 0;
    } catch (error) {
      return 0; // Fallback se localStorage não disponível
    }
  }

  // Salvar recorde
  saveHighScore() {
    try {
      localStorage.setItem('cloudClimberHighScore', this.gameData.highScore.toString());
    } catch (error) {
      // Ignorar erro se localStorage não disponível
      console.warn('Could not save high score');
    }
  }

  // Mudar estado do jogo
  setState(newState) {
    if (newState === this.currentState) return;

    this.previousState = this.currentState;
    this.currentState = newState;
    
    this.onStateChange(newState, this.previousState);
    this.notifyStateChangeListeners(newState, this.previousState);
  }

  // Obter estado atual
  getState() {
    return this.currentState;
  }

  // Obter estado anterior
  getPreviousState() {
    return this.previousState;
  }

  // Verificar se está em um estado específico
  isState(state) {
    return this.currentState === state;
  }

  // Adicionar listener para mudanças de estado
  addStateChangeListener(callback) {
    this.stateChangeListeners.push(callback);
  }

  // Remover listener
  removeStateChangeListener(callback) {
    const index = this.stateChangeListeners.indexOf(callback);
    if (index > -1) {
      this.stateChangeListeners.splice(index, 1);
    }
  }

  // Notificar todos os listeners sobre mudança de estado
  notifyStateChangeListeners(newState, oldState) {
    this.stateChangeListeners.forEach(callback => {
      callback(newState, oldState);
    });
  }

  // Manipular mudanças de estado
  onStateChange(newState, oldState) {
    switch (newState) {
      case GAME_STATES.PLAYING:
        this.startGame();
        break;
      case GAME_STATES.PAUSED:
        this.pauseGame();
        break;
      case GAME_STATES.GAME_OVER:
        this.endGame();
        break;
      case GAME_STATES.MENU:
        this.returnToMenu();
        break;
    }
  }

  // Iniciar jogo
  startGame() {
    this.gameData.startTime = Date.now();
    this.gameData.gameTime = 0;
    this.gameData.isPaused = false;
    
    if (this.previousState === GAME_STATES.MENU) {
      // Novo jogo
      this.resetGameData();
    }
  }

  // Pausar jogo
  pauseGame() {
    this.gameData.isPaused = true;
  }

  // Continuar jogo
  resumeGame() {
    if (this.currentState === GAME_STATES.PAUSED) {
      this.gameData.isPaused = false;
      this.setState(GAME_STATES.PLAYING);
    }
  }

  // Terminar jogo
  endGame() {
    this.gameData.isPaused = false;
    
    // Atualizar recorde se necessário
    if (this.gameData.score > this.gameData.highScore) {
      this.gameData.highScore = this.gameData.score;
      this.saveHighScore();
    }
    
    // Calcular tempo total de jogo
    if (this.gameData.startTime) {
      this.gameData.gameTime = Date.now() - this.gameData.startTime;
    }
  }

  // Voltar ao menu
  returnToMenu() {
    this.gameData.isPaused = false;
  }

  // Reset dos dados do jogo
  resetGameData() {
    this.gameData.score = 0;
    this.gameData.lives = 3;
    this.gameData.level = 1;
    this.gameData.startTime = null;
    this.gameData.gameTime = 0;
    this.gameData.isPaused = false;
  }

  // Atualizar pontuação
  updateScore(newScore) {
    this.gameData.score = Math.max(this.gameData.score, newScore);
  }

  // Perder uma vida
  loseLife() {
    this.gameData.lives = Math.max(0, this.gameData.lives - 1);
    
    if (this.gameData.lives <= 0) {
      this.setState(GAME_STATES.GAME_OVER);
      return false; // Game over
    }
    
    return true; // Ainda tem vidas
  }

  // Ganhar uma vida
  gainLife() {
    this.gameData.lives = Math.min(5, this.gameData.lives + 1); // Máximo 5 vidas
  }

  // Obter dados do jogo
  getGameData() {
    return { ...this.gameData };
  }

  // Obter estatísticas do jogo
  getGameStats() {
    return {
      currentScore: this.gameData.score,
      highScore: this.gameData.highScore,
      lives: this.gameData.lives,
      level: this.gameData.level,
      gameTime: this.gameData.gameTime,
      isNewRecord: this.gameData.score > 0 && this.gameData.score === this.gameData.highScore
    };
  }

  // Verificar se pode pausar
  canPause() {
    return this.currentState === GAME_STATES.PLAYING;
  }

  // Verificar se pode continuar
  canResume() {
    return this.currentState === GAME_STATES.PAUSED;
  }

  // Verificar se jogo está ativo
  isGameActive() {
    return this.currentState === GAME_STATES.PLAYING || this.currentState === GAME_STATES.PAUSED;
  }

  // Toggle pause
  togglePause() {
    if (this.canPause()) {
      this.setState(GAME_STATES.PAUSED);
    } else if (this.canResume()) {
      this.resumeGame();
    }
  }

  // Atualizar tempo de jogo
  updateGameTime() {
    if (this.gameData.startTime && !this.gameData.isPaused && this.isState(GAME_STATES.PLAYING)) {
      this.gameData.gameTime = Date.now() - this.gameData.startTime;
    }
  }
}
