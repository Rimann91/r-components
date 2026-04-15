const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      box-sizing: border-box;

      /* Exposed vars */
      --select-font:          var(--font-body, "Fira Code", monospace);
      --select-font-size:     var(--text-sm);
      --select-font-weight:   var(--font-weight-normal);
      --select-radius:        var(--radius);
      --select-padding:       var(--space-1) var(--space-2);
      --select-bg:            var(--color-bg-primary);
      --select-color:         var(--color-fg-primary);
      --select-border-color:  var(--color-divider);
      --select-border-width:  1px;
      --select-focus-ring:    var(--focus-ring);
      --select-transition:    var(--transition-fast);

      --select-label-size:    var(--text-xs);
      --select-label-color:   var(--color-gray-500);
      --select-label-weight:  var(--font-weight-medium);
      --select-label-gap:     var(--space-1);

      --select-error-color:   var(--color-primary-red);
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--select-label-gap);
    }

    label {
      font-family: var(--select-font);
      font-size: var(--select-label-size);
      font-weight: var(--select-label-weight);
      color: var(--select-label-color);
      line-height: var(--line-height-base);
    }

    select {
      font-family: var(--select-font);
      font-size: var(--select-font-size);
      font-weight: var(--select-font-weight);
      color: var(--select-color);
      background-color: var(--select-bg);
      border: var(--select-border-width) solid var(--select-border-color);
      border-radius: var(--select-radius);
      padding: var(--select-padding);
      line-height: var(--line-height-base);
      width: 100%;
      box-sizing: border-box;
      cursor: pointer;
      transition: border-color var(--select-transition),
                  box-shadow var(--select-transition);
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23928374' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right var(--space-2) center;
      padding-right: var(--space-6);
    }

    select:focus {
      outline: none;
      border-color: var(--color-focus);
      box-shadow: var(--select-focus-ring);
    }

    select:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    :host([error]) label  { color: var(--select-error-color); }
    :host([error]) select { border-color: var(--select-error-color); }
    :host([error]) select:focus { box-shadow: 0 0 0 2px var(--select-error-color); }

    .error-message {
      display: none;
      font-family: var(--select-font);
      font-size: var(--select-label-size);
      color: var(--select-error-color);
      line-height: var(--line-height-base);
    }
    :host([error]) .error-message { display: block; }
  </style>

  <div class="wrapper">
    <label></label>
    <select></select>
    <span class="error-message"></span>
  </div>
`

class RSelect extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(template.content.cloneNode(true));
    this._label    = this.shadowRoot.querySelector('label');
    this._select   = this.shadowRoot.querySelector('select');
    this._errorMsg = this.shadowRoot.querySelector('.error-message');

    this._select.addEventListener('change', () => {
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: this._select.value },
        bubbles: true,
        composed: true
      }));
    });
  }

  static get observedAttributes() {
    return ['label', 'disabled', 'error', 'error-message'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'label')         this._label.textContent = newValue ?? '';
    if (name === 'disabled')      this._select.disabled = newValue !== null;
    if (name === 'error-message') this._errorMsg.textContent = newValue ?? '';
  }

  connectedCallback() {
    /* Move any <option>/<optgroup> children into the shadow select */
    this._moveOptions();
    this._observer = new MutationObserver(() => this._moveOptions());
    this._observer.observe(this, { childList: true });
  }

  get value() { return this._select.value; }
  set value(v) { this._select.value = v; }

  disconnectedCallback() {
    this._observer?.disconnect();
  }

  _moveOptions() {
    this._select.innerHTML = '';
    [...this.children].forEach(child => {
      if (child.tagName === 'OPTION' || child.tagName === 'OPTGROUP') {
        this._select.append(child.cloneNode(true));
      }
    });
  }
}

customElements.define('r-select', RSelect);
