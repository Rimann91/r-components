const cardTemplate = document.createElement('template')
cardTemplate.innerHTML = `
  <style> 
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
      --card-color-bg: var(--color-bg-primary);
      font-family: 'fira code', monospace;
    }
    .container {
      background-color: var(--card-color-bg);
      color: var(--color-fg-primary);
      border-radius: 4px;
      border: solid 1px var(--color-divider);
    }
    .header-slot {
      width: 100%;
      border-bottom: solid 1px var(--color-divider);
      display: flex;
      justify-content: space-between;
    }
    .title {
      padding: 8px;
      font-weight: 700;
      font-size: 16;
    }
    .header-right-slot {
      padding: 8px;
    }
    .content {
      padding: 8px;
    }
  </style>
<div class='container'>
  <slot name='header'>
    <div class="header-slot">
      <slot name='slot-left'>
        <div class='title'></div>
      </slot>
      <div class='header-right-slot'>
        <slot name='header-slot-right'></slot>
      </div>
    </div>
  </slot>
  <div class='content'>
    <slot></slot>
  </div>
</div>

`

class RCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(cardTemplate.content.cloneNode(true))
    this._title = this.shadowRoot.querySelector('.title')
  }

  static get observedAttributes(){
    return ['title']
  } 

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'title') {
      this._updateTitle(newValue)
    }
  }

  _updateTitle(value) {
    this._title.textContent = value ?? ''
  }
}

customElements.define('r-card', RCard)
