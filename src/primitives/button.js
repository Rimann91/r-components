const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host{
      display: block;
      box-sizing: border-box;
      --button-border-width: 1px;
      --button-padding: 4px;
      --button-radius: 2px;
      --button-font-weight: 400;
      --button-font-size: 14px;
      --color-background-hollow: var(--color-background-primary);

      --color-button-primary: var(--color-primary-blue);
      --color-button-hover-primary: var(--color-secondary-blue);

      --color-button-secondary: var(--color-fg-primary);
      --color-button-hover-secondary: var(--color-gray-600);

      --color-button-tertiary: var(--color-bg-primary);
      --color-button-hover-tertiary: var(--color-gray-200);

      --color-button-success: var(--color-primary-green);
      --color-button-hover-success: var(--color-secondary-green);

      --color-button-danger: var(--color-primary-red);
      --color-button-hover-danger: var(--color-secondary-red);

    }
    :host([primary]) button {
      color: var(--color-button-primary);
      background-color: var(--color-background-hollow);
      border-color: var(--color-button-primary);
    }
    :host([primary]) button:hover {
      background-color: var(--color-button-hover-primary);
      border-color: var(--color-button-primary);
      color: var(--color-bg-primary);
    }
    :host([secondary]) button {
      background-color: var(--color-background-hollow);
      color: var(--color-button-secondary);
      border-color: var(--color-button-secondary);
    }
    :host([secondary]) button:hover {
      color: var(--color-bg-primary);
      border-color: var(--color-button-secondary);
      background-color: var(--color-button-hover-secondary);
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
      color: var(--color-button-success);
      background-color: var(--color-background-hollow);
      border-color: var(--color-button-success);
    }
    :host([success]) button:hover {
      background-color: var(--color-button-hover-success);
      color: var(--color-bg-primary);
    }
    :host([danger]) button {
      color: var(--color-button-danger);
      background-color: var(--color-background-hollow);
      border-color: var(--color-button-danger);
    }
    :host([danger]) button:hover {
      background-color: var(--color-button-hover-danger);
      color: var(--color-bg-primary);
    }
    button {
      border-width: var(--button-border-width);
      border-radius: var(--button-radius);
      border-style: solid;
      padding: var(--button-padding);
      cursor: pointer;
      font-family: 'fira code', monospace;
      font-size: var(--button-font-size);
      font-weight: var(--botton-font-weight);
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
