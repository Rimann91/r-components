const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      align-items: center;

      /* Exposed vars */
      --badge-font:        var(--font-body, "Fira Code", monospace);
      --badge-font-size:   var(--text-xs);
      --badge-font-weight: var(--font-weight-medium);
      --badge-padding:     0 var(--space-2);
      --badge-radius:      9999px;
      --badge-height:      20px;

      /* Colour slots — filled by default, overridden per variant */
      --badge-color: var(--color-bg-primary);
      --badge-bg:    var(--color-gray-500);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      height: var(--badge-height);
      padding: var(--badge-padding);
      border-radius: var(--badge-radius);
      background-color: var(--badge-bg);
      color: var(--badge-color);
      font-family: var(--badge-font);
      font-size: var(--badge-font-size);
      font-weight: var(--badge-font-weight);
      line-height: 1;
      white-space: nowrap;
    }

    :host([primary]) { --badge-bg: var(--color-primary-blue);   }
    :host([success]) { --badge-bg: var(--color-primary-green);  }
    :host([warning]) {
      --badge-bg:    var(--color-primary-yellow);
      --badge-color: var(--color-fg-dark);
    }
    :host([danger])  { --badge-bg: var(--color-primary-red);    }
    :host([neutral]) { --badge-bg: var(--color-gray-400);       }
  </style>
  <span class="badge"><slot></slot></span>
`

class RBadge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(template.content.cloneNode(true));
  }
}

customElements.define('r-badge', RBadge);
