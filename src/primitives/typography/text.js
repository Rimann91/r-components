const template = document.createElement('template')
template.innerHTML = `
 <style>
  :host {
    --font-body: "Fira Code", monospace;
    --text-base: 1rem;
    --text-small: 0.875rem;
    --text-large: 1.123rem;
    --text-muted: var(--color-gray-300);
    --text-emphasized: var(--color-gray-800);
    --text-emphasized-weight: 700;
    --text-line-height: 1.25;
    font-family: var(--font-body, "Fira Code", monospace);
    font-weight: 500;
    font-size: var(--text-base);
    color: var(--color-fg-primary);
    line-height: var(--text-line-height);
  }
  :host([inline]) {
    display: inline;
  }
  :host([muted]) {
    color: var(--text-muted, var(--color-gray-300));
  }
  :host([emphasized]) {
    color: var(--text-emphasized, var(--color-gray-500));
    font-weight: var(--text-emphasized-weight, 700);
  }
  :host([size="small"]) {
    font-size: var(--text-small);
  }

  :host([size="base"]) {
    font-size: var(--text-base); 
  }

  :host([size="large"]) {
    font-size: var(--text-large);
  }

 </style> 
 <slot></slot>
`

class RText extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(template.content.cloneNode(true))
  }
}

customElements.define('r-text', RText)
