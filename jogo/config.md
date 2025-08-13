no `bash`
Configuração Inicial

#### Criar novo projeto React
`npx create-react-app cloud-climber` <br>
`cd cloud-climber` <br>

#### Instalar Tailwind CSS
`npm install -D tailwindcss postcss autoprefixer` <br>
`npx tailwindcss init -p` <br>

2 - Configurar o Tailwind <br>
    * conforme arquivo tailwind.config
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
    
3 - Configurar CSS `src/index.css`

```css

@tailwind base;
@tailwind components;
@tailwind utilities;

```

4 - Substituir o conteúdo:
  * Substitua o conteúdo de `src/App.js` pelo código do jogo
  * Ou crie um novo componente `CloudClimber.js`

5 - Executar: 
```bash
npm start
```


