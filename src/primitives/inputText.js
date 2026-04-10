const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      box-sizing: border-box;

      /* Exposed vars */
      --input-font:         var(--font-body, "Fira Code", monospace);
      --input-font-size:    var(--text-sm);
      --input-font-weight:  var(--font-weight-normal);
      --input-radius:       var(--radius);
      --input-padding:      var(--space-1) var(--space-2);
      --input-bg:           var(--color-bg-primary);
      --input-color:        var(--color-fg-primary);
      --input-border-color: var(--color-divider);
      --input-border-width: 1px;
      --input-focus-ring:   var(--focus-ring);
      --input-transition:   var(--transition-fast);

      --input-label-size:   var(--text-xs);
      --input-label-color:  var(--color-gray-500);
      --input-label-weight: var(--font-weight-medium);
      --input-label-gap:    var(--space-1);

      --input-error-color:  var(--color-primary-red);
      --input-placeholder-color: var(--color-gray-400);
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--input-label-gap);
    }

    label {
      font-family: var(--input-font);
      font-size: var(--input-label-size);
      font-weight: var(--input-label-weight);
      color: var(--input-label-color);
      line-height: var(--line-height-base);
    }

    input {
      font-family: var(--input-font);
      font-size: var(--input-font-size);
      font-weight: var(--input-font-weight);
      color: var(--input-color);
      background-color: var(--input-bg);
      border: var(--input-border-width) solid var(--input-border-color);
      border-radius: var(--input-radius);
      padding: var(--input-padding);
      line-height: var(--line-height-base);
      width: 100%;
      box-sizing: border-box;
      transition: border-color var(--input-transition),
                  box-shadow var(--input-transition);
    }

    input::placeholder {
      color: var(--input-placeholder-color);
    }

    input:focus {
      outline: none;
      border-color: var(--color-focus);
      box-shadow: var(--input-focus-ring);
    }

    input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Error state */
    :host([error]) label {
      color: var(--input-error-color);
    }
    :host([error]) input {
      border-color: var(--input-error-color);
    }
    :host([error]) input:focus {
      box-shadow: 0 0 0 2px var(--input-error-color);
    }

    .error-message {
      display: none;
      font-family: var(--input-font);
      font-size: var(--input-label-size);
      color: var(--input-error-color);
      line-height: var(--line-height-base);
    }
    :host([error]) .error-message {
      display: block;
    }
  </style>

  <div class="wrapper">
    <label></label>
    <input type="text" />
    <span class="error-message"></span>
  </div>
`

class RInputText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(template.content.cloneNode(true));
    this._label = this.shadowRoot.querySelector('label');
    this._input = this.shadowRoot.querySelector('input');
    this._errorMsg = this.shadowRoot.querySelector('.error-message');
  }

  static get observedAttributes() {
    return ['label', 'placeholder', 'value', 'disabled', 'error', 'error-message'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'label')         this._label.textContent = newValue ?? '';
    if (name === 'placeholder')   this._input.placeholder = newValue ?? '';
    if (name === 'value')         this._input.value = newValue ?? '';
    if (name === 'disabled')      this._input.disabled = newValue !== null;
    if (name === 'error-message') this._errorMsg.textContent = newValue ?? '';
  }
}

customElements.define('r-input-text', RInputText);
