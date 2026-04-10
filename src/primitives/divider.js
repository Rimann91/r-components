const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;

      /* Exposed vars */
      --divider-color:     var(--color-divider);
      --divider-thickness: 1px;
      --divider-margin:    var(--space-2) 0;
    }

    .divider {
      background-color: var(--divider-color);
    }

    :host(:not([vertical])) .divider {
      width: 100%;
      height: var(--divider-thickness);
      margin: var(--divider-margin);
    }

    :host([vertical]) .divider {
      width: var(--divider-thickness);
      height: 100%;
      margin: 0 var(--space-2);
    }
  </style>
<div class="divider" role="separator"></div>`

class RDivider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(template.content.cloneNode(true))
  }
}

customElements.define('r-divider', RDivider)
