// src/game/Input.js

import { INPUT_KEYS } from '../constants/gameConstants.js';

export class InputManager {
  constructor() {
    this.keys = {};
    this.previousKeys = {};
    this.setupEventListeners();
  }

  // Configurar event listeners
  setupEventListeners() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  // Manipular tecla pressionada
  handleKeyDown(event) {
    this.keys[event.key] = true;
    
    // Prevenir comportamento padrão para teclas do jogo
    if (this.isGameKey(event.key)) {
      event.preventDefault();
    }
  }

  // Manipular tecla solta
  handleKeyUp(event) {
    this.keys[event.key] = false;
  }

  // Verificar se é uma tecla do jogo
  isGameKey(key) {
    const allGameKeys = [
      ...INPUT_KEYS.LEFT,
      ...INPUT_KEYS.RIGHT,
      ...INPUT_KEYS.JUMP,
      ...INPUT_KEYS.PAUSE
    ];
    return allGameKeys.includes(key);
  }

  // Atualizar estado das teclas (chamado a cada frame)
  update() {
    this.previousKeys = { ...this.keys };
  }

  // Verificar se tecla está sendo pressionada
  isKeyPressed(keyGroup) {
    return INPUT_KEYS[keyGroup].some(key => this.keys[key]);
  }

  // Verificar se tecla foi pressionada neste frame (just pressed)
  isKeyJustPressed(keyGroup) {
    return INPUT_KEYS[keyGroup].some(key => 
      this.keys[key] && !this.previousKeys[key]
    );
  }

  // Verificar se tecla foi solta neste frame (just released)
  isKeyJustReleased(keyGroup) {
    return INPUT_KEYS[keyGroup].some(key => 
      !this.keys[key] && this.previousKeys[key]
    );
  }

  // Métodos específicos para cada ação
  isMovingLeft() {
    return this.isKeyPressed('LEFT');
  }

  isMovingRight() {
    return this.isKeyPressed('RIGHT');
  }

  isJumping() {
    return this.isKeyJustPressed('JUMP');
  }

  isPauseJustPressed() {
    return this.isKeyJustPressed('PAUSE');
  }

  // Limpar todos os inputs
  clear() {
    this.keys = {};
    this.previousKeys = {};
  }

  // Destruir event listeners (para cleanup)
  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  // Obter estado atual dos controles
  getControlState() {
    return {
      left: this.isMovingLeft(),
      right: this.isMovingRight(),
      jump: this.isJumping(),
      pause: this.isPauseJustPressed()
    };
  }

  // Debug: mostrar teclas pressionadas
  getActiveKeys() {
    return Object.keys(this.keys).filter(key => this.keys[key]);
  }
}
