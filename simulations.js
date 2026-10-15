/**
 * MENTE / CEREBRO — Simulaciones Interactivas
 * 1. Visualizador de Red Neuronal / Impulso Sináptico
 * 2. Simulador Astronómico (Geocéntrico vs Heliocéntrico)
 * 3. Simulador de la Metáfora del Escritorio de Dennett (Interfaz vs Hardware)
 */

class BrainNetworkSim {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.connections = [];
    this.impulses = [];
    this.animationFrame = null;
    this.isRunning = true;
    this.activeThought = "Percepción sensorial activa";

    this.init();
    this.setupEvents();
    this.animate();
  }

  init() {
    this.resize();
    const count = Math.min(28, Math.floor(this.canvas.width / 22));
    this.nodes = [];
    for (let i = 0; i < count; i++) {
      this.nodes.push({
        x: Math.random() * (this.canvas.width - 60) + 30,
        y: Math.random() * (this.canvas.height - 60) + 30,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 3 + 3.5,
        energy: Math.random() * 0.5,
        label: i === 0 ? "Tálamo" : i === 1 ? "Amígdala" : i === 2 ? "Corteza Frontal" : null
      });
    }

    this.connections = [];
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          this.connections.push({ a: i, b: j, dist });
        }
      }
    }
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || 600;
    this.canvas.height = 260;
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      if (this.canvas) {
        this.resize();
        this.init();
      }
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      this.triggerSpike(clickX, clickY);
    });
  }

  triggerSpike(x, y) {
    // Find closest node
    let closest = 0;
    let minDist = 99999;
    this.nodes.forEach((node, idx) => {
      const d = Math.hypot(node.x - x, node.y - y);
      if (d < minDist) {
        minDist = d;
        closest = idx;
      }
    });

    this.nodes[closest].energy = 1.0;
    // Launch impulses along connected edges
    this.connections.forEach(conn => {
      if (conn.a === closest) {
        this.impulses.push({ from: conn.a, to: conn.b, progress: 0, speed: 0.04 });
      } else if (conn.b === closest) {
        this.impulses.push({ from: conn.b, to: conn.a, progress: 0, speed: 0.04 });
      }
    });
  }

  animate() {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update nodes
    this.nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 20 || node.x > this.canvas.width - 20) node.vx *= -1;
      if (node.y < 20 || node.y > this.canvas.height - 20) node.vy *= -1;
      node.energy = Math.max(0.1, node.energy * 0.96);
    });

    // Random firing occasionally
    if (Math.random() < 0.03 && this.connections.length > 0) {
      const conn = this.connections[Math.floor(Math.random() * this.connections.length)];
      this.impulses.push({ from: conn.a, to: conn.b, progress: 0, speed: 0.035 });
      this.nodes[conn.a].energy = 0.9;
    }

    // Draw connections
    this.connections.forEach(conn => {
      const na = this.nodes[conn.a];
      const nb = this.nodes[conn.b];
      const dist = Math.hypot(na.x - nb.x, na.y - nb.y);
      const alpha = Math.max(0.08, 1 - dist / 110) * 0.4;
      this.ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(na.x, na.y);
      this.ctx.lineTo(nb.x, nb.y);
      this.ctx.stroke();
    });

    // Update & draw impulses
    for (let i = this.impulses.length - 1; i >= 0; i--) {
      const imp = this.impulses[i];
      imp.progress += imp.speed;
      const na = this.nodes[imp.from];
      const nb = this.nodes[imp.to];
      const cx = na.x + (nb.x - na.x) * imp.progress;
      const cy = na.y + (nb.y - na.y) * imp.progress;

      // Glow
      this.ctx.fillStyle = '#ff9100';
      this.ctx.shadowColor = '#ff9100';
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      if (imp.progress >= 1) {
        this.nodes[imp.to].energy = 0.9;
        this.impulses.splice(i, 1);
      }
    }

    // Draw nodes
    this.nodes.forEach(node => {
      const glow = node.energy;
      this.ctx.fillStyle = `rgba(0, 229, 255, ${0.4 + glow * 0.6})`;
      this.ctx.shadowColor = '#00e5ff';
      this.ctx.shadowBlur = glow * 12;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius + glow * 2, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      if (node.label) {
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '10px Inter, system-ui, sans-serif';
        this.ctx.fillText(node.label, node.x + 8, node.y - 6);
      }
    });

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.isRunning = false;
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
  }
}

