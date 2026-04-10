const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      /* Exposed vars */
      --spinner-size:      20px;
      --spinner-thickness: 2px;
      --spinner-color:     var(--color-primary-blue);
      --spinner-track:     var(--color-gray-300);
      --spinner-duration:  800ms;
    }

    :host([size="sm"]) { --spinner-size: 14px; }
    :host([size="lg"]) { --spinner-size: 32px; }

    .track {
      width: var(--spinner-size);
      height: var(--spinner-size);
      border-radius: 50%;
      border: var(--spinner-thickness) solid var(--spinner-track);
      border-top-color: var(--spinner-color);
      animation: spin var(--spinner-duration) linear infinite;
      box-sizing: border-box;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
  <span class="track" role="status" aria-label="Loading"></span>
`

class RSpinner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(template.content.cloneNode(true));
  }
}

customElements.define('r-spinner', RSpinner);
