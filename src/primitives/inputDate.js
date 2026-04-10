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

      /* Exposed vars */
      --date-font:         var(--font-body, "Fira Code", monospace);
      --date-font-size:    var(--text-sm);
      --date-radius:       var(--radius);
      --date-bg:           var(--color-bg-primary);
      --date-color:        var(--color-fg-primary);
      --date-border-color: var(--color-divider);
      --date-border-width: 1px;
      --date-focus-ring:   var(--focus-ring);
      --date-transition:   var(--transition-fast);

      --date-label-size:   var(--text-xs);
      --date-label-color:  var(--color-gray-500);
      --date-label-weight: var(--font-weight-medium);
      --date-label-gap:    var(--space-1);

      --date-error-color:  var(--color-primary-red);

      --date-popup-bg:     var(--color-bg-primary);
      --date-popup-border: var(--color-divider);
      --date-popup-shadow: var(--shadow-base);
      --date-cell-size:    32px;
      --date-accent:       var(--color-primary-blue);
      --date-accent-text:  var(--color-bg-primary);
      --date-today-color:  var(--color-primary-blue);
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--date-label-gap);
    }

    label {
      font-family: var(--date-font);
      font-size: var(--date-label-size);
      font-weight: var(--date-label-weight);
      color: var(--date-label-color);
      line-height: var(--line-height-base);
    }

    .control {
      display: flex;
      border: var(--date-border-width) solid var(--date-border-color);
      border-radius: var(--date-radius);
      overflow: hidden;
      transition: border-color var(--date-transition), box-shadow var(--date-transition);
      background-color: var(--date-bg);
    }
    .control:focus-within {
      border-color: var(--color-focus);
      box-shadow: var(--date-focus-ring);
    }

    input[type="text"] {
      flex: 1;
      font-family: var(--date-font);
      font-size: var(--date-font-size);
      color: var(--date-color);
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
      border-left: var(--date-border-width) solid var(--date-border-color);
      color: var(--date-label-color);
      padding: 0 var(--space-2);
      cursor: pointer;
      font-size: var(--text-base);
      transition: background-color var(--date-transition);
    }
    .cal-btn:hover { background-color: var(--color-gray-200); }

    :host([disabled]) { opacity: 0.5; pointer-events: none; }
    :host([error]) label    { color: var(--date-error-color); }
    :host([error]) .control { border-color: var(--date-error-color); }
    :host([error]) .control:focus-within { box-shadow: 0 0 0 2px var(--date-error-color); }

    .error-message {
      display: none;
      font-family: var(--date-font);
      font-size: var(--date-label-size);
      color: var(--date-error-color);
      line-height: var(--line-height-base);
    }
    :host([error]) .error-message { display: block; }

    /* ── Calendar popup ── */
    .popup {
      display: none;
      position: absolute;
      top: calc(100% + var(--space-1));
      left: 0;
      z-index: var(--z-dropdown);
      background-color: var(--date-popup-bg);
      border: 1px solid var(--date-popup-border);
      border-radius: var(--date-radius);
      box-shadow: var(--date-popup-shadow);
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
      color: var(--date-color);
      cursor: pointer;
      font-family: var(--date-font);
      font-size: var(--text-base);
      padding: var(--space-1);
      border-radius: var(--date-radius);
      transition: background-color var(--date-transition);
    }
    .popup-header button:hover { background-color: var(--color-gray-200); }
    .month-label {
      font-family: var(--date-font);
      font-size: var(--date-font-size);
      font-weight: var(--font-weight-bold);
      color: var(--date-color);
    }

    .day-grid {
      display: grid;
      grid-template-columns: repeat(7, var(--date-cell-size));
      gap: 2px;
    }
    .day-name {
      font-family: var(--date-font);
      font-size: var(--text-xs);
      color: var(--date-label-color);
      text-align: center;
      padding: var(--space-1) 0;
      font-weight: var(--font-weight-medium);
    }
    .day-cell {
      width: var(--date-cell-size);
      height: var(--date-cell-size);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--date-font);
      font-size: var(--text-xs);
      color: var(--date-color);
      border-radius: var(--date-radius);
      cursor: pointer;
      border: none;
      background: none;
      transition: background-color var(--date-transition);
    }
    .day-cell:hover { background-color: var(--color-gray-200); }
    .day-cell.other-month { color: var(--date-label-color); }
    .day-cell.today { color: var(--date-today-color); font-weight: var(--font-weight-bold); }
    .day-cell.selected {
      background-color: var(--date-accent);
      color: var(--date-accent-text);
    }
    .day-cell.selected:hover { background-color: var(--date-accent); }
  </style>

  <div class="wrapper">
    <label></label>
    <div class="control">
      <input type="text" placeholder="MM/DD/YYYY" readonly />
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
  </div>
`

class RInputDate extends HTMLElement {
  #year;  #month;  #selected = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(template.content.cloneNode(true));

    this._label    = this.shadowRoot.querySelector('label');
    this._input    = this.shadowRoot.querySelector('input');
    this._errorMsg = this.shadowRoot.querySelector('.error-message');
    this._popup    = this.shadowRoot.querySelector('.popup');
    this._grid     = this.shadowRoot.querySelector('.day-grid');
    this._monthLbl = this.shadowRoot.querySelector('.month-label');

    const now = new Date();
    this.#year  = now.getFullYear();
    this.#month = now.getMonth();

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

    /* Close popup on outside click */
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
      const d = new Date(newValue + 'T00:00:00');
      if (!isNaN(d)) {
        this.#selected = d;
        this.#year  = d.getFullYear();
        this.#month = d.getMonth();
        this._input.value = this._fmt(d);
      }
    }
  }

  _fmt(d) {
    return `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}/${d.getFullYear()}`;
  }

  _renderGrid() {
    this._monthLbl.textContent = `${MONTHS[this.#month]} ${this.#year}`;
    this._grid.innerHTML = '';

    /* Day name headers */
    DAYS.forEach(d => {
      const el = document.createElement('div');
      el.className = 'day-name';
      el.textContent = d;
      this._grid.append(el);
    });

    const first   = new Date(this.#year, this.#month, 1).getDay();
    const daysInMonth = new Date(this.#year, this.#month + 1, 0).getDate();
    const prevDays    = new Date(this.#year, this.#month, 0).getDate();
    const today       = new Date();

    /* Leading days from prev month */
    for (let i = first - 1; i >= 0; i--) {
      this._dayCell(prevDays - i, this.#month - 1, 'other-month');
    }
    /* Current month */
    for (let d = 1; d <= daysInMonth; d++) {
      const cell = this._dayCell(d, this.#month);
      const isToday = d === today.getDate() && this.#month === today.getMonth() && this.#year === today.getFullYear();
      const isSelected = this.#selected &&
        d === this.#selected.getDate() && this.#month === this.#selected.getMonth() && this.#year === this.#selected.getFullYear();
      if (isToday)    cell.classList.add('today');
      if (isSelected) cell.classList.add('selected');
    }
    /* Trailing days */
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
      this._input.value = this._fmt(this.#selected);
      this._popup.classList.remove('open');
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: this.#selected.toISOString().split('T')[0] },
        bubbles: true, composed: true
      }));
    });
    this._grid.append(btn);
    return btn;
  }

  get value() { return this.#selected ? this.#selected.toISOString().split('T')[0] : ''; }
}

customElements.define('r-input-date', RInputDate);
