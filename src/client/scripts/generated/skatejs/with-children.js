export const withChildren=(e=HTMLElement)=>(class extends e{childrenUpdated(){super.childrenUpdated&&super.childrenUpdated(),this.props&&this.props.hasOwnProperty("children")&&(this.props={children:this.children})}connectedCallback(){if(super.connectedCallback&&super.connectedCallback(),this.childrenUpdated){const e=this.childrenUpdated.bind(this);this._mo=new MutationObserver(e),this._mo.observe(this,{childList:!0}),e()}}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),this._mo&&this._mo.disconnect()}});