/**
 * ═══════════════════════════════════════════════════════════════
 * BORDADO PERFEITO · ÁREA DE MEMBROS INFANTIL & ACONCHEGANTE
 * Script principal: catálogo, busca inteligente, filtros, modais
 * e integração completa de downloads.
 * ═══════════════════════════════════════════════════════════════
 */

// ══ CONFIGURAÇÕES GERAIS ══
const CONFIG = {
  // Base URL onde os arquivos, zips e capas reais estão hospedados
  BASE_URL: 'https://area-do-aluno.shop',
  ARQ_DIR: 'arquivos/arquivos',
  CAPAS_DIR: 'capas/capas',
  ZIPS_DIR: 'zips-colecoes/zips',
  ZIPS_TUDO_DIR: 'zips-completos/zips',
  BATCH_SIZE: 48 // Quantidade de matrizes renderizadas por lote
};

// ══ BANCO DE DADOS DE MÁQUINAS E COMPATIBILIDADE ══
const MAQUINAS = [
  { s: 'PES', marca: 'Brother', modelos: 'Brother, Baby Lock, Bernina Deco', ext: '.pes', icone: '🧵' },
  { s: 'JEF', marca: 'Janome', modelos: 'Janome, Elna, Kenmore', ext: '.jef', icone: '🪡' },
  { s: 'DST', marca: 'Tajima / Industrial', modelos: 'Tajima, Barudan, Industriais, SWF', ext: '.dst', icone: '🏭' },
  { s: 'EXP', marca: 'Bernina / Melco', modelos: 'Melco, Bernina', ext: '.exp', icone: '✨' },
  { s: 'XXX', marca: 'Singer', modelos: 'Singer, Compucon', ext: '.xxx', icone: '🪢' }
];

// Ícones e cores para cada categoria
const CATEGORIA_ICONES = {
  'ursinhos': { icone: '🧸', cor: '#FFE8D6' },
  'safari-e-animais': { icone: '🦁', cor: '#E7F7EF' },
  'bebe-e-enxoval': { icone: '🍼', cor: '#FDE8EF' },
  'infantil': { icone: '🎈', cor: '#EBF4FC' },
  'fazendinha': { icone: '🐮', cor: '#FEF5E5' },
  'jardim-e-flores': { icone: '🌸', cor: '#FDE8EF' },
  'princesas-e-fadas': { icone: '👑', cor: '#F3EEF9' },
  'fundo-do-mar': { icone: '🐳', cor: '#EBF4FC' },
  'dinossauros': { icone: '🦕', cor: '#E7F7EF' },
  'natal-e-datas-especiais': { icone: '🎄', cor: '#FDE8EF' },
  'alfabetos': { icone: '🔤', cor: '#F3EEF9' },
  'nomes-prontos': { icone: '🏷️', cor: '#FEF5E5' }
};

// ══ GERENCIADOR DE ESTADO LOCAL ══
const Storage = {
  get: (key, fallback) => {
    try {
      const val = localStorage.getItem('bp_' + key);
      return val === null ? fallback : JSON.parse(val);
    } catch (e) {
      return fallback;
    }
  },
  set: (key, val) => {
    try {
      localStorage.setItem('bp_' + key, JSON.stringify(val));
    } catch (e) {}
  }
};

// ══ SÍNTESE DE SOM COZY (WEB AUDIO API) ══
class CozySound {
  constructor() {
    this.ctx = null;
    this.enabled = Storage.get('sound_enabled', true);
  }
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }
  playChime(type = 'pop') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.12); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'heart') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.18); // G5
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.23);
      }
    } catch (e) {}
  }
}
const sound = new CozySound();

