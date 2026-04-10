const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;

      /* Exposed vars */
      --card-bg:          var(--color-bg-primary);
      --card-border-color: var(--color-divider);
      --card-radius:      var(--radius);
      --card-padding:     var(--space-2);
      --card-font-size:   var(--text-base);
      --card-title-size:  var(--text-xl);
      --card-title-weight: var(--font-weight-bold);
    }

    .container {
      background-color: var(--card-bg);
      color: var(--color-fg-primary);
      border-radius: var(--card-radius);
      border: solid 1px var(--card-border-color);
      font-family: var(--font-body, "Fira Code", monospace);
      font-size: var(--card-font-size);
    }
    .header-slot {
      width: 100%;
      border-bottom: solid 1px var(--card-border-color);
      display: flex;
      justify-content: space-between;
    }
    .title {
      padding: var(--card-padding);
      font-weight: var(--card-title-weight);
      font-size: var(--card-title-size);
      line-height: var(--line-height-tight);
    }
    .header-right-slot {
      padding: var(--card-padding);
    }
    .content {
      padding: var(--card-padding);
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
    this.shadowRoot.append(template.content.cloneNode(true))
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
