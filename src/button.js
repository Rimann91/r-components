const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host{
      display: block;
      box-sizing: border-box;
    }
    :host([primary]) button {
      color: var(--color-bg-primary);
      background-color: var(--color-primary-blue);
      border-color: var(--color-primary-blue);
    }
    :host([primary]) button:hover {
      background-color: var(--color-secondary-blue);
      border-color: var(--color-primary-blue);
    }
    :host([secondary]) button {
      color: var(--color-bg-primary);
      background-color: var(--color-fg-primary);
      border-color: var(--color-fg-primary);
    }
    :host([secondary]) button:hover {
      background-color: var(--color-gray-800);
    }
    :host([tertiary]) button {
      color: var(--color-fg-primary);
      background-color: var(--color-bg-primary);
      border-color: var(--color-gray-300);
    }
    :host([tertiary]) button:hover {
      background-color: var(--color-gray-200);
    }
    :host([success]) button {
      color: var(--color-fg-dark);
      background-color: var(--color-primary-green);
      border-color: var(--color-primary-green);
    }
    :host([success]) button:hover {
      background-color: var(--color-secondary-green);
    }
    :host([danger]) button {
      color: var(--color-fg-dark);
      background-color: var(--color-primary-red);
      border-color: var(--color-primary-red);
    }
    :host([danger]) button:hover {
      background-color: var(--color-secondary-red);
    }
    button {
      border-width: 3px;
      border-radius: 4px;
      cursor: pointer;
      font-family: 'fira code', monospace;
      font-size: 14px;
      font-weight: 500;
      line-height: 16px;
    }
  </style>

  <button>
    <slot>Button</slot>
    <slot name="symbol">
    </slot>
  </button>
`
class RButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open"});
    this.shadowRoot.append(template.content.cloneNode(true))
  }
}

customElements.define('r-button', RButton);
