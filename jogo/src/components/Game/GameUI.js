// src/components/Game/GameUI.js

import React from 'react';
import { GAME_STATES } from '../../constants/gameConstants.js';
import Button from '../Common/Button.js';

const GameUI = ({ gameState, gameStats, onStartGame, onReturnToMenu, onTogglePause }) => {
  const renderMenuScreen = () => (
    <div className="text-center">
      <div className="mb-8">
        <h2 className="text-2xl mb-4 text-gray-800">Como Jogar:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">🎮 Controles</h3>
            <p className="text-sm">← → ou A/D para mover</p>
            <p className="text-sm">ESPAÇO, ↑ ou W para pular</p>
            <p className="text-sm">ESC ou P para pausar</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">🎯 Objetivo</h3>
            <p className="text-sm">Escale o máximo que conseguir</p>
            <p className="text-sm">Pule entre as plataformas móveis</p>
            <p className="text-sm">Evite cair no vazio</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">❤️ Vidas</h3>
            <p className="text-sm">Você começa com 3 vidas</p>
            <p className="text-sm">Perde vida ao cair muito</p>
            <p className="text-sm">Game over sem vidas</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">⭐ Dicas</h3>
            <p className="text-sm">Plataformas se movem sozinhas</p>
            <p className="text-sm">Nuvens e madeiras têm comportamentos diferentes</p>
            <p className="text-sm">Quanto mais alto, mais pontos</p>
          </div>
        </div>
        
        {gameStats.highScore > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-lg">
            <p className="text-lg font-semibold text-yellow-800">
              🏆 Seu Recorde: {gameStats.highScore} pontos
            </p>
          </div>
        )}
      </div>
      
      <Button
        onClick={onStartGame}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors shadow-lg"
      >
        {gameStats.highScore > 0 ? 'Jogar Novamente' : 'Começar Jogo'}
      </Button>
    </div>
  );

  const renderGameOverScreen = () => (
    <div className="text-center">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-red-600 mb-4">🎮 Game Over!</h2>
        
        <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-semibold">Pontuação Final:</span>
              <span className="text-xl font-bold text-blue-600">{gameStats.currentScore}</span>
            </div>
            
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-semibold">Altura Alcançada:</span>
              <span className="text-lg">{Math.floor(gameStats.currentScore / 10)}m</span>
            </div>

            {gameStats.gameTime > 0 && (
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold">Tempo de Jogo:</span>
                <span className="text-lg">{Math.floor(gameStats.gameTime / 1000)}s</span>
              </div>
            )}

            {gameStats.isNewRecord && (
              <div className="bg-gradient-to-r from-yellow-200 to-yellow-300 p-3 rounded-lg">
                <p className="font-bold text-yellow-800">🏆 NOVO RECORDE!</p>
              </div>
            )}

            {!gameStats.isNewRecord && gameStats.highScore > 0 && (
              <div className="flex justify-between items-center">
                <span className="font-semibold">Recorde Atual:</span>
                <span className="text-lg text-green-600">{gameStats.highScore}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={onStartGame}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors shadow-lg"
        >
          🔄 Tentar Novamente
        </Button>
        
        <div>
          <Button
            onClick={onReturnToMenu}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            📋 Menu Principal
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPausedScreen = () => (
    <div className="text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-yellow-600 mb-4">⏸️ Jogo Pausado</h2>
        
        <div className="bg-yellow-50 p-6 rounded-lg max-w-md mx-auto">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Pontuação Atual:</span>
              <span className="text-xl font-bold text-blue-600">{gameStats.currentScore}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-semibold">Vidas Restantes:</span>
              <span className="text-lg">{'❤️'.repeat(gameStats.lives)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold">Altura:</span>
              <span className="text-lg">{Math.floor(gameStats.currentScore / 10)}m</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mt-4">
          Pressione ESC, P ou o botão abaixo para continuar
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={onTogglePause}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors shadow-lg"
        >
          ▶️ Continuar
        </Button>
        
        <div>
          <Button
            onClick={onReturnToMenu}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            🏠 Sair para Menu
          </Button>
        </div>
      </div>
    </div>
  );

  const renderGameplayHUD = () => (
    <div className="flex justify-between items-center mb-4 p-3 bg-gray-800 text-white rounded-lg">
      <div className="flex space-x-6">
        <div className="text-center">
          <div className="text-sm text-gray-300">Pontuação</div>
          <div className="text-xl font-bold text-blue-300">{gameStats.currentScore}</div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-300">Altura</div>
          <div className="text-lg font-semibold">{Math.floor(gameStats.currentScore / 10)}m</div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-center">
          <div className="text-sm text-gray-300">Vidas</div>
          <div className="text-lg">{'❤️'.repeat(gameStats.lives)}</div>
        </div>

        <Button
          onClick={onTogglePause}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          ⏸️ Pausar
        </Button>
      </div>
    </div>
  );

  // Renderizar baseado no estado atual
  switch (gameState) {
    case GAME_STATES.MENU:
      return renderMenuScreen();
    
    case GAME_STATES.PLAYING:
      return renderGameplayHUD();
    
    case GAME_STATES.PAUSED:
      return renderPausedScreen();
    
    case GAME_STATES.GAME_OVER:
      return renderGameOverScreen();
    
    default:
      return renderMenuScreen();
  }
};

export default GameUI;
