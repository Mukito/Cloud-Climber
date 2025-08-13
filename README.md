# Cloud-Climber
Jogo Teste desenvolvido em React (JavaScript/JSX) com HTML5 Canvas para a parte gráfica e Tailwind CSS para o styling.


### 🛠️ Tecnologias Utilizadas:

  * React - Framework JavaScript para a interface
  * HTML5 Canvas - Para renderização dos gráficos 2D
  * JavaScript - Lógica do jogo, física e controles
  * Tailwind CSS - Estilização da interface







<img width="927" height="452" alt="image" src="https://github.com/user-attachments/assets/1a97181e-c515-4a8d-9a6b-de9653ca16fc" />




### 📜 Plano de Jogo – "Cloud Climber"
### 🎯 Objetivo
O jogador deve escalar o máximo possível, saltando entre plataformas, evitando quedas e superando desafios que aumentam de dificuldade conforme a altura alcançada.

**🕹️ Controles**
 * **Movimento**: Setas ← / → ou teclas A / D
 * **Pulo**: Barra de Espaço, seta ↑ ou tecla W

**⚙️ Mecânicas Principais**
1. **Movimento Lateral**: Apenas esquerda/direita.
2. **Salto**: Permite alcançar plataformas mais altas.
3. **Sistema de Vidas**:
   * Vidas iniciais: 3
   * Perde uma vida ao cair das plataformas ou errar o salto.
   * Respawn na última plataforma segura ou um pouco abaixo.
   * Pequena animação de “queda” ao perder vida.
   * Breve invencibilidade (2 segundos, com efeito de piscar) após respawn.
   * Possibilidade de coletar vidas extras em alturas específicas (opcional).

4. **Progressão Dinâmica**:
   * Plataformas progressivamente menores e mais rápidas.
   * Distâncias e posicionamentos cada vez mais desafiadores.

5. **Plataformas**:
   * Tipos: nuvens e bases de madeira/metal de tamanhos variados.
   * Algumas móveis, com movimento horizontal aleatório.

**🎥 Câmera**
   * Segue o jogador verticalmente conforme ele sobe.
   * Mantém a sensação de altura crescente.

**🏆 Pontuação**
   * Baseada na altura máxima alcançada.
   * Sistema de recordes: salva a melhor pontuação.
   * Indicador de altura atual visível na interface.

**🎨 Visual e Estilo**
   * Personagem carismático com aparência simpática.
   * Paleta vibrante com fundo em gradiente azul-céu.
   * Plataformas visuais distintas:
      * **Nuvens**: brancas e fofas.
      * **Madeiras/metais**: marrons ou cinzas.
   * Interface limpa, com:
      * Contador de vidas no canto da tela.
      * Pontuação e altura exibidas de forma clara.

**🔊 Recursos Adicionais**
   * Física de salto e gravidade realistas.
   * Efeitos sonoros para pulos, quedas e coleta de vidas.
   * Feedback visual nas ações (por exemplo, piscar em vermelho ao receber dano).
