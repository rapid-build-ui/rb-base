import{removeNodes}from"./dom.js";import{insertNodeIntoTemplate,removeNodesFromTemplate}from"./modify-template.js";import{parts,render as litRender}from"./render.js";import{templateCaches}from"./template-factory.js";import{TemplateInstance}from"./template-instance.js";import{marker,Template}from"./template.js";export{html,svg,TemplateResult}from"../lit-html.js";const getTemplateCacheKey=(e,t)=>`${e}--${t}`;let compatibleShadyCSSVersion=!0;void 0===window.ShadyCSS?compatibleShadyCSSVersion=!1:void 0===window.ShadyCSS.prepareTemplateDom&&(console.warn("Incompatible ShadyCSS version detected. Please update to at least @webcomponents/webcomponentsjs@2.0.2 and @webcomponents/shadycss@1.3.1."),compatibleShadyCSSVersion=!1);const shadyTemplateFactory=e=>t=>{const o=getTemplateCacheKey(t.type,e);let r=templateCaches.get(o);void 0===r&&(r={stringsArray:new WeakMap,keyString:new Map},templateCaches.set(o,r));let a=r.stringsArray.get(t.strings);if(void 0!==a)return a;const s=t.strings.join(marker);if(void 0===(a=r.keyString.get(s))){const o=t.getTemplateElement();compatibleShadyCSSVersion&&window.ShadyCSS.prepareTemplateDom(o,e),a=new Template(t,o),r.keyString.set(s,a)}return r.stringsArray.set(t.strings,a),a},TEMPLATE_TYPES=["html","svg"],removeStylesFromLitTemplates=e=>{TEMPLATE_TYPES.forEach(t=>{const o=templateCaches.get(getTemplateCacheKey(t,e));void 0!==o&&o.keyString.forEach(e=>{const{element:{content:t}}=e,o=new Set;Array.from(t.querySelectorAll("style")).forEach(e=>{o.add(e)}),removeNodesFromTemplate(e,o)})})},shadyRenderSet=new Set,prepareTemplateStyles=(e,t,o)=>{shadyRenderSet.add(e);const r=o?o.element:document.createElement("template"),a=t.querySelectorAll("style"),{length:s}=a;if(0===s)return void window.ShadyCSS.prepareTemplateStyles(r,e);const n=document.createElement("style");for(let e=0;e<s;e++){const t=a[e];t.parentNode.removeChild(t),n.textContent+=t.textContent}removeStylesFromLitTemplates(e);const l=r.content;o?insertNodeIntoTemplate(o,n,l.firstChild):l.insertBefore(n,l.firstChild),window.ShadyCSS.prepareTemplateStyles(r,e);const m=l.querySelector("style");if(window.ShadyCSS.nativeShadow&&null!==m)t.insertBefore(m.cloneNode(!0),t.firstChild);else if(o){l.insertBefore(n,l.firstChild);const e=new Set;e.add(n),removeNodesFromTemplate(o,e)}};export const render=(e,t,o)=>{if(!o||"object"!=typeof o||!o.scopeName)throw new Error("The `scopeName` option is required.");const r=o.scopeName,a=parts.has(t),s=compatibleShadyCSSVersion&&11===t.nodeType&&!!t.host,n=s&&!shadyRenderSet.has(r),l=n?document.createDocumentFragment():t;if(litRender(e,l,Object.assign({templateFactory:shadyTemplateFactory(r)},o)),n){const e=parts.get(l);parts.delete(l);const o=e.value instanceof TemplateInstance?e.value.template:void 0;prepareTemplateStyles(r,l,o),removeNodes(t,t.firstChild),t.appendChild(l),parts.set(t,e)}!a&&s&&window.ShadyCSS.styleElement(t.host)};