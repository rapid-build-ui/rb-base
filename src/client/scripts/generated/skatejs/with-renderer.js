import{shadow}from"./shadow.js";export const withRenderer=(e=HTMLElement)=>(class extends e{get renderRoot(){return super.renderRoot||shadow(this)}renderer(e,r){super.renderer?super.renderer(e,r):e.innerHTML=r()||""}updated(e,r){super.updated&&super.updated(e,r),this.rendering&&this.rendering(),this.renderer(this.renderRoot,()=>this.render&&this.render(this)),this.rendered&&this.rendered()}});