// ══ APLICAÇÃO PRINCIPAL ══
document.addEventListener('DOMContentLoaded', () => {
  const ACERVO = window.ACERVO;
  if (!ACERVO) {
    document.getElementById('view').innerHTML = `
      <div class="empty-state-box">
        <span class="empty-icon">⚠️</span>
        <h3 class="empty-title">Catálogo não carregado</h3>
        <p class="empty-desc">Verifique se o arquivo catalogo.js está presente na mesma pasta.</p>
      </div>`;
    return;
  }

  // Estado da Aplicação
  let userFormat = Storage.get('machine_fmt', null);
  let favorites = Storage.get('favorites', []);
  let currentRoute = { view: 'home', param: null, subcol: null };
  let currentFilters = {
    hoop: 'all',
    stitches: 'all',
    colors: 'all',
    sort: 'default',
    viewMode: Storage.get('view_mode', 'comfortable')
  };

  // Índices Rápidos
  const COLS = ACERVO.cols;
  const CATS = ACERVO.cats;
  const MATRIZES = ACERVO.m;

  const colNomeMap = {}, colCatMap = {};
  for (const k in COLS) {
    colNomeMap[k] = COLS[k].nome;
    colCatMap[k] = COLS[k].cat;
  }

  const catNomeMap = {};
  CATS.forEach(c => { catNomeMap[c.id] = c.nome; });

  // Normalização de texto para busca
  const normalize = (str) => {
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  // Pré-computa strings de busca
  const SEARCH_INDEX = MATRIZES.map(m => {
    return normalize(m[1] + ' ' + (colNomeMap[m[2]] || '') + ' ' + (catNomeMap[colCatMap[m[2]]] || '') + ' ' + m[3]);
  });

  // Utilitários de Formatação
  const fmtNum = (n) => Number(n || 0).toLocaleString('pt-BR');
  const fmtCm = (w, h) => `${(w / 10).toFixed(1).replace('.', ',')} × ${(h / 10).toFixed(1).replace('.', ',')} cm`;
  
  // URL Resolvers
  const getCapaUrl = (id) => `${CONFIG.BASE_URL}/${CONFIG.CAPAS_DIR}/${id}.webp`;
  const getSingleFileUrl = (m, fmt) => {
    const f = fmt || userFormat || 'PES';
    return `${CONFIG.BASE_URL}/${CONFIG.ARQ_DIR}/${f}/${m[2]}/${m[8]}.${f.toLowerCase()}`;
  };
  const getColZipUrl = (colId, fmt) => {
    const f = fmt || userFormat || 'PES';
    return `${CONFIG.BASE_URL}/${CONFIG.ZIPS_DIR}/${colId}-${f.toLowerCase()}.zip`;
  };
  const getAllZipUrl = (fmt) => {
    const f = fmt || userFormat || 'PES';
    return `${CONFIG.BASE_URL}/${CONFIG.ZIPS_TUDO_DIR}/acervo-completo-${f.toLowerCase()}.zip`;
  };

  const getZipWeight = (zipKey) => {
    const mb = ACERVO.z && ACERVO.z[zipKey.replace(/\.zip$/, '')];
    if (!mb) return '';
    return mb >= 1 ? `${Math.round(mb)} MB` : `${Math.round(mb * 1024)} KB`;
  };

  // Cálculo de Bastidor Ideal
  const getSuggestedHoop = (wMm, hMm) => {
    const maxDim = Math.max(wMm, hMm);
    const minDim = Math.min(wMm, hMm);
    if (maxDim <= 98) return '10×10 cm';
    if (minDim <= 128 && maxDim <= 178) return '13×18 cm';
    if (maxDim <= 138) return '14×14 cm';
    if (minDim <= 158 && maxDim <= 258) return '16×26 cm';
    if (minDim <= 198 && maxDim <= 298) return '20×30 cm';
    return 'Grande';
  };

  // Tempo estimado de bordado (base 650 ppm + 1.5 min por troca de cor)
  const getEstimatedTime = (pontos, cores) => {
    const minutos = Math.ceil((pontos / 650) + (cores * 1.5));
    if (minutos < 60) return `${minutos} min`;
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h}h ${m}m`;
  };

  // Elementos do DOM
  const viewEl = document.getElementById('view');
  const sidebarEl = document.getElementById('sidebar');
  const backdropEl = document.getElementById('drawerBackdrop');
  const searchInputEl = document.getElementById('searchInput');
  const searchClearEl = document.getElementById('searchClear');
  const searchFormEl = document.getElementById('searchForm');
  const modalMatrixEl = document.getElementById('modalMatrix');
  const modalMatrixWindowEl = document.getElementById('modalMatrixWindow');
  const modalMachineEl = document.getElementById('modalMachine');
  const modalMachineWindowEl = document.getElementById('modalMachineWindow');

  // Atualiza indicadores de máquina
  const updateMachineDisplay = () => {
    const fmt = userFormat || 'PES';
    document.querySelectorAll('.js-active-format').forEach(el => {
      el.textContent = fmt;
    });
  };

  // Atualiza contador de favoritos
  const updateFavCount = () => {
    const count = favorites.length;
    document.querySelectorAll('.js-fav-count').forEach(el => {
      el.textContent = count > 0 ? count : '';
    });
  };

  // Toast Notification
  const showToast = (msg, icon = '✨') => {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  };

  // Navegação entre rotas
  const navigate = (view, param = null, subcol = null) => {
    currentRoute = { view, param, subcol };
    closeDrawer();

    // Atualiza menu ativo no menu lateral e na barra inferior mobile
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    document.querySelectorAll('.mbn-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });

    renderView();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Atualiza hash da URL sem recarregar a página
    let hash = `#${view}`;
    if (param) hash += `/${param}`;
    if (subcol) hash += `/${subcol}`;
    history.replaceState(null, '', hash);
  };

  // Mobile Drawer (Gaveta)
  const openDrawer = () => {
    sidebarEl.classList.add('active');
    backdropEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  const closeDrawer = () => {
    sidebarEl.classList.remove('active');
    backdropEl.classList.remove('active');
    document.body.style.overflow = '';
  };
  const toggleDrawer = () => {
    if (sidebarEl.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  document.getElementById('btnOpenMenu')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDrawer();
  });
  document.getElementById('btnBottomMenu')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDrawer();
  });
  document.getElementById('btnCloseDrawer')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeDrawer();
  });
  backdropEl?.addEventListener('click', closeDrawer);

  // Busca com debounce
  let searchTimeout;
  searchInputEl?.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const q = searchInputEl.value.trim();
    searchClearEl.classList.toggle('active', q.length > 0);
    searchTimeout = setTimeout(() => {
      if (q.length >= 2) {
        navigate('search', q);
      } else if (currentRoute.view === 'search') {
        navigate('home');
      }
    }, 280);
  });

  searchClearEl?.addEventListener('click', () => {
    searchInputEl.value = '';
    searchClearEl.classList.remove('active');
    searchInputEl.focus();
    if (currentRoute.view === 'search') navigate('home');
  });

  searchFormEl?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = searchInputEl.value.trim();
    if (q) navigate('search', q);
  });

  // Chips de pesquisa rápida
  document.querySelectorAll('.js-quick-search').forEach(tag => {
    tag.addEventListener('click', () => {
      const q = tag.dataset.query;
      searchInputEl.value = q;
      searchClearEl.classList.add('active');
      navigate('search', q);
    });
  });

  // Renderizador de Card de Matriz
  const renderMatrixCard = (m) => {
    const isFav = favorites.includes(m[0]);
    const hoop = getSuggestedHoop(m[4], m[5]);
    const currentFmt = userFormat || 'PES';
    const downloadUrl = getSingleFileUrl(m, currentFmt);
    const capaUrl = getCapaUrl(m[0]);

    return `
      <div class="matrix-card" data-matrix-id="${m[0]}">
        <div class="matrix-thumb-box js-open-matrix" data-matrix-id="${m[0]}">
          <img class="matrix-img" src="${capaUrl}" alt="${m[1]}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23FDE8EF%22/><text x=%2250%22 y=%2255%22 font-size=%2230%22 text-anchor=%22middle%22>🧵</text></svg>'">
          <span class="hoop-badge">${hoop}</span>
          <button class="btn-fav ${isFav ? 'active' : ''} js-toggle-fav" data-fav-id="${m[0]}" aria-label="Favoritar matriz" title="Favoritar matriz">
            ♥
          </button>
        </div>
        <div class="matrix-details">
          <h4 class="matrix-title js-open-matrix" data-matrix-id="${m[0]}" title="${m[1]}">${m[1]}</h4>
          <div class="matrix-meta-specs">
            <span class="matrix-size">${m[3]}</span>
            <span class="matrix-points">${(m[6] / 1000).toFixed(1)}k pts • ${m[7]}c</span>
          </div>
          <div class="matrix-actions-row">
            <a class="btn-card-download" href="${downloadUrl}" download title="Baixar em ${currentFmt}">
              <span>⬇</span> Baixar ${currentFmt}
            </a>
            <button class="btn-card-quickview js-open-matrix" data-matrix-id="${m[0]}" title="Ficha completa">
              👁️
            </button>
          </div>
        </div>
      </div>
    `;
  };

  // Renderizador em Lote (Infinite Chunk Grid)
  let renderNextBatch = null;
  const renderBatchGrid = (list, targetContainer) => {
    let index = 0;
    const batchSize = CONFIG.BATCH_SIZE;

    const appendChunk = () => {
      let html = '';
      const limit = Math.min(index + batchSize, list.length);
      for (; index < limit; index++) {
        html += renderMatrixCard(list[index]);
      }
      targetContainer.insertAdjacentHTML('beforeend', html);

      const loadMoreBtn = document.getElementById('btnLoadMore');
      const counterEl = document.getElementById('loadCounter');
      if (index < list.length) {
        renderNextBatch = appendChunk;
        if (loadMoreBtn) {
          loadMoreBtn.style.display = 'inline-flex';
          loadMoreBtn.innerHTML = `Carregar mais matrizes (${fmtNum(list.length - index)} restantes)`;
        }
        if (counterEl) {
          counterEl.textContent = `Mostrando ${fmtNum(index)} de ${fmtNum(list.length)} matrizes`;
        }
      } else {
        renderNextBatch = null;
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        if (counterEl) {
          counterEl.textContent = `Todas as ${fmtNum(list.length)} matrizes carregadas com carinho! ✨`;
        }
      }
    };

    appendChunk();
  };

  // Aplicação de Filtros e Ordenação
  const applyFiltersAndSorting = (items) => {
    let filtered = [...items];

    // Filtro por Bastidor
    if (currentFilters.hoop !== 'all') {
      filtered = filtered.filter(m => {
        const hoop = getSuggestedHoop(m[4], m[5]);
        return hoop.toLowerCase().includes(currentFilters.hoop.toLowerCase());
      });
    }

    // Filtro por Pontos
    if (currentFilters.stitches !== 'all') {
      filtered = filtered.filter(m => {
        const pts = m[6];
        if (currentFilters.stitches === 'light') return pts < 10000;
        if (currentFilters.stitches === 'medium') return pts >= 10000 && pts <= 25000;
        if (currentFilters.stitches === 'dense') return pts > 25000;
        return true;
      });
    }

    // Filtro por Cores
    if (currentFilters.colors !== 'all') {
      filtered = filtered.filter(m => {
        const c = m[7];
        if (currentFilters.colors === '1') return c === 1;
        if (currentFilters.colors === '2-4') return c >= 2 && c <= 4;
        if (currentFilters.colors === '5+') return c >= 5;
        return true;
      });
    }

    // Ordenação
    if (currentFilters.sort === 'name-asc') {
      filtered.sort((a, b) => a[1].localeCompare(b[1]));
    } else if (currentFilters.sort === 'name-desc') {
      filtered.sort((a, b) => b[1].localeCompare(a[1]));
    } else if (currentFilters.sort === 'points-asc') {
      filtered.sort((a, b) => a[6] - b[6]);
    } else if (currentFilters.sort === 'points-desc') {
      filtered.sort((a, b) => b[6] - a[6]);
    } else if (currentFilters.sort === 'size-asc') {
      filtered.sort((a, b) => (a[4] * a[5]) - (b[4] * b[5]));
    } else if (currentFilters.sort === 'size-desc') {
      filtered.sort((a, b) => (b[4] * b[5]) - (a[4] * a[5]));
    }

    return filtered;
  };

  // Barra de Ferramentas de Filtros
  const renderFiltersToolbar = () => {
    return `
      <div class="filters-toolbar">
        <div class="filters-left">
          <div class="filter-select-group">
            <span class="filter-label">Bastidor:</span>
            <select class="custom-select js-filter-hoop">
              <option value="all" ${currentFilters.hoop === 'all' ? 'selected' : ''}>Todos os Bastidores</option>
              <option value="10×10" ${currentFilters.hoop === '10×10' ? 'selected' : ''}>Bastidor 10×10 cm</option>
              <option value="13×18" ${currentFilters.hoop === '13×18' ? 'selected' : ''}>Bastidor 13×18 cm</option>
              <option value="14×14" ${currentFilters.hoop === '14×14' ? 'selected' : ''}>Bastidor 14×14 cm</option>
              <option value="16×26" ${currentFilters.hoop === '16×26' ? 'selected' : ''}>Bastidor 16×26 cm</option>
              <option value="20×30" ${currentFilters.hoop === '20×30' ? 'selected' : ''}>Bastidor 20×30 cm</option>
            </select>
          </div>

          <div class="filter-select-group">
            <span class="filter-label">Pontos:</span>
            <select class="custom-select js-filter-stitches">
              <option value="all" ${currentFilters.stitches === 'all' ? 'selected' : ''}>Todos os Pontos</option>
              <option value="light" ${currentFilters.stitches === 'light' ? 'selected' : ''}>Leve (&lt; 10k pts)</option>
              <option value="medium" ${currentFilters.stitches === 'medium' ? 'selected' : ''}>Médio (10k - 25k pts)</option>
              <option value="dense" ${currentFilters.stitches === 'dense' ? 'selected' : ''}>Denso (&gt; 25k pts)</option>
            </select>
          </div>

          <div class="filter-select-group">
            <span class="filter-label">Cores:</span>
            <select class="custom-select js-filter-colors">
              <option value="all" ${currentFilters.colors === 'all' ? 'selected' : ''}>Todas as Cores</option>
              <option value="1" ${currentFilters.colors === '1' ? 'selected' : ''}>1 Cor (Monocromático)</option>
              <option value="2-4" ${currentFilters.colors === '2-4' ? 'selected' : ''}>2 a 4 Cores</option>
              <option value="5+" ${currentFilters.colors === '5+' ? 'selected' : ''}>5 ou mais Cores</option>
            </select>
          </div>
        </div>

        <div class="filters-right">
          <div class="filter-select-group">
            <span class="filter-label">Ordenar:</span>
            <select class="custom-select js-filter-sort">
              <option value="default" ${currentFilters.sort === 'default' ? 'selected' : ''}>Ordem do Acervo</option>
              <option value="name-asc" ${currentFilters.sort === 'name-asc' ? 'selected' : ''}>Nome (A → Z)</option>
              <option value="name-desc" ${currentFilters.sort === 'name-desc' ? 'selected' : ''}>Nome (Z → A)</option>
              <option value="points-asc" ${currentFilters.sort === 'points-asc' ? 'selected' : ''}>Menos Pontos Primeiro</option>
              <option value="points-desc" ${currentFilters.sort === 'points-desc' ? 'selected' : ''}>Mais Pontos Primeiro</option>
              <option value="size-asc" ${currentFilters.sort === 'size-asc' ? 'selected' : ''}>Menor Tamanho</option>
              <option value="size-desc" ${currentFilters.sort === 'size-desc' ? 'selected' : ''}>Maior Tamanho</option>
            </select>
          </div>

          <div class="view-mode-toggle">
            <button class="vmt-btn ${currentFilters.viewMode === 'comfortable' ? 'active' : ''} js-view-mode" data-mode="comfortable" title="Grade confortável">
              ▦ Normal
            </button>
            <button class="vmt-btn ${currentFilters.viewMode === 'compact' ? 'active' : ''} js-view-mode" data-mode="compact" title="Grade compacta">
              ▤ Compacto
            </button>
          </div>
        </div>
      </div>
    `;
  };

  // ══ RENDERIZADOR PRINCIPAL DE VISUALIZAÇÕES ══
  const renderView = () => {
    const { view, param, subcol } = currentRoute;
    const currentFmt = userFormat || 'PES';
    let html = '';

    // ── VISTA: HOME / INÍCIO ──
    if (view === 'home') {
      html += `
        <!-- Hero Banner Acolhedor -->
        <section class="hero-banner">
          <div class="hero-content">
            <div class="hero-badge-pill">
              <span>🧸✨</span> Cantinho do Bordado Infantil
            </div>
            <h1 class="hero-title">Bem-vinda ao seu Ateliê Encantado de <em>Bordados</em></h1>
            <p class="hero-desc">Sua biblioteca definitiva com <b>${fmtNum(ACERVO.total)} matrizes infantis</b> prontas para a sua máquina de bordar, organizadas por temas fofos e coleções exclusivas.</p>
          </div>
        </section>

        <!-- Faixa de Máquina Selecionada com Troca Fácil -->
        <div class="format-notice-bar">
          <div class="fnb-text">
            <span>🪡 Sua máquina está configurada para:</span>
            <b>Formato ${currentFmt}</b>
            <span style="opacity:0.75">(Todos os botões baixam automaticamente nesta extensão)</span>
          </div>
          <button class="btn-change-format js-open-machine-modal">
            Trocar Máquina / Formato
          </button>
        </div>

        <!-- Grade de Estatísticas Acolhedoras -->
        <div class="stats-grid">
          <div class="stat-card c1">
            <div class="stat-icon">🧸</div>
            <div class="stat-info">
              <span class="stat-number">${fmtNum(ACERVO.total)}</span>
              <span class="stat-title">Matrizes Infantis</span>
            </div>
          </div>
          <div class="stat-card c2">
            <div class="stat-icon">📁</div>
            <div class="stat-info">
              <span class="stat-number">${Object.keys(COLS).length}</span>
              <span class="stat-title">Coleções Prontas</span>
            </div>
          </div>
          <div class="stat-card c3">
            <div class="stat-icon">✨</div>
            <div class="stat-info">
              <span class="stat-number">5 Formatos</span>
              <span class="stat-title">PES · DST · JEF · EXP · XXX</span>
            </div>
          </div>
          <div class="stat-card c4">
            <div class="stat-icon">👑</div>
            <div class="stat-info">
              <span class="stat-number">Acesso Vitalício</span>
              <span class="stat-title">Sem mensalidade</span>
            </div>
          </div>
        </div>

        <!-- Seção: Categorias em Destaque -->
        <div class="section-header">
          <div class="section-title-box">
            <span class="section-icon">🎀</span>
            <h2 class="section-title">Categorias Encantadas</h2>
          </div>
          <button class="btn-view-all js-nav" data-view="categories">
            Ver todas (${CATS.length}) &rarr;
          </button>
        </div>
        <div class="categories-grid">
          ${CATS.map(c => {
            const meta = CATEGORIA_ICONES[c.id] || { icone: '🌸' };
            return `
              <div class="category-card js-nav" data-view="category" data-param="${c.id}">
                <div class="category-img-wrapper">
                  <img class="category-img" src="${getCapaUrl(c.capa)}" alt="${c.nome}" loading="lazy">
                </div>
                <span class="category-name">${meta.icone} ${c.nome}</span>
                <span class="category-count">${fmtNum(c.n)} matrizes</span>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Seção: Coleções em Destaque -->
        <div class="section-header" style="margin-top: 10px;">
          <div class="section-title-box">
            <span class="section-icon">✨</span>
            <h2 class="section-title">Coleções Mais Amadas</h2>
          </div>
          <button class="btn-view-all js-nav" data-view="collections">
            Ver todas as coleções &rarr;
          </button>
        </div>
        <div class="collections-grid">
          ${Object.keys(COLS).slice(0, 12).map(key => {
            const col = COLS[key];
            return `
              <div class="collection-card js-nav" data-view="collection" data-param="${col.id}">
                <div class="collection-img-box">
                  <img class="collection-img" src="${getCapaUrl(col.capa)}" alt="${col.nome}" loading="lazy">
                </div>
                <div class="collection-meta">
                  <h4 class="collection-name">${col.nome}</h4>
                  <span class="collection-count">${fmtNum(col.n)} matrizes</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Banner Especial: Baixar Acervo Completo de uma vez -->
        <div class="download-pack-banner" style="margin-top: 20px;">
          <div class="dpb-info">
            <span class="dpb-tag">⭐ PACOTE COMPLETO VITALÍCIO</span>
            <h3 class="dpb-title">Baixar Todas as ${fmtNum(ACERVO.total)} Matrizes de uma só vez</h3>
            <p class="dpb-subtitle">Economize tempo! O arquivo ZIP completo em <b>${currentFmt}</b> contém todas as 12 categorias e 30 coleções organizadas em pastas. ${getZipWeight(`acervo-completo-${currentFmt.toLowerCase()}`) ? `Tamanho: ${getZipWeight(`acervo-completo-${currentFmt.toLowerCase()}`)}.` : ''} (Recomendado baixar conectado ao Wi-Fi).</p>
          </div>
          <div class="dpb-actions">
            <a class="btn-download-pack" href="${getAllZipUrl(currentFmt)}" download>
              <span>⬇</span> Baixar Acervo Completo em ${currentFmt}
            </a>
          </div>
        </div>
      `;
    }

    // ── VISTA: TODAS AS CATEGORIAS ──
    else if (view === 'categories') {
      html += `
        <div class="section-header">
          <div class="section-title-box">
            <span class="section-icon">🧸</span>
            <div>
              <h2 class="section-title">Todas as Categorias Infantis</h2>
              <p style="font-size:0.9rem;color:var(--text-muted);">${CATS.length} categorias temáticas com ${fmtNum(ACERVO.total)} matrizes</p>
            </div>
          </div>
        </div>
        <div class="categories-grid" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));">
          ${CATS.map(c => {
            const meta = CATEGORIA_ICONES[c.id] || { icone: '🌸' };
            return `
              <div class="category-card js-nav" data-view="category" data-param="${c.id}" style="padding:16px 12px 18px;">
                <div class="category-img-wrapper" style="border-radius:var(--r-lg);">
                  <img class="category-img" src="${getCapaUrl(c.capa)}" alt="${c.nome}" loading="lazy">
                </div>
                <span class="category-name" style="font-size:1.05rem;">${meta.icone} ${c.nome}</span>
                <span class="category-count">${fmtNum(c.n)} matrizes • ${c.cols.length} coleç${c.cols.length > 1 ? 'ões' : 'ão'}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // ── VISTA: TODAS AS COLEÇÕES ──
    else if (view === 'collections') {
      const allCols = Object.keys(COLS).map(k => COLS[k]).sort((a, b) => b.n - a.n);
      html += `
        <div class="section-header">
          <div class="section-title-box">
            <span class="section-icon">📁</span>
            <div>
              <h2 class="section-title">Todas as Coleções</h2>
              <p style="font-size:0.9rem;color:var(--text-muted);">${allCols.length} pastas temáticas prontas para baixar</p>
            </div>
          </div>
        </div>
        <div class="collections-grid">
          ${allCols.map(col => `
            <div class="collection-card js-nav" data-view="collection" data-param="${col.id}">
              <div class="collection-img-box">
                <img class="collection-img" src="${getCapaUrl(col.capa)}" alt="${col.nome}" loading="lazy">
              </div>
              <div class="collection-meta">
                <h4 class="collection-name">${col.nome}</h4>
                <span class="collection-count">${fmtNum(col.n)} matrizes</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // ── VISTA: UMA CATEGORIA ESPECÍFICA ──
    else if (view === 'category') {
      const cat = CATS.find(c => c.id === param);
      if (!cat) { navigate('categories'); return; }

      const meta = CATEGORIA_ICONES[cat.id] || { icone: '🌸' };
      let items = MATRIZES.filter(m => colCatMap[m[2]] === cat.id);

      // Se filtrou por subcoleção
      if (subcol) {
        items = items.filter(m => m[2] === subcol);
      }

      html += `
        <div style="margin-bottom: 20px;">
          <button class="btn-view-all js-nav" data-view="categories" style="margin-bottom:14px;">
            &larr; Voltar para Categorias
          </button>
          <div class="section-header" style="margin-bottom: 10px;">
            <div class="section-title-box">
              <span class="section-icon" style="font-size:2rem;">${meta.icone}</span>
              <div>
                <h2 class="section-title">${cat.nome}</h2>
                <p style="font-size:0.92rem;color:var(--text-muted);">${fmtNum(cat.n)} matrizes em ${cat.cols.length} coleç${cat.cols.length > 1 ? 'ões' : 'ão'}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Chips de Subcoleções -->
        <div class="subcollection-chips">
          <button class="subchip ${!subcol ? 'active' : ''} js-nav" data-view="category" data-param="${cat.id}">
            Todas as ${fmtNum(cat.n)} matrizes
          </button>
          ${cat.cols.map(cId => {
            const o = COLS[cId];
            if (!o) return '';
            return `
              <button class="subchip ${subcol === cId ? 'active' : ''} js-nav" data-view="category" data-param="${cat.id}" data-subcol="${cId}">
                ${o.nome} <span class="subchip-count">(${o.n})</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Banner de Download da Subcoleção (se selecionada) -->
        ${subcol && COLS[subcol] ? `
          <div class="download-pack-banner">
            <div class="dpb-info">
              <span class="dpb-tag">📁 DOWNLOAD DO PACOTE</span>
              <h3 class="dpb-title">Baixar Coleção "${COLS[subcol].nome}" em ${currentFmt}</h3>
              <p class="dpb-subtitle">Baixe todas as ${COLS[subcol].n} matrizes desta coleção em um único arquivo ZIP. ${getZipWeight(subcol + '-' + currentFmt.toLowerCase()) ? `Tamanho: ${getZipWeight(subcol + '-' + currentFmt.toLowerCase())}.` : ''}</p>
            </div>
            <div class="dpb-actions">
              <a class="btn-download-pack" href="${getColZipUrl(subcol, currentFmt)}" download>
                <span>⬇</span> Baixar Pacote ZIP (${currentFmt})
              </a>
            </div>
          </div>
        ` : ''}

        ${renderFiltersToolbar()}

        <div class="matrix-grid ${currentFilters.viewMode === 'compact' ? 'compact' : ''}" id="matrixGridTarget"></div>

        <div class="load-more-container">
          <button class="btn-load-more" id="btnLoadMore" style="display:none;">Carregar mais matrizes</button>
          <div class="remaining-counter" id="loadCounter"></div>
        </div>
      `;
      currentRoute.activeList = items;
    }

    // ── VISTA: UMA COLEÇÃO ESPECÍFICA ──
    else if (view === 'collection') {
      const col = COLS[param];
      if (!col) { navigate('collections'); return; }

      const items = MATRIZES.filter(m => m[2] === col.id);
      const zipName = `${col.id}-${currentFmt.toLowerCase()}`;
      const zipWeight = getZipWeight(zipName);

      html += `
        <div style="margin-bottom: 20px;">
          <button class="btn-view-all js-nav" data-view="category" data-param="${col.cat}" style="margin-bottom:14px;">
            &larr; Voltar para ${catNomeMap[col.cat] || 'Categoria'}
          </button>
          <div class="section-header" style="margin-bottom: 10px;">
            <div class="section-title-box">
              <span class="section-icon">📁</span>
              <div>
                <h2 class="section-title">${col.nome}</h2>
                <p style="font-size:0.92rem;color:var(--text-muted);">${fmtNum(col.n)} matrizes prontas</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Banner de Download da Coleção Completa -->
        <div class="download-pack-banner">
          <div class="dpb-info">
            <span class="dpb-tag">📁 DOWNLOAD DO PACOTE COMPLETO</span>
            <h3 class="dpb-title">Baixar a Coleção "${col.nome}" inteira em ${currentFmt}</h3>
            <p class="dpb-subtitle">Receba todas as ${col.n} matrizes desta coleção organizadas em um arquivo ZIP. ${zipWeight ? `Tamanho: ${zipWeight}.` : ''}</p>
          </div>
          <div class="dpb-actions">
            <a class="btn-download-pack" href="${getColZipUrl(col.id, currentFmt)}" download>
              <span>⬇</span> Baixar Pacote ZIP (${currentFmt})
            </a>
          </div>
        </div>

        ${renderFiltersToolbar()}

        <div class="matrix-grid ${currentFilters.viewMode === 'compact' ? 'compact' : ''}" id="matrixGridTarget"></div>

        <div class="load-more-container">
          <button class="btn-load-more" id="btnLoadMore" style="display:none;">Carregar mais matrizes</button>
          <div class="remaining-counter" id="loadCounter"></div>
        </div>
      `;
      currentRoute.activeList = items;
    }

    // ── VISTA: RESULTADOS DA BUSCA ──
    else if (view === 'search') {
      const term = normalize(param || '');
      let results = [];
      if (term) {
        for (let i = 0; i < MATRIZES.length; i++) {
          if (SEARCH_INDEX[i].includes(term)) {
            results.push(MATRIZES[i]);
          }
        }
      }

      html += `
        <div class="section-header">
          <div class="section-title-box">
            <span class="section-icon">🔍</span>
            <div>
              <h2 class="section-title">Busca: "${param}"</h2>
              <p style="font-size:0.92rem;color:var(--text-muted);">
                ${results.length > 0 ? `${fmtNum(results.length)} matriz${results.length > 1 ? 'es' : ''} encontrada${results.length > 1 ? 's' : ''}` : 'Nenhuma matriz encontrada'}
              </p>
            </div>
          </div>
        </div>
      `;

      if (results.length === 0) {
        html += `
          <div class="empty-state-box">
            <span class="empty-icon">🔍🧸</span>
            <h3 class="empty-title">Não encontramos matrizes com esse termo</h3>
            <p class="empty-desc">Tente buscar por palavras mais simples como "urso", "leao", "flor", "letra", "nome" ou explore as categorias abaixo.</p>
            <button class="btn-search-action js-nav" data-view="categories" style="margin:0 auto;display:inline-flex;">
              Explorar Categorias
            </button>
          </div>
        `;
      } else {
        html += `
          ${renderFiltersToolbar()}
          <div class="matrix-grid ${currentFilters.viewMode === 'compact' ? 'compact' : ''}" id="matrixGridTarget"></div>
          <div class="load-more-container">
            <button class="btn-load-more" id="btnLoadMore" style="display:none;">Carregar mais matrizes</button>
            <div class="remaining-counter" id="loadCounter"></div>
          </div>
        `;
        currentRoute.activeList = results;
      }
    }

    // ── VISTA: FAVORITOS ──
    else if (view === 'favorites') {
      const favItems = MATRIZES.filter(m => favorites.includes(m[0]));

      html += `
        <div class="section-header">
          <div class="section-title-box">
            <span class="section-icon">♥</span>
            <div>
              <h2 class="section-title">Meus Bordados Favoritos</h2>
              <p style="font-size:0.92rem;color:var(--text-muted);">
                ${favItems.length > 0 ? `${favItems.length} matriz${favItems.length > 1 ? 'es' : ''} salva${favItems.length > 1 ? 's' : ''} no seu aparelho` : 'Você ainda não salvou matrizes'}
              </p>
            </div>
          </div>
          ${favItems.length > 0 ? `
            <button class="btn-view-all js-clear-favs" style="color:var(--rose-dark);border-color:var(--rose-border);">
              Limpar Lista
            </button>
          ` : ''}
        </div>
      `;

      if (favItems.length === 0) {
        html += `
          <div class="empty-state-box">
            <span class="empty-icon">💖</span>
            <h3 class="empty-title">Sua lista de favoritos está vazia</h3>
            <p class="empty-desc">Toque no coraçãozinho (♥) no canto de qualquer matriz para guardar aqui e acessar rapidamente quando for bordar.</p>
            <button class="btn-search-action js-nav" data-view="categories" style="margin:0 auto;display:inline-flex;">
              Ver Catálogo Completo
            </button>
          </div>
        `;
      } else {
        html += `
          ${renderFiltersToolbar()}
          <div class="matrix-grid ${currentFilters.viewMode === 'compact' ? 'compact' : ''}" id="matrixGridTarget"></div>
          <div class="load-more-container">
            <button class="btn-load-more" id="btnLoadMore" style="display:none;">Carregar mais matrizes</button>
            <div class="remaining-counter" id="loadCounter"></div>
          </div>
        `;
        currentRoute.activeList = favItems;
      }
    }

    // ── VISTA: COMO USAR / TUTORIAL DE BORDADO ──
    else if (view === 'help') {
      html += `
        <div class="section-header">
          <div class="section-title-box">
            <span class="section-icon">🪡</span>
            <div>
              <h2 class="section-title">Guia Prático da Artesã: Como Bordar com Perfeição</h2>
              <p style="font-size:0.92rem;color:var(--text-muted);">Passo a passo simples para transferir e bordar qualquer matriz do seu acervo</p>
            </div>
          </div>
        </div>

        <div class="tutorial-steps-list">
          <div class="tutorial-step-card">
            <h4 class="step-card-title">1. Escolha o Formato da Sua Máquina</h4>
            <p class="step-card-desc">Antes de baixar, confirme a marca da sua máquina (Brother usa <b>.PES</b>, Janome usa <b>.JEF</b>, Singer usa <b>.XXX</b>). Aqui na plataforma, basta selecionar uma vez que todos os botões já baixam no formato certo.</p>
          </div>

          <div class="tutorial-step-card">
            <h4 class="step-card-title">2. Baixe a Matriz ou Coleção</h4>
            <p class="step-card-desc">Clique no botão de download. Se baixar matriz avulsa, o arquivo vai direto para a pasta Downloads. Se baixar o pacote ZIP, clique com o botão direito e escolha "Extrair tudo".</p>
          </div>

          <div class="tutorial-step-card">
            <h4 class="step-card-title">3. Passe o Arquivo para a Raiz do Pen Drive</h4>
            <p class="step-card-desc">Coloque o arquivo na <b>raiz do pen drive</b> (fora de qualquer pasta). Muitas máquinas de bordar não reconhecem arquivos colocados dentro de subpastas ou com nomes muito longos.</p>
          </div>

          <div class="tutorial-step-card">
            <h4 class="step-card-title">4. Encaixe na Máquina de Bordar</h4>
            <p class="step-card-desc">Com a máquina ligada, insira o pen drive na porta USB. Abra a aba de memória USB no visor digital e selecione a matriz desejada.</p>
          </div>

          <div class="tutorial-step-card">
            <h4 class="step-card-title">5. Prepare o Tecido, Entretela e Borde</h4>
            <p class="step-card-desc">Para enxovais e fraldas, use entretela rasga-fácil dupla. Para toalhas aveludadas, use um plástico filme hidrossolúvel por cima para que os pontos fiquem nítidos e fofinhos!</p>
          </div>
        </div>

        <!-- Dicas de Ouro -->
        <div class="section-header" style="margin-top: 36px;">
          <div class="section-title-box">
            <span class="section-icon">💡</span>
            <h3 class="section-title">Dicas de Ouro para o Bordado Ficar Lindo</h3>
          </div>
        </div>
        <div class="artisan-tips-grid">
          <div class="tip-card">
            <div class="tip-card-header">
              <span>🧵</span>
              <h4>Tensão da Linha</h4>
            </div>
            <p class="tip-card-desc">Para matrizes com muitos detalhes, mantenha a linha da bobina branca de gramatura 60 ou 70 e ajuste a tensão para que a linha de cima não puxe o verso.</p>
          </div>

          <div class="tip-card">
            <div class="tip-card-header">
              <span>🪡</span>
              <h4>Agulha Ideal</h4>
            </div>
            <p class="tip-card-desc">Use agulha 75/11 ponta bola para malhas, bodies de bebê e fraldinhas. Para tecidos planos ou toalhas, agulha 80/12 ou 90/14 borda perfeitamente.</p>
          </div>

          <div class="tip-card">
            <div class="tip-card-header">
              <span>📐</span>
              <h4>Confira o Bastidor</h4>
            </div>
            <p class="tip-card-desc">Nunca tente bordar uma matriz maior que a área do seu bastidor. Em cada card indicamos a sugestão ideal (10x10, 13x18, 14x14, etc.).</p>
          </div>
        </div>

        <div class="format-notice-bar" style="margin-top: 30px;">
          <div class="fnb-text">
            <span>Dúvida sobre qual formato escolher?</span>
            <b>Sua máquina atual: ${currentFmt}</b>
          </div>
          <button class="btn-change-format js-open-machine-modal">
            Alterar Marca / Formato
          </button>
        </div>
      `;
    }

    // Insere o HTML base
    viewEl.innerHTML = html;

    // Se houver uma lista de matrizes para exibir, aplica filtros e renderiza em lote
    const gridTarget = document.getElementById('matrixGridTarget');
    if (gridTarget && currentRoute.activeList) {
      const processed = applyFiltersAndSorting(currentRoute.activeList);
      renderBatchGrid(processed, gridTarget);
    }
  };

  // ══ MODAL DE DETALHES DA MATRIZ ══
  const openMatrixModal = (id) => {
    const m = MATRIZES.find(item => item[0] === id);
    if (!m) return;

    sound.playChime('pop');
    const isFav = favorites.includes(m[0]);
    const hoop = getSuggestedHoop(m[4], m[5]);
    const estTime = getEstimatedTime(m[6], m[7]);
    const colObj = COLS[m[2]] || { nome: 'Coleção' };
    const currentFmt = userFormat || 'PES';

    modalMatrixWindowEl.innerHTML = `
      <button class="modal-close-btn js-close-modal" aria-label="Fechar">&times;</button>
      
      <div style="text-align:center;">
        <span style="font-size:0.8rem;font-weight:800;color:var(--rose-primary);background:var(--rose-light);padding:3px 12px;border-radius:var(--r-pill);text-transform:uppercase;letter-spacing:0.04em;">
          ${colObj.nome}
        </span>
        <h3 style="font-family:var(--font-heading);font-size:1.45rem;color:var(--text-main);margin-top:6px;">${m[1]}</h3>
      </div>

      <div class="modal-matrix-preview-box">
        <img class="modal-matrix-img" src="${getCapaUrl(m[0])}" alt="${m[1]}">
      </div>

      <!-- Ficha Técnica -->
      <div class="modal-specs-grid">
        <div class="spec-item">
          <span class="spec-val">${fmtCm(m[4], m[5]).replace(' cm', '')}</span>
          <span class="spec-label">Dimensão (cm)</span>
        </div>
        <div class="spec-item">
          <span class="spec-val">${hoop}</span>
          <span class="spec-label">Bastidor Ideal</span>
        </div>
        <div class="spec-item">
          <span class="spec-val">${fmtNum(m[6])}</span>
          <span class="spec-label">Total Pontos</span>
        </div>
        <div class="spec-item">
          <span class="spec-val">${m[7]} cores</span>
          <span class="spec-label">~ ${estTime}</span>
        </div>
      </div>

      <p style="font-size:0.88rem;font-weight:800;color:var(--text-main);text-align:center;margin-bottom:8px;">
        Baixar matriz individual no formato desejado:
      </p>

      <!-- Botões de Formatos -->
      <div class="formats-download-grid">
        ${ACERVO.formatos.map(fmt => {
          const isRec = fmt === currentFmt;
          const url = getSingleFileUrl(m, fmt);
          const mq = MAQUINAS.find(x => x.s === fmt);
          const brand = mq ? mq.marca : fmt;
          return `
            <a class="format-btn ${isRec ? 'recommended' : ''}" href="${url}" download>
              <span>${fmt}</span>
              <small>${isRec ? 'Sua Máquina' : brand}</small>
            </a>
          `;
        }).join('')}
      </div>

      <div style="display:flex;gap:10px;margin-top:14px;">
        <button class="btn-card-download js-toggle-fav" data-fav-id="${m[0]}" style="flex:1;background:var(--rose-light);color:var(--rose-dark);font-size:0.9rem;padding:12px;">
          <span>${isFav ? '♥ Salvo nos Favoritos' : '♡ Adicionar aos Favoritos'}</span>
        </button>
        <button class="btn-card-quickview js-copy-link" data-id="${m[0]}" style="width:auto;padding:0 16px;border-radius:var(--r-pill);font-size:0.86rem;font-weight:700;" title="Copiar link desta matriz">
          🔗 Compartilhar
        </button>
      </div>

      <p style="font-size:0.75rem;color:var(--text-light);text-align:center;margin-top:14px;">
        Dica: Baixe no formato recomendado para garantir total compatibilidade com a sua máquina.
      </p>
    `;

    modalMatrixEl.classList.add('active');
  };

  // ══ MODAL DE SELEÇÃO DE MÁQUINA ══
  const openMachineModal = (canClose = true) => {
    sound.playChime('pop');
    modalMachineWindowEl.innerHTML = `
      ${canClose ? '<button class="modal-close-btn js-close-modal" aria-label="Fechar">&times;</button>' : ''}
      <div style="text-align:center;margin-bottom:18px;">
        <span style="font-size:2.2rem;display:block;margin-bottom:4px;">🧵🪡</span>
        <h3 style="font-family:var(--font-heading);font-size:1.4rem;color:var(--text-main);">Qual é a marca da sua máquina?</h3>
        <p style="font-size:0.9rem;color:var(--text-muted);margin-top:4px;">Assim a plataforma já deixa todos os botões prontos no formato ideal pra você!</p>
      </div>

      <div class="machine-cards-list">
        ${MAQUINAS.map(mq => {
          const isCurrent = mq.s === (userFormat || 'PES');
          return `
            <div class="machine-select-card ${isCurrent ? 'active' : ''} js-select-machine" data-fmt="${mq.s}">
              <div class="msc-info">
                <span class="msc-title">${mq.icone} ${mq.marca}</span>
                <span class="msc-desc">${mq.modelos}</span>
              </div>
              <span class="msc-format-pill">${mq.s}</span>
            </div>
          `;
        }).join('')}
      </div>

      <p style="font-size:0.78rem;color:var(--text-light);text-align:center;margin-top:16px;">
        Não tem certeza? Escolha <b>Brother (.PES)</b>. É o formato mais compatível e você pode alterar quando quiser!
      </p>
    `;

    modalMachineEl.classList.add('active');
  };

  // ══ MODAL DE DOWNLOAD DO ACERVO COMPLETO ══
  const openAcervoCompletoModal = () => {
    sound.playChime('pop');
    modalMatrixWindowEl.innerHTML = `
      <button class="modal-close-btn js-close-modal" aria-label="Fechar">&times;</button>
      <div style="text-align:center;margin-bottom:18px;">
        <span style="font-size:2.4rem;display:block;margin-bottom:6px;">📦✨</span>
        <h3 style="font-family:var(--font-heading);font-size:1.45rem;color:var(--text-main);">Baixar Todo o Acervo de Uma Vez</h3>
        <p style="font-size:0.92rem;color:var(--text-muted);margin-top:4px;">
          Todas as ${fmtNum(ACERVO.total)} matrizes organizadas por pastas em um único arquivo ZIP.
        </p>
      </div>

      <div style="background:var(--bg-page);border:1.5px dashed var(--rose-border);border-radius:var(--r-lg);padding:14px 18px;margin-bottom:18px;font-size:0.86rem;color:var(--text-muted);line-height:1.5;">
        💡 <b>Dica de Artesã:</b> Como o acervo completo é bem recheado (40MB a 150MB dependendo do formato), recomendamos baixar conectado ao Wi-Fi. Extraia o ZIP no seu computador antes de passar para o pen drive.
      </div>

      <div class="machine-cards-list">
        ${ACERVO.formatos.map(fmt => {
          const mq = MAQUINAS.find(x => x.s === fmt) || { marca: fmt, modelos: '' };
          const zipKey = `acervo-completo-${fmt.toLowerCase()}`;
          const weight = getZipWeight(zipKey);
          const url = getAllZipUrl(fmt);
          const isUserFmt = fmt === (userFormat || 'PES');
          return `
            <a class="machine-select-card ${isUserFmt ? 'active' : ''}" href="${url}" download style="text-decoration:none;">
              <div class="msc-info">
                <span class="msc-title">${isUserFmt ? '⭐ ' : ''}${fmt} · ${mq.marca}</span>
                <span class="msc-desc">${mq.modelos} ${weight ? `• ${weight}` : ''}</span>
              </div>
              <span class="msc-format-pill" style="display:flex;align-items:center;gap:5px;">
                <span>⬇</span> Baixar
              </span>
            </a>
          `;
        }).join('')}
      </div>
    `;

    modalMatrixEl.classList.add('active');
  };

  // Fechar qualquer modal
  const closeModal = () => {
    modalMatrixEl.classList.remove('active');
    modalMachineEl.classList.remove('active');
  };

  // ══ EVENT DELEGATION GLOBAL ══
  document.body.addEventListener('click', (e) => {
    const target = e.target;

    // Fechar Modal (X ou clique fora)
    if (target.closest('.js-close-modal') || target === modalMatrixEl || target === modalMachineEl) {
      closeModal();
      return;
    }

    // Favoritar / Desfavoritar (prioridade máxima sobre o clique no card!)
    const favBtn = target.closest('.js-toggle-fav');
    if (favBtn) {
      e.stopPropagation();
      e.preventDefault();
      const id = favBtn.dataset.favId;
      const idx = favorites.indexOf(id);
      if (idx > -1) {
        favorites.splice(idx, 1);
        favBtn.classList.remove('active');
        showToast('Removido dos favoritos', '♡');
      } else {
        favorites.push(id);
        favBtn.classList.add('active');
        sound.playChime('heart');
        showToast('Adicionado aos favoritos! ♥', '💖');
      }
      Storage.set('favorites', favorites);
      updateFavCount();

      // Se estiver na tela de favoritos e removeu, atualiza a tela
      if (currentRoute.view === 'favorites') {
        renderView();
      }
      return;
    }

    // Alternar Sons
    const soundToggle = target.closest('.js-toggle-sound');
    if (soundToggle) {
      sound.enabled = !sound.enabled;
      Storage.set('sound_enabled', sound.enabled);
      document.querySelectorAll('.js-sound-label').forEach(el => {
        el.textContent = sound.enabled ? 'Sons: Ativos 🔔' : 'Sons: Mudos 🔕';
      });
      showToast(sound.enabled ? 'Efeitos sonoros ativados! 🔔' : 'Sons desativados! 🔕');
      return;
    }

    // Voltar ao Topo
    if (target.closest('.js-back-to-top')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Abrir Modal de Acervo Completo
    if (target.closest('.js-open-acervo-modal')) {
      openAcervoCompletoModal();
      return;
    }

    // Abrir Modal de Máquina
    if (target.closest('.js-open-machine-modal')) {
      openMachineModal(true);
      return;
    }

    // Selecionar Máquina no Modal
    const machineSelect = target.closest('.js-select-machine');
    if (machineSelect) {
      const fmt = machineSelect.dataset.fmt;
      userFormat = fmt;
      Storage.set('machine_fmt', fmt);
      updateMachineDisplay();
      sound.playChime('pop');
      closeModal();
      showToast(`Máquina configurada para ${fmt}! 🧵`);
      renderView();
      return;
    }

    // Navegação via botões .js-nav
    const navBtn = target.closest('.js-nav');
    if (navBtn) {
      e.preventDefault();
      const v = navBtn.dataset.view;
      const p = navBtn.dataset.param || null;
      const s = navBtn.dataset.subcol || null;
      navigate(v, p, s);
      return;
    }

    // Abrir Modal de Matriz (apenas quando não clicou em favoritar ou baixar)
    const matrixOpener = target.closest('.js-open-matrix');
    if (matrixOpener) {
      const id = matrixOpener.dataset.matrixId;
      openMatrixModal(id);
      return;
    }

    // Limpar todos os favoritos
    if (target.closest('.js-clear-favs')) {
      if (confirm('Deseja limpar todos os seus favoritos?')) {
        favorites = [];
        Storage.set('favorites', favorites);
        updateFavCount();
        showToast('Lista de favoritos limpa!');
        renderView();
      }
      return;
    }

    // Copiar Link
    const copyBtn = target.closest('.js-copy-link');
    if (copyBtn) {
      const id = copyBtn.dataset.id;
      const shareUrl = `${window.location.origin}${window.location.pathname}#mat=${id}`;
      navigator.clipboard?.writeText(shareUrl).then(() => {
        showToast('Link copiado com sucesso! 🔗');
      }).catch(() => {
        prompt('Copie o link:', shareUrl);
      });
      return;
    }

    // Carregar mais matrizes (Load More)
    if (target.closest('#btnLoadMore') && renderNextBatch) {
      renderNextBatch();
      return;
    }
  });

  // ══ EVENT DELEGATION PARA FILTROS NA TELA ══
  document.body.addEventListener('change', (e) => {
    const target = e.target;

    if (target.classList.contains('js-filter-hoop')) {
      currentFilters.hoop = target.value;
      rerenderGrid();
    } else if (target.classList.contains('js-filter-stitches')) {
      currentFilters.stitches = target.value;
      rerenderGrid();
    } else if (target.classList.contains('js-filter-colors')) {
      currentFilters.colors = target.value;
      rerenderGrid();
    } else if (target.classList.contains('js-filter-sort')) {
      currentFilters.sort = target.value;
      rerenderGrid();
    }
  });

  // Alternar modo de visualização (Normal vs Compacto)
  document.body.addEventListener('click', (e) => {
    const vmt = e.target.closest('.js-view-mode');
    if (vmt) {
      const mode = vmt.dataset.mode;
      currentFilters.viewMode = mode;
      Storage.set('view_mode', mode);
      document.querySelectorAll('.js-view-mode').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
      const grid = document.getElementById('matrixGridTarget');
      if (grid) {
        grid.classList.toggle('compact', mode === 'compact');
      }
    }
  });

  // Recarrega apenas a grade com novos filtros sem recarregar topo
  const rerenderGrid = () => {
    const gridTarget = document.getElementById('matrixGridTarget');
    if (gridTarget && currentRoute.activeList) {
      gridTarget.innerHTML = '';
      const processed = applyFiltersAndSorting(currentRoute.activeList);
      renderBatchGrid(processed, gridTarget);
    }
  };

  // Teclado (ESC fecha modais e gaveta)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeDrawer();
    }
  });

  // ══ LEITURA INICIAL DA URL / HASH ══
  const handleInitialHash = () => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) {
      navigate('home');
      return;
    }

    if (hash.startsWith('mat=')) {
      const id = hash.replace('mat=', '');
      navigate('home');
      setTimeout(() => openMatrixModal(id), 300);
      return;
    }

    const parts = hash.split('/');
    const v = parts[0] || 'home';
    const p = parts[1] || null;
    const s = parts[2] || null;
    navigate(v, p, s);
  };

  // ══ INICIALIZAÇÃO DA APLICAÇÃO ══
  updateFavCount();

  // Se o usuário nunca escolheu o formato da máquina, abre modal acolhedor
  if (!userFormat) {
    userFormat = 'PES';
    Storage.set('machine_fmt', 'PES');
    setTimeout(() => openMachineModal(false), 450);
  }
  updateMachineDisplay();

  // Botão flutuante de voltar ao topo
  const btnBackToTop = document.getElementById('btnBackToTop');
  window.addEventListener('scroll', () => {
    if (btnBackToTop) {
      btnBackToTop.classList.toggle('active', window.scrollY > 350);
    }
  }, { passive: true });

  handleInitialHash();
});
