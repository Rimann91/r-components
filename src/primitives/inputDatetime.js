const MONTHS = ['January','February','March','April','May','June',
                 'July','August','September','October','November','December'];
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      box-sizing: border-box;
      position: relative;

      /* Exposed vars — mirrors r-input-date */
      --datetime-font:         var(--font-body, "Fira Code", monospace);
      --datetime-font-size:    var(--text-sm);
      --datetime-radius:       var(--radius);
      --datetime-bg:           var(--color-bg-primary);
      --datetime-color:        var(--color-fg-primary);
      --datetime-border-color: var(--color-divider);
      --datetime-border-width: 1px;
      --datetime-focus-ring:   var(--focus-ring);
      --datetime-transition:   var(--transition-fast);

      --datetime-label-size:   var(--text-xs);
      --datetime-label-color:  var(--color-gray-500);
      --datetime-label-weight: var(--font-weight-medium);
      --datetime-label-gap:    var(--space-1);

      --datetime-error-color:  var(--color-primary-red);

      --datetime-popup-bg:     var(--color-bg-primary);
      --datetime-popup-border: var(--color-divider);
      --datetime-popup-shadow: var(--shadow-base);
      --datetime-cell-size:    32px;
      --datetime-accent:       var(--color-primary-blue);
      --datetime-accent-text:  var(--color-bg-primary);
      --datetime-today-color:  var(--color-primary-blue);
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--datetime-label-gap);
    }

    label {
      font-family: var(--datetime-font);
      font-size: var(--datetime-label-size);
      font-weight: var(--datetime-label-weight);
      color: var(--datetime-label-color);
      line-height: var(--line-height-base);
    }

    .control {
      display: flex;
      border: var(--datetime-border-width) solid var(--datetime-border-color);
      border-radius: var(--datetime-radius);
      overflow: hidden;
      transition: border-color var(--datetime-transition), box-shadow var(--datetime-transition);
      background-color: var(--datetime-bg);
    }
    .control:focus-within {
      border-color: var(--color-focus);
      box-shadow: var(--datetime-focus-ring);
    }

    input[type="text"] {
      flex: 1;
      font-family: var(--datetime-font);
      font-size: var(--datetime-font-size);
      color: var(--datetime-color);
      background: transparent;
      border: none;
      outline: none;
      padding: var(--space-1) var(--space-2);
      line-height: var(--line-height-base);
      cursor: pointer;
    }
    input[type="text"]:disabled { opacity: 0.5; cursor: not-allowed; }

    .cal-btn {
      background: transparent;
      border: none;
      border-left: var(--datetime-border-width) solid var(--datetime-border-color);
      color: var(--datetime-label-color);
      padding: 0 var(--space-2);
      cursor: pointer;
      font-size: var(--text-base);
      transition: background-color var(--datetime-transition);
    }
    .cal-btn:hover { background-color: var(--color-gray-200); }

    :host([disabled]) { opacity: 0.5; pointer-events: none; }
    :host([error]) label     { color: var(--datetime-error-color); }
    :host([error]) .control  { border-color: var(--datetime-error-color); }
    :host([error]) .control:focus-within { box-shadow: 0 0 0 2px var(--datetime-error-color); }

    .error-message {
      display: none;
      font-family: var(--datetime-font);
      font-size: var(--datetime-label-size);
      color: var(--datetime-error-color);
      line-height: var(--line-height-base);
    }
    :host([error]) .error-message { display: block; }

    /* ── Popup ── */
    .popup {
      display: none;
      position: absolute;
      top: calc(100% + var(--space-1));
      left: 0;
      z-index: var(--z-dropdown);
      background-color: var(--datetime-popup-bg);
      border: 1px solid var(--datetime-popup-border);
      border-radius: var(--datetime-radius);
      box-shadow: var(--datetime-popup-shadow);
      padding: var(--space-2);
      min-width: 240px;
    }
    .popup.open { display: block; }

    .popup-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-2);
    }
    .popup-header button {
      background: none;
      border: none;
      color: var(--datetime-color);
      cursor: pointer;
      font-family: var(--datetime-font);
      font-size: var(--text-base);
      padding: var(--space-1);
      border-radius: var(--datetime-radius);
      transition: background-color var(--datetime-transition);
    }
    .popup-header button:hover { background-color: var(--color-gray-200); }
    .month-label {
      font-family: var(--datetime-font);
      font-size: var(--datetime-font-size);
      font-weight: var(--font-weight-bold);
      color: var(--datetime-color);
    }

    .day-grid {
      display: grid;
      grid-template-columns: repeat(7, var(--datetime-cell-size));
      gap: 2px;
    }
    .day-name {
      font-family: var(--datetime-font);
      font-size: var(--text-xs);
      color: var(--datetime-label-color);
      text-align: center;
      padding: var(--space-1) 0;
      font-weight: var(--font-weight-medium);
    }
    .day-cell {
      width: var(--datetime-cell-size);
      height: var(--datetime-cell-size);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--datetime-font);
      font-size: var(--text-xs);
      color: var(--datetime-color);
      border-radius: var(--datetime-radius);
      cursor: pointer;
      border: none;
      background: none;
      transition: background-color var(--datetime-transition);
    }
    .day-cell:hover { background-color: var(--color-gray-200); }
    .day-cell.other-month { color: var(--datetime-label-color); }
    .day-cell.today  { color: var(--datetime-today-color); font-weight: var(--font-weight-bold); }
    .day-cell.selected {
      background-color: var(--datetime-accent);
      color: var(--datetime-accent-text);
    }
    .day-cell.selected:hover { background-color: var(--datetime-accent); }

    /* ── Time row ── */
    .time-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      margin-top: var(--space-2);
      padding-top: var(--space-2);
      border-top: 1px solid var(--datetime-popup-border);
    }
    .time-row label {
      font-size: var(--text-xs);
      color: var(--datetime-label-color);
    }
    .time-input {
      font-family: var(--datetime-font);
      font-size: var(--datetime-font-size);
      color: var(--datetime-color);
      background-color: var(--datetime-bg);
      border: var(--datetime-border-width) solid var(--datetime-border-color);
      border-radius: var(--datetime-radius);
      padding: var(--space-1) var(--space-2);
      width: 52px;
      text-align: center;
      outline: none;
    }
    .time-input:focus {
      border-color: var(--color-focus);
      box-shadow: var(--datetime-focus-ring);
    }
    .time-sep {
      font-family: var(--datetime-font);
      font-weight: var(--font-weight-bold);
      color: var(--datetime-color);
    }
    .confirm-btn {
      margin-top: var(--space-2);
      width: 100%;
      font-family: var(--datetime-font);
      font-size: var(--datetime-font-size);
      color: var(--datetime-accent-text);
      background-color: var(--datetime-accent);
      border: none;
      border-radius: var(--datetime-radius);
      padding: var(--space-1) var(--space-2);
      cursor: pointer;
      transition: opacity var(--datetime-transition);
    }
    .confirm-btn:hover { opacity: 0.85; }
  </style>

  <div class="wrapper">
    <label></label>
    <div class="control">
      <input type="text" placeholder="MM/DD/YYYY HH:MM" readonly />
      <button class="cal-btn" aria-label="Open calendar">📅</button>
    </div>
    <span class="error-message"></span>
  </div>
  <div class="popup">
    <div class="popup-header">
      <button class="prev-month">‹</button>
      <span class="month-label"></span>
      <button class="next-month">›</button>
    </div>
    <div class="day-grid"></div>
    <div class="time-row">
      <label>Time</label>
      <input class="time-input hour-input" type="number" min="0" max="23" placeholder="HH" />
      <span class="time-sep">:</span>
      <input class="time-input min-input"  type="number" min="0" max="59" placeholder="MM" />
    </div>
    <button class="confirm-btn">Confirm</button>
  </div>
