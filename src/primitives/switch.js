const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--switch-gap);
      cursor: pointer;

      /* Exposed vars */
      --switch-width:       36px;
      --switch-height:      20px;
      --switch-radius:      10px;
      --switch-thumb-size:  14px;
      --switch-thumb-color: var(--color-bg-primary);
      --switch-bg-off:      var(--color-gray-400);
      --switch-bg-on:       var(--color-primary-blue);
      --switch-transition:  var(--transition-fast);
      --switch-focus-ring:  var(--focus-ring);
      --switch-gap:         var(--space-2);

      --switch-label-font:   var(--font-body, "Fira Code", monospace);
      --switch-label-size:   var(--text-sm);
      --switch-label-color:  var(--color-fg-primary);
      --switch-label-weight: var(--font-weight-normal);
    }

    :host([disabled]) {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Visually hidden real checkbox for accessibility */
    input[type="checkbox"] {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      pointer-events: none;
    }

    .track {
      position: relative;
      width: var(--switch-width);
      height: var(--switch-height);
      min-width: var(--switch-width);
      border-radius: var(--switch-radius);
      background-color: var(--switch-bg-off);
      transition: background-color var(--switch-transition);
      box-sizing: border-box;
    }

    .thumb {
      position: absolute;
      top: 50%;
      left: 3px;
      width: var(--switch-thumb-size);
      height: var(--switch-thumb-size);
      border-radius: 50%;
      background-color: var(--switch-thumb-color);
      transform: translateY(-50%);
      transition: left var(--switch-transition);
    }

    :host([checked]) .track {
      background-color: var(--switch-bg-on);
    }
    :host([checked]) .thumb {
      left: calc(var(--switch-width) - var(--switch-thumb-size) - 3px);
    }

    input[type="checkbox"]:focus-visible ~ .track {
      box-shadow: var(--switch-focus-ring);
    }

    label {
      font-family: var(--switch-label-font);
      font-size: var(--switch-label-size);
      font-weight: var(--switch-label-weight);
      color: var(--switch-label-color);
      cursor: pointer;
      line-height: var(--line-height-base);
      user-select: none;
    }
  </style>

  <input type="checkbox" id="sw" />
  <div class="track" role="switch" tabindex="0" aria-checked="false">
    <div class="thumb"></div>
  </div>
  <label for="sw"><slot></slot></label>
`

class RSwitch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(template.content.cloneNode(true));
    this._input = this.shadowRoot.querySelector('input');
    this._track = this.shadowRoot.querySelector('.track');

    const toggle = () => {
      if (this.hasAttribute('disabled')) return;
      this.checked = !this.checked;
      this.dispatchEvent(new CustomEvent('change', {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true
      }));
    };

    this._track.addEventListener('click', toggle);
    this._track.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
    });
  }

  static get observedAttributes() {
    return ['checked', 'disabled'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'checked') {
      const isChecked = newValue !== null;
      this._input.checked = isChecked;
      this._track.setAttribute('aria-checked', String(isChecked));
    }
    if (name === 'disabled') {
      this._input.disabled = newValue !== null;
      this._track.setAttribute('aria-disabled', String(newValue !== null));
    }
  }

  get checked() { return this.hasAttribute('checked'); }
  set checked(v) {
    v ? this.setAttribute('checked', '') : this.removeAttribute('checked');
  }
}

customElements.define('r-switch', RSwitch);
