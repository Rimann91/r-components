const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      box-sizing: border-box;

      /* Exposed vars */
      --collapse-transition: var(--transition-base);
    }

    .container {
      display: grid;
      overflow: hidden;
      transition: grid-template-rows var(--collapse-transition);
      grid-template-rows: 0fr;
    }
    :host([open]) .container {
      grid-template-rows: 1fr;
    }
    .content {
      overflow: hidden;
      min-height: 0;
    }
  </style>
<div class='container'>
  <div class='content'>
    <slot></slot>
  </div>
</div>

`

class RCollapse extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(template.content.cloneNode(true))
  }

  open(){
    this.setAttribute('open', '');
  }

  close(){
    this.removeAttribute('open');
  }

  toggle() {
    this.toggleAttribute('open');
  }
}

customElements.define('r-collapse', RCollapse)

