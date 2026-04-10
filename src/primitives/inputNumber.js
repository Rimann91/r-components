const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      box-sizing: border-box;

      /* Exposed vars */
      --input-number-font:         var(--font-body, "Fira Code", monospace);
      --input-number-font-size:    var(--text-sm);
      --input-number-font-weight:  var(--font-weight-normal);
      --input-number-radius:       var(--radius);
      --input-number-bg:           var(--color-bg-primary);
      --input-number-color:        var(--color-fg-primary);
      --input-number-border-color: var(--color-divider);
      --input-number-border-width: 1px;
      --input-number-focus-ring:   var(--focus-ring);
      --input-number-transition:   var(--transition-fast);
      --input-number-btn-width:    28px;

      --input-number-label-size:   var(--text-xs);
      --input-number-label-color:  var(--color-gray-500);
      --input-number-label-weight: var(--font-weight-medium);
      --input-number-label-gap:    var(--space-1);

      --input-number-error-color:  var(--color-primary-red);
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--input-number-label-gap);
    }

    label {
      font-family: var(--input-number-font);
      font-size: var(--input-number-label-size);
      font-weight: var(--input-number-label-weight);
      color: var(--input-number-label-color);
      line-height: var(--line-height-base);
    }

    .control {
      display: flex;
      border: var(--input-number-border-width) solid var(--input-number-border-color);
      border-radius: var(--input-number-radius);
      overflow: hidden;
      transition: border-color var(--input-number-transition),
                  box-shadow var(--input-number-transition);
      background-color: var(--input-number-bg);
    }

    .control:focus-within {
      border-color: var(--color-focus);
      box-shadow: var(--input-number-focus-ring);
    }

    input[type="number"] {
      flex: 1;
      min-width: 0;
      font-family: var(--input-number-font);
      font-size: var(--input-number-font-size);
      font-weight: var(--input-number-font-weight);
      color: var(--input-number-color);
      background: transparent;
      border: none;
      outline: none;
      padding: var(--space-1) var(--space-2);
      text-align: center;
      line-height: var(--line-height-base);
      /* Hide browser spinners */
      -moz-appearance: textfield;
    }
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    button {
      width: var(--input-number-btn-width);
      background: transparent;
      border: none;
      border-left: var(--input-number-border-width) solid var(--input-number-border-color);
      color: var(--input-number-color);
      font-family: var(--input-number-font);
      font-size: var(--text-base);
      cursor: pointer;
      padding: 0;
      transition: background-color var(--input-number-transition);
      line-height: 1;
    }
    button:first-of-type {
      border-left: none;
      border-right: var(--input-number-border-width) solid var(--input-number-border-color);
      order: -1;
    }
    button:hover:not(:disabled) {
      background-color: var(--color-gray-200);
    }
    button:focus-visible {
      outline: none;
      background-color: var(--color-gray-200);
    }
    button:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }

    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }

    :host([error]) label   { color: var(--input-number-error-color); }
    :host([error]) .control {
      border-color: var(--input-number-error-color);
    }
    :host([error]) .control:focus-within {
      box-shadow: 0 0 0 2px var(--input-number-error-color);
    }

    .error-message {
      display: none;
      font-family: var(--input-number-font);
      font-size: var(--input-number-label-size);
      color: var(--input-number-error-color);
      line-height: var(--line-height-base);
    }
    :host([error]) .error-message { display: block; }
  </style>

  <div class="wrapper">
    <label></label>
    <div class="control">
      <input type="number" />
      <button class="btn-decrement" aria-label="Decrement">−</button>
      <button class="btn-increment" aria-label="Increment">+</button>
    </div>
    <span class="error-message"></span>
  </div>
`

class RInputNumber extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(template.content.cloneNode(true));
    this._label     = this.shadowRoot.querySelector('label');
    this._input     = this.shadowRoot.querySelector('input');
    this._decBtn    = this.shadowRoot.querySelector('.btn-decrement');
    this._incBtn    = this.shadowRoot.querySelector('.btn-increment');
    this._errorMsg  = this.shadowRoot.querySelector('.error-message');

    this._decBtn.addEventListener('click', () => this._step(-1));
    this._incBtn.addEventListener('click', () => this._step(1));
    this._input.addEventListener('change', () => {
      this._clamp();
      this._updateButtons();
      this._emit();
    });
  }

  static get observedAttributes() {
    return ['label', 'value', 'min', 'max', 'step', 'disabled', 'error', 'error-message'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'label')         this._label.textContent = newValue ?? '';
    if (name === 'value')         { this._input.value = newValue ?? ''; this._updateButtons(); }
    if (name === 'min')           { this._input.min = newValue ?? ''; this._updateButtons(); }
    if (name === 'max')           { this._input.max = newValue ?? ''; this._updateButtons(); }
    if (name === 'step')          this._input.step = newValue ?? '1';
    if (name === 'disabled')      this._input.disabled = newValue !== null;
    if (name === 'error-message') this._errorMsg.textContent = newValue ?? '';
  }

  _step(direction) {
    if (direction > 0) this._input.stepUp();
    else               this._input.stepDown();
    this._clamp();
    this._updateButtons();
    this._emit();
  }

  _clamp() {
    const min = parseFloat(this._input.min);
    const max = parseFloat(this._input.max);
    let val   = parseFloat(this._input.value);
    if (!isNaN(min) && val < min) this._input.value = min;
    if (!isNaN(max) && val > max) this._input.value = max;
  }

  _updateButtons() {
    const val = parseFloat(this._input.value);
    const min = parseFloat(this._input.min);
    const max = parseFloat(this._input.max);
    this._decBtn.disabled = !isNaN(min) && val <= min;
    this._incBtn.disabled = !isNaN(max) && val >= max;
  }

  _emit() {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: parseFloat(this._input.value) },
      bubbles: true,
      composed: true
    }));
  }

  get value() { return parseFloat(this._input.value); }
  set value(v) { this._input.value = v; this._updateButtons(); }
}

customElements.define('r-input-number', RInputNumber);
