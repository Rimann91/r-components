const textTemplate = document.createElement('template')
textTemplate.innerHTML = `
 <style>
  :host {
    --font-body: "Fira Code", monospace;
    --text-base: 1rem;
    --text-sm: 0.875rem;
    --text-muted: var(--color-gray-300);
  }
  :host([inline]) {
    display: inline;
  }
  :host([muted]) {
    color: var(--text-muted, var(--color-gray-300));
  }
  :host([size="small"]) {
    font-size: 0.875em;
  }

  :host([size="base"]) {
    font-size: 1rem; 
  }

  :host([size="large"]) {
    font-size: 1.125rem;
  }

 </style> 
 <slot></slot>
`

class RText extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(textTemplate.content.cloneNode(true))
  }
}

customElements.define('r-text', RText)
