const collapseTemplate = document.createElement('template')
collapseTemplate.innerHTML = `
  <style> 
    :host {
      display: block;
      box-sizing: border-box;
      font-family: 'fira code', monospace;
    }
    .container{
      display: grid;
      overflow: hidden;
      transition: grid-template-rows 250ms ease;
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
    console.log('collapse constructed');
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(collapseTemplate.content.cloneNode(true))
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

