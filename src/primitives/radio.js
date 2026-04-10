const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--radio-gap);
      cursor: pointer;

      /* Exposed vars */
      --radio-size:         16px;
      --radio-bg:           var(--color-bg-primary);
      --radio-color:        var(--color-primary-blue);
      --radio-border-color: var(--color-divider);
      --radio-border-width: 1px;
      --radio-focus-ring:   var(--focus-ring);
      --radio-transition:   var(--transition-fast);
      --radio-gap:          var(--space-2);

      --radio-label-font:   var(--font-body, "Fira Code", monospace);
      --radio-label-size:   var(--text-sm);
      --radio-label-color:  var(--color-fg-primary);
      --radio-label-weight: var(--font-weight-normal);
    }

    :host([disabled]) {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    input[type="radio"] {
      appearance: none;
      width: var(--radio-size);
      height: var(--radio-size);
      min-width: var(--radio-size);
      border: var(--radio-border-width) solid var(--radio-border-color);
      border-radius: 50%;
      background-color: var(--radio-bg);
      cursor: pointer;
      transition: background-color var(--radio-transition),
                  border-color var(--radio-transition);
      display: grid;
      place-content: center;
      box-sizing: border-box;
    }

    input[type="radio"]::before {
      content: '';
      width: calc(var(--radio-size) * 0.45);
      height: calc(var(--radio-size) * 0.45);
      border-radius: 50%;
      background-color: var(--color-bg-primary);
      transform: scale(0);
      transition: transform var(--radio-transition);
    }

    input[type="radio"]:checked {
      background-color: var(--radio-color);
      border-color: var(--radio-color);
    }

    input[type="radio"]:checked::before {
      transform: scale(1);
    }

    input[type="radio"]:focus-visible {
      outline: none;
      box-shadow: var(--radio-focus-ring);
    }

    label {
      font-family: var(--radio-label-font);
      font-size: var(--radio-label-size);
      font-weight: var(--radio-label-weight);
      color: var(--radio-label-color);
      cursor: pointer;
      line-height: var(--line-height-base);
      user-select: none;
    }
  </style>

  <input type="radio" id="rb" />
  <label for="rb"><slot></slot></label>
`

class RRadio extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(template.content.cloneNode(true));
    this._input = this.shadowRoot.querySelector('input');
    this._input.addEventListener('change', () => {
      if (this._input.checked) {
        this.setAttribute('checked', '');
        this._uncheckSiblings();
      }
      this.dispatchEvent(new CustomEvent('change', {
        detail: { checked: this._input.checked, value: this._input.value },
        bubbles: true,
        composed: true
      }));
    });
  }

  /* Deselect other r-radio elements sharing the same name in the same root */
  _uncheckSiblings() {
    const name = this.getAttribute('name');
    if (!name) return;
    const root = this.getRootNode();
    root.querySelectorAll(`r-radio[name="${name}"]`).forEach(radio => {
      if (radio !== this) radio.removeAttribute('checked');
    });
  }

  static get observedAttributes() {
    return ['checked', 'disabled', 'name', 'value'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'checked')  this._input.checked  = newValue !== null;
    if (name === 'disabled') this._input.disabled = newValue !== null;
    if (name === 'name')     this._input.name     = newValue ?? '';
    if (name === 'value')    this._input.value    = newValue ?? '';
  }

  get checked() { return this._input.checked; }
}

customElements.define('r-radio', RRadio);
