const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      box-sizing: border-box;

      /* Exposed vars */
      --money-font:         var(--font-body, "Fira Code", monospace);
      --money-font-size:    var(--text-sm);
      --money-font-weight:  var(--font-weight-normal);
      --money-radius:       var(--radius);
      --money-bg:           var(--color-bg-primary);
      --money-color:        var(--color-fg-primary);
      --money-border-color: var(--color-divider);
      --money-border-width: 1px;
      --money-focus-ring:   var(--focus-ring);
      --money-transition:   var(--transition-fast);
      --money-symbol-color: var(--color-gray-500);
      --money-symbol-bg:    var(--color-gray-200);

      --money-label-size:   var(--text-xs);
      --money-label-color:  var(--color-gray-500);
      --money-label-weight: var(--font-weight-medium);
      --money-label-gap:    var(--space-1);

      --money-error-color:  var(--color-primary-red);
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--money-label-gap);
    }

    label {
      font-family: var(--money-font);
      font-size: var(--money-label-size);
      font-weight: var(--money-label-weight);
      color: var(--money-label-color);
      line-height: var(--line-height-base);
    }

    .control {
      display: flex;
      border: var(--money-border-width) solid var(--money-border-color);
      border-radius: var(--money-radius);
      overflow: hidden;
      transition: border-color var(--money-transition),
                  box-shadow var(--money-transition);
    }

    .control:focus-within {
      border-color: var(--color-focus);
      box-shadow: var(--money-focus-ring);
    }

    .symbol {
      display: flex;
      align-items: center;
      padding: 0 var(--space-2);
      background-color: var(--money-symbol-bg);
      color: var(--money-symbol-color);
      font-family: var(--money-font);
      font-size: var(--money-font-size);
      font-weight: var(--font-weight-medium);
      border-right: var(--money-border-width) solid var(--money-border-color);
      user-select: none;
      white-space: nowrap;
    }

    input {
      flex: 1;
      min-width: 0;
      font-family: var(--money-font);
      font-size: var(--money-font-size);
      font-weight: var(--money-font-weight);
      color: var(--money-color);
      background-color: var(--money-bg);
      border: none;
      outline: none;
      padding: var(--space-1) var(--space-2);
      line-height: var(--line-height-base);
      text-align: right;
    }

    input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    :host([disabled]) { opacity: 0.5; pointer-events: none; }

    :host([error]) label   { color: var(--money-error-color); }
    :host([error]) .control { border-color: var(--money-error-color); }
    :host([error]) .control:focus-within {
      box-shadow: 0 0 0 2px var(--money-error-color);
    }

    .error-message {
      display: none;
      font-family: var(--money-font);
      font-size: var(--money-label-size);
      color: var(--money-error-color);
      line-height: var(--line-height-base);
    }
    :host([error]) .error-message { display: block; }
  </style>

  <div class="wrapper">
    <label></label>
    <div class="control">
      <span class="symbol">$</span>
      <input type="text" inputmode="decimal" placeholder="0.00" />
    </div>
    <span class="error-message"></span>
  </div>
`

class RInputMoney extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(template.content.cloneNode(true));
    this._label    = this.shadowRoot.querySelector('label');
    this._symbol   = this.shadowRoot.querySelector('.symbol');
    this._input    = this.shadowRoot.querySelector('input');
    this._errorMsg = this.shadowRoot.querySelector('.error-message');

    /* Allow only digits, decimal point, and minus */
    this._input.addEventListener('keydown', e => {
      const allowed = /[0-9.\-]|Backspace|Delete|Tab|ArrowLeft|ArrowRight|Home|End/;
      if (!allowed.test(e.key)) e.preventDefault();
      /* Allow only one decimal point */
      if (e.key === '.' && this._input.value.includes('.')) e.preventDefault();
    });

    this._input.addEventListener('blur', () => this._format());

    this._input.addEventListener('input', () => {
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: this._rawValue() },
        bubbles: true,
        composed: true
      }));
    });
  }

  static get observedAttributes() {
    return ['label', 'value', 'symbol', 'disabled', 'error', 'error-message'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'label')         this._label.textContent = newValue ?? '';
    if (name === 'symbol')        this._symbol.textContent = newValue ?? '$';
    if (name === 'value')         { this._input.value = newValue ?? ''; this._format(); }
    if (name === 'disabled')      this._input.disabled = newValue !== null;
    if (name === 'error-message') this._errorMsg.textContent = newValue ?? '';
  }

  _rawValue() {
    return parseFloat(this._input.value.replace(/,/g, '')) || 0;
  }

  _format() {
    const val = this._rawValue();
    if (!isNaN(val)) this._input.value = val.toFixed(2);
  }

  get value() { return this._rawValue(); }
  set value(v) { this._input.value = v; this._format(); }
}

customElements.define('r-input-money', RInputMoney);
