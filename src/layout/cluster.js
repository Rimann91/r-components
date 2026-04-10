class RCluster extends HTMLElement {
  static get observedAttributes() {
    return ['gap', 'align', 'justify'];
  }

  connectedCallback() {
    this._apply();
  }

  attributeChangedCallback() {
    this._apply();
  }

  _apply() {
    const gap     = this.getAttribute('gap')     ?? '3';
    const align   = this.getAttribute('align')   ?? 'center';
    const justify = this.getAttribute('justify') ?? 'flex-start';

    this.style.display        = 'flex';
    this.style.flexWrap       = 'wrap';
    this.style.gap            = `var(--space-${gap})`;
    this.style.alignItems     = align;
    this.style.justifyContent = justify;
  }
}

customElements.define('r-cluster', RCluster);
