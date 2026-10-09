/**
 * ═══════════════════════════════════════════════════════════════
 * BORDADO PERFECTO · ÁREA DE MIEMBROS INFANTIL & ACOGEDORA
 * Versión en Español LATAM completa y adaptada.
 * Catálogo, búsqueda inteligente, filtros, modales y descargas.
 * ═══════════════════════════════════════════════════════════════
 */

// ══ CONFIGURACIONES GENERALES ══
const CONFIG = {
  // Base URL donde están alojados los archivos, zips y portadas reales
  BASE_URL: 'https://area-do-aluno.shop',
  ARQ_DIR: 'arquivos/arquivos',
  CAPAS_DIR: 'capas/capas',
  ZIPS_DIR: 'zips-colecoes/zips',
  ZIPS_TUDO_DIR: 'zips-completos/zips',
  BATCH_SIZE: 48 // Cantidad de matrices renderizadas por lote
};

// ══ BASE DE DATOS DE MÁQUINAS Y COMPATIBILIDAD ══
const MAQUINAS = [
  { s: 'PES', marca: 'Brother', modelos: 'Brother, Baby Lock, Bernina Deco', ext: '.pes', icone: '🧵' },
  { s: 'JEF', marca: 'Janome', modelos: 'Janome, Elna, Kenmore', ext: '.jef', icone: '🪡' },
  { s: 'DST', marca: 'Tajima / Industrial', modelos: 'Tajima, Barudan, Industriales, SWF', ext: '.dst', icone: '🏭' },
  { s: 'EXP', marca: 'Bernina / Melco', modelos: 'Melco, Bernina', ext: '.exp', icone: '✨' },
  { s: 'XXX', marca: 'Singer', modelos: 'Singer, Compucon', ext: '.xxx', icone: '🪢' }
];

// Íconos y colores para cada categoría
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

// Diccionario de Categorías en Español LATAM
const CAT_ESPANOL = {
  'ursinhos': 'Ositos',
  'safari-e-animais': 'Safari y Animales',
  'bebe-e-enxoval': 'Bebé y Ajuar',
  'infantil': 'Infantil y Juguetes',
  'fazendinha': 'Granjita',
  'jardim-e-flores': 'Jardín y Flores',
  'princesas-e-fadas': 'Princesas y Hadas',
  'fundo-do-mar': 'Fondo del Mar',
  'dinossauros': 'Dinosaurios',
  'natal-e-datas-especiais': 'Navidad y Fechas Especiales',
  'alfabetos': 'Alfabetos y Letras',
  'nomes-prontos': 'Nombres Listos'
};

// Diccionario de Colecciones en Español LATAM
const COL_ESPANOL = {
  'ursinhos-ursinhos': 'Ositos Tiernos',
  'safari-e-animais-safari-e-animais': 'Safari y Animales',
  'bebe-e-enxoval-bebe-e-enxoval': 'Bebé y Ajuar',
  'fazendinha-fazendinha': 'Granjita Encantada',
  'fundo-do-mar-fundo-do-mar': 'Fondo del Mar',
  'dinossauros-dinossauros': 'Dinosaurios Infantiles',
  'infantil-transporte': 'Transporte y Vehículos',
  'infantil-brinquedos': 'Juguetes y Juegos',
  'infantil-doces': 'Dulces y Golosinas',
  'infantil-escola': 'Escuela y Colegio',
  'infantil-frutas': 'Frutitas',
  'infantil-roupinhas': 'Ropita y Baberos',
  'princesas-e-fadas-princesas-e-fadas': 'Princesas y Hadas',
  'jardim-e-flores-jardim-e-flores': 'Jardín y Flores',
  'natal-e-datas-especiais-natal': 'Navidad',
  'natal-e-datas-especiais-pascoa': 'Pascua',
  'natal-e-datas-especiais-datas-especiais': 'Fechas Especiales',
  'alfabetos-alfabeto-alegre': 'Alfabeto Alegre',
  'alfabetos-alfabeto-caligrafia': 'Alfabeto Caligrafía',
  'alfabetos-alfabeto-classico': 'Alfabeto Clásico',
  'alfabetos-alfabeto-delicado': 'Alfabeto Delicado',
  'alfabetos-alfabeto-elegante': 'Alfabeto Elegante',
  'alfabetos-alfabeto-fino': 'Alfabeto Fino',
  'alfabetos-alfabeto-infantil': 'Alfabeto Infantil',
  'alfabetos-alfabeto-manuscrito': 'Alfabeto Manuscrito',
  'alfabetos-alfabeto-redondo': 'Alfabeto Redondo',
  'alfabetos-alfabeto-romano': 'Alfabeto Romano',
  'alfabetos-alfabeto-romantico': 'Alfabeto Romántico',
  'nomes-prontos-nomes-femininos': 'Nombres Femeninos',
  'nomes-prontos-nomes-masculinos': 'Nombres Masculinos'
};

// ══ ADMINISTRADOR DE ESTADO LOCAL ══
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

// ══ SÍNTESIS DE SONIDO ACOGEDOR (WEB AUDIO API) ══
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

