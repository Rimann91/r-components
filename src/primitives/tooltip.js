const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      /* Exposed vars */
      --tooltip-font:       var(--font-body, "Fira Code", monospace);
      --tooltip-font-size:  var(--text-xs);
      --tooltip-padding:    var(--space-1) var(--space-2);
      --tooltip-radius:     var(--radius);
      --tooltip-bg:         var(--color-fg-dark, #3c3836);
      --tooltip-color:      var(--color-bg-primary);
      --tooltip-max-width:  240px;
      --tooltip-transition: var(--transition-fast);
      --tooltip-gap:        var(--space-1);

      display: inline-block;
      position: relative;
    }

    .tip {
      position: absolute;
      z-index: var(--z-tooltip);
      background-color: var(--tooltip-bg);
      color: var(--tooltip-color);
      font-family: var(--tooltip-font);
      font-size: var(--tooltip-font-size);
      padding: var(--tooltip-padding);
      border-radius: var(--tooltip-radius);
      max-width: var(--tooltip-max-width);
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity var(--tooltip-transition);
      line-height: var(--line-height-base);
    }

    /* Show on hover or when trigger is focused */
    :host(:hover) .tip,
    :host(:focus-within) .tip {
      opacity: 1;
    }

    /* ── Position: top (default) ── */
    :host(:not([position])) .tip,
    :host([position="top"]) .tip {
      bottom: calc(100% + var(--tooltip-gap));
      left: 50%;
      transform: translateX(-50%);
    }

    /* ── Position: bottom ── */
    :host([position="bottom"]) .tip {
      top: calc(100% + var(--tooltip-gap));
      left: 50%;
      transform: translateX(-50%);
    }

    /* ── Position: left ── */
    :host([position="left"]) .tip {
      right: calc(100% + var(--tooltip-gap));
      top: 50%;
      transform: translateY(-50%);
    }

    /* ── Position: right ── */
    :host([position="right"]) .tip {
      left: calc(100% + var(--tooltip-gap));
      top: 50%;
      transform: translateY(-50%);
    }
  </style>

  <slot></slot>
  <span class="tip" role="tooltip"></span>
`

class RTooltip extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(template.content.cloneNode(true));
    this._tip = this.shadowRoot.querySelector('.tip');
  }

  static get observedAttributes() {
    return ['content'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'content') this._tip.textContent = newValue ?? '';
  }
}

customElements.define('r-tooltip', RTooltip);
