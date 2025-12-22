const template = document.createElement('template')
template.innerHTML = `
  <style> 
  :host { 
      display: block;
      --divider-color: var(--color-divider, #444);
      --divider-thickness: 1px;
      --divider-margin: 8px 0;
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
      margin: 0 var(--divider-margin, 8px);
    }
  </style>
<div class="divider" role="seperator"></div>`

class RDivider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(template.content.cloneNode(true))
  }
}

customElements.define('r-divider', RDivider)
