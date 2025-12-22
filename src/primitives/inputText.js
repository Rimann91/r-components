const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host{
      display: block;
      box-sizing: border-box;
      --button-border-width: 1px;
      --button-padding: 4px;
      --button-radius: 2px;
      --button-font-weight: 400;
      --button-font-size: 14px;
      --color-background-hollow: var(--color-background-primary);

      --color-button-primary: var(--color-primary-blue);
      --color-button-hover-primary: var(--color-secondary-blue);


    }
    input {
      font-family: 'fira code', monospace;
      font-size: 14px;
      font-weight: 700;
      line-height: 1.5;
      border-radius: 2px;
      border-color: var(--color-primary-blue);
      background-color: var(--color-gray-900);
    }
  </style>

  <label></label>
  <input type="text"></input>
`
class RInputText extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open"});
    this.shadowRoot.append(template.content.cloneNode(true))
    this._label = this.shadowRoot.querySelector('label')
  }

  static get observedAttributes(){
    return ['label']
  } 

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'label') {
      this._updateLabel(newValue)
    }
  }

  _updateLabel(value) {
    this._label.textContent = value ?? ''
  }
}

customElements.define('r-input-text', RInputText);
