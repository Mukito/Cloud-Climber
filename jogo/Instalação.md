# 🚀 Cloud Climber - Guia de Instalação

## 📋 Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **npm** ou **yarn**
- **VSCode** (recomendado)

## 🛠️ Instalação Passo a Passo

### 1. Criar novo projeto React
```bash
npx create-react-app cloud-climber
cd cloud-climber
```

### 2. Instalar Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Configurar Tailwind CSS

**tailwind.config.js:**
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Criar Estrutura de Pastas

```
src/
├── components/
│   ├── Game/
│   │   ├── CloudClimber.js
│   │   ├── GameUI.js
│   │   └── GameControls.js
│   └── Common/
│       └── Button.js
├── game/
│   ├── Player.js
│   ├── Platform.js
│   ├── Camera.js
│   ├── Input.js
│   ├── Collision.js
│   ├── GameState.js
│   └── Renderer.js
├── constants/
│   └── gameConstants.js
└── utils/
    └── mathUtils.js
```

### 5. Copiar os Arquivos

Copie todos os arquivos criados para suas respectivas pastas:

- `gameConstants.js` → `src/constants/`
- `Player.js` → `src/game/`
- `Platform.js` → `src/game/`
- `Input.js` → `src/game/`
- `Collision.js` → `src/game/`
- `Camera.js` → `src/game/`
- `GameState.js` → `src/game/`
- `Renderer.js` → `src/game/`
- `CloudClimber.js` → `src/components/Game/`
- `GameUI.js` → `src/components/Game/`
- `Button.js` → `src/components/Common/`
- `App.js` → `src/`

### 6. Executar o Projeto
```bash
npm start
```

O jogo estará disponível em `http://localhost:3000`

## 🎮 Controles do Jogo

- **← → ou A/D:** Mover esquerda/direita
- **ESPAÇO, ↑ ou W:** Pular
- **ESC ou P:** Pausar/continuar

## 🔧 Personalização

### Modificar Configurações do Jogo
Edite o arquivo `src/constants/gameConstants.js`:

```javascript
// Exemplo: Tornar o jogo mais fácil
export const GAME_CONSTANTS = {
  GRAVITY: 0.6,        // Reduzir gravidade
  JUMP_FORCE: -18,     // Aumentar força do pulo
  INITIAL_LIVES: 5,    // Mais vidas
  // ... outras configurações
};
```

### Adicionar Novos Tipos de Plataforma
No arquivo `src/game/Platform.js`:

```javascript
// Adicionar novo tipo
export const PLATFORM_TYPES = {
  CLOUD: 'cloud',
  WOOD: 'wood',
  METAL: 'metal',
  ICE: 'ice'    // Novo tipo
};
```

### Modificar Cores
No arquivo `src/constants/gameConstants.js`:

```javascript
COLORS: {
  SKY: '#87CEEB',
  PLAYER: '#4ECDC4',
  // Adicionar novas cores...
}
```

## 🐛 Solução de Problemas

### Problema: "Module not found"
**Solução:** Verifique se todos os arquivos estão nas pastas corretas e se as importações estão corretas.

### Problema: Canvas não aparece
**Solução:** Verifique se o Tailwind CSS está configurado corretamente e se o canvas está sendo referenciado.

### Problema: Jogo muito lento
**Solução:** 
- Reduza o número de plataformas em `GAME_CONSTANTS.MAX_PLATFORMS`
- Ajuste a taxa de FPS em `GAME_CONSTANTS.FPS`

### Problema: localStorage não funciona
**Solução:** O código já tem fallbacks para quando localStorage não está disponível.

## 📦 Scripts Disponíveis

```bash
npm start          # Executar em modo desenvolvimento
npm run build      # Build para produção
npm test           # Executar testes
npm run eject      # Ejetar configuração (irreversível)
```

## 🚀 Deploy

### Deploy no Netlify/Vercel:
1. Execute `npm run build`
2. Faça upload da pasta `build/`
3. Configure o site

### Deploy no GitHub Pages:
```bash
npm install --save-dev gh-pages
```

Adicione no `package.json`:
```json
{
  "homepage": "https://seuusuario.github.io/cloud-climber",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

Execute:
```bash
npm run deploy
```

## 🎯 Próximos Passos

1. **Testes:** Adicionar testes unitários para cada módulo
2. **Otimização:** Implementar object pooling para plataformas
3. **Features:** Adicionar power-ups, inimigos, níveis
4. **Audio:** Implementar sistema de som
5. **Mobile:** Adicionar controles touch

## 💡 Dicas de Desenvolvimento

- Use o **React DevTools** para debug
- **F12** para abrir DevTools e ver erros no console
- Modifique constantes para testar rapidamente
- Use `console.log()` nos métodos para debug
- Teste em diferentes navegadores

## 📚 Recursos Úteis

- [Documentação do React](https://reactjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Game Development Patterns](https://gameprogrammingpatterns.com/)

---

**Divirta-se programando e jogando! 🎮**
