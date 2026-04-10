const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--checkbox-gap);
      cursor: pointer;

      /* Exposed vars */
      --checkbox-size:         16px;
      --checkbox-radius:       calc(var(--radius) / 2);
      --checkbox-bg:           var(--color-bg-primary);
      --checkbox-color:        var(--color-primary-blue);
      --checkbox-border-color: var(--color-divider);
      --checkbox-border-width: 1px;
      --checkbox-focus-ring:   var(--focus-ring);
      --checkbox-transition:   var(--transition-fast);
      --checkbox-gap:          var(--space-2);

      --checkbox-label-font:   var(--font-body, "Fira Code", monospace);
      --checkbox-label-size:   var(--text-sm);
      --checkbox-label-color:  var(--color-fg-primary);
      --checkbox-label-weight: var(--font-weight-normal);
    }

    :host([disabled]) {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    input[type="checkbox"] {
      appearance: none;
      width: var(--checkbox-size);
      height: var(--checkbox-size);
      min-width: var(--checkbox-size);
      border: var(--checkbox-border-width) solid var(--checkbox-border-color);
      border-radius: var(--checkbox-radius);
      background-color: var(--checkbox-bg);
      cursor: pointer;
      transition: background-color var(--checkbox-transition),
                  border-color var(--checkbox-transition);
      display: grid;
      place-content: center;
      box-sizing: border-box;
    }

    input[type="checkbox"]::before {
      content: '';
      width: calc(var(--checkbox-size) * 0.5);
      height: calc(var(--checkbox-size) * 0.5);
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      background-color: var(--color-bg-primary);
      transform: scale(0);
      transition: transform var(--checkbox-transition);
    }

    input[type="checkbox"]:checked {
      background-color: var(--checkbox-color);
      border-color: var(--checkbox-color);
    }

    input[type="checkbox"]:checked::before {
      transform: scale(1);
    }

    input[type="checkbox"]:focus-visible {
      outline: none;
      box-shadow: var(--checkbox-focus-ring);
    }

    label {
      font-family: var(--checkbox-label-font);
      font-size: var(--checkbox-label-size);
      font-weight: var(--checkbox-label-weight);
      color: var(--checkbox-label-color);
      cursor: pointer;
      line-height: var(--line-height-base);
      user-select: none;
    }
  </style>

  <input type="checkbox" id="cb" />
  <label for="cb"><slot></slot></label>
`

class RCheckbox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(template.content.cloneNode(true));
    this._input = this.shadowRoot.querySelector('input');
    this._input.addEventListener('change', () => {
      if (this._input.checked) {
        this.setAttribute('checked', '');
      } else {
        this.removeAttribute('checked');
      }
      this.dispatchEvent(new CustomEvent('change', {
        detail: { checked: this._input.checked },
        bubbles: true,
        composed: true
      }));
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
  set checked(v) {
    this._input.checked = v;
    v ? this.setAttribute('checked', '') : this.removeAttribute('checked');
  }
}

customElements.define('r-checkbox', RCheckbox);
