const SIZES = {
  sm:   '640px',
  md:   '768px',
  lg:   '1024px',
  xl:   '1280px',
  '2xl':'1536px',
  full: 'none',
};

class RContainer extends HTMLElement {
  static get observedAttributes() {
    return ['size'];
  }

  connectedCallback() {
    this._apply();
  }

  attributeChangedCallback() {
    this._apply();
  }

  _apply() {
    const size = this.getAttribute('size') ?? 'lg';

    this.style.display      = 'block';
    this.style.width        = '100%';
    this.style.maxWidth     = SIZES[size] ?? SIZES.lg;
    this.style.marginLeft  = 'auto';
    this.style.marginRight = 'auto';
    this.style.paddingLeft  = `var(--space-4)`;
    this.style.paddingRight = `var(--space-4)`;
    this.style.boxSizing = 'border-box';
  }
}

customElements.define('r-container', RContainer);