// ══ APLICACIÓN PRINCIPAL ══
document.addEventListener('DOMContentLoaded', () => {
  const ACERVO = window.ACERVO;
  if (!ACERVO) {
    document.getElementById('view').innerHTML = `
      <div class="empty-state-box">
        <span class="empty-icon">⚠️</span>
        <h3 class="empty-title">El catálogo no se cargó correctamente</h3>
        <p class="empty-desc">Por favor verifica que el archivo catalogo.js esté presente en la misma carpeta.</p>
      </div>`;
    return;
  }

  // Estado de la Aplicación
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
    colNomeMap[k] = COL_ESPANOL[k] || COLS[k].nome;
    colCatMap[k] = COLS[k].cat;
  }

  const catNomeMap = {};
  CATS.forEach(c => { catNomeMap[c.id] = CAT_ESPANOL[c.id] || c.nome; });

  // Normalización de texto para búsqueda sin acentos
  const normalize = (str) => {
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  // Sinónimos bilingües para búsqueda intuitiva (encuentra por términos en español y portugués)
  const getSearchSynonyms = (text) => {
    const t = normalize(text);
    let extra = '';
    if (t.includes('urso') || t.includes('ursinho')) extra += ' oso osito osita ';
    if (t.includes('coracao')) extra += ' corazon corazoncito ';
    if (t.includes('leao')) extra += ' leon leoncito ';
    if (t.includes('girafa')) extra += ' jirafa ';
    if (t.includes('bebe') || t.includes('enxoval')) extra += ' bebe nene ajuar cuna ';
    if (t.includes('fazenda') || t.includes('fazendinha')) extra += ' granja granjita vaca cerdito ';
    if (t.includes('jardim') || t.includes('flor')) extra += ' jardin flores floral florcita ';
    if (t.includes('fada')) extra += ' hada hadas magica ';
    if (t.includes('princesa')) extra += ' princesa corona tiara ';
    if (t.includes('mar') || t.includes('peixe')) extra += ' pez peces mar oceano ballena ';
    if (t.includes('dino')) extra += ' dinosaurio dinosaurios ';
    if (t.includes('natal')) extra += ' navidad claus pino ';
    if (t.includes('pascoa')) extra += ' pascua conejo conejito ';
    if (t.includes('doce')) extra += ' dulce dulces golosina paleta ';
    if (t.includes('fruta')) extra += ' fruta frutas frutita ';
    if (t.includes('brinquedo')) extra += ' juguete juguetes ';
    if (t.includes('escola')) extra += ' escuela colegio lapiz ';
    if (t.includes('roupa') || t.includes('roupinha')) extra += ' ropa ropita babero ';
    if (t.includes('transporte')) extra += ' transporte auto coche avion tren ';
    return extra;
  };

  // Precalcula strings de búsqueda rápida
  const SEARCH_INDEX = MATRIZES.map(m => {
    const cName = colNomeMap[m[2]] || '';
    const catName = catNomeMap[colCatMap[m[2]]] || '';
    const syn = getSearchSynonyms(m[1] + ' ' + cName + ' ' + catName);
    return normalize(m[1] + ' ' + cName + ' ' + catName + ' ' + m[3] + ' ' + syn);
  });

  // Utilidades de Formato
  const fmtNum = (n) => Number(n || 0).toLocaleString('es-LA');
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

  // Tiempo estimado de bordado (base 650 ppm + 1.5 min por cambio de color)
  const getEstimatedTime = (pontos, cores) => {
    const minutos = Math.ceil((pontos / 650) + (cores * 1.5));
    if (minutos < 60) return `${minutos} min`;
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h}h ${m}m`;
  };

  // Elementos del DOM
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

  // Actualiza indicadores de máquina
  const updateMachineDisplay = () => {
    const fmt = userFormat || 'PES';
    document.querySelectorAll('.js-active-format').forEach(el => {
      el.textContent = fmt;
    });
  };

  // Actualiza contador de favoritos
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

  // Navegación entre vistas
  const navigate = (view, param = null, subcol = null) => {
    currentRoute = { view, param, subcol };
    closeDrawer();

    // Actualiza menú activo en la barra lateral y en la barra inferior móvil
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    document.querySelectorAll('.mbn-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });

    renderView();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Actualiza hash de la URL
    let hash = `#${view}`;
    if (param) hash += `/${param}`;
    if (subcol) hash += `/${subcol}`;
    history.replaceState(null, '', hash);
  };

  // Gaveta Móvil (Drawer)
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

  // Búsqueda con debounce
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

  // Chips de búsqueda rápida
  document.querySelectorAll('.js-quick-search').forEach(tag => {
    tag.addEventListener('click', () => {
      const q = tag.dataset.query;
      searchInputEl.value = q;
      searchClearEl.classList.add('active');
      navigate('search', q);
    });
  });

  // Renderizador de Tarjeta de Matriz
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
          <span class="hoop-badge">Bastidor ${hoop}</span>
          <button class="btn-fav ${isFav ? 'active' : ''} js-toggle-fav" data-fav-id="${m[0]}" aria-label="Guardar en favoritos" title="Guardar en favoritos">
            ♥
          </button>
        </div>
        <div class="matrix-details">
          <h4 class="matrix-title js-open-matrix" data-matrix-id="${m[0]}" title="${m[1]}">${m[1]}</h4>
          <div class="matrix-meta-specs">
            <span class="matrix-size">${m[3]}</span>
            <span class="matrix-points">${(m[6] / 1000).toFixed(1)}k pts • ${m[7]} col</span>
          </div>
          <div class="matrix-actions-row">
            <a class="btn-card-download" href="${downloadUrl}" download title="Descargar en ${currentFmt}">
              <span>⬇</span> Descargar ${currentFmt}
            </a>
            <button class="btn-card-quickview js-open-matrix" data-matrix-id="${m[0]}" title="Ficha completa">
              👁️
            </button>
          </div>
        </div>
      </div>
    `;
  };

  // Renderizador en Lote (Infinite Chunk Grid)
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
          loadMoreBtn.innerHTML = `Cargar más matrices (${fmtNum(list.length - index)} restantes)`;
        }
        if (counterEl) {
          counterEl.textContent = `Mostrando ${fmtNum(index)} de ${fmtNum(list.length)} matrices`;
        }
      } else {
        renderNextBatch = null;
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        if (counterEl) {
          counterEl.textContent = `¡Todas las ${fmtNum(list.length)} matrices cargadas con cariño! ✨`;
        }
      }
    };

    appendChunk();
  };

  // Filtros y Ordenamiento
  const applyFiltersAndSorting = (items) => {
    let filtered = [...items];

    // Filtro por Bastidor
    if (currentFilters.hoop !== 'all') {
      filtered = filtered.filter(m => {
        const hoop = getSuggestedHoop(m[4], m[5]);
        return hoop.toLowerCase().includes(currentFilters.hoop.toLowerCase());
      });
    }

    // Filtro por Puntadas
    if (currentFilters.stitches !== 'all') {
      filtered = filtered.filter(m => {
        const pts = m[6];
        if (currentFilters.stitches === 'light') return pts < 10000;
        if (currentFilters.stitches === 'medium') return pts >= 10000 && pts <= 25000;
        if (currentFilters.stitches === 'dense') return pts > 25000;
        return true;
      });
    }

    // Filtro por Colores
    if (currentFilters.colors !== 'all') {
      filtered = filtered.filter(m => {
        const c = m[7];
        if (currentFilters.colors === '1') return c === 1;
        if (currentFilters.colors === '2-4') return c >= 2 && c <= 4;
        if (currentFilters.colors === '5+') return c >= 5;
        return true;
      });
    }

    // Ordenamiento
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

  // Barra de Herramientas de Filtros en Español
  const renderFiltersToolbar = () => {
    return `
      <div class="filters-toolbar">
        <div class="filters-left">
          <div class="filter-select-group">
            <span class="filter-label">Bastidor:</span>
            <select class="custom-select js-filter-hoop">
              <option value="all" ${currentFilters.hoop === 'all' ? 'selected' : ''}>Todos los Bastidores</option>
              <option value="10×10" ${currentFilters.hoop === '10×10' ? 'selected' : ''}>Bastidor 10×10 cm</option>
              <option value="13×18" ${currentFilters.hoop === '13×18' ? 'selected' : ''}>Bastidor 13×18 cm</option>
              <option value="14×14" ${currentFilters.hoop === '14×14' ? 'selected' : ''}>Bastidor 14×14 cm</option>
              <option value="16×26" ${currentFilters.hoop === '16×26' ? 'selected' : ''}>Bastidor 16×26 cm</option>
              <option value="20×30" ${currentFilters.hoop === '20×30' ? 'selected' : ''}>Bastidor 20×30 cm</option>
            </select>
          </div>

          <div class="filter-select-group">
            <span class="filter-label">Puntadas:</span>
            <select class="custom-select js-filter-stitches">
              <option value="all" ${currentFilters.stitches === 'all' ? 'selected' : ''}>Todas las Puntadas</option>
              <option value="light" ${currentFilters.stitches === 'light' ? 'selected' : ''}>Ligero (&lt; 10k pts)</option>
              <option value="medium" ${currentFilters.stitches === 'medium' ? 'selected' : ''}>Medio (10k - 25k pts)</option>
              <option value="dense" ${currentFilters.stitches === 'dense' ? 'selected' : ''}>Denso (&gt; 25k pts)</option>
            </select>
          </div>

          <div class="filter-select-group">
            <span class="filter-label">Colores:</span>
            <select class="custom-select js-filter-colors">
              <option value="all" ${currentFilters.colors === 'all' ? 'selected' : ''}>Todos los Colores</option>
              <option value="1" ${currentFilters.colors === '1' ? 'selected' : ''}>1 Color (Monocromático)</option>
              <option value="2-4" ${currentFilters.colors === '2-4' ? 'selected' : ''}>2 a 4 Colores</option>
              <option value="5+" ${currentFilters.colors === '5+' ? 'selected' : ''}>5 o más Colores</option>
            </select>
          </div>
        </div>

        <div class="filters-right">
          <div class="filter-select-group">
            <span class="filter-label">Ordenar:</span>
            <select class="custom-select js-filter-sort">
              <option value="default" ${currentFilters.sort === 'default' ? 'selected' : ''}>Orden del Catálogo</option>
              <option value="name-asc" ${currentFilters.sort === 'name-asc' ? 'selected' : ''}>Nombre (A → Z)</option>
              <option value="name-desc" ${currentFilters.sort === 'name-desc' ? 'selected' : ''}>Nombre (Z → A)</option>
              <option value="points-asc" ${currentFilters.sort === 'points-asc' ? 'selected' : ''}>Menos Puntadas Primero</option>
              <option value="points-desc" ${currentFilters.sort === 'points-desc' ? 'selected' : ''}>Más Puntadas Primero</option>
              <option value="size-asc" ${currentFilters.sort === 'size-asc' ? 'selected' : ''}>Menor Tamaño</option>
              <option value="size-desc" ${currentFilters.sort === 'size-desc' ? 'selected' : ''}>Mayor Tamaño</option>
            </select>
          </div>

          <div class="view-mode-toggle">
            <button class="vmt-btn ${currentFilters.viewMode === 'comfortable' ? 'active' : ''} js-view-mode" data-mode="comfortable" title="Vista normal confortable">
              ▦ Normal
            </button>
            <button class="vmt-btn ${currentFilters.viewMode === 'compact' ? 'active' : ''} js-view-mode" data-mode="compact" title="Vista compacta rápida">
              ▤ Compacto
            </button>
          </div>
        </div>
      </div>
    `;
  };

  // ══ RENDERIZADOR PRINCIPAL DE VISTAS ══
  const renderView = () => {
    const { view, param, subcol } = currentRoute;
    const currentFmt = userFormat || 'PES';
    let html = '';

    // ── VISTA: INICIO / HOME ──
    if (view === 'home') {
      html += `
        <!-- Hero Banner Acogedor -->
        <section class="hero-banner">
          <div class="hero-content">
            <div class="hero-badge-pill">
              <span>🧸✨</span> Rincón del Bordado Infantil
            </div>
            <h1 class="hero-title">Bienvenida a tu Taller Encantado de <em>Bordados</em></h1>
            <p class="hero-desc">Tu biblioteca definitiva con <b>${fmtNum(ACERVO.total)} matrices infantiles</b> listas para tu máquina bordadora, organizadas por temas tiernos y colecciones exclusivas.</p>
          </div>
        </section>

        <!-- Barra de Máquina Seleccionada con Cambio Fácil -->
        <div class="format-notice-bar">
          <div class="fnb-text">
            <span>🪡 Tu máquina está configurada para:</span>
            <b>Formato ${currentFmt}</b>
            <span style="opacity:0.75">(Todos los botones descargan automáticamente en este formato)</span>
          </div>
          <button class="btn-change-format js-open-machine-modal">
            Cambiar Máquina / Formato
          </button>
        </div>

        <!-- Tarjetas de Estadísticas Acogedoras -->
        <div class="stats-grid">
          <div class="stat-card c1">
            <div class="stat-icon">🧸</div>
            <div class="stat-info">
              <span class="stat-number">${fmtNum(ACERVO.total)}</span>
              <span class="stat-title">Matrices Infantiles</span>
            </div>
          </div>
          <div class="stat-card c2">
            <div class="stat-icon">📁</div>
            <div class="stat-info">
              <span class="stat-number">${Object.keys(COLS).length}</span>
              <span class="stat-title">Colecciones Listas</span>
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
              <span class="stat-number">Acceso Vitalicio</span>
              <span class="stat-title">Sin mensualidades</span>
            </div>
          </div>
        </div>

        <!-- Sección: Categorías Encantadas -->
        <div class="section-header">
          <div class="section-title-box">
            <span class="section-icon">🎀</span>
            <h2 class="section-title">Categorías Encantadas</h2>
          </div>
          <button class="btn-view-all js-nav" data-view="categories">
            Ver todas (${CATS.length}) &rarr;
          </button>
        </div>
        <div class="categories-grid">
          ${CATS.map(c => {
            const meta = CATEGORIA_ICONES[c.id] || { icone: '🌸' };
            const nombreEsp = CAT_ESPANOL[c.id] || c.nome;
            return `
              <div class="category-card js-nav" data-view="category" data-param="${c.id}">
                <div class="category-img-wrapper">
                  <img class="category-img" src="${getCapaUrl(c.capa)}" alt="${nombreEsp}" loading="lazy">
                </div>
                <span class="category-name">${meta.icone} ${nombreEsp}</span>
                <span class="category-count">${fmtNum(c.n)} matrices</span>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Sección: Colecciones Destacadas -->
        <div class="section-header" style="margin-top: 10px;">
          <div class="section-title-box">
            <span class="section-icon">✨</span>
            <h2 class="section-title">Colecciones Más Queridas</h2>
          </div>
          <button class="btn-view-all js-nav" data-view="collections">
            Ver todas las colecciones &rarr;
          </button>
        </div>
        <div class="collections-grid">
          ${Object.keys(COLS).slice(0, 12).map(key => {
            const col = COLS[key];
            const nombreColEsp = COL_ESPANOL[col.id] || col.nome;
            return `
              <div class="collection-card js-nav" data-view="collection" data-param="${col.id}">
                <div class="collection-img-box">
                  <img class="collection-img" src="${getCapaUrl(col.capa)}" alt="${nombreColEsp}" loading="lazy">
                </div>
                <div class="collection-meta">
                  <h4 class="collection-name">${nombreColEsp}</h4>
                  <span class="collection-count">${fmtNum(col.n)} matrices</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Banner Especial: Descargar Catálogo Completo de una Sola Vez -->
        <div class="download-pack-banner" style="margin-top: 20px;">
          <div class="dpb-info">
            <span class="dpb-tag">⭐ PAQUETE COMPLETO VITALICIO</span>
            <h3 class="dpb-title">Descargar las ${fmtNum(ACERVO.total)} Matrices de una Sola Vez</h3>
            <p class="dpb-subtitle">¡Ahorra tiempo! El archivo ZIP completo en <b>${currentFmt}</b> contiene todas las 12 categorías y 30 colecciones organizadas en carpetas. ${getZipWeight(`acervo-completo-${currentFmt.toLowerCase()}`) ? `Tamaño: ${getZipWeight(`acervo-completo-${currentFmt.toLowerCase()}`)}.` : ''} (Recomendado descargar conectada a Wi-Fi).</p>
          </div>
          <div class="dpb-actions">
            <a class="btn-download-pack" href="${getAllZipUrl(currentFmt)}" download>
              <span>⬇</span> Descargar Catálogo Completo en ${currentFmt}
            </a>
          </div>
        </div>
      `;
    }

    // ── VISTA: TODAS LAS CATEGORÍAS ──
    else if (view === 'categories') {
      html += `
        <div class="section-header">
          <div class="section-title-box">
            <span class="section-icon">🧸</span>
            <div>
              <h2 class="section-title">Todas las Categorías Infantiles</h2>
              <p style="font-size:0.9rem;color:var(--text-muted);">${CATS.length} categorías temáticas con ${fmtNum(ACERVO.total)} matrices</p>
            </div>
          </div>
        </div>
        <div class="categories-grid" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));">
          ${CATS.map(c => {
            const meta = CATEGORIA_ICONES[c.id] || { icone: '🌸' };
            const nombreEsp = CAT_ESPANOL[c.id] || c.nome;
            return `
              <div class="category-card js-nav" data-view="category" data-param="${c.id}" style="padding:16px 12px 18px;">
                <div class="category-img-wrapper" style="border-radius:var(--r-lg);">
                  <img class="category-img" src="${getCapaUrl(c.capa)}" alt="${nombreEsp}" loading="lazy">
                </div>
                <span class="category-name" style="font-size:1.05rem;">${meta.icone} ${nombreEsp}</span>
                <span class="category-count">${fmtNum(c.n)} matrices • ${c.cols.length} colecci${c.cols.length > 1 ? 'ones' : 'ón'}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // ── VISTA: TODAS LAS COLECCIONES ──
    else if (view === 'collections') {
      const allCols = Object.keys(COLS).map(k => COLS[k]).sort((a, b) => b.n - a.n);
      html += `
        <div class="section-header">
          <div class="section-title-box">
            <span class="section-icon">📁</span>
            <div>
              <h2 class="section-title">Todas las Colecciones</h2>
              <p style="font-size:0.9rem;color:var(--text-muted);">${allCols.length} carpetas temáticas listas para descargar</p>
            </div>
          </div>
        </div>
        <div class="collections-grid">
          ${allCols.map(col => {
            const nombreColEsp = COL_ESPANOL[col.id] || col.nome;
            return `
              <div class="collection-card js-nav" data-view="collection" data-param="${col.id}">
                <div class="collection-img-box">
                  <img class="collection-img" src="${getCapaUrl(col.capa)}" alt="${nombreColEsp}" loading="lazy">
                </div>
                <div class="collection-meta">
                  <h4 class="collection-name">${nombreColEsp}</h4>
                  <span class="collection-count">${fmtNum(col.n)} matrices</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // ── VISTA: CATEGORÍA ESPECÍFICA ──
    else if (view === 'category') {
      const cat = CATS.find(c => c.id === param);
      if (!cat) { navigate('categories'); return; }

      const meta = CATEGORIA_ICONES[cat.id] || { icone: '🌸' };
      const nombreCatEsp = CAT_ESPANOL[cat.id] || cat.nome;
      let items = MATRIZES.filter(m => colCatMap[m[2]] === cat.id);

      // Si se filtró por subcolección
      if (subcol) {
        items = items.filter(m => m[2] === subcol);
      }

      html += `
        <div style="margin-bottom: 20px;">
          <button class="btn-view-all js-nav" data-view="categories" style="margin-bottom:14px;">
            &larr; Volver a Categorías
          </button>
          <div class="section-header" style="margin-bottom: 10px;">
            <div class="section-title-box">
              <span class="section-icon" style="font-size:2rem;">${meta.icone}</span>
              <div>
                <h2 class="section-title">${nombreCatEsp}</h2>
                <p style="font-size:0.92rem;color:var(--text-muted);">${fmtNum(cat.n)} matrices en ${cat.cols.length} colecci${cat.cols.length > 1 ? 'ones' : 'ón'}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Chips de Subcolecciones -->
        <div class="subcollection-chips">
          <button class="subchip ${!subcol ? 'active' : ''} js-nav" data-view="category" data-param="${cat.id}">
            Todas las ${fmtNum(cat.n)} matrices
          </button>
          ${cat.cols.map(cId => {
            const o = COLS[cId];
            if (!o) return '';
            const nombreSubEsp = COL_ESPANOL[cId] || o.nome;
            return `
              <button class="subchip ${subcol === cId ? 'active' : ''} js-nav" data-view="category" data-param="${cat.id}" data-subcol="${cId}">
                ${nombreSubEsp} <span class="subchip-count">(${o.n})</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Banner de Descarga de Subcolección (si está seleccionada) -->
        ${subcol && COLS[subcol] ? `
          <div class="download-pack-banner">
            <div class="dpb-info">
              <span class="dpb-tag">📁 DESCARGA DEL PAQUETE</span>
              <h3 class="dpb-title">Descargar Colección "${COL_ESPANOL[subcol] || COLS[subcol].nome}" en ${currentFmt}</h3>
              <p class="dpb-subtitle">Descarga las ${COLS[subcol].n} matrices de esta colección en un único archivo ZIP. ${getZipWeight(subcol + '-' + currentFmt.toLowerCase()) ? `Tamaño: ${getZipWeight(subcol + '-' + currentFmt.toLowerCase())}.` : ''}</p>
            </div>
            <div class="dpb-actions">
              <a class="btn-download-pack" href="${getColZipUrl(subcol, currentFmt)}" download>
                <span>⬇</span> Descargar Paquete ZIP (${currentFmt})
              </a>
            </div>
          </div>
        ` : ''}

        ${renderFiltersToolbar()}

        <div class="matrix-grid ${currentFilters.viewMode === 'compact' ? 'compact' : ''}" id="matrixGridTarget"></div>

        <div class="load-more-container">
          <button class="btn-load-more" id="btnLoadMore" style="display:none;">Cargar más matrices</button>
          <div class="remaining-counter" id="loadCounter"></div>
        </div>
      `;
      currentRoute.activeList = items;
    }

    // ── VISTA: COLECCIÓN ESPECÍFICA ──
    else if (view === 'collection') {
      const col = COLS[param];
      if (!col) { navigate('collections'); return; }

      const nombreColEsp = COL_ESPANOL[col.id] || col.nome;
      const items = MATRIZES.filter(m => m[2] === col.id);
      const zipName = `${col.id}-${currentFmt.toLowerCase()}`;
      const zipWeight = getZipWeight(zipName);

      html += `
        <div style="margin-bottom: 20px;">
          <button class="btn-view-all js-nav" data-view="category" data-param="${col.cat}" style="margin-bottom:14px;">
            &larr; Volver a ${catNomeMap[col.cat] || 'Categoría'}
          </button>
          <div class="section-header" style="margin-bottom: 10px;">
            <div class="section-title-box">
              <span class="section-icon">📁</span>
              <div>
                <h2 class="section-title">${nombreColEsp}</h2>
                <p style="font-size:0.92rem;color:var(--text-muted);">${fmtNum(col.n)} matrices listas</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Banner de Descarga de Colección Completa -->
        <div class="download-pack-banner">
          <div class="dpb-info">
            <span class="dpb-tag">📁 DESCARGA DEL PAQUETE COMPLETO</span>
            <h3 class="dpb-title">Descargar la Colección "${nombreColEsp}" completa en ${currentFmt}</h3>
            <p class="dpb-subtitle">Recibe todas las ${col.n} matrices de esta colección organizadas en un archivo ZIP. ${zipWeight ? `Tamaño: ${zipWeight}.` : ''}</p>
          </div>
          <div class="dpb-actions">
            <a class="btn-download-pack" href="${getColZipUrl(col.id, currentFmt)}" download>
              <span>⬇</span> Descargar Paquete ZIP (${currentFmt})
            </a>
          </div>
        </div>

        ${renderFiltersToolbar()}

        <div class="matrix-grid ${currentFilters.viewMode === 'compact' ? 'compact' : ''}" id="matrixGridTarget"></div>

        <div class="load-more-container">
          <button class="btn-load-more" id="btnLoadMore" style="display:none;">Cargar más matrices</button>
          <div class="remaining-counter" id="loadCounter"></div>
        </div>
      `;
      currentRoute.activeList = items;
    }

    // ── VISTA: RESULTADOS DE BÚSQUEDA ──
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
              <h2 class="section-title">Búsqueda: "${param}"</h2>
              <p style="font-size:0.92rem;color:var(--text-muted);">
                ${results.length > 0 ? `${fmtNum(results.length)} matriz${results.length > 1 ? 'es' : ''} encontrada${results.length > 1 ? 's' : ''}` : 'Ninguna matriz encontrada'}
              </p>
            </div>
          </div>
        </div>
      `;

      if (results.length === 0) {
        html += `
          <div class="empty-state-box">
            <span class="empty-icon">🔍🧸</span>
            <h3 class="empty-title">No encontramos matrices con ese término</h3>
            <p class="empty-desc">Intenta buscar con palabras más simples como "oso", "león", "safari", "flor", "alfabeto", "nombre" o explora las categorías abajo.</p>
            <button class="btn-search-action js-nav" data-view="categories" style="margin:0 auto;display:inline-flex;">
              Explorar Categorías
            </button>
          </div>
        `;
      } else {
        html += `
          ${renderFiltersToolbar()}
          <div class="matrix-grid ${currentFilters.viewMode === 'compact' ? 'compact' : ''}" id="matrixGridTarget"></div>
          <div class="load-more-container">
            <button class="btn-load-more" id="btnLoadMore" style="display:none;">Cargar más matrices</button>
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
              <h2 class="section-title">Mis Bordados Favoritos</h2>
              <p style="font-size:0.92rem;color:var(--text-muted);">
                ${favItems.length > 0 ? `${favItems.length} matriz${favItems.length > 1 ? 'es' : ''} guardada${favItems.length > 1 ? 's' : ''} en tu dispositivo` : 'Aún no has guardado matrices'}
              </p>
            </div>
          </div>
          ${favItems.length > 0 ? `
            <button class="btn-view-all js-clear-favs" style="color:var(--rose-dark);border-color:var(--rose-border);">
              Limpiar Lista
            </button>
          ` : ''}
        </div>
      `;

      if (favItems.length === 0) {
        html += `
          <div class="empty-state-box">
            <span class="empty-icon">💖</span>
            <h3 class="empty-title">Tu lista de favoritos está vacía</h3>
            <p class="empty-desc">Toca el corazoncito (♥) en la esquina de cualquier matriz para guardarla aquí y acceder rápido cuando vayas a bordar.</p>
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
            <button class="btn-load-more" id="btnLoadMore" style="display:none;">Cargar más matrices</button>
            <div class="remaining-counter" id="loadCounter"></div>
          </div>
        `;
        currentRoute.activeList = favItems;
      }
    }

    // ── VISTA: CÓMO BORDAR (GUÍA PASO A PASO) ──
    else if (view === 'help') {
      html += `
        <div class="section-header">
          <div class="section-title-box">
            <span class="section-icon">🪡</span>
            <div>
              <h2 class="section-title">Guía Práctica de la Artesana: Cómo Bordar con Perfección</h2>
              <p style="font-size:0.92rem;color:var(--text-muted);">Paso a paso sencillo para transferir y bordar cualquier matriz de tu catálogo</p>
            </div>
          </div>
        </div>

        <div class="tutorial-steps-list">
          <div class="tutorial-step-card">
            <h4 class="step-card-title">1. Elige el Formato de tu Máquina</h4>
            <p class="step-card-desc">Antes de descargar, confirma la marca de tu máquina bordadora (Brother usa <b>.PES</b>, Janome usa <b>.JEF</b>, Singer usa <b>.XXX</b>). Aquí en la plataforma, con seleccionarlo una vez todos los botones descargan en el formato correcto.</p>
          </div>

          <div class="tutorial-step-card">
            <h4 class="step-card-title">2. Descarga la Matriz o Colección</h4>
            <p class="step-card-desc">Haz clic en el botón de descarga. Si descargas una matriz individual, el archivo irá a tu carpeta de Descargas. Si descargas el paquete ZIP, haz clic derecho y selecciona "Extraer todo".</p>
          </div>

          <div class="tutorial-step-card">
            <h4 class="step-card-title">3. Pasa el Archivo a la Raíz de tu Memoria USB (Pendrive)</h4>
            <p class="step-card-desc">Coloca el archivo en la <b>raíz de la memoria USB</b> (fuera de cualquier subcarpeta). Muchas máquinas bordadoras no reconocen archivos colocados dentro de carpetas o con nombres excesivamente largos.</p>
          </div>

          <div class="tutorial-step-card">
            <h4 class="step-card-title">4. Conéctala a tu Máquina Bordadora</h4>
            <p class="step-card-desc">Con la máquina encendida, inserta la memoria USB en el puerto USB. Abre la pestaña de memoria USB en la pantalla digital y selecciona tu diseño.</p>
          </div>

          <div class="tutorial-step-card">
            <h4 class="step-card-title">5. Prepara la Tela, Estabilizador y ¡a Bordar!</h4>
            <p class="step-card-desc">Para ajuar y ropa de bebé, usa entretela / estabilizador desgarro fácil doble (tear-away). Para toallas afelpadas, coloca una película hidrosoluble encima para que las puntadas queden nítidas y esponjosas.</p>
          </div>
        </div>

        <!-- Consejos de Oro -->
        <div class="section-header" style="margin-top: 36px;">
          <div class="section-title-box">
            <span class="section-icon">💡</span>
            <h3 class="section-title">Consejos de Oro para que tus Bordados Queden Bellísimos</h3>
          </div>
        </div>
        <div class="artisan-tips-grid">
          <div class="tip-card">
            <div class="tip-card-header">
              <span>🧵</span>
              <h4>Tensión del Hilo</h4>
            </div>
            <p class="tip-card-desc">Para matrices con muchos detalles, mantén el hilo de la bobina blanco de gramaje 60 o 70 y ajusta la tensión para que el hilo superior no jale el reverso.</p>
          </div>

          <div class="tip-card">
            <div class="tip-card-header">
              <span>🪡</span>
              <h4>Aguja Ideal</h4>
            </div>
            <p class="tip-card-desc">Usa aguja 75/11 punta bola para telas de punto, bodys de bebé y batitas. Para telas planas o toallas, una aguja 80/12 o 90/14 borda a la perfección.</p>
          </div>

          <div class="tip-card">
            <div class="tip-card-header">
              <span>📐</span>
              <h4>Revisa el Bastidor</h4>
            </div>
            <p class="tip-card-desc">Nunca intentes bordar un diseño más grande que el área de tu bastidor. En cada tarjeta te indicamos el tamaño sugerido (10x10, 13x18, 14x14, etc.).</p>
          </div>
        </div>

        <div class="format-notice-bar" style="margin-top: 30px;">
          <div class="fnb-text">
            <span>¿Dudas sobre qué formato elegir?</span>
            <b>Tu máquina actual: ${currentFmt}</b>
          </div>
          <button class="btn-change-format js-open-machine-modal">
            Cambiar Marca / Formato
          </button>
        </div>
      `;
    }

    // Inserta el HTML base
    viewEl.innerHTML = html;

    // Si hay una lista activa de matrices, aplica filtros y renderiza en lote
    const gridTarget = document.getElementById('matrixGridTarget');
    if (gridTarget && currentRoute.activeList) {
      const processed = applyFiltersAndSorting(currentRoute.activeList);
      renderBatchGrid(processed, gridTarget);
    }
  };

  // ══ MODAL DE DETALLES DE LA MATRIZ ══
  const openMatrixModal = (id) => {
    const m = MATRIZES.find(item => item[0] === id);
    if (!m) return;

    sound.playChime('pop');
    const isFav = favorites.includes(m[0]);
    const hoop = getSuggestedHoop(m[4], m[5]);
    const estTime = getEstimatedTime(m[6], m[7]);
    const colNombre = COL_ESPANOL[m[2]] || (COLS[m[2]] ? COLS[m[2]].nome : 'Colección');
    const currentFmt = userFormat || 'PES';

    modalMatrixWindowEl.innerHTML = `
      <button class="modal-close-btn js-close-modal" aria-label="Cerrar">&times;</button>
      
      <div style="text-align:center;">
        <span style="font-size:0.8rem;font-weight:800;color:var(--rose-primary);background:var(--rose-light);padding:3px 12px;border-radius:var(--r-pill);text-transform:uppercase;letter-spacing:0.04em;">
          ${colNombre}
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
          <span class="spec-label">Dimensión (cm)</span>
        </div>
        <div class="spec-item">
          <span class="spec-val">${hoop}</span>
          <span class="spec-label">Bastidor Ideal</span>
        </div>
        <div class="spec-item">
          <span class="spec-val">${fmtNum(m[6])}</span>
          <span class="spec-label">Total Puntadas</span>
        </div>
        <div class="spec-item">
          <span class="spec-val">${m[7]} col</span>
          <span class="spec-label">~ ${estTime}</span>
        </div>
      </div>

      <p style="font-size:0.88rem;font-weight:800;color:var(--text-main);text-align:center;margin-bottom:8px;">
        Descargar matriz individual en el formato deseado:
      </p>

      <!-- Botones de Formatos -->
      <div class="formats-download-grid">
        ${ACERVO.formatos.map(fmt => {
          const isRec = fmt === currentFmt;
          const url = getSingleFileUrl(m, fmt);
          const mq = MAQUINAS.find(x => x.s === fmt);
          const brand = mq ? mq.marca : fmt;
          return `
            <a class="format-btn ${isRec ? 'recommended' : ''}" href="${url}" download>
              <span>${fmt}</span>
              <small>${isRec ? 'Tu Máquina' : brand}</small>
            </a>
          `;
        }).join('')}
      </div>

      <div style="display:flex;gap:10px;margin-top:14px;">
        <button class="btn-card-download js-toggle-fav" data-fav-id="${m[0]}" style="flex:1;background:var(--rose-light);color:var(--rose-dark);font-size:0.9rem;padding:12px;">
          <span>${isFav ? '♥ Guardado en Favoritos' : '♡ Agregar a Favoritos'}</span>
        </button>
        <button class="btn-card-quickview js-copy-link" data-id="${m[0]}" style="width:auto;padding:0 16px;border-radius:var(--r-pill);font-size:0.86rem;font-weight:700;" title="Copiar enlace de esta matriz">
          🔗 Compartir
        </button>
      </div>

      <p style="font-size:0.75rem;color:var(--text-light);text-align:center;margin-top:14px;">
        Consejo: Descarga en el formato recomendado para garantizar total compatibilidad con tu máquina bordadora.
      </p>
    `;

    modalMatrixEl.classList.add('active');
  };

  // ══ MODAL DE SELECCIÓN DE MÁQUINA ══
  const openMachineModal = (canClose = true) => {
    sound.playChime('pop');
    modalMachineWindowEl.innerHTML = `
      ${canClose ? '<button class="modal-close-btn js-close-modal" aria-label="Cerrar">&times;</button>' : ''}
      <div style="text-align:center;margin-bottom:18px;">
        <span style="font-size:2.2rem;display:block;margin-bottom:4px;">🧵🪡</span>
        <h3 style="font-family:var(--font-heading);font-size:1.4rem;color:var(--text-main);">¿Cuál es la marca de tu máquina bordadora?</h3>
        <p style="font-size:0.9rem;color:var(--text-muted);margin-top:4px;">¡Así la plataforma deja todos los botones listos en el formato ideal para ti!</p>
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
        ¿No estás segura? Elige <b>Brother (.PES)</b>. ¡Es el formato más compatible y puedes cambiarlo cuando quieras aquí mismo!
      </p>
    `;

    modalMachineEl.classList.add('active');
  };

  // ══ MODAL DE DESCARGA DEL CATÁLOGO COMPLETO ══
  const openAcervoCompletoModal = () => {
    sound.playChime('pop');
    modalMatrixWindowEl.innerHTML = `
      <button class="modal-close-btn js-close-modal" aria-label="Cerrar">&times;</button>
      <div style="text-align:center;margin-bottom:18px;">
        <span style="font-size:2.4rem;display:block;margin-bottom:6px;">📦✨</span>
        <h3 style="font-family:var(--font-heading);font-size:1.45rem;color:var(--text-main);">Descargar Todo el Catálogo de una Vez</h3>
        <p style="font-size:0.92rem;color:var(--text-muted);margin-top:4px;">
          Todas las ${fmtNum(ACERVO.total)} matrices organizadas por carpetas en un único archivo ZIP.
        </p>
      </div>

      <div style="background:var(--bg-page);border:1.5px dashed var(--rose-border);border-radius:var(--r-lg);padding:14px 18px;margin-bottom:18px;font-size:0.86rem;color:var(--text-muted);line-height:1.5;">
        💡 <b>Consejo de Artesana:</b> Como el catálogo completo es muy amplio (40MB a 150MB según el formato), recomendamos descargarlo conectada a Wi-Fi. Extrae el ZIP en tu computadora antes de pasarlo a tu memoria USB o pendrive.
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
                <span>⬇</span> Descargar
              </span>
            </a>
          `;
        }).join('')}
      </div>
    `;

    modalMatrixEl.classList.add('active');
  };

  // Cerrar cualquier modal
  const closeModal = () => {
    modalMatrixEl.classList.remove('active');
    modalMachineEl.classList.remove('active');
  };

  // ══ EVENT DELEGATION GLOBAL ══
  document.body.addEventListener('click', (e) => {
    const target = e.target;

    // Cerrar Modal (botón X o clic afuera)
    if (target.closest('.js-close-modal') || target === modalMatrixEl || target === modalMachineEl) {
      closeModal();
      return;
    }

    // Favoritar / Desfavoritar (prioridad máxima sobre clic en tarjeta)
    const favBtn = target.closest('.js-toggle-fav');
    if (favBtn) {
      e.stopPropagation();
      e.preventDefault();
      const id = favBtn.dataset.favId;
      const idx = favorites.indexOf(id);
      if (idx > -1) {
        favorites.splice(idx, 1);
        favBtn.classList.remove('active');
        showToast('Eliminado de favoritos', '♡');
      } else {
        favorites.push(id);
        favBtn.classList.add('active');
        sound.playChime('heart');
        showToast('¡Agregado a favoritos! ♥', '💖');
      }
      Storage.set('favorites', favorites);
      updateFavCount();

      // Si está en favoritos y lo quitó, refresca la vista
      if (currentRoute.view === 'favorites') {
        renderView();
      }
      return;
    }

    // Alternar Sonidos
    const soundToggle = target.closest('.js-toggle-sound');
    if (soundToggle) {
      sound.enabled = !sound.enabled;
      Storage.set('sound_enabled', sound.enabled);
      document.querySelectorAll('.js-sound-label').forEach(el => {
        el.textContent = sound.enabled ? 'Sonidos: Activos 🔔' : 'Sonidos: Silencio 🔕';
      });
      showToast(sound.enabled ? '¡Efectos de sonido activados! 🔔' : '¡Sonidos desactivados! 🔕');
      return;
    }

    // Volver Arriba
    if (target.closest('.js-back-to-top')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Abrir Modal de Catálogo Completo
    if (target.closest('.js-open-acervo-modal')) {
      openAcervoCompletoModal();
      return;
    }

    // Abrir Modal de Máquina
    if (target.closest('.js-open-machine-modal')) {
      openMachineModal(true);
      return;
    }

    // Seleccionar Máquina en el Modal
    const machineSelect = target.closest('.js-select-machine');
    if (machineSelect) {
      const fmt = machineSelect.dataset.fmt;
      userFormat = fmt;
      Storage.set('machine_fmt', fmt);
      updateMachineDisplay();
      sound.playChime('pop');
      closeModal();
      showToast(`¡Máquina configurada para ${fmt}! 🧵`);
      renderView();
      return;
    }

    // Navegación vía botones .js-nav
    const navBtn = target.closest('.js-nav');
    if (navBtn) {
      e.preventDefault();
      const v = navBtn.dataset.view;
      const p = navBtn.dataset.param || null;
      const s = navBtn.dataset.subcol || null;
      navigate(v, p, s);
      return;
    }

    // Abrir Modal de Matriz
    const matrixOpener = target.closest('.js-open-matrix');
    if (matrixOpener) {
      const id = matrixOpener.dataset.matrixId;
      openMatrixModal(id);
      return;
    }

    // Limpiar todos los favoritos
    if (target.closest('.js-clear-favs')) {
      if (confirm('¿Deseas vaciar tu lista de favoritos?')) {
        favorites = [];
        Storage.set('favorites', favorites);
        updateFavCount();
        showToast('¡Lista de favoritos vaciada!');
        renderView();
      }
      return;
    }

    // Copiar Enlace
    const copyBtn = target.closest('.js-copy-link');
    if (copyBtn) {
      const id = copyBtn.dataset.id;
      const shareUrl = `${window.location.origin}${window.location.pathname}#mat=${id}`;
      navigator.clipboard?.writeText(shareUrl).then(() => {
        showToast('¡Enlace copiado con éxito! 🔗');
      }).catch(() => {
        prompt('Copia el enlace:', shareUrl);
      });
      return;
    }

    // Cargar más matrices (Load More)
    if (target.closest('#btnLoadMore') && renderNextBatch) {
      renderNextBatch();
      return;
    }
  });

  // ══ EVENT DELEGATION PARA FILTROS ══
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

  // Alternar modo de visualización (Normal vs Compacto)
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

  // Recarga sólo la grilla con nuevos filtros
  const rerenderGrid = () => {
    const gridTarget = document.getElementById('matrixGridTarget');
    if (gridTarget && currentRoute.activeList) {
      gridTarget.innerHTML = '';
      const processed = applyFiltersAndSorting(currentRoute.activeList);
      renderBatchGrid(processed, gridTarget);
    }
  };

  // Teclado (ESC cierra modales y gaveta)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeDrawer();
    }
  });

  // ══ LECTURA INICIAL DE LA URL / HASH ══
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

  // ══ INICIALIZACIÓN DE LA APLICACIÓN ══
  updateFavCount();

  // Si la usuaria nunca seleccionó su máquina, abre modal acogedor
  if (!userFormat) {
    userFormat = 'PES';
    Storage.set('machine_fmt', 'PES');
    setTimeout(() => openMachineModal(false), 450);
  }
  updateMachineDisplay();

  // Botón flotante volver arriba
  const btnBackToTop = document.getElementById('btnBackToTop');
  window.addEventListener('scroll', () => {
    if (btnBackToTop) {
      btnBackToTop.classList.toggle('active', window.scrollY > 350);
    }
  }, { passive: true });

  handleInitialHash();
});
