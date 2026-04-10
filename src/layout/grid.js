class RGrid extends HTMLElement {
  static get observedAttributes() {
    return ['columns', 'gap', 'min-col-width'];
  }

  connectedCallback() {
    this._apply();
  }

  attributeChangedCallback() {
    this._apply();
  }

  _apply() {
    const gap         = this.getAttribute('gap')           ?? '4';
    const columns     = this.getAttribute('columns');
    const minColWidth = this.getAttribute('min-col-width') ?? '200px';

    this.style.display = 'grid';
    this.style.gap     = `var(--space-${gap})`;

    if (columns && /^\d+$/.test(columns)) {
      /* Fixed column count */
      this.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    } else if (columns) {
      /* Raw template string e.g. "1fr 2fr 1fr" */
      this.style.gridTemplateColumns = columns;
    } else {
      /* Responsive auto-fill based on min-col-width */
      this.style.gridTemplateColumns = `repeat(auto-fill, minmax(${minColWidth}, 1fr))`;
    }
  }
}

customElements.define('r-grid', RGrid);