`

class RInputDatetime extends HTMLElement {
  #year;  #month;  #selected = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(template.content.cloneNode(true));

    this._label    = this.shadowRoot.querySelector('label');
    this._input    = this.shadowRoot.querySelector('input[type="text"]');
    this._errorMsg = this.shadowRoot.querySelector('.error-message');
    this._popup    = this.shadowRoot.querySelector('.popup');
    this._grid     = this.shadowRoot.querySelector('.day-grid');
    this._monthLbl = this.shadowRoot.querySelector('.month-label');
    this._hourIn   = this.shadowRoot.querySelector('.hour-input');
    this._minIn    = this.shadowRoot.querySelector('.min-input');

    const now = new Date();
    this.#year  = now.getFullYear();
    this.#month = now.getMonth();
    this._hourIn.value = String(now.getHours()).padStart(2, '0');
    this._minIn.value  = String(now.getMinutes()).padStart(2, '0');

    this.shadowRoot.querySelector('.cal-btn').addEventListener('click', e => {
      e.stopPropagation();
      this._popup.classList.toggle('open');
      if (this._popup.classList.contains('open')) this._renderGrid();
    });
    this.shadowRoot.querySelector('.prev-month').addEventListener('click', () => {
      this.#month--;
      if (this.#month < 0) { this.#month = 11; this.#year--; }
      this._renderGrid();
    });
    this.shadowRoot.querySelector('.next-month').addEventListener('click', () => {
      this.#month++;
      if (this.#month > 11) { this.#month = 0; this.#year++; }
      this._renderGrid();
    });
    this.shadowRoot.querySelector('.confirm-btn').addEventListener('click', () => {
      if (!this.#selected) return;
      const h = Math.min(23, Math.max(0, parseInt(this._hourIn.value) || 0));
      const m = Math.min(59, Math.max(0, parseInt(this._minIn.value)  || 0));
      this.#selected.setHours(h, m, 0, 0);
      this._input.value = this._fmt(this.#selected);
      this._popup.classList.remove('open');
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: this.#selected.toISOString() },
        bubbles: true, composed: true
      }));
    });

    document.addEventListener('click', e => {
      if (!this.contains(e.target)) this._popup.classList.remove('open');
    });
  }

  static get observedAttributes() {
    return ['label', 'value', 'disabled', 'error', 'error-message'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'label')         this._label.textContent = newValue ?? '';
    if (name === 'disabled')      this._input.disabled = newValue !== null;
    if (name === 'error-message') this._errorMsg.textContent = newValue ?? '';
    if (name === 'value' && newValue) {
      const d = new Date(newValue);
      if (!isNaN(d)) {
        this.#selected = d;
        this.#year  = d.getFullYear();
        this.#month = d.getMonth();
        this._hourIn.value = String(d.getHours()).padStart(2, '0');
        this._minIn.value  = String(d.getMinutes()).padStart(2, '0');
        this._input.value  = this._fmt(d);
      }
    }
  }

  _fmt(d) {
    const date = `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}/${d.getFullYear()}`;
    const time = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    return `${date} ${time}`;
  }

  _renderGrid() {
    this._monthLbl.textContent = `${MONTHS[this.#month]} ${this.#year}`;
    this._grid.innerHTML = '';
    DAYS.forEach(d => {
      const el = document.createElement('div');
      el.className = 'day-name';
      el.textContent = d;
      this._grid.append(el);
    });

    const first       = new Date(this.#year, this.#month, 1).getDay();
    const daysInMonth = new Date(this.#year, this.#month + 1, 0).getDate();
    const prevDays    = new Date(this.#year, this.#month, 0).getDate();
    const today       = new Date();

    for (let i = first - 1; i >= 0; i--) {
      this._dayCell(prevDays - i, this.#month - 1, 'other-month');
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const cell = this._dayCell(d, this.#month);
      const isToday = d === today.getDate() && this.#month === today.getMonth() && this.#year === today.getFullYear();
      const isSel   = this.#selected &&
        d === this.#selected.getDate() && this.#month === this.#selected.getMonth() && this.#year === this.#selected.getFullYear();
      if (isToday) cell.classList.add('today');
      if (isSel)   cell.classList.add('selected');
    }
    const total = first + daysInMonth;
    const trail = total % 7 === 0 ? 0 : 7 - (total % 7);
    for (let d = 1; d <= trail; d++) {
      this._dayCell(d, this.#month + 1, 'other-month');
    }
  }

  _dayCell(day, month, cls = '') {
    const btn = document.createElement('button');
    btn.className = `day-cell ${cls}`.trim();
    btn.textContent = day;
    btn.addEventListener('click', () => {
      const y = month < 0 ? this.#year - 1 : month > 11 ? this.#year + 1 : this.#year;
      const m = ((month % 12) + 12) % 12;
      this.#selected = new Date(y, m, day);
      this.#year  = y;
      this.#month = m;
      this._renderGrid();
    });
    this._grid.append(btn);
    return btn;
  }

  get value() { return this.#selected ? this.#selected.toISOString() : ''; }
}

customElements.define('r-input-datetime', RInputDatetime);
