const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      box-sizing: border-box;

      /* Exposed vars — override these to customise any instance */
      --button-padding:      var(--space-1) var(--space-2);
      --button-radius:       var(--radius);
      --button-border-width: 1px;
      --button-font-size:    var(--text-sm);
      --button-font-weight:  var(--font-weight-normal);
      --button-transition:   var(--transition-fast);
      --button-focus-ring:   var(--focus-ring);

      /* Colour slots (reference global palette tokens) */
      --button-color-primary:       var(--color-primary-blue);
      --button-color-primary-hover: var(--color-secondary-blue);

      --button-color-secondary:       var(--color-fg-primary);
      --button-color-secondary-hover: var(--color-gray-600);

      --button-color-success:       var(--color-primary-green);
      --button-color-success-hover: var(--color-secondary-green);

      --button-color-danger:       var(--color-primary-red);
      --button-color-danger-hover: var(--color-secondary-red);

      --button-bg-hollow: var(--color-bg-primary);
      --button-bg-ghost:  transparent;
    }

    button {
      border-width: var(--button-border-width);
      border-radius: var(--button-radius);
      border-style: solid;
      padding: var(--button-padding);
      cursor: pointer;
      font-family: var(--font-body, "Fira Code", monospace);
      font-size: var(--button-font-size);
      font-weight: var(--button-font-weight);
      line-height: var(--line-height-tight);
      transition: background-color var(--button-transition),
                  color var(--button-transition),
                  border-color var(--button-transition);
    }
    button:focus-visible {
      outline: none;
      box-shadow: var(--button-focus-ring);
    }

    :host([primary]) button {
      color: var(--button-color-primary);
      background-color: var(--button-bg-hollow);
      border-color: var(--button-color-primary);
    }
    :host([primary]) button:hover {
      background-color: var(--button-color-primary-hover);
      border-color: var(--button-color-primary-hover);
      color: var(--color-bg-primary);
    }

    :host([secondary]) button {
      color: var(--button-color-secondary);
      background-color: var(--button-bg-hollow);
      border-color: var(--button-color-secondary);
    }
    :host([secondary]) button:hover {
      color: var(--color-bg-primary);
      border-color: var(--button-color-secondary);
      background-color: var(--button-color-secondary-hover);
    }

    :host([tertiary]) button {
      color: var(--color-fg-primary);
      background-color: var(--color-bg-primary);
      border-color: var(--color-gray-300);
    }
    :host([tertiary]) button:hover {
      background-color: var(--color-gray-200);
    }

    :host([ghost]) button {
      color: var(--color-fg-primary);
      background-color: var(--button-bg-ghost);
      border-color: var(--color-gray-300);
    }
    :host([ghost]) button:hover {
      background-color: var(--color-bg-hover);
    }

    :host([success]) button {
      color: var(--button-color-success);
      background-color: var(--button-bg-hollow);
      border-color: var(--button-color-success);
    }
    :host([success]) button:hover {
      background-color: var(--button-color-success-hover);
      color: var(--color-bg-primary);
    }

    :host([danger]) button {
      color: var(--button-color-danger);
      background-color: var(--button-bg-hollow);
      border-color: var(--button-color-danger);
    }
    :host([danger]) button:hover {
      background-color: var(--button-color-danger-hover);
      color: var(--color-bg-primary);
    }
  </style>

  <button>
    <slot>Button</slot>
    <slot name="symbol"></slot>
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
