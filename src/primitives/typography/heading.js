const template = document.createElement('template')
template.innerHTML = `
 <style>
  :host {
    --font-body: "Fira Code", monospace;
    --heading-size-1: 1.75rem;
    --heading-size-2: 1.50rem;
    --heading-size-3: 1.25rem;
    --heading-size-4: 1rem;
    --text-small: 0.875rem;
    --text-large: 1.123rem;
    --heading-color: var(--color-fg-primary);
    --heading-weight-1: 700;
    --heading-weight-2: 600;
    --heading-line-height: 1.5;
    --vertical-margin: 8px;
    font-family: var(--font-body, "Fira Code", monospace);
  }
  :host([one]) {
    font-size: var(--heading-size-1);
    color: var(--heading-color);
    font-weight: var(--heading-weight-1);
    line-height: var(--heading-line-height);
  }
  :host([two]) {
    font-size: var(--heading-size-2);
    color: var(--heading-color);
    font-weight: var(--heading-weight-1);
    line-height: var(--heading-line-height);
  }
  :host([three]) {
    font-size: var(--heading-size-3);
    color: var(--heading-color);
    font-weight: var(--heading-weight-2);
    line-height: var(--heading-line-height);
  }
  :host([four]) {
    font-size: var(--heading-size-4);
    color: var(--heading-color);
    font-weight: var(--heading-weight-2);
    line-height: var(--heading-line-height);
  }
  .container {
    margin-top: var(--vertical-margin);
    margin-bottom: var(--vertical-margin);
  }
 </style> 
 <div class="container">
   <slot></slot>
 </div>
`

class RHeading extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(template.content.cloneNode(true))
  }
}

customElements.define('r-heading', RHeading)
