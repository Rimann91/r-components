const template = document.createElement('template')
template.innerHTML = `
 <style>
  :host {
    /* Exposed vars */
    --text-font:              var(--font-body, "Fira Code", monospace);
    --text-color:             var(--color-fg-primary);
    --text-size:              var(--text-base);
    --text-weight:            var(--font-weight-medium);
    --text-line-height:       var(--line-height-tight);
    --text-color-muted:       var(--color-gray-300);
    --text-color-emphasized:  var(--color-gray-800);
    --text-weight-emphasized: var(--font-weight-bold);

    display: block;
    font-family: var(--text-font);
    font-weight: var(--text-weight);
    font-size: var(--text-size);
    color: var(--text-color);
    line-height: var(--text-line-height);
  }
  :host([inline])     { display: inline; }
  :host([muted])      { color: var(--text-color-muted); }
  :host([emphasized]) { color: var(--text-color-emphasized); font-weight: var(--text-weight-emphasized); }
  :host([size="small"])  { font-size: var(--text-sm); }
  :host([size="base"])   { font-size: var(--text-base); }
  :host([size="large"])  { font-size: var(--text-lg); }
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
