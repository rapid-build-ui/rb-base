import{directive}from"../lit-html.js";const previousValues=new WeakMap;export const guard=directive((r,e)=>s=>{const i=previousValues.get(s);if(Array.isArray(r)){if(Array.isArray(i)&&i.length===r.length&&r.every((r,e)=>r===i[e]))return}else if(i===r&&(void 0!==r||previousValues.has(s)))return;s.setValue(e()),previousValues.set(s,Array.isArray(r)?Array.from(r):r)});