class AstronomySim {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.mode = 'geocentric'; // 'geocentric' | 'heliocentric'
    this.time = 0;
    this.speed = 0.02;
    this.isPlaying = true;
    this.animationFrame = null;

    this.resize();
    this.setupEvents();
    this.animate();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || 600;
    this.canvas.height = 340;
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      if (this.canvas) this.resize();
    });
  }

  setMode(newMode) {
    this.mode = newMode;
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    return this.isPlaying;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    if (this.isPlaying) {
      this.time += this.speed;
    }

    if (this.mode === 'geocentric') {
      this.drawGeocentric(cx, cy);
    } else {
      this.drawHeliocentric(cx, cy);
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  drawGeocentric(cx, cy) {
    // Background starfield hint
    this.ctx.fillStyle = '#64748b';
    this.ctx.font = '12px Inter, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText("MODELO GEOCÉNTRICO (Ptolomeo / Apariencia cotidiana)", 20, 28);
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '11px Inter, sans-serif';
    this.ctx.fillText("«El Sol parece girar sobre nosotros; decimos 'el Sol sale'»", 20, 46);

    // Orbits
    const orbits = [
      { r: 65, label: "Órbita de la Luna", speed: 2.5, color: '#94a3b8', size: 5, body: 'Luna' },
      { r: 110, label: "Órbita del Sol", speed: 1.0, color: '#f59e0b', size: 11, body: 'Sol (gira alrededor de la Tierra)', glow: '#f59e0b' },
      { r: 150, label: "Epiciclo de Marte", speed: 0.6, color: '#ef4444', size: 6, body: 'Marte', epicycle: { r: 24, speed: 3.5 } }
    ];

    orbits.forEach(orb => {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([4, 4]);
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, orb.r, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      let bx = cx + Math.cos(this.time * orb.speed) * orb.r;
      let by = cy + Math.sin(this.time * orb.speed) * orb.r;

      if (orb.epicycle) {
        // Draw epicycle circle
        this.ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
        this.ctx.beginPath();
        this.ctx.arc(bx, by, orb.epicycle.r, 0, Math.PI * 2);
        this.ctx.stroke();

        bx += Math.cos(this.time * orb.epicycle.speed) * orb.epicycle.r;
        by += Math.sin(this.time * orb.epicycle.speed) * orb.epicycle.r;
      }

      // Draw celestial body
      if (orb.glow) {
        this.ctx.shadowColor = orb.glow;
        this.ctx.shadowBlur = 18;
      }
      this.ctx.fillStyle = orb.color;
      this.ctx.beginPath();
      this.ctx.arc(bx, by, orb.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Label
      this.ctx.fillStyle = '#cbd5e1';
      this.ctx.font = '10px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(orb.body, bx, by + orb.size + 12);
    });

    // Central Earth (Static, at center)
    this.ctx.shadowColor = '#00e5ff';
    this.ctx.shadowBlur = 14;
    this.ctx.fillStyle = '#0284c7';
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 11px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("TIERRA", cx, cy - 18);
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '9px Inter, sans-serif';
    this.ctx.fillText("(Inmóvil en el centro)", cx, cy + 26);
  }

  drawHeliocentric(cx, cy) {
    this.ctx.fillStyle = '#00e5ff';
    this.ctx.font = '12px Inter, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText("MODELO HELIOCÉNTRICO (Copérnico / Realidad física)", 20, 28);
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '11px Inter, sans-serif';
    this.ctx.fillText("«La Tierra rota sobre su eje y se traslada; el lenguaje 'el sol sale' es solo una metáfora»", 20, 46);

    // Central Sun
    this.ctx.shadowColor = '#ff9100';
    this.ctx.shadowBlur = 24;
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 11px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText("SOL", cx, cy + 4);
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '9px Inter, sans-serif';
    this.ctx.fillText("(Centro del Sistema)", cx, cy + 30);

    // Planetary orbits
    const planets = [
      { r: 60, speed: 2.2, color: '#cbd5e1', size: 4, name: "Mercurio" },
      { r: 90, speed: 1.5, color: '#f97316', size: 6, name: "Venus" },
      {
        r: 125,
        speed: 1.0,
        color: '#0284c7',
        size: 8,
        name: "Tierra (rotando)",
        hasMoon: true,
        rotSpeed: 4.0
      },
      { r: 160, speed: 0.6, color: '#ef4444', size: 6, name: "Marte" }
    ];

    planets.forEach(p => {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, p.r, 0, Math.PI * 2);
      this.ctx.stroke();

      const px = cx + Math.cos(this.time * p.speed) * p.r;
      const py = cy + Math.sin(this.time * p.speed) * p.r;

      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(px, py, p.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Earth rotation arrow / moon
      if (p.hasMoon) {
        // Moon orbiting Earth
        const mx = px + Math.cos(this.time * 6) * 16;
        const my = py + Math.sin(this.time * 6) * 16;
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.beginPath();
        this.ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
        this.ctx.fill();

        // Rotation vector indicator
        this.ctx.strokeStyle = '#00e5ff';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(px, py, p.size + 4, this.time * p.rotSpeed, this.time * p.rotSpeed + Math.PI);
        this.ctx.stroke();
      }

      this.ctx.fillStyle = '#cbd5e1';
      this.ctx.font = '10px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(p.name, px, py + p.size + 12);
    });
  }

  destroy() {
    this.isPlaying = false;
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
  }
}

class DesktopMetaphorSim {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.mode = 'ui'; // 'ui' (interfaz) or 'hardware' (procesos físicos)
    this.selectedItem = null;
    this.openWindow = null;
    this.init();
  }

  init() {
    this.render();
  }

  setMode(newMode) {
    this.mode = newMode;
    this.render();
  }

  render() {
    if (!this.container) return;
    const isUI = this.mode === 'ui';

    this.container.innerHTML = `
      <div class="desktop-sim-wrapper ${isUI ? 'mode-ui' : 'mode-hardware'}">
        <div class="desktop-sim-toolbar">
          <div class="toolbar-brand">
            <span class="toolbar-dot red"></span>
            <span class="toolbar-dot yellow"></span>
            <span class="toolbar-dot green"></span>
            <span class="toolbar-title">${isUI ? 'Simulador de Escritorio Cognitivo — CerebroOS' : 'Substrato Físico / Nivel de Hardware Cerebral'}</span>
          </div>
          <div class="toolbar-toggle">
            <span class="toggle-label ${isUI ? 'active' : ''}">Modo Interfaz (Psicología Popular)</span>
            <button class="switch-btn ${!isUI ? 'switched' : ''}" id="desktopModeToggle" aria-label="Cambiar entre modo Interfaz y modo Hardware">
              <span class="switch-handle"></span>
            </button>
            <span class="toggle-label ${!isUI ? 'active' : ''}">Modo Físico (Neurobiología / Silicio)</span>
          </div>
        </div>

        <div class="desktop-sim-screen" id="simScreen">
          ${isUI ? this.renderUIContent() : this.renderHardwareContent()}
        </div>

        <div class="desktop-sim-legend">
          <div class="legend-badge">
            <i class="icon-info"></i>
            <span>${isUI 
              ? '<strong>NIVEL INTERFAZ:</strong> Ves carpetas, archivos y deseos como objetos claros e intuitivos. Es la metáfora con la que navegamos la vida cotidiana.' 
              : '<strong>NIVEL FÍSICO:</strong> No hay carpetas ni deseos flotantes. Solo hay conmutación de voltajes, bits binarios y 86.000 millones de neuronas descargando potenciales de acción.'}</span>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderUIContent() {
    return `
      <div class="virtual-desktop">
        <div class="desktop-icons">
          <div class="desktop-icon" data-action="creencias" tabindex="0">
            <div class="icon-graphic folder-icon">📁</div>
            <span class="icon-name">Mis_Creencias.txt</span>
          </div>
          <div class="desktop-icon" data-action="deseo" tabindex="0">
            <div class="icon-graphic star-icon">⭐</div>
            <span class="icon-name">Deseo_Aprobar.exe</span>
          </div>
          <div class="desktop-icon" data-action="miedo" tabindex="0">
            <div class="icon-graphic doc-icon">⚡</div>
            <span class="icon-name">Alerta_Examen.log</span>
          </div>
          <div class="desktop-icon trash-icon" data-action="papelera" tabindex="0">
            <div class="icon-graphic trash-glyph">🗑️</div>
            <span class="icon-name">Papelera de reciclaje</span>
          </div>
        </div>

        ${this.openWindow ? this.renderActiveWindow() : `
          <div class="desktop-welcome-hint">
            <p>👆 <strong>Haz clic en cualquier icono</strong> para abrirlo e interactuar.</p>
            <p class="sub-hint">Luego activa el <em>Modo Físico</em> para comprobar si dentro del ordenador existen realmente 'carpetas' o 'papeleras'.</p>
          </div>
        `}
      </div>
    `;
  }

  renderActiveWindow() {
    let title = "";
    let content = "";

    switch(this.openWindow) {
      case 'creencias':
        title = "Mis_Creencias.txt — Bloc de notas";
        content = `
          <div class="window-text-content">
            <p><strong>[Contenido de la Creencia]:</strong></p>
            <p>«Creo que mañana el examen de filosofía será difícil si no repaso a Dennett y a los Churchland».</p>
            <div class="tag-meta">Estado Intencional: Trata sobre un evento futuro</div>
          </div>
        `;
        break;
      case 'deseo':
        title = "Deseo_Aprobar.exe — Proceso Motivacional";
        content = `
          <div class="window-text-content">
            <p><strong>[Objetivo del Deseo]:</strong></p>
            <p>«Obtener una calificación excelente para acceder al grado universitario deseado».</p>
            <div class="progress-bar-mock"><div class="fill" style="width: 85%;"></div></div>
            <small>Fuerza del impulso motivacional: 85%</small>
          </div>
        `;
        break;
      case 'miedo':
        title = "Alerta_Examen.log — Registro Emocional";
        content = `
          <div class="window-text-content">
            <p><strong>[Alerta activa]:</strong> Nivel de cortisol elevado. Respuesta de estrés adaptativo para enfocar la atención.</p>
          </div>
        `;
        break;
      case 'papelera':
        title = "Papelera de reciclaje";
        content = `
          <div class="window-text-content">
            <p>🗑️ Aquí se envían los archivos eliminados.</p>
            <p><em>¿Crees que hay una trituradora real de basura dentro del microchip?</em></p>
          </div>
        `;
        break;
    }

    return `
      <div class="virtual-window">
        <div class="window-header">
          <span class="window-title">${title}</span>
          <button class="window-close-btn" id="closeVirtualWindow" aria-label="Cerrar ventana">✕</button>
        </div>
        <div class="window-body">
          ${content}
        </div>
      </div>
    `;
  }

  renderHardwareContent() {
    return `
      <div class="virtual-hardware">
        <div class="hardware-grid">
          <div class="hardware-card circuit-card">
            <h4>Microarquitectura Físico-Química</h4>
            <div class="binary-stream">
              01001100 01101111 01100111 01101001 01100011<br>
              11010010 10110001 00101101 11001011 01010101<br>
              01110100 01110010 01100001 01101110 01110011<br>
              00100000 01110110 01101111 01101100 01110100
            </div>
            <div class="voltage-meters">
              <div class="v-meter"><span>Pin 12 (Voltaje):</span> <span class="val">3.28 V</span></div>
              <div class="v-meter"><span>Potencial de membrana:</span> <span class="val">-70 mV</span></div>
              <div class="v-meter"><span>Frecuencia sináptica:</span> <span class="val">42 Hz</span></div>
            </div>
          </div>

          <div class="hardware-card inspector-card">
            <h4>Búsqueda Ontológica en el Hardware:</h4>
            <div class="inspect-test">
              <p>🔍 Buscando objeto físico: <strong>«Papelera_de_reciclaje»</strong>...</p>
              <div class="inspect-result alert-red">
                ❌ <strong>RESULTADO: NO ENCONTRADO</strong>.<br>
                En el silicio y en las neuronas no existen 'papeleras' ni 'carpetas amarillas'. Solo existen transistores de silicio conmutando entre saturación y corte, y corrientes iónicas de sodio/potasio.
              </div>
              <div class="dennett-takeaway">
                💡 <strong>Conclusión de Dennett:</strong> La papelera y las carpetas son una «ilusión de usuario» (user-illusion) sumamente eficiente y real como interfaz. Del mismo modo, tus «deseos» y «creencias» son la interfaz cognitiva con la que el cerebro gestiona su asombrosa maquinaria física sin sobrecargarte.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const toggleBtn = document.getElementById('desktopModeToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.setMode(this.mode === 'ui' ? 'hardware' : 'ui');
      });
    }

    const icons = this.container.querySelectorAll('.desktop-icon');
    icons.forEach(icon => {
      icon.addEventListener('click', () => {
        const action = icon.getAttribute('data-action');
        this.openWindow = action;
        this.render();
      });
      icon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const action = icon.getAttribute('data-action');
          this.openWindow = action;
          this.render();
        }
      });
    });

    const closeBtn = document.getElementById('closeVirtualWindow');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.openWindow = null;
        this.render();
      });
    }
  }
}

window.BrainNetworkSim = BrainNetworkSim;
window.AstronomySim = AstronomySim;
window.DesktopMetaphorSim = DesktopMetaphorSim;
