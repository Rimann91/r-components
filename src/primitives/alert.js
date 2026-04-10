const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;

      /* Exposed vars */
      --alert-font:         var(--font-body, "Fira Code", monospace);
      --alert-font-size:    var(--text-sm);
      --alert-padding:      var(--space-3) var(--space-4);
      --alert-radius:       var(--radius);
      --alert-border-width: 1px;
      --alert-transition:   var(--transition-base);

      /* Colour slots — set by variant */
      --alert-color:        var(--color-fg-primary);
      --alert-bg:           var(--color-bg-secondary, var(--color-gray-100));
      --alert-border-color: var(--color-divider);
    }

    :host([info]) {
      --alert-color:        var(--color-primary-blue);
      --alert-bg:           transparent;
      --alert-border-color: var(--color-primary-blue);
    }
    :host([success]) {
      --alert-color:        var(--color-primary-green);
      --alert-bg:           transparent;
      --alert-border-color: var(--color-primary-green);
    }
    :host([warning]) {
      --alert-color:        var(--color-primary-yellow);
      --alert-bg:           transparent;
      --alert-border-color: var(--color-primary-yellow);
    }
    :host([danger]) {
      --alert-color:        var(--color-primary-red);
      --alert-bg:           transparent;
      --alert-border-color: var(--color-primary-red);
    }

    .alert {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-3);
      padding: var(--alert-padding);
      border-radius: var(--alert-radius);
      border: var(--alert-border-width) solid var(--alert-border-color);
      background-color: var(--alert-bg);
      color: var(--alert-color);
      font-family: var(--alert-font);
      font-size: var(--alert-font-size);
      line-height: var(--line-height-base);
      box-sizing: border-box;
    }

    .content { flex: 1; }

    .dismiss {
      flex-shrink: 0;
      background: none;
      border: none;
      cursor: pointer;
      color: inherit;
      font-size: var(--text-base);
      line-height: 1;
      padding: 0;
      opacity: 0.7;
    }
    .dismiss:hover { opacity: 1; }
    .dismiss:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }

    :host(:not([dismissible])) .dismiss { display: none; }
  </style>

  <div class="alert" role="alert">
    <div class="content"><slot></slot></div>
    <button class="dismiss" aria-label="Dismiss">✕</button>
  </div>
`

class RAlert extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(template.content.cloneNode(true));
    this.shadowRoot.querySelector('.dismiss')
      .addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('dismiss', { bubbles: true, composed: true }));
        this.remove();
      });
  }
}

customElements.define('r-alert', RAlert);
