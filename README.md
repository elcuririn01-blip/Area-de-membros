# 🧸 Bordado Perfeito · Área de Membros Infantil & Aconchegante

Uma área de membros completa, moderna, acolhedora e minimalista para ateliê de bordado computadorizado, contendo todo o acervo de **3.764 matrizes infantis** organizadas por temas, coleções e formatos de máquinas.

---

## ✨ Principais Diferenciais e Melhorias

1. **Design Aconchegante & Minimalista ("Estilo Infantil")**:
   - Paleta de cores em tons pastéis suaves (Rosa Bebê, Amarelinho Manteiga, Menta, Azul Nuvem e Linho Suave).
   - Detalhes artesanais de costura pontilhada (*embroidery stitches*) nos cards e botões.
   - Tipografia amigável e legível: **Fredoka** para títulos acolhedores e **Nunito** para especificações técnicas claras.
   - Micro-interações agradáveis e suaves, sem poluição visual.

2. **Mesmos Links de Acesso Originais & Integração Total**:
   - Todas as **3.764 capas** carregam em alta definição diretamente do servidor.
   - Download individual de qualquer matriz nos 5 principais formatos: **PES** (Brother), **JEF** (Janome), **DST** (Tajima/Industriais), **EXP** (Bernina/Melco) e **XXX** (Singer).
   - Download de todas as **30 coleções completas em formato ZIP**.
   - Download do **Acervo Inteiro de uma só vez em ZIP** em qualquer formato selecionado.

3. **Busca Instantânea Inteligente**:
   - Busca em tempo real sem travamentos.
   - Não diferencia acentos nem maiúsculas/minúsculas.
   - Busca por nome da matriz, coleção, categoria, medida ou bastidor.
   - Botões de sugestão rápida (Ursinhos, Safári, Enxoval, Flores, Alfabetos, Dinossauros, Nomes).

4. **Filtros e Ordenação Avançada**:
   - **Filtro por Bastidor**: 10×10 cm, 13×18 cm, 14×14 cm, 16×26 cm, 20×30 cm.
   - **Filtro por Pontos**: Leve (< 10k), Médio (10k a 25k), Denso (> 25k).
   - **Filtro por Cores**: 1 cor (monocromático), 2 a 4 cores, 5+ cores.
   - **Ordenação**: Nome (A-Z ou Z-A), Menos pontos, Mais pontos, Menor tamanho, Maior tamanho.
   - **Alternador de Grade**: Grade Normal (confortável) ou Grade Compacta (alta densidade).

5. **Ficha Técnica Detalhada no Modal**:
   - Pré-visualização ampla da matriz.
   - Dimensões reais em centímetros e milímetros.
   - Sugestão do bastidor ideal.
   - Total de pontos e tempo estimado de bordado (a 650 pontos/min).
   - Botões de download em todos os formatos com destaque para a máquina do usuário.
   - Botão para compartilhar link direto da matriz (`#mat=ID`).

6. **Seletor de Máquina Inteligente**:
   - Salva a preferência da artesã no navegador (`localStorage`).
   - Todos os botões do site se adaptam automaticamente para baixar na extensão escolhida.

7. **Sistema de Favoritos**:
   - Salve suas matrizes favoritas com 1 clique no coraçãozinho (♥).
   - Aba exclusiva com todas as matrizes favoritadas para acesso rápido antes de bordar.

8. **Guia Passo a Passo "Como Bordar"**:
   - Tutorial ilustrado em 5 passos para levar a matriz até a máquina.
   - Dicas profissionais sobre tensão de linha, entretela e escolha de agulhas.

9. **Sons Fofos (Web Audio API)**:
   - Efeitos sonoros suaves estilo carrilhão/marimba ao favoritar e clicar.
   - Botão para ligar/desligar o som a qualquer momento.

---

## 🚀 Como Abrir e Usar

Basta abrir o arquivo **`index.html`** em qualquer navegador moderno (Chrome, Edge, Safari, Firefox) no computador, celular ou tablet.

Se preferir rodar em um servidor local:
```bash
# Com Node.js
npx serve .

# Ou com Python
python -m http.server 3000
```

---

## ⚙️ Estrutura dos Arquivos

- **`index.html`**: Estrutura semântica da área de membros com menu, barra de busca, modais e containers.
- **`styles.css`**: Design completo, responsivo, minimalista e aconchegante com variáveis CSS e animações suaves.
- **`app.js`**: Lógica da aplicação (catálogo, filtros, paginação em lotes de alto desempenho, modais e downloads).
- **`catalogo.js`**: Base de dados completa com as 3.764 matrizes, 12 categorias e 30 coleções.

### 🌐 Configuração de Servidor Próprio (Opcional)
Por padrão, o arquivo `app.js` aponta os downloads e capas para `https://area-do-aluno.shop`:
```javascript
const CONFIG = {
  BASE_URL: 'https://area-do-aluno.shop',
  // ...
};
```
Caso você venha a hospedar todos os arquivos `.zip`, `.pes`, `.jef` e imagens no seu próprio domínio ou hospedagem (ex: Hostinger, AWS S3, etc.), basta alterar `CONFIG.BASE_URL` para o endereço da sua hospedagem.
