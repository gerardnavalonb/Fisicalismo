/**
 * MENTE / CEREBRO — Lógica de Aplicación y Evaluación Pedagógica
 */

(function () {
  'use strict';

  // Clave en LocalStorage
  const STORAGE_KEY = 'mente_cerebro_learning_state';

  // Estado global de la aplicación
  const defaultState = {
    currentPhase: 1,
    maxVisitedPhase: 1,
    phase1: {
      p1_q1: null,
      p1_q2: null,
      p1_q3_text: ''
    },
    phase2: {
      matches: {},
      attempts: 0,
      completed: false
    },
    phase3: {
      selectedOption: null,
      justification: '',
      completed: false
    },
    phase4: {
      quizAnswers: {},
      completed: false
    },
    phase5: {
      ex1: {},
      ex2: {},
      ex3: {},
      ex4: {
        nagel_q1: null,
        nagel_q2: null,
        nagel_q3: null,
        nagel_q4_text: ''
      },
      completed: false
    },
    phase6: {
      finalReflectiveText: ''
    }
  };

  let state = loadState();

  // Instancias de simulaciones
  let brainSim = null;
  let astroSim = null;
  let desktopSim = null;

  // Cargar estado de almacenamiento local
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return Object.assign({}, defaultState, JSON.parse(saved));
      }
    } catch (e) {
      console.warn("No se pudo cargar localStorage:", e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  // Guardar estado en almacenamiento local
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("No se pudo guardar en localStorage:", e);
    }
  }

  // Inicialización de la aplicación
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderAndNavigation();
    initModals();
    initPhase1();
    initPhase2();
    initPhase3();
    initPhase4();
    initPhase5();
    initPhase6();

    // Mostrar fase guardada
    goToPhase(state.currentPhase || 1);
  });

  // =================================================================
  // NAVEGACIÓN Y ENCABEZADO
  // =================================================================

  function initHeaderAndNavigation() {
    const stepBtns = document.querySelectorAll('.step-item');
    stepBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetStep = parseInt(btn.getAttribute('data-step'), 10);
        // Permitir ir si ya ha sido visitado o si es el siguiente inmediato
        if (targetStep <= state.maxVisitedPhase) {
          goToPhase(targetStep);
        }
      });
    });

    updateStepperUI();
  }

  function goToPhase(phaseNum) {
    if (phaseNum < 1 || phaseNum > 6) return;

    state.currentPhase = phaseNum;
    if (phaseNum > state.maxVisitedPhase) {
      state.maxVisitedPhase = phaseNum;
    }
    saveState();

    // Actualizar contenedores
    const containers = document.querySelectorAll('.phase-container');
    containers.forEach(c => c.classList.remove('active'));

    const currentContainer = document.getElementById(`phase-${phaseNum}`);
    if (currentContainer) {
      currentContainer.classList.add('active');
    }

    updateStepperUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Activar simulaciones específicas al entrar en su fase
    if (phaseNum === 1 && !brainSim) {
      setTimeout(() => { brainSim = new BrainNetworkSim('neuralCanvas'); }, 80);
    } else if (phaseNum === 3 && !astroSim) {
      setTimeout(() => { astroSim = new AstronomySim('astroCanvas'); }, 80);
    } else if (phaseNum === 4 && !desktopSim) {
      setTimeout(() => { desktopSim = new DesktopMetaphorSim('desktopSimContainer'); }, 80);
    } else if (phaseNum === 6) {
      renderReport();
    }
  }

  function updateStepperUI() {
    const stepBtns = document.querySelectorAll('.step-item');
    stepBtns.forEach(btn => {
      const step = parseInt(btn.getAttribute('data-step'), 10);
      btn.classList.remove('active', 'completed');

      if (step === state.currentPhase) {
        btn.classList.add('active');
      } else if (step < state.currentPhase || step < state.maxVisitedPhase) {
        btn.classList.add('completed');
      }

      // Accesibilidad aria
      btn.setAttribute('aria-current', step === state.currentPhase ? 'step' : 'false');
      btn.disabled = step > state.maxVisitedPhase;
    });

    // Actualizar barra de progreso
    const progressFill = document.getElementById('progressBarFill');
    if (progressFill) {
      const percentage = ((state.currentPhase - 1) / 5) * 100;
      progressFill.style.width = `${percentage}%`;
    }
  }

  // =================================================================
  // MODALES: GLOSARIO Y REINICIO
  // =================================================================

  function initModals() {
    const glossaryModal = document.getElementById('glossaryModal');
    const btnOpenGlossary = document.getElementById('btnOpenGlossary');
    const btnCloseGlossary = document.getElementById('btnCloseGlossary');

    btnOpenGlossary.addEventListener('click', () => {
      glossaryModal.classList.add('active');
      btnCloseGlossary.focus();
    });

    btnCloseGlossary.addEventListener('click', () => {
      glossaryModal.classList.remove('active');
      btnOpenGlossary.focus();
    });

    const resetModal = document.getElementById('resetModal');
    const btnResetApp = document.getElementById('btnResetApp');
    const btnCancelReset = document.getElementById('btnCancelReset');
    const btnConfirmReset = document.getElementById('btnConfirmReset');
    const btnRestartFromReport = document.getElementById('btnRestartFromReport');

    function openReset() {
      resetModal.classList.add('active');
      btnCancelReset.focus();
    }

    btnResetApp.addEventListener('click', openReset);
    if (btnRestartFromReport) {
      btnRestartFromReport.addEventListener('click', openReset);
    }

    btnCancelReset.addEventListener('click', () => {
      resetModal.classList.remove('active');
    });

    btnConfirmReset.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });

    // Cerrar modales con tecla Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        glossaryModal.classList.remove('active');
        resetModal.classList.remove('active');
      }
    });
  }

  // =================================================================
  // FASE 1: EL DILEMA
  // =================================================================

  function initPhase1() {
    const optButtons = document.querySelectorAll('#phase-1 .option-btn');
    const textarea = document.getElementById('p1_q3_text');
    const charCount = document.getElementById('p1_char_count');
    const continueBtn = document.getElementById('btnContinuePhase1');

    // Restaurar valores guardados
    if (state.phase1.p1_q1) {
      const b = document.querySelector(`#phase-1 .option-btn[data-qid="p1_q1"][data-opt="${state.phase1.p1_q1}"]`);
      if (b) b.classList.add('selected');
    }
    if (state.phase1.p1_q2) {
      const b = document.querySelector(`#phase-1 .option-btn[data-qid="p1_q2"][data-opt="${state.phase1.p1_q2}"]`);
      if (b) b.classList.add('selected');
    }
    if (state.phase1.p1_q3_text) {
      textarea.value = state.phase1.p1_q3_text;
      charCount.textContent = `${textarea.value.length} caracteres`;
    }

    checkPhase1Completion();

    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.getAttribute('data-qid');
        const opt = btn.getAttribute('data-opt');

        // Desmarcar hermanos de la misma pregunta
        const siblings = document.querySelectorAll(`#phase-1 .option-btn[data-qid="${qid}"]`);
        siblings.forEach(s => s.classList.remove('selected'));

        btn.classList.add('selected');
        state.phase1[qid] = opt;
        saveState();
        checkPhase1Completion();
      });
    });

    textarea.addEventListener('input', () => {
      state.phase1.p1_q3_text = textarea.value.trim();
      charCount.textContent = `${textarea.value.length} caracteres`;
      saveState();
      checkPhase1Completion();
    });

    continueBtn.addEventListener('click', () => {
      goToPhase(2);
    });

    function checkPhase1Completion() {
      const valid = state.phase1.p1_q1 && state.phase1.p1_q2 && state.phase1.p1_q3_text.length >= 10;
      continueBtn.disabled = !valid;
    }
  }

  // =================================================================
  // FASE 2: DESCUBRE EL FISICALISMO
  // =================================================================

  function initPhase2() {
    const container = document.getElementById('phase2MatchingContainer');
    const continueBtn = document.getElementById('btnContinuePhase2');
    const backBtn = document.getElementById('btnBackPhase2');
    const feedbackSummary = document.getElementById('phase2FeedbackSummary');

    backBtn.addEventListener('click', () => goToPhase(1));
    continueBtn.addEventListener('click', () => goToPhase(3));

    const p2Data = PHILOSOPHY_DATA.phase2.matchingActivity;
    let html = `<div style="display: flex; flex-direction: column; gap: 1.25rem;">`;

    p2Data.items.forEach((item, idx) => {
      const savedChoice = state.phase2.matches[item.id] || "";

      html += `
        <div class="card" style="margin-bottom: 0; background-color: var(--bg-surface);" id="p2_item_${item.id}">
          <p style="font-weight: 600; color: #ffffff; margin-bottom: 0.75rem; font-size: 0.95rem;">
            ${idx + 1}. ${item.statement}
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
            <label style="font-size: 0.85rem; color: var(--text-muted);">Asignar a:</label>
            ${p2Data.conceptOptions.map(concept => `
              <button type="button" class="btn btn-secondary btn-p2-match ${savedChoice === concept ? 'btn-amber' : ''}" 
                data-itemid="${item.id}" data-concept="${concept}" style="font-size: 0.85rem; padding: 0.4rem 0.8rem;">
                ${concept}
              </button>
            `).join('')}
          </div>
          <div class="feedback-box info p2-feedback-box" id="p2_fb_${item.id}" style="display: none; margin-top: 0.75rem;"></div>
        </div>
      `;
    });

    html += `
      <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
        <button type="button" id="btnVerifyPhase2" class="btn btn-primary">
          <span>Comprobar y ver feedback razonado</span>
          <span>✓</span>
        </button>
      </div>
    </div>`;

    container.innerHTML = html;

    // Asignar eventos a botones de emparejamiento
    const matchBtns = container.querySelectorAll('.btn-p2-match');
    matchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-itemid');
        const concept = btn.getAttribute('data-concept');

        const siblings = container.querySelectorAll(`.btn-p2-match[data-itemid="${itemId}"]`);
        siblings.forEach(s => s.classList.remove('btn-amber'));

        btn.classList.add('btn-amber');
        state.phase2.matches[itemId] = concept;
        saveState();
      });
    });

    const verifyBtn = document.getElementById('btnVerifyPhase2');
    verifyBtn.addEventListener('click', () => {
      let allCorrect = true;
      let answeredCount = 0;

      p2Data.items.forEach(item => {
        const choice = state.phase2.matches[item.id];
        const fbEl = document.getElementById(`p2_fb_${item.id}`);
        if (choice) answeredCount++;

        if (choice === item.correctConcept) {
          fbEl.className = 'feedback-box success';
          fbEl.innerHTML = `<strong>¡Correcto!</strong> ${item.feedback}`;
          fbEl.style.display = 'block';
        } else if (choice) {
          allCorrect = false;
          fbEl.className = 'feedback-box warning';
          fbEl.innerHTML = `<strong>Revisión necesaria:</strong> Has seleccionado <em>${choice}</em>. Sin embargo, este caso corresponde a <strong>${item.correctConcept}</strong>: ${item.feedback}`;
          fbEl.style.display = 'block';
        } else {
          allCorrect = false;
          fbEl.className = 'feedback-box warning';
          fbEl.innerHTML = `<em>Por favor, selecciona una categoría para este enunciado.</em>`;
          fbEl.style.display = 'block';
        }
      });

      if (answeredCount === p2Data.items.length) {
        state.phase2.completed = true;
        saveState();
        continueBtn.disabled = false;
        feedbackSummary.className = 'feedback-box info';
        feedbackSummary.innerHTML = `
          <strong>Actividad completada:</strong> Has comprobado las 4 relaciones conceptuales. Lee detenidamente el feedback para asentar la diferencia entre la dependencia física, la intencionalidad y la psicología popular antes de continuar.
        `;
        feedbackSummary.style.display = 'block';
      }
    });

    if (state.phase2.completed) {
      continueBtn.disabled = false;
    }
  }

  // =================================================================
  // FASE 3: LA ANALOGÍA ASTRONÓMICA
  // =================================================================

  function initPhase3() {
    const geoBtn = document.getElementById('btnGeocentricMode');
    const helioBtn = document.getElementById('btnHeliocentricMode');
    const togglePlayBtn = document.getElementById('btnToggleAstroPlay');
    const playIcon = document.getElementById('astroPlayIcon');
    const optionsGrid = document.getElementById('astroOptionsGrid');
    const feedbackBox = document.getElementById('astroFeedbackBox');
    const textarea = document.getElementById('astroJustificationText');
    const charCount = document.getElementById('astro_char_count');
    const continueBtn = document.getElementById('btnContinuePhase3');
    const backBtn = document.getElementById('btnBackPhase3');

    backBtn.addEventListener('click', () => goToPhase(2));
    continueBtn.addEventListener('click', () => goToPhase(4));

    // Controles de simulación astronómica
    geoBtn.addEventListener('click', () => {
      if (astroSim) astroSim.setMode('geocentric');
      geoBtn.classList.add('active-mode');
      geoBtn.style.borderColor = 'var(--accent-cyan)';
      helioBtn.classList.remove('active-mode');
      helioBtn.style.borderColor = 'transparent';
    });

    helioBtn.addEventListener('click', () => {
      if (astroSim) astroSim.setMode('heliocentric');
      helioBtn.classList.add('active-mode');
      helioBtn.style.borderColor = 'var(--accent-cyan)';
      geoBtn.classList.remove('active-mode');
      geoBtn.style.borderColor = 'transparent';
    });

    togglePlayBtn.addEventListener('click', () => {
      if (astroSim) {
        const isPlaying = astroSim.togglePlay();
        playIcon.textContent = isPlaying ? "⏸️ Pausar" : "▶️ Reanudar";
      }
    });

    // Pregunta de la Fase 3
    const p3Data = PHILOSOPHY_DATA.phase3.reflectionQuestion;
    optionsGrid.innerHTML = p3Data.options.map((opt, i) => `
      <button type="button" class="option-btn" data-p3-opt="${opt.id}">
        <span class="option-marker">${String.fromCharCode(65 + i)}</span>
        <span>${opt.text}</span>
      </button>
    `).join('');

    // Restaurar si ya existía
    if (state.phase3.selectedOption) {
      const selectedBtn = optionsGrid.querySelector(`[data-p3-opt="${state.phase3.selectedOption}"]`);
      if (selectedBtn) selectedBtn.classList.add('selected');
      showAstroFeedback(state.phase3.selectedOption);
    }

    if (state.phase3.justification) {
      textarea.value = state.phase3.justification;
      charCount.textContent = `${textarea.value.length} caracteres`;
    }

    checkPhase3Completion();

    optionsGrid.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        optionsGrid.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        const optId = btn.getAttribute('data-p3-opt');
        state.phase3.selectedOption = optId;
        saveState();
        showAstroFeedback(optId);
        checkPhase3Completion();
      });
    });

    textarea.addEventListener('input', () => {
      state.phase3.justification = textarea.value.trim();
      charCount.textContent = `${textarea.value.length} caracteres`;
      saveState();
      checkPhase3Completion();
    });

    function showAstroFeedback(optId) {
      const opt = p3Data.options.find(o => o.id === optId);
      if (!opt) return;

      feedbackBox.className = opt.validity === 'acertada' ? 'feedback-box success' : 'feedback-box warning';
      feedbackBox.innerHTML = `<strong>Análisis Filosófico:</strong> ${opt.feedback}`;
      feedbackBox.style.display = 'block';
    }

    function checkPhase3Completion() {
      const valid = state.phase3.selectedOption && state.phase3.justification.length >= 15;
      continueBtn.disabled = !valid;
      if (valid) state.phase3.completed = true;
    }
  }

  // =================================================================
  // FASE 4: TRES POSICIONES FILOSÓFICAS
  // =================================================================

  function initPhase4() {
    const container = document.getElementById('phase4QuizContainer');
    const continueBtn = document.getElementById('btnContinuePhase4');
    const backBtn = document.getElementById('btnBackPhase4');

    backBtn.addEventListener('click', () => goToPhase(3));
    continueBtn.addEventListener('click', () => goToPhase(5));

    const quizData = PHILOSOPHY_DATA.phase4.comparativeQuiz;
    let html = `<div style="display: flex; flex-direction: column; gap: 1.25rem;">`;

    quizData.forEach((q, idx) => {
      const saved = state.phase4.quizAnswers[q.id] || "";

      html += `
        <div class="card" style="margin-bottom: 0; background-color: var(--bg-surface);" id="p4_q_${q.id}">
          <p style="font-weight: 600; color: #ffffff; margin-bottom: 0.75rem; font-size: 0.95rem;">
            ${idx + 1}. ${q.statement}
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
            <label style="font-size: 0.85rem; color: var(--text-muted);">Posición:</label>
            <button type="button" class="btn btn-secondary btn-p4-ans ${saved === 'fisicalismo' ? 'btn-amber' : ''}" 
              data-qid="${q.id}" data-stance="fisicalismo" style="font-size: 0.82rem; padding: 0.35rem 0.7rem;">
              Fisicalismo General
            </button>
            <button type="button" class="btn btn-secondary btn-p4-ans ${saved === 'churchland' ? 'btn-amber' : ''}" 
              data-qid="${q.id}" data-stance="churchland" style="font-size: 0.82rem; padding: 0.35rem 0.7rem;">
              Churchland (Eliminativismo)
            </button>
            <button type="button" class="btn btn-secondary btn-p4-ans ${saved === 'dennett' ? 'btn-amber' : ''}" 
              data-qid="${q.id}" data-stance="dennett" style="font-size: 0.82rem; padding: 0.35rem 0.7rem;">
              Daniel Dennett (Interfaz / Postura Intencional)
            </button>
          </div>
          <div class="feedback-box info p4-feedback" id="p4_fb_${q.id}" style="display: none; margin-top: 0.75rem;"></div>
        </div>
      `;
    });

    html += `
      <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
        <button type="button" id="btnVerifyPhase4" class="btn btn-primary">
          <span>Comprobar discriminación de teorías</span>
          <span>✓</span>
        </button>
      </div>
    </div>`;

    container.innerHTML = html;

    const ansBtns = container.querySelectorAll('.btn-p4-ans');
    ansBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.getAttribute('data-qid');
        const stance = btn.getAttribute('data-stance');

        const siblings = container.querySelectorAll(`.btn-p4-ans[data-qid="${qid}"]`);
        siblings.forEach(s => s.classList.remove('btn-amber'));

        btn.classList.add('btn-amber');
        state.phase4.quizAnswers[qid] = stance;
        saveState();
      });
    });

    const verifyBtn = document.getElementById('btnVerifyPhase4');
    verifyBtn.addEventListener('click', () => {
      let allAnswered = true;

      quizData.forEach(q => {
        const ans = state.phase4.quizAnswers[q.id];
        const fbEl = document.getElementById(`p4_fb_${q.id}`);

        if (!ans) {
          allAnswered = false;
          fbEl.className = 'feedback-box warning';
          fbEl.innerHTML = `<em>Selecciona una de las tres opciones para este enunciado.</em>`;
          fbEl.style.display = 'block';
          return;
        }

        if (ans === q.correct) {
          fbEl.className = 'feedback-box success';
          fbEl.innerHTML = `<strong>¡Correcto!</strong> ${q.explanation}`;
          fbEl.style.display = 'block';
        } else {
          fbEl.className = 'feedback-box warning';
          fbEl.innerHTML = `<strong>Aclaración conceptual:</strong> Has seleccionado otra postura, pero esta tesis define la de <strong>${q.correct.toUpperCase()}</strong>: ${q.explanation}`;
          fbEl.style.display = 'block';
        }
      });

      if (allAnswered) {
        state.phase4.completed = true;
        saveState();
        continueBtn.disabled = false;
      }
    });

    if (state.phase4.completed) {
      continueBtn.disabled = false;
    }
  }

  // =================================================================
  // FASE 5: LABORATORIO DE IDEAS (EVALUACIÓN FORMATIVA)
  // =================================================================

  function initPhase5() {
    const continueBtn = document.getElementById('btnContinuePhase5');
    const backBtn = document.getElementById('btnBackPhase5');

    backBtn.addEventListener('click', () => goToPhase(4));
    continueBtn.addEventListener('click', () => goToPhase(6));

    renderLabExercise1();
    renderLabExercise2();
    renderLabExercise3();
    renderLabExercise4();

    checkPhase5Completion();
  }

  function renderLabExercise1() {
    const container = document.getElementById('labEx1Content');
    const ex1Data = PHILOSOPHY_DATA.phase5.exercise1;

    // Obtener casos no clasificados
    const unclassified = ex1Data.cases.filter(c => !state.phase5.ex1[c.id]);
    const classifiedCount = ex1Data.cases.length - unclassified.length;
    const activeSample = unclassified.length > 0 ? unclassified[0] : null;

    let html = `<div class="sorting-lab-container">`;

    // 1. Consola de Muestra Activa (si queda alguna por clasificar)
    if (activeSample) {
      const sampleNum = classifiedCount + 1;
      html += `
        <div class="sample-console" id="sampleConsole">
          <div class="sample-console-header">
            <span class="sample-badge">🔬 Muestra Activa #${sampleNum}</span>
            <span class="sample-progress-counter">Progreso: ${classifiedCount} / ${ex1Data.cases.length} clasificadas</span>
          </div>

          <div class="sample-text-box" id="draggableSample" draggable="true" data-caseid="${activeSample.id}" tabindex="0" role="button" aria-label="Muestra a clasificar: ${activeSample.text}">
            ${activeSample.text}
          </div>

          <div class="sample-instruction-hint">
            <span>💡 <strong>Cómo clasificar:</strong> Arrastra la tarjeta superior hacia la bandeja adecuada o haz clic directamente en <em>«📥 Depositar en esta bandeja»</em>.</span>
          </div>
          <div id="sortingFeedbackAlert" style="display: none; margin-top: 0.75rem;"></div>
        </div>
      `;
    } else {
      // Todas clasificadas
      html += `
        <div class="sorting-completed-banner">
          <h4 style="color: var(--accent-green); font-size: 1.15rem; margin-bottom: 0.5rem;">
            🎉 ¡Todas las muestras teóricas han sido clasificadas con rigor en el laboratorio!
          </h4>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
            Has asignado correctamente cada enunciado con su fundamento ontológico y epistemológico. Revisa las bandejas inferiores o pulsa el botón para reintentar si lo deseas.
          </p>
          <button type="button" id="btnResetSortingLab" class="btn btn-outline" style="font-size: 0.85rem; padding: 0.35rem 0.8rem;">
            🔄 Volver a clasificar muestras
          </button>
        </div>
      `;
    }

    // 2. Rejilla de 4 Bandejas Receptoras
    html += `<div class="sorting-trays-grid">`;

    ex1Data.trays.forEach(tray => {
      // Casos depositados en esta bandeja
      const depositedCases = ex1Data.cases.filter(c => state.phase5.ex1[c.id] === tray.id);

      html += `
        <div class="theory-tray tray-${tray.classKey}" data-trayid="${tray.id}" tabindex="0" role="region" aria-label="Bandeja de ${tray.title}">
          <div class="tray-header">
            <span class="tray-icon">${tray.icon}</span>
            <span class="tray-title">${tray.title}</span>
          </div>
          <p class="tray-desc">${tray.tagline}</p>

          ${activeSample ? `
            <button type="button" class="tray-deposit-btn" data-target-tray="${tray.id}">
              📥 Depositar aquí
            </button>
          ` : ''}

          <div class="tray-items-list">
            ${depositedCases.map(c => `
              <div class="archived-sample-pill">
                <div class="archived-sample-header">
                  <span>✓ Clasificada</span>
                  <button type="button" class="btn-remove-sample" data-remove-cid="${c.id}" title="Deshacer y reubicar muestra">✕</button>
                </div>
                <p style="margin-bottom: 0.3rem; color: #ffffff;">${c.text}</p>
                <small style="color: #6ee7b7; display: block;"><em>${c.rationale}</em></small>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;

    // Configuración de Eventos de Arrastre (Drag & Drop) y Clic
    const draggableEl = document.getElementById('draggableSample');
    const trays = container.querySelectorAll('.theory-tray');
    const fbAlert = document.getElementById('sortingFeedbackAlert');

    if (draggableEl && activeSample) {
      draggableEl.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', activeSample.id);
        e.dataTransfer.effectAllowed = 'move';
      });

      // Accesibilidad con teclado: presionar Enter o Espacio
      draggableEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (fbAlert) {
            fbAlert.className = 'feedback-box info';
            fbAlert.innerHTML = `<em>Muestra seleccionada. Ahora pulsa en el botón 'Depositar aquí' de la bandeja que consideres adecuada.</em>`;
            fbAlert.style.display = 'block';
          }
        }
      });
    }

    trays.forEach(tray => {
      const trayId = tray.getAttribute('data-trayid');

      tray.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        tray.classList.add('drag-over');
      });

      tray.addEventListener('dragleave', () => {
        tray.classList.remove('drag-over');
      });

      tray.addEventListener('drop', (e) => {
        e.preventDefault();
        tray.classList.remove('drag-over');
        if (activeSample) {
          handleDeposit(activeSample, trayId);
        }
      });

      // Botón de depósito directo
      const depBtn = tray.querySelector('.tray-deposit-btn');
      if (depBtn) {
        depBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (activeSample) {
            handleDeposit(activeSample, trayId);
          }
        });
      }
    });

    function handleDeposit(sample, targetTrayId) {
      if (sample.correct === targetTrayId) {
        // Correcto: archivar en la bandeja
        state.phase5.ex1[sample.id] = targetTrayId;
        saveState();
        checkPhase5Completion();
        renderLabExercise1();
      } else {
        // Feedback pedagógico de error
        if (fbAlert) {
          fbAlert.className = 'feedback-box warning';
          fbAlert.innerHTML = `
            <strong>Reflexión teórica:</strong> Has intentado depositar la muestra en <em>«${targetTrayId}»</em>, pero esta postura no defiende esa tesis. 
            <br>Pista: Analiza si la proposición trata sobre sentido común cotidiano, sustitución radical por neurociencia, interfaz funcional o principio ontológico físico.
          `;
          fbAlert.style.display = 'block';
        }
      }
    }

    // Botones para retirar muestra ya clasificada
    container.querySelectorAll('.btn-remove-sample').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const cid = btn.getAttribute('data-remove-cid');
        delete state.phase5.ex1[cid];
        saveState();
        checkPhase5Completion();
        renderLabExercise1();
      });
    });

    // Botón reiniciar clasificador con barajado dinámico
    const resetSortingBtn = document.getElementById('btnResetSortingLab');
    if (resetSortingBtn) {
      resetSortingBtn.addEventListener('click', () => {
        state.phase5.ex1 = {};
        PHILOSOPHY_DATA.phase5.exercise1.cases.sort(() => Math.random() - 0.5);
        saveState();
        checkPhase5Completion();
        renderLabExercise1();
      });
    }
  }

  function renderLabExercise2() {
    const container = document.getElementById('labEx2Content');
    const ex2Data = PHILOSOPHY_DATA.phase5.exercise2;

    let html = `<div style="display: flex; flex-direction: column; gap: 1.25rem;">`;
    ex2Data.tasks.forEach((t, i) => {
      const saved = state.phase5.ex2[t.id];
      html += `
        <div class="question-block" style="padding-bottom: 0.5rem;">
          <p class="question-text" style="font-size: 1rem;">${i + 1}. ${t.question}</p>
          <div class="options-grid">
            ${t.options.map(opt => `
              <button type="button" class="option-btn ${saved === opt.id ? 'selected' : ''}" data-taskid="${t.id}" data-optid="${opt.id}">
                <span class="option-marker">${opt.id.toUpperCase()}</span>
                <span>${opt.text}</span>
              </button>
            `).join('')}
          </div>
          <div class="feedback-box info" id="fb_ex2_${t.id}" style="${saved ? 'display:block;' : 'display:none;'} margin-top: 0.75rem;">
            ${saved ? (() => {
              const sel = t.options.find(o => o.id === saved);
              return sel ? (sel.correct ? `<strong>✓ Correcto:</strong> ${sel.feedback}` : `<strong>Atención:</strong> ${sel.feedback}`) : '';
            })() : ''}
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-taskid');
        const optId = btn.getAttribute('data-optid');
        const task = ex2Data.tasks.find(x => x.id === taskId);
        const opt = task.options.find(o => o.id === optId);

        container.querySelectorAll(`.option-btn[data-taskid="${taskId}"]`).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.phase5.ex2[taskId] = optId;
        saveState();

        const fbEl = document.getElementById(`fb_ex2_${taskId}`);
        fbEl.className = opt.correct ? 'feedback-box success' : 'feedback-box warning';
        fbEl.innerHTML = opt.correct ? `<strong>✓ Excelente:</strong> ${opt.feedback}` : `<strong>Atención:</strong> ${opt.feedback}`;
        fbEl.style.display = 'block';

        checkPhase5Completion();
      });
    });
  }

  function renderLabExercise3() {
    const container = document.getElementById('labEx3Content');
    const ex3Data = PHILOSOPHY_DATA.phase5.exercise3;

    let html = `<div style="display: flex; flex-direction: column; gap: 1.25rem;">`;
    ex3Data.questions.forEach((q, i) => {
      const saved = state.phase5.ex3[q.id];
      html += `
        <div class="question-block" style="padding-bottom: 0.5rem;">
          <p class="question-text" style="font-size: 1rem;">${i + 1}. ${q.prompt}</p>
          <div class="options-grid">
            ${q.options.map(opt => `
              <button type="button" class="option-btn ${saved === opt.id ? 'selected' : ''}" data-ex3-qid="${q.id}" data-ex3-optid="${opt.id}">
                <span class="option-marker">${opt.id.toUpperCase()}</span>
                <span>${opt.text}</span>
              </button>
            `).join('')}
          </div>
          <div class="feedback-box info" id="fb_ex3_${q.id}" style="${saved ? 'display:block;' : 'display:none;'} margin-top: 0.75rem;">
            ${saved ? (() => {
              const sel = q.options.find(o => o.id === saved);
              return sel ? (sel.correct ? `<strong>✓ Correcto:</strong> ${q.feedback}` : `<strong>Refuerzo:</strong> Respuesta incompleta o inexacta: ${q.feedback}`) : '';
            })() : ''}
          </div>
        </div>
      `;
    });
    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.getAttribute('data-ex3-qid');
        const optId = btn.getAttribute('data-ex3-optid');
        const qObj = ex3Data.questions.find(x => x.id === qid);
        const opt = qObj.options.find(o => o.id === optId);

        container.querySelectorAll(`.option-btn[data-ex3-qid="${qid}"]`).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.phase5.ex3[qid] = optId;
        saveState();

        const fbEl = document.getElementById(`fb_ex3_${qid}`);
        fbEl.className = opt.correct ? 'feedback-box success' : 'feedback-box warning';
        fbEl.innerHTML = opt.correct ? `<strong>✓ Correcto:</strong> ${qObj.feedback}` : `<strong>Refuerzo:</strong> ${qObj.feedback}`;
        fbEl.style.display = 'block';

        checkPhase5Completion();
      });
    });
  }

  function renderLabExercise4() {
    const container = document.getElementById('labEx4Content');
    const ex4Data = PHILOSOPHY_DATA.phase5.exercise4;

    let html = `<div style="display: flex; flex-direction: column; gap: 1.5rem;">`;

    // Preguntas tipo test críticas
    ex4Data.criticalQuestions.forEach((q, i) => {
      if (q.id === 'nagel_q4_text') {
        html += `
          <div class="question-block" style="padding-bottom: 0;">
            <p class="question-text">${q.prompt}</p>
            <textarea id="nagel_q4_input" class="reflective-textarea" placeholder="${q.placeholder}">${state.phase5.ex4.nagel_q4_text || ''}</textarea>
            <div class="textarea-footer">
              <span id="nagel_q4_char_count">${(state.phase5.ex4.nagel_q4_text || '').length} caracteres</span>
              <span>Autoevalúa tu respuesta con la rúbrica inferior</span>
            </div>
          </div>
        `;
      } else {
        const saved = state.phase5.ex4[q.id];
        html += `
          <div class="question-block" style="padding-bottom: 0.5rem;">
            <p class="question-text" style="font-size: 1rem;">${q.prompt}</p>
            <div class="options-grid">
              ${q.options.map(opt => `
                <button type="button" class="option-btn ${saved === opt.id ? 'selected' : ''}" data-nagel-qid="${q.id}" data-nagel-opt="${opt.id}">
                  <span class="option-marker">${opt.id.toUpperCase()}</span>
                  <span>${opt.text}</span>
                </button>
              `).join('')}
            </div>
            <div class="feedback-box info" id="fb_nagel_${q.id}" style="${saved ? 'display:block;' : 'display:none;'} margin-top: 0.75rem;">
              ${saved ? (() => {
                const sel = q.options.find(o => o.id === saved);
                return sel ? (sel.correct ? `<strong>✓ Excelente rigor:</strong> ${sel.feedback || q.feedback}` : `<strong>Atención a la falacia:</strong> ${sel.feedback || q.feedback}`) : '';
              })() : ''}
            </div>
          </div>
        `;
      }
    });

    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.getAttribute('data-nagel-qid');
        const optId = btn.getAttribute('data-nagel-opt');
        const qObj = ex4Data.criticalQuestions.find(x => x.id === qid);
        const opt = qObj.options.find(o => o.id === optId);

        container.querySelectorAll(`.option-btn[data-nagel-qid="${qid}"]`).forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.phase5.ex4[qid] = optId;
        saveState();

        const fbEl = document.getElementById(`fb_nagel_${qid}`);
        fbEl.className = opt.correct ? 'feedback-box success' : 'feedback-box warning';
        fbEl.innerHTML = opt.correct ? `<strong>✓ Muy bien razonado:</strong> ${opt.feedback || qObj.feedback}` : `<strong>Atención:</strong> ${opt.feedback || qObj.feedback}`;
        fbEl.style.display = 'block';

        checkPhase5Completion();
      });
    });

    const nagelInput = document.getElementById('nagel_q4_input');
    const nagelCharCount = document.getElementById('nagel_q4_char_count');
    if (nagelInput) {
      nagelInput.addEventListener('input', () => {
        state.phase5.ex4.nagel_q4_text = nagelInput.value.trim();
        nagelCharCount.textContent = `${nagelInput.value.length} caracteres`;
        saveState();
        checkPhase5Completion();
      });
    }
  }

  function checkPhase5Completion() {
    const continueBtn = document.getElementById('btnContinuePhase5');
    const ex1Complete = Object.keys(state.phase5.ex1).length >= 4;
    const ex2Complete = Object.keys(state.phase5.ex2).length >= 2;
    const ex3Complete = Object.keys(state.phase5.ex3).length >= 3;
    const ex4Complete = state.phase5.ex4.nagel_q1 && state.phase5.ex4.nagel_q2 && state.phase5.ex4.nagel_q3 && state.phase5.ex4.nagel_q4_text.length >= 15;

    const allGood = ex1Complete && ex2Complete && ex3Complete && ex4Complete;
    continueBtn.disabled = !allGood;
    if (allGood) {
      state.phase5.completed = true;
      saveState();
    }
  }

  // =================================================================
  // FASE 6: INFORME DE APRENDIZAJE PERSONALIZADO
  // =================================================================

  function initPhase6() {
    const backBtn = document.getElementById('btnBackPhase6');
    const printBtn = document.getElementById('btnPrintReport');
    const finalReflectiveText = document.getElementById('finalReflectiveText');
    const finalCharCount = document.getElementById('final_char_count');

    backBtn.addEventListener('click', () => goToPhase(5));

    printBtn.addEventListener('click', () => {
      window.print();
    });

    if (state.phase6.finalReflectiveText) {
      finalReflectiveText.value = state.phase6.finalReflectiveText;
      finalCharCount.textContent = `${finalReflectiveText.value.length} caracteres`;
    }

    finalReflectiveText.addEventListener('input', () => {
      state.phase6.finalReflectiveText = finalReflectiveText.value.trim();
      finalCharCount.textContent = `${finalReflectiveText.value.length} caracteres`;
      saveState();
    });
  }

  function renderReport() {
    const dateStamp = document.getElementById('reportDateStamp');
    const p1Container = document.getElementById('reportPhase1Answers');
    const masteredList = document.getElementById('reportMasteredList');
    const reviewList = document.getElementById('reportReviewList');
    const mapNodes = document.getElementById('conceptualMapNodes');
    const mapRelations = document.getElementById('conceptualMapRelations');
    const nextStepBox = document.getElementById('reportNextStepBox');

    const now = new Date();
    dateStamp.textContent = `Fecha de emisión: ${now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} · ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;

    // 1. Respuestas de partida Fase 1
    const q1Obj = PHILOSOPHY_DATA.phase1.questions[0].options.find(o => o.id === state.phase1.p1_q1);
    const q2Obj = PHILOSOPHY_DATA.phase1.questions[1].options.find(o => o.id === state.phase1.p1_q2);

    p1Container.innerHTML = `
      <div class="answer-record-item">
        <strong>1. Sobre dónde existe una creencia («creo que suspenderé»):</strong>
        <p>Tu intuición inicial: <em>"${q1Obj ? q1Obj.text : 'Pendiente'}"</em></p>
      </div>
      <div class="answer-record-item">
        <strong>2. Sobre la naturaleza del deseo de aprobar:</strong>
        <p>Tu intuición inicial: <em>"${q2Obj ? q2Obj.text : 'Pendiente'}"</em></p>
      </div>
      <div class="answer-record-item">
        <strong>3. Sobre si un escáner atómico del cerebro explicaría toda la mente:</strong>
        <p>Tu reflexión inicial: <em>"${state.phase1.p1_q3_text || 'Sin texto inicial'}"</em></p>
      </div>
    `;

    // 2. Evaluación pedagógica: Conceptos dominados vs revisión
    const mastered = [];
    const review = [];

    // Verificación Fase 2
    if (state.phase2.completed) {
      mastered.push({ tag: "Fisicalismo Ontológico", desc: "Comprendes que la mente se asienta en la naturaleza física y rechazas el dualismo ingenuo." });
      mastered.push({ tag: "Psicología Popular", desc: "Identificas el marco de 'creencias y deseos' como herramienta explicativa cotidiana." });
    }

    // Verificación Fase 3 (Astronomía)
    if (state.phase3.selectedOption === 'opt_b') {
      mastered.push({ tag: "Analogía Copernicana del Lenguaje", desc: "Distingues entre la persistencia de metáforas lingüísticas útiles y la verdad ontológica de una teoría." });
    } else {
      review.push({
        topic: "Lenguaje y Ontología (Analogía astronómica)",
        fix: "Decir 'el sol sale' no demuestra que el sol gire alrededor de la Tierra. De igual forma, seguir usando palabras como 'creo' o 'deseo' no demuestra por sí solo que existan como objetos inmateriales separados del cerebro."
      });
    }

    // Verificación Fase 4 (Comparativa Churchland vs Dennett)
    const p4 = state.phase4.quizAnswers;
    if (p4.comp_1 === 'churchland' && p4.comp_2 === 'dennett') {
      mastered.push({ tag: "Materialismo Eliminativo (Churchland)", desc: "Distingues con precisión cómo los Churchland prevén la sustitución de la psicología popular por la neurociencia madura." });
      mastered.push({ tag: "Metáfora del Escritorio de Dennett", desc: "Comprendes la conciencia como 'ilusión de usuario' evolutiva y funcional, no como un teatro cartesiano." });
    } else {
      review.push({
        topic: "Diferencia entre Churchland y Dennett",
        fix: "Los Churchland quieren eliminar y erradicar los conceptos de creencia/deseo como si fueran el 'flogisto'. Dennett, en cambio, defiende que la interfaz de la mente (la postura intencional) es pragmáticamente indispensable y real como nivel de abstracción del sistema operativo."
      });
    }

    // Verificación Fase 5: Nagel y Dualismo
    if (state.phase5.ex4.nagel_q3 === 'b') {
      mastered.push({ tag: "Rigor Lógico: Crítica a Dennett ≠ Dualismo", desc: "Evitas la falacia del falso dilema y comprendes que criticar el reduccionismo de Dennett no equivale a defender el alma cartesiana inmaterial." });
    } else {
      review.push({
        topic: "Thomas Nagel y el falso dilema del dualismo",
        fix: "Thomas Nagel subraya el carácter subjetivo irreductible de 'lo que se siente' ser consciente, pero eso no lo convierte en dualista de sustancias. Señalar los límites del fisicalismo actual no significa aceptar fantasmas ni magia."
      });
    }

    // Renderizar badges dominados
    masteredList.innerHTML = mastered.map(m => `
      <span class="badge-mastered" title="${m.desc}">
        <span>✓</span> <strong>${m.tag}</strong>
      </span>
    `).join('');

    // Renderizar revisiones necesarias
    if (review.length === 0) {
      reviewList.innerHTML = `
        <div class="feedback-box success">
          <strong>¡Excelente solidez argumental!</strong> No se han detectado confusiones conceptuales graves en tus actividades. Has distinguido con éxito las tesis de los Churchland, la metáfora de Dennett y la postura crítica de Nagel.
        </div>
      `;
    } else {
      reviewList.innerHTML = review.map(r => `
        <div class="feedback-box warning" style="margin-bottom: 0.75rem;">
          <strong style="color: var(--accent-orange);">${r.topic}:</strong>
          <p style="margin-top: 0.25rem;">${r.fix}</p>
        </div>
      `).join('');
    }

    // 4. Renderizar Mapa Conceptual
    const mapData = PHILOSOPHY_DATA.conceptualMap;
    mapNodes.innerHTML = mapData.nodes.map(n => `
      <div class="map-node-card">
        <div class="map-node-header">${n.label.replace('\n', ' ')}</div>
        <p class="map-node-desc">${n.desc}</p>
      </div>
    `).join('');

    mapRelations.innerHTML = mapData.links.map(l => `
      <li><strong>${l.from.toUpperCase()} → ${l.to.toUpperCase()}:</strong> ${l.label}</li>
    `).join('');

    // 6. Recomendación de siguiente paso
    if (review.length > 0) {
      nextStepBox.innerHTML = `
        <strong>Recomendación Formativa:</strong> Te recomendamos pulsar en la barra superior sobre la <strong>Fase 4 (Tres Posiciones)</strong> para repasar la distinción entre el eliminativismo de los Churchland y la postura intencional de Dennett. Luego contrasta tu respuesta abierta final con la rúbrica de Nagel.
      `;
    } else {
      nextStepBox.innerHTML = `
        <strong>Nivel Avanzado Alcanzado:</strong> Estás listo para debatir el «problema difícil de la conciencia» de David Chalmers o profundizar en la obra <em>La mente de la noche a la mañana</em> de Patricia Churchland y <em>La evolución de las mentes</em> de Daniel Dennett. ¡Guarda tu informe en PDF para tu profesor!
      `;
    }
  }

})();
