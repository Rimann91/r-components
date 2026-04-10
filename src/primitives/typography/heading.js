const template = document.createElement('template')
template.innerHTML = `
 <style>
  :host {
    /* Exposed vars */
    --heading-font:        var(--font-body, "Fira Code", monospace);
    --heading-color:       var(--color-fg-primary);
    --heading-line-height: var(--line-height-base);
    --heading-margin:      var(--space-2) 0;

    --heading-size-1:   var(--text-3xl);
    --heading-size-2:   var(--text-2xl);
    --heading-size-3:   var(--text-xl);
    --heading-size-4:   var(--text-base);

    --heading-weight-1: var(--font-weight-bold);
    --heading-weight-2: var(--font-weight-semibold);

    display: block;
    font-family: var(--heading-font);
    color: var(--heading-color);
    line-height: var(--heading-line-height);
  }
  :host([one])   { font-size: var(--heading-size-1); font-weight: var(--heading-weight-1); }
  :host([two])   { font-size: var(--heading-size-2); font-weight: var(--heading-weight-1); }
  :host([three]) { font-size: var(--heading-size-3); font-weight: var(--heading-weight-2); }
  :host([four])  { font-size: var(--heading-size-4); font-weight: var(--heading-weight-2); }

  .container {
    margin: var(--heading-margin);
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
