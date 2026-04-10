const toastTemplate = document.createElement('template')
toastTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      pointer-events: auto;

      /* Exposed vars */
      --toast-font:         var(--font-body, "Fira Code", monospace);
      --toast-font-size:    var(--text-sm);
      --toast-padding:      var(--space-3) var(--space-4);
      --toast-radius:       var(--radius);
      --toast-min-width:    260px;
      --toast-max-width:    380px;
      --toast-shadow:       var(--shadow-lg);
      --toast-duration:     250ms;

      /* Colour slots */
      --toast-color:        var(--color-fg-primary);
      --toast-bg:           var(--color-bg-primary);
      --toast-border-color: var(--color-divider);
      --toast-border-width: 1px;
    }

    :host([info])    {
      --toast-border-color: var(--color-primary-blue);
      --toast-color: var(--color-primary-blue);
    }
    :host([success]) {
      --toast-border-color: var(--color-primary-green);
      --toast-color: var(--color-primary-green);
    }
    :host([warning]) {
      --toast-border-color: var(--color-primary-yellow);
      --toast-color: var(--color-primary-yellow);
    }
    :host([danger])  {
      --toast-border-color: var(--color-primary-red);
      --toast-color: var(--color-primary-red);
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      min-width: var(--toast-min-width);
      max-width: var(--toast-max-width);
      padding: var(--toast-padding);
      background-color: var(--toast-bg);
      color: var(--toast-color);
      border: var(--toast-border-width) solid var(--toast-border-color);
      border-radius: var(--toast-radius);
      box-shadow: var(--toast-shadow);
      font-family: var(--toast-font);
      font-size: var(--toast-font-size);
      line-height: var(--line-height-base);
      box-sizing: border-box;

      /* Slide-in from right */
      animation: slide-in var(--toast-duration) ease forwards;
    }

    .toast.dismissing {
      animation: slide-out var(--toast-duration) ease forwards;
    }

    @keyframes slide-in {
      from { opacity: 0; transform: translateX(calc(100% + 16px)); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes slide-out {
      from { opacity: 1; transform: translateX(0); }
      to   { opacity: 0; transform: translateX(calc(100% + 16px)); }
    }

    .message { flex: 1; }

    .dismiss {
      flex-shrink: 0;
      background: none;
      border: none;
      cursor: pointer;
      color: inherit;
      opacity: 0.6;
      font-size: var(--text-base);
      line-height: 1;
      padding: 0;
    }
    .dismiss:hover { opacity: 1; }
    .dismiss:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
      border-radius: 2px;
    }
  </style>

  <div class="toast" role="status" aria-live="polite">
    <span class="message"></span>
    <button class="dismiss" aria-label="Dismiss">✕</button>
  </div>
`

class RToast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(toastTemplate.content.cloneNode(true));
    this._toast   = this.shadowRoot.querySelector('.toast');
    this._message = this.shadowRoot.querySelector('.message');

    this.shadowRoot.querySelector('.dismiss').addEventListener('click', () => this._dismiss());
  }

  static get observedAttributes() {
    return ['message'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'message') this._message.textContent = newValue ?? '';
  }

  _dismiss() {
    this._toast.classList.add('dismissing');
    // Fallback: remove after animation duration + buffer in case animationend misfires
    const fallback = setTimeout(() => {
      this.dispatchEvent(new CustomEvent('dismiss', { bubbles: true, composed: true }));
      this.remove();
    }, 400);
    this._toast.addEventListener('animationend', () => {
      clearTimeout(fallback);
      this.dispatchEvent(new CustomEvent('dismiss', { bubbles: true, composed: true }));
      this.remove();
    }, { once: true });
  }

  /* ── Static API ── */

  static _getContainer() {
    let container = document.getElementById('r-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'r-toast-container';
      Object.assign(container.style, {
        position:      'fixed',
        bottom:        '16px',
        right:         '16px',
        display:       'flex',
        flexDirection: 'column',
        gap:           '8px',
        zIndex:        '9999',
        pointerEvents: 'none',
        alignItems:    'flex-end',
      });
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Show a toast notification.
   * @param {object} options
   * @param {string} options.message   - Text to display
   * @param {string} [options.variant] - 'info' | 'success' | 'warning' | 'danger'
   * @param {number} [options.duration=4000] - Auto-dismiss delay in ms. 0 = no auto-dismiss.
   */
  static show({ message = '', variant = '', duration = 4000 } = {}) {
    const toast = document.createElement('r-toast');
    toast.setAttribute('message', message);
    if (variant) toast.setAttribute(variant, '');

    RToast._getContainer().appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        if (toast.isConnected) toast._dismiss();
      }, duration);
    }

    return toast;
  }
}

customElements.define('r-toast', RToast);

export { RToast };
