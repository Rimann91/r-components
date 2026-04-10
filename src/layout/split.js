class RSplit extends HTMLElement {
  static get observedAttributes() {
    return ['side', 'side-width', 'gap', 'align'];
  }

  connectedCallback() {
    this._apply();
  }

  attributeChangedCallback() {
    this._apply();
  }

  _apply() {
    const side      = this.getAttribute('side')       ?? 'left';
    const sideWidth = this.getAttribute('side-width') ?? '220px';
    const gap       = this.getAttribute('gap')        ?? '0';
    const align     = this.getAttribute('align')      ?? 'stretch';

    this.style.display    = 'grid';
    this.style.alignItems = align;
    this.style.gap        = gap === '0' ? '0px' : `var(--space-${gap})`;

    this.style.gridTemplateColumns = side === 'right'
      ? `1fr ${sideWidth}`
      : `${sideWidth} 1fr`;
  }
}

customElements.define('r-split', RSplit);
