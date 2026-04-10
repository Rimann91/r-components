class RStack extends HTMLElement {
  static get observedAttributes() {
    return ['gap', 'align'];
  }

  connectedCallback() {
    this._apply();
  }

  attributeChangedCallback() {
    this._apply();
  }

  _apply() {
    const gap   = this.getAttribute('gap')   ?? '4';
    const align = this.getAttribute('align') ?? 'stretch';

    this.style.display       = 'flex';
    this.style.flexDirection = 'column';
    this.style.gap           = `var(--space-${gap})`;
    this.style.alignItems    = align;
  }
}

customElements.define('r-stack', RStack);
