const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      /* Exposed vars */
      --modal-font:          var(--font-body, "Fira Code", monospace);
      --modal-bg:            var(--color-bg-primary);
      --modal-color:         var(--color-fg-primary);
      --modal-border-color:  var(--color-divider);
      --modal-radius:        var(--radius);
      --modal-padding:       var(--space-4);
      --modal-width:         480px;
      --modal-max-width:     90vw;
      --modal-shadow:        var(--shadow-lg);
      --modal-transition:    var(--transition-base);
      --modal-overlay-bg:    rgba(0, 0, 0, 0.5);
      --modal-title-size:    var(--text-xl);
      --modal-title-weight:  var(--font-weight-bold);
      --modal-focus-ring:    var(--focus-ring);
    }

    /* Overlay — uses <dialog> backdrop */
    dialog {
      padding: 0;
      border: none;
      border-radius: var(--modal-radius);
      background: var(--modal-bg);
      color: var(--modal-color);
      box-shadow: var(--modal-shadow);
      width: var(--modal-width);
      max-width: var(--modal-max-width);
      font-family: var(--modal-font);
    }

    dialog::backdrop {
      background-color: var(--modal-overlay-bg);
    }

    .modal-inner {
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--modal-padding);
      border-bottom: 1px solid var(--modal-border-color);
    }

    .modal-title {
      font-size: var(--modal-title-size);
      font-weight: var(--modal-title-weight);
      line-height: var(--line-height-tight);
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-gray-500);
      font-size: var(--text-lg);
      line-height: 1;
      padding: var(--space-1);
      border-radius: var(--modal-radius);
      transition: color var(--modal-transition),
                  background-color var(--modal-transition);
    }
    .close-btn:hover {
      color: var(--modal-color);
      background-color: var(--color-gray-200);
    }
    .close-btn:focus-visible {
      outline: none;
      box-shadow: var(--modal-focus-ring);
    }

    .modal-body {
      padding: var(--modal-padding);
      line-height: var(--line-height-base);
    }

    .modal-footer {
      padding: var(--modal-padding);
      border-top: 1px solid var(--modal-border-color);
      display: none;
    }
  </style>

  <dialog part="dialog">
    <div class="modal-inner">
      <div class="modal-header">
        <span class="modal-title"></span>
        <button class="close-btn" aria-label="Close">✕</button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </dialog>
`

class RModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(template.content.cloneNode(true));
    this._dialog = this.shadowRoot.querySelector('dialog');
    this._title  = this.shadowRoot.querySelector('.modal-title');
    this._footer = this.shadowRoot.querySelector('.modal-footer');

    /* Show footer only when content is slotted into it */
    const footerSlot = this.shadowRoot.querySelector('slot[name="footer"]');
    footerSlot.addEventListener('slotchange', () => {
      const hasContent = footerSlot.assignedElements({ flatten: true }).length > 0;
      this._footer.style.display = hasContent ? '' : 'none';
    });

    this.shadowRoot.querySelector('.close-btn').addEventListener('click', () => this.close());

    /* Close on backdrop click */
    this._dialog.addEventListener('click', e => {
      const rect = this._dialog.getBoundingClientRect();
      const clickedBackdrop = e.clientX < rect.left || e.clientX > rect.right ||
                              e.clientY < rect.top  || e.clientY > rect.bottom;
      if (clickedBackdrop) this.close();
    });

    /* Close on Escape (dialog handles this natively, but we sync the attribute) */
    this._dialog.addEventListener('close', () => this.removeAttribute('open'));
  }

  static get observedAttributes() {
    return ['open', 'title'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'title') this._title.textContent = newValue ?? '';
    if (name === 'open') {
      if (newValue !== null) {
        this._dialog.showModal();
      } else {
        if (this._dialog.open) this._dialog.close();
      }
    }
  }

  open() {
    this.setAttribute('open', '');
    this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
  }

  close() {
    this.removeAttribute('open');
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }
}

customElements.define('r-modal', RModal);
