
/**
 * USCalcHub Unified Site-Wide Search Client
 * Priority Ordering:
 *  1: Calculator Child Pages (Salary & Social Security state pages)
 *  2: Core Tools & Hub Pages
 *  3: WordPress Blog Articles
 */

(function() {
  // 1. Bundle Fuse.js in a safe scoped environment
  var Fuse;
  (function() {
    var module = { exports: {} };
/**
 * Fuse.js v7.5.0 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2026 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
function e(e){return Array.isArray?Array.isArray(e):u(e)===`[object Array]`}function t(e){if(typeof e==`string`)return e;if(typeof e==`bigint`)return e.toString();let t=e+``;return t==`0`&&1/e==-1/0?`-0`:t}function n(e){return e==null?``:t(e)}function r(e){return typeof e==`string`}function i(e){return typeof e==`number`}function a(e){return e===!0||e===!1||s(e)&&u(e)==`[object Boolean]`}function o(e){return typeof e==`object`}function s(e){return o(e)&&e!==null}function c(e){return e!=null}function l(e){return!e.trim().length}function u(e){return e==null?e===void 0?`[object Undefined]`:`[object Null]`:Object.prototype.toString.call(e)}const d=`Invalid doc index: must be a non-negative integer within the bounds of the docs array`,f=e=>`Pattern length exceeds max of ${e}.`,p=e=>`Missing ${e} property in key`,m=e=>`Property 'weight' in key '${e}' must be a positive integer`,h=Object.prototype.hasOwnProperty;var g=class{constructor(e){this._keys=[],this._keyMap={};let t=0;e.forEach(e=>{let n=_(e);this._keys.push(n),this._keyMap[n.id]=n,t+=n.weight}),this._keys.forEach(e=>{e.weight/=t})}get(e){return this._keyMap[e]}keys(){return this._keys}toJSON(){return JSON.stringify(this._keys)}};function _(t){let n=null,i=null,a=null,o=1,s=null;if(r(t)||e(t))a=t,n=v(t),i=y(t);else{if(!h.call(t,`name`))throw Error(p(`name`));let e=t.name;if(a=e,h.call(t,`weight`)&&t.weight!==void 0&&(o=t.weight,o<=0))throw Error(m(y(e)));n=v(e),i=y(e),s=t.getFn??null}return{path:n,id:i,weight:o,src:a,getFn:s}}function v(t){return e(t)?t:t.split(`.`)}function y(t){return e(t)?t.join(`.`):t}function b(t,o){let s=[],l=!1,u=(t,o,d,f)=>{if(c(t))if(!o[d])s.push(f===void 0?t:{v:t,i:f});else{let p=t[o[d]];if(!c(p))return;if(d===o.length-1&&(r(p)||i(p)||a(p)||typeof p==`bigint`))s.push(f===void 0?n(p):{v:n(p),i:f});else if(e(p)){l=!0;for(let e=0,t=p.length;e<t;e+=1)u(p[e],o,d+1,e)}else o.length&&u(p,o,d+1,f)}};return u(t,r(o)?o.split(`.`):o,0),l?s:s[0]}const x={includeMatches:!1,findAllMatches:!1,minMatchCharLength:1},S={isCaseSensitive:!1,ignoreDiacritics:!1,includeScore:!1,keys:[],shouldSort:!0,sortFn:(e,t)=>e.score===t.score?e.idx<t.idx?-1:1:e.score<t.score?-1:1},C={location:0,threshold:.6,distance:100},w={useExtendedSearch:!1,useTokenSearch:!1,tokenize:void 0,tokenMatch:`any`,getFn:b,ignoreLocation:!1,ignoreFieldNorm:!1,fieldNormWeight:1},T=Object.freeze({...S,...x,...C,...w});function E(e){return e>=9&&e<=13||e===32||e===160}function D(e=1,t=3){let n=new Map,r=10**t;return{get(t){let i=0,a=!1;for(let e=0;e<t.length;e++)E(t.charCodeAt(e))?a=!1:a||(i++,a=!0);if(i===0&&(i=1),n.has(i))return n.get(i);let o=Math.round(r/i**(.5*e))/r;return n.set(i,o),o},clear(){n.clear()}}}var O=class{constructor({getFn:e=T.getFn,fieldNormWeight:t=T.fieldNormWeight}={}){this.norm=D(t,3),this.getFn=e,this.isCreated=!1,this.docs=[],this.keys=[],this._keysMap={},this.setIndexRecords()}setSources(e=[]){this.docs=e}setIndexRecords(e=[]){this.records=e}setKeys(e=[]){this.keys=e,this._keysMap={},e.forEach((e,t)=>{this._keysMap[e.id]=t})}create(){if(this.isCreated||!this.docs.length)return;this.isCreated=!0;let e=this.docs.length;this.records=Array(e);let t=0;if(r(this.docs[0]))for(let n=0;n<e;n++){let e=this._createStringRecord(this.docs[n],n);e&&(this.records[t++]=e)}else for(let n=0;n<e;n++)this.records[t++]=this._createObjectRecord(this.docs[n],n);this.records.length=t,this.norm.clear()}add(e,t){if(!Number.isInteger(t)||t<0)throw Error(d);if(r(e)){let n=this._createStringRecord(e,t);return n&&this.records.push(n),n}let n=this._createObjectRecord(e,t);return this.records.push(n),n}removeAt(e){if(!Number.isInteger(e)||e<0)throw Error(d);for(let t=0,n=this.records.length;t<n;t+=1)if(this.records[t].i===e){this.records.splice(t,1);break}for(let t=0,n=this.records.length;t<n;t+=1)this.records[t].i>e&&--this.records[t].i}removeAll(e){let t=new Set;for(let n of e)Number.isInteger(n)&&n>=0&&t.add(n);if(t.size===0)return;this.records=this.records.filter(e=>!t.has(e.i));let n=Array.from(t).sort((e,t)=>e-t);for(let e of this.records){let t=0,r=n.length;for(;t<r;){let i=t+r>>>1;n[i]<e.i?t=i+1:r=i}e.i-=t}}getValueForItemAtKeyId(e,t){return e[this._keysMap[t]]}size(){return this.records.length}_createStringRecord(e,t){return!c(e)||l(e)?null:{v:e,i:t,n:this.norm.get(e)}}_createObjectRecord(t,i){let a={i,$:{}};for(let i=0,o=this.keys.length;i<o;i++){let o=this.keys[i],s=o.getFn?o.getFn(t):this.getFn(t,o.path);if(c(s)){if(e(s)){let e=[];for(let t=0,i=s.length;t<i;t+=1){let i=s[t];if(c(i)){if(r(i)){if(!l(i)){let n={v:i,i:t,n:this.norm.get(i)};e.push(n)}}else if(c(i.v)){let t=r(i.v)?i.v:n(i.v);if(!l(t)){let n={v:t,i:i.i,n:this.norm.get(t)};e.push(n)}}}}a.$[i]=e}else if(r(s)&&!l(s)){let e={v:s,n:this.norm.get(s)};a.$[i]=e}}}return a}toJSON(){return{keys:this.keys.map(({getFn:e,...t})=>t),records:this.records}}};function k(e,t,{getFn:n=T.getFn,fieldNormWeight:r=T.fieldNormWeight}={}){let i=new O({getFn:n,fieldNormWeight:r});return i.setKeys(e.map(_)),i.setSources(t),i.create(),i}function A(e,{getFn:t=T.getFn,fieldNormWeight:n=T.fieldNormWeight}={}){let{keys:r,records:i}=e,a=new O({getFn:t,fieldNormWeight:n});return a.setKeys(r),a.setIndexRecords(i),a}function j(e=[],t=T.minMatchCharLength){let n=[],r=-1,i=-1,a=0;for(let o=e.length;a<o;a+=1){let o=e[a];o&&r===-1?r=a:!o&&r!==-1&&(i=a-1,i-r+1>=t&&n.push([r,i]),r=-1)}return e[a-1]&&a-r>=t&&n.push([r,a-1]),n}function M(e,t,n,{location:r=T.location,distance:i=T.distance,threshold:a=T.threshold,findAllMatches:o=T.findAllMatches,minMatchCharLength:s=T.minMatchCharLength,includeMatches:c=T.includeMatches,ignoreLocation:l=T.ignoreLocation}={}){if(t.length>32)throw Error(f(32));let u=t.length,d=e.length,p=Math.max(0,Math.min(r,d)),m=a,h=p,g=(e,t)=>{let n=e/u;if(l)return n;let r=Math.abs(p-t);return i?n+r/i:r?1:n},_=s>1||c,v=_?Array(d):[],y;for(;(y=e.indexOf(t,h))>-1;){let e=g(0,y);if(m=Math.min(e,m),h=y+u,_){let e=0;for(;e<u;)v[y+e]=1,e+=1}}h=-1;let b=[],x=1,S=0,C=u+d,w=1<<u-1;for(let t=0;t<u;t+=1){let r=0,i=C;for(;r<i;)g(t,p+i)<=m?r=i:C=i,i=Math.floor((C-r)/2+r);C=i;let a=Math.max(1,p-i+1),s=o?d:Math.min(p+i,d)+u,c=Array(s+2);c[s+1]=(1<<t)-1;for(let r=s;r>=a;--r){let i=r-1,o=n[e[i]];if(c[r]=(c[r+1]<<1|1)&o,t&&(c[r]|=(b[r+1]|b[r])<<1|1|b[r+1]),c[r]&w&&(x=g(t,i),x<=m)){if(m=x,h=i,S=t,h<=p)break;a=Math.max(1,2*p-h)}}if(g(t+1,p)>m)break;b=c}if(_&&h>=0){let t=Math.min(d-1,h+u-1+S);for(let r=h;r<=t;r+=1)n[e[r]]&&(v[r]=1)}let E={isMatch:h>=0,score:Math.max(.001,x)};if(_){let e=j(v,s);e.length?c&&(E.indices=e):E.isMatch=!1}return E}function N(e){let t={};for(let n=0,r=e.length;n<r;n+=1){let i=e.charAt(n);t[i]=(t[i]||0)|1<<r-n-1}return t}function P(e){if(e.length<=1)return e;e.sort((e,t)=>e[0]-t[0]||e[1]-t[1]);let t=[e[0]];for(let n=1,r=e.length;n<r;n+=1){let r=t[t.length-1],i=e[n];i[0]<=r[1]+1?r[1]=Math.max(r[1],i[1]):t.push(i)}return t}const F={ł:`l`,Ł:`L`,đ:`d`,Đ:`D`,ø:`o`,Ø:`O`,ħ:`h`,Ħ:`H`,ŧ:`t`,Ŧ:`T`,ı:`i`,ß:`ss`},I=RegExp(`[`+Object.keys(F).join(``)+`]`,`g`),L=typeof String.prototype.normalize==`function`?e=>e.normalize(`NFD`).replace(/[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]/g,``).replace(I,e=>F[e]):e=>e;var R=class{constructor(e,{location:t=T.location,threshold:n=T.threshold,distance:r=T.distance,includeMatches:i=T.includeMatches,findAllMatches:a=T.findAllMatches,minMatchCharLength:o=T.minMatchCharLength,isCaseSensitive:s=T.isCaseSensitive,ignoreDiacritics:c=T.ignoreDiacritics,ignoreLocation:l=T.ignoreLocation}={}){if(this.options={location:t,threshold:n,distance:r,includeMatches:i,findAllMatches:a,minMatchCharLength:o,isCaseSensitive:s,ignoreDiacritics:c,ignoreLocation:l},e=s?e:e.toLowerCase(),e=c?L(e):e,this.pattern=e,this.chunks=[],!this.pattern.length)return;let u=(e,t)=>{this.chunks.push({pattern:e,alphabet:N(e),startIndex:t})},d=this.pattern.length;if(d>32){let e=0,t=d%32,n=d-t;for(;e<n;)u(this.pattern.substr(e,32),e),e+=32;if(t){let e=d-32;u(this.pattern.substr(e),e)}}else u(this.pattern,0)}searchIn(e){let{isCaseSensitive:t,ignoreDiacritics:n,includeMatches:r}=this.options;if(e=t?e:e.toLowerCase(),e=n?L(e):e,this.pattern===e){if(e.length<this.options.minMatchCharLength)return{isMatch:!1,score:1};let t={isMatch:!0,score:0};return r&&(t.indices=[[0,e.length-1]]),t}let{location:i,distance:a,threshold:o,findAllMatches:s,minMatchCharLength:c,ignoreLocation:l}=this.options,u=[],d=0,f=!1;this.chunks.forEach(({pattern:t,alphabet:n,startIndex:p})=>{let{isMatch:m,score:h,indices:g}=M(e,t,n,{location:i+p,distance:a,threshold:o,findAllMatches:s,minMatchCharLength:c,includeMatches:r,ignoreLocation:l});m&&(f=!0),d+=h,m&&g&&u.push(...g)});let p={isMatch:f,score:f?d/this.chunks.length:1};return f&&r&&(p.indices=P(u)),p}};const z=[];function B(...e){z.push(...e)}function V(e,t){for(let n=0,r=z.length;n<r;n+=1){let r=z[n];if(r.condition(e,t))return new r(e,t)}return new R(e,t)}function H(e,{ignoreFieldNorm:t=T.ignoreFieldNorm}){let n=1;return e.forEach(({key:e,norm:r,score:i})=>{let a=e?e.weight:null;n*=(i===0&&a?2**-52:i)**+((a||1)*(t?1:r))}),n}function U(e,{ignoreFieldNorm:t=T.ignoreFieldNorm}){e.forEach(e=>{e.score=H(e.matches,{ignoreFieldNorm:t})})}var W=class{constructor(e,t){this.limit=e,this.heap=[],this.comparator=t}get size(){return this.heap.length}insert(e){this.size<this.limit?(this.heap.push(e),this._bubbleUp(this.size-1)):this.comparator(e,this.heap[0])<0&&(this.heap[0]=e,this._sinkDown(0))}extractSorted(){return this.heap.sort(this.comparator)}_bubbleUp(e){let t=this.heap;for(;e>0;){let n=e-1>>1;if(this.comparator(t[e],t[n])<=0)break;let r=t[e];t[e]=t[n],t[n]=r,e=n}}_sinkDown(e){let t=this.heap,n=t.length,r=e;do{e=r;let i=2*e+1,a=2*e+2;if(i<n&&this.comparator(t[i],t[r])>0&&(r=i),a<n&&this.comparator(t[a],t[r])>0&&(r=a),r!==e){let n=t[e];t[e]=t[r],t[r]=n}}while(r!==e)}};function G(e){let t=[];return e.matches.forEach(e=>{if(!c(e.indices)||!e.indices.length)return;let n={indices:e.indices,value:e.value};e.key&&(n.key=e.key.id),e.idx>-1&&(n.refIndex=e.idx),t.push(n)}),t}function K(e,t,{includeMatches:n=T.includeMatches,includeScore:r=T.includeScore}={}){return e.map(e=>{let{idx:i}=e,a={item:t[i],refIndex:i};return n&&(a.matches=G(e)),r&&(a.score=e.score),a})}const q=/[\p{L}\p{M}\p{N}_]+/gu;function J(e){return typeof e==`function`?t=>e(t):e instanceof RegExp?(e.global,t=>t.match(e)||[]):e=>e.match(q)||[]}function Y({isCaseSensitive:e=!1,ignoreDiacritics:t=!1,tokenize:n}={}){let r=J(n);return{tokenize(n){return e||(n=n.toLowerCase()),t&&(n=L(n)),r(n)}}}function X(e,t,n,r){let i=r.tokenize(t);if(!i.length)return;e.fieldCount++,e.docFieldCount.set(n,(e.docFieldCount.get(n)||0)+1);let a=new Set(i),o=e.docTermFieldHits.get(n);o||(o=new Map,e.docTermFieldHits.set(n,o));for(let t of a)o.set(t,(o.get(t)||0)+1),e.df.set(t,(e.df.get(t)||0)+1)}function Z(e,t,n,r){let{i,v:a,$:o}=t;if(a!==void 0){X(e,a,i,r);return}if(o)for(let t=0;t<n;t++){let n=o[t];if(n)if(Array.isArray(n))for(let t of n)X(e,t.v,i,r);else X(e,n.v,i,r)}}function ee(e,t,n){let r={fieldCount:0,df:new Map,docFieldCount:new Map,docTermFieldHits:new Map};for(let i of e)Z(r,i,t,n);return r}function te(e,t,n,r){Z(e,t,n,r)}function ne(e,t){let n=e.docFieldCount.get(t);if(n===void 0)return;e.fieldCount-=n,e.docFieldCount.delete(t);let r=e.docTermFieldHits.get(t);if(r){for(let[t,n]of r){let r=(e.df.get(t)||0)-n;r<=0?e.df.delete(t):e.df.set(t,r)}e.docTermFieldHits.delete(t)}}function Q(e,t){if(t.length===0)return;let n=Array.from(new Set(t)).sort((e,t)=>e-t);for(let t of n)ne(e,t);let r=e=>{let t=0,r=n.length;for(;t<r;){let i=t+r>>>1;n[i]<e?t=i+1:r=i}return e-t},i=n[0],a=new Map;for(let[t,n]of e.docFieldCount)a.set(t>i?r(t):t,n);e.docFieldCount=a;let o=new Map;for(let[t,n]of e.docTermFieldHits)o.set(t>i?r(t):t,n);e.docTermFieldHits=o}var $=class{constructor(e,t,n){if(this.options={...T,...t},this.options.useExtendedSearch)throw Error(`Extended search is not available`);if(this.options.useTokenSearch)throw Error(`Token search is not available`);this._keyStore=new g(this.options.keys),this._docs=e,this._myIndex=null,this._invertedIndex=null,this.setCollection(e,n),this._lastQuery=null,this._lastSearcher=null}_getSearcher(e){if(this._lastQuery===e)return this._lastSearcher;let t=V(e,this._invertedIndex?{...this.options,_invertedIndex:this._invertedIndex}:this.options);return this._lastQuery=e,this._lastSearcher=t,t}setCollection(e,t){if(this._docs=e,t&&!(t instanceof O))throw Error(`Incorrect 'index' type`);if(this._myIndex=t||k(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight}),this.options.useTokenSearch){let e=Y({isCaseSensitive:this.options.isCaseSensitive,ignoreDiacritics:this.options.ignoreDiacritics,tokenize:this.options.tokenize});this._invertedIndex=ee(this._myIndex.records,this._myIndex.keys.length,e)}this._invalidateSearcherCache()}add(e){if(!c(e))return;this._docs.push(e);let t=this._myIndex.add(e,this._docs.length-1);if(this._invertedIndex&&t){let e=Y({isCaseSensitive:this.options.isCaseSensitive,ignoreDiacritics:this.options.ignoreDiacritics,tokenize:this.options.tokenize});te(this._invertedIndex,t,this._myIndex.keys.length,e)}this._invalidateSearcherCache()}remove(e=()=>!1){let t=[],n=[];for(let r=0,i=this._docs.length;r<i;r+=1)e(this._docs[r],r)&&(t.push(this._docs[r]),n.push(r));if(n.length){this._invertedIndex&&Q(this._invertedIndex,n);let e=new Set(n);this._docs=this._docs.filter((t,n)=>!e.has(n)),this._myIndex.removeAll(n),this._invalidateSearcherCache()}return t}removeAt(e){if(!Number.isInteger(e)||e<0||e>=this._docs.length)throw Error(d);this._invertedIndex&&Q(this._invertedIndex,[e]);let t=this._docs.splice(e,1)[0];return this._myIndex.removeAt(e),this._invalidateSearcherCache(),t}_invalidateSearcherCache(){this._lastQuery=null,this._lastSearcher=null}getIndex(){return this._myIndex}_normalizedKeys(){return this._myIndex.keys.map(e=>this._keyStore.get(e.id)||e)}search(e,t){let{limit:n=-1}=t||{},{includeMatches:a,includeScore:o,shouldSort:s,sortFn:c,ignoreFieldNorm:l}=this.options;if(r(e)&&!e.trim()){let e=this._docs.map((e,t)=>({item:e,refIndex:t}));return i(n)&&n>-1&&(e=e.slice(0,n)),e}let u=s&&i(n)&&n>0&&r(e),d=c,f=(e,t)=>d(e,t)||e.idx-t.idx,p;if(u){let t=new W(n,f);r(this._docs[0])?this._searchStringList(e,{heap:t,ignoreFieldNorm:l}):this._searchObjectList(e,{heap:t,ignoreFieldNorm:l}),p=t.extractSorted()}else p=r(e)?r(this._docs[0])?this._searchStringList(e):this._searchObjectList(e):this._searchLogical(e),U(p,{ignoreFieldNorm:l}),s&&p.sort(r(e)?f:d),i(n)&&n>-1&&(p=p.slice(0,n));return K(p,this._docs,{includeMatches:a,includeScore:o})}_searchStringList(e,{heap:t,ignoreFieldNorm:n}={}){let r=this._getSearcher(e),i=this.options.useTokenSearch&&this.options.tokenMatch===`all`,{records:a}=this._myIndex,o=t?null:[];return a.forEach(({v:e,i:a,n:s})=>{if(!c(e))return;let l=r.searchIn(e);if(l.isMatch){let r={score:l.score,value:e,norm:s,indices:l.indices};i&&(r.matchedMask=l.matchedMask,r.matchedTerms=l.matchedTerms,r.termCount=l.termCount);let c=[r];if(!i||this._coversAllTokens(c)){let r={item:e,idx:a,matches:c};t?(r.score=H(r.matches,{ignoreFieldNorm:n}),t.insert(r)):o.push(r)}}}),o}_searchLogical(e){throw Error(`Logical search is not available`)}_searchObjectList(e,{heap:t,ignoreFieldNorm:n}={}){let r=this._getSearcher(e),i=this.options.useTokenSearch&&this.options.tokenMatch===`all`,{records:a}=this._myIndex,o=this._normalizedKeys(),s=t?null:[];return a.forEach(({$:e,i:a})=>{if(!c(e))return;let l=[],u=!1,d=!1;if(o.forEach((t,n)=>{let i=this._findMatches({key:t,value:e[n],searcher:r});i.length?(l.push(...i),i[0].hasInverse&&(d=!0)):u=!0}),!(d&&u)&&l.length&&(!i||this._coversAllTokens(l))){let r={idx:a,item:e,matches:l};t?(r.score=H(r.matches,{ignoreFieldNorm:n}),t.insert(r)):s.push(r)}}),s}_findMatches({key:t,value:n,searcher:r}){if(!c(n))return[];let i=[];if(e(n))n.forEach(({v:e,i:n,n:a})=>{if(!c(e))return;let o=r.searchIn(e);if(o.isMatch){let r={score:o.score,key:t,value:e,idx:n,norm:a,indices:o.indices,hasInverse:o.hasInverse};o.termCount!==void 0&&(r.matchedMask=o.matchedMask,r.matchedTerms=o.matchedTerms,r.termCount=o.termCount),i.push(r)}});else{let{v:e,n:a}=n,o=r.searchIn(e);if(o.isMatch){let n={score:o.score,key:t,value:e,norm:a,indices:o.indices,hasInverse:o.hasInverse};o.termCount!==void 0&&(n.matchedMask=o.matchedMask,n.matchedTerms=o.matchedTerms,n.termCount=o.termCount),i.push(n)}}return i}_coversAllTokens(e){let t=e.length?e[0].termCount:void 0;if(t===void 0)return!0;if(t<=31){let n=0;for(let t=0;t<e.length;t++)n|=e[t].matchedMask||0;return n===2**t-1}let n=new Set;for(let t=0;t<e.length;t++){let r=e[t].matchedTerms;if(r)for(let e of r)n.add(e)}return n.size===t}};$.version=`7.5.0`,$.createIndex=k,$.parseIndex=A,$.config=T,$.match=function(e,t,n){if(n&&n.useTokenSearch)throw Error(`Fuse.match does not support useTokenSearch: token search requires corpus-level statistics (df, fieldCount) that a one-off string comparison does not have. Use new Fuse(...).search(...) instead.`);return V(e,{...T,...n}).searchIn(t)},$.use=function(...e){e.forEach(e=>B(e))};var re=$;module.exports=re;
    Fuse = module.exports;
    window.Fuse = Fuse;
  })();

  // 2. Global State
  var searchIndex = [];
  var fuse = null;
  var isLoaded = false;
  var activeTab = 'all';
  var currentResults = [];
  var selectedIndex = 0;

  // 3. Create Modal HTML
  var modalHTML = `
    <div class="uscalchub-search-backdrop" id="uscalchub-search-modal" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Site Search">
      <div class="uscalchub-search-modal">
        <!-- Header -->
        <div class="uscalchub-search-header">
          <svg class="uscalchub-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          </svg>
          <input 
            type="text" 
            id="uscalchub-search-input" 
            class="uscalchub-search-input" 
            placeholder="Search 80+ calculators, tools & articles... (e.g. Nevada, 75k, Credit Card)" 
            autocomplete="off" 
            spellcheck="false"
          />
          <button type="button" id="uscalchub-search-close-btn" class="uscalchub-search-close-kbd" title="Close (Esc)">ESC</button>
        </div>

        <!-- Filter Category Tabs -->
        <div class="uscalchub-search-tabs">
          <button type="button" class="uscalchub-search-tab active" data-tab="all">
            All <span class="tab-count" id="tab-count-all"></span>
          </button>
          <button type="button" class="uscalchub-search-tab" data-tab="calculator">
            Calculators <span class="tab-count" id="tab-count-calculator"></span>
          </button>
          <button type="button" class="uscalchub-search-tab" data-tab="tool">
            Tools & Hubs <span class="tab-count" id="tab-count-tool"></span>
          </button>
          <button type="button" class="uscalchub-search-tab" data-tab="article">
            Articles <span class="tab-count" id="tab-count-article"></span>
          </button>
        </div>

        <!-- Results Scroll Area -->
        <div class="uscalchub-search-results" id="uscalchub-search-results">
          <!-- Populated dynamically -->
        </div>

        <!-- Footer -->
        <div class="uscalchub-search-footer">
          <div class="uscalchub-search-shortcuts">
            <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
            <span><kbd>↵</kbd> Select</span>
            <span><kbd>esc</kbd> Close</span>
          </div>
          <div id="uscalchub-search-counter">Ready</div>
        </div>
      </div>
    </div>
  `;

  // 4. Fetch Index & Init Fuse
  function loadIndex() {
    if (isLoaded) return Promise.resolve();
    
    // Support root and subpaths
    var indexPath = '/search-index.json';
    return fetch(indexPath)
      .then(function(res) {
        if (!res.ok) throw new Error('Failed to load search index');
        return res.json();
      })
      .then(function(data) {
        searchIndex = data;
        fuse = new Fuse(searchIndex, {
          keys: [
            { name: 'title', weight: 0.5 },
            { name: 'keywords', weight: 0.35 },
            { name: 'description', weight: 0.15 }
          ],
          threshold: 0.38,
          ignoreLocation: true,
          includeScore: true,
          minMatchCharLength: 2
        });
        isLoaded = true;
        updateTabCounts();
      })
      .catch(function(err) {
        console.warn('[USCalcHub Search] Could not load search-index.json:', err);
      });
  }

  function updateTabCounts() {
    var total = searchIndex.length;
    var calcs = searchIndex.filter(function(i) { return i.type === 'calculator'; }).length;
    var tools = searchIndex.filter(function(i) { return i.type === 'tool'; }).length;
    var articles = searchIndex.filter(function(i) { return i.type === 'article'; }).length;

    var elAll = document.getElementById('tab-count-all');
    var elCalc = document.getElementById('tab-count-calculator');
    var elTool = document.getElementById('tab-count-tool');
    var elArt = document.getElementById('tab-count-article');

    if (elAll) elAll.textContent = '(' + total + ')';
    if (elCalc) elCalc.textContent = '(' + calcs + ')';
    if (elTool) elTool.textContent = '(' + tools + ')';
    if (elArt) elArt.textContent = '(' + articles + ')';
  }

  // 5. Open / Close Modal Logic
  function openModal(initialQuery) {
    var modal = document.getElementById('uscalchub-search-modal');
    if (!modal) {
      initDOM();
      modal = document.getElementById('uscalchub-search-modal');
    }
    
    loadIndex().then(function() {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      var input = document.getElementById('uscalchub-search-input');
      if (input) {
        if (typeof initialQuery === 'string' && initialQuery.trim()) {
          input.value = initialQuery.trim();
        }
        input.focus();
        if (input.value) {
          input.select();
        }
        renderResults();
      }
    });
  }

  function closeModal() {
    var modal = document.getElementById('uscalchub-search-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // 6. Search & Priority Ordering Logic
  function performSearch(query) {
    if (!query || !query.trim()) {
      // Curated initial recommendations when search input is empty
      var popularIds = [
        'tool-salary',
        'tool-credit-card',
        'tool-social-security',
        'tool-overtime',
        'salary-texas-75k',
        'salary-florida-75k',
        'salary-nevada-75k',
        'salary-california-75k',
        'ss-colorado',
        'post-289',
        'post-284',
        'tool-real-estate',
        'tool-tip'
      ];
      var initialList = [];
      popularIds.forEach(function(id) {
        var found = searchIndex.find(function(item) { return item.id === id; });
        if (found) initialList.push({ item: found, score: 0 });
      });
      if (initialList.length < 8) {
        initialList = searchIndex.slice(0, 12).map(function(item) { return { item: item, score: 0 }; });
      }
      return initialList;
    }

    var q = query.trim();
    var tokens = q.split(/\s+/).filter(Boolean);

    if (tokens.length === 1) {
      var singleResults = fuse.search(tokens[0]).filter(function(r) { return r.score <= 0.45; });
      singleResults.sort(function(a, b) {
        if (a.item.priority !== b.item.priority) return a.item.priority - b.item.priority;
        return a.score - b.score;
      });
      return singleResults;
    }

    // Multi-token: Intersect tokens (AND matching) with score averaging
    var tokenMatches = tokens.map(function(t) {
      return fuse.search(t).filter(function(r) { return r.score <= 0.45; });
    });

    var map = new Map();
    if (tokenMatches[0]) {
      tokenMatches[0].forEach(function(r) {
        map.set(r.item.id, { item: r.item, scores: [r.score] });
      });

      for (var i = 1; i < tokenMatches.length; i++) {
        var currentSet = new Map();
        tokenMatches[i].forEach(function(r) { currentSet.set(r.item.id, r.score); });
        for (var [id, data] of map.entries()) {
          if (currentSet.has(id)) {
            data.scores.push(currentSet.get(id));
          } else {
            map.delete(id);
          }
        }
      }
    }

    var finalResults = Array.from(map.values()).map(function(data) {
      var avgScore = data.scores.reduce(function(a, b) { return a + b; }, 0) / data.scores.length;
      return { item: data.item, score: avgScore };
    });

    // Fallback: If intersection is empty, fall back to general search
    if (finalResults.length === 0) {
      finalResults = fuse.search(q).filter(function(r) { return r.score <= 0.55; });
    }

    // STRICT 3-TIER PRIORITY ORDERING:
    // Priority 1 (Calculators) > Priority 2 (Core Tools) > Priority 3 (Blog Articles)
    finalResults.sort(function(a, b) {
      if (a.item.priority !== b.item.priority) return a.item.priority - b.item.priority;
      return a.score - b.score;
    });

    return finalResults;
  }

  function renderResults() {
    var input = document.getElementById('uscalchub-search-input');
    var container = document.getElementById('uscalchub-search-results');
    var counter = document.getElementById('uscalchub-search-counter');
    if (!container) return;

    var query = input ? input.value : '';
    var matches = performSearch(query);

    // Filter by active tab
    if (activeTab !== 'all') {
      matches = matches.filter(function(m) {
        return m.item.type === activeTab;
      });
    }

    currentResults = matches;
    selectedIndex = 0;

    if (matches.length === 0) {
      container.innerHTML = `
        <div class="uscalchub-search-empty">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
          </svg>
          <div class="uscalchub-search-empty-title">No matching results found</div>
          <div class="uscalchub-search-empty-desc">We couldn't find any calculators or articles matching "${escapeHTML(query)}". Try one of these popular searches:</div>
          <div class="uscalchub-search-suggestions">
            <button type="button" class="uscalchub-search-suggest-chip" data-suggest="Nevada">Nevada</button>
            <button type="button" class="uscalchub-search-suggest-chip" data-suggest="Texas 75k">Texas 75k</button>
            <button type="button" class="uscalchub-search-suggest-chip" data-suggest="Social Security">Social Security</button>
            <button type="button" class="uscalchub-search-suggest-chip" data-suggest="Credit Card">Credit Card</button>
            <button type="button" class="uscalchub-search-suggest-chip" data-suggest="Florida 100k">Florida 100k</button>
            <button type="button" class="uscalchub-search-suggest-chip" data-suggest="Overtime">Overtime</button>
          </div>
        </div>
      `;
      if (counter) counter.textContent = '0 results';
      return;
    }

    var html = '';
    var lastPriority = null;

    matches.forEach(function(m, idx) {
      var item = m.item;

      // Group header divider when priority tier changes (if query is present)
      if (query && item.priority !== lastPriority) {
        lastPriority = item.priority;
        var groupLabel = 'Calculators';
        if (item.priority === 2) groupLabel = 'Core Tools & Hubs';
        if (item.priority === 3) groupLabel = 'Blog Articles & Guides';

        html += '<div class="uscalchub-search-group-title"><span>' + groupLabel + '</span><span>Priority ' + item.priority + '</span></div>';
      }

      var badgeClass = 'uscalchub-badge-' + item.type;
      var isSelected = idx === selectedIndex ? 'selected' : '';

      html += `
        <a href="${item.url}" class="uscalchub-search-item ${isSelected}" data-index="${idx}">
          <div class="uscalchub-item-content">
            <div class="uscalchub-item-title-row">
              <span class="uscalchub-badge ${badgeClass}">${item.badge}</span>
              <span class="uscalchub-item-title">${escapeHTML(item.title)}</span>
            </div>
            <div class="uscalchub-item-desc">${escapeHTML(item.description)}</div>
          </div>
          <svg class="uscalchub-item-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          </svg>
        </a>
      `;
    });

    container.innerHTML = html;
    if (counter) {
      counter.textContent = matches.length + ' ' + (matches.length === 1 ? 'result' : 'results');
    }
  }

  function updateSelected() {
    var container = document.getElementById('uscalchub-search-results');
    if (!container) return;
    var items = container.querySelectorAll('.uscalchub-search-item');
    items.forEach(function(el, idx) {
      if (idx === selectedIndex) {
        el.classList.add('selected');
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        el.classList.remove('selected');
      }
    });
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 7. Event Bindings
  function initDOM() {
    if (document.getElementById('uscalchub-search-modal')) return;

    var div = document.createElement('div');
    div.innerHTML = modalHTML;
    document.body.appendChild(div.firstElementChild);

    var modal = document.getElementById('uscalchub-search-modal');
    var input = document.getElementById('uscalchub-search-input');
    var closeBtn = document.getElementById('uscalchub-search-close-btn');
    var resultsContainer = document.getElementById('uscalchub-search-results');

    // Close on backdrop click
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Search input typing
    if (input) {
      input.addEventListener('input', function() {
        renderResults();
      });

      // Keyboard navigation inside input
      input.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (currentResults.length > 0) {
            selectedIndex = (selectedIndex + 1) % currentResults.length;
            updateSelected();
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (currentResults.length > 0) {
            selectedIndex = (selectedIndex - 1 + currentResults.length) % currentResults.length;
            updateSelected();
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (currentResults[selectedIndex]) {
            window.location.href = currentResults[selectedIndex].item.url;
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          closeModal();
        }
      });
    }

    // Category Tabs
    var tabs = modal.querySelectorAll('.uscalchub-search-tab');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        tabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        activeTab = tab.getAttribute('data-tab');
        renderResults();
      });
    });

    // Suggestions click delegation
    if (resultsContainer) {
      resultsContainer.addEventListener('click', function(e) {
        var suggestChip = e.target.closest('.uscalchub-search-suggest-chip');
        if (suggestChip) {
          var text = suggestChip.getAttribute('data-suggest');
          if (input && text) {
            input.value = text;
            renderResults();
            input.focus();
          }
        }
      });
    }
  }

  // 8. Global Keyboard Shortcut (Cmd+K / Ctrl+K & '/')
  document.addEventListener('keydown', function(e) {
    // Open on Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      var modal = document.getElementById('uscalchub-search-modal');
      if (modal && modal.classList.contains('active')) {
        closeModal();
      } else {
        openModal();
      }
      return;
    }

    // Open on '/' if not typing in an input
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openModal();
      return;
    }

    // Close on Escape
    if (e.key === 'Escape') {
      var modal = document.getElementById('uscalchub-search-modal');
      if (modal && modal.classList.contains('active')) {
        e.preventDefault();
        closeModal();
      }
    }
  });

  // 9. Attach triggers across the page
  document.addEventListener('DOMContentLoaded', function() {
    initDOM();

    // Any element with [data-open-search] or class .uscalchub-search-trigger
    document.addEventListener('click', function(e) {
      var trigger = e.target.closest('[data-open-search], .uscalchub-search-trigger');
      if (trigger) {
        e.preventDefault();
        openModal();
      }
    });

    // Intercept homepage search input & search button if present
    var homeSearchInput = document.getElementById('tool-search-input');
    var homeSearchBtn = document.getElementById('tool-search-btn');

    if (homeSearchInput) {
      homeSearchInput.addEventListener('focus', function() {
        var val = homeSearchInput.value;
        openModal(val);
      });
      homeSearchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          openModal(homeSearchInput.value);
        }
      });
    }

    if (homeSearchBtn) {
      homeSearchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var val = homeSearchInput ? homeSearchInput.value : '';
        openModal(val);
      });
    }

    // Support URL query parameter ?search=... or ?q=...
    try {
      var urlParams = new URLSearchParams(window.location.search);
      var queryParam = urlParams.get('search') || urlParams.get('q');
      if (queryParam) {
        setTimeout(function() {
          openModal(queryParam === 'open' ? '' : queryParam);
        }, 150);
      }
    } catch(err) {}
  });

  // 10. Expose public API
  window.openUSCalcHubSearch = openModal;
  window.closeUSCalcHubSearch = closeModal;

  // Preload index in the background after 1 second of idle
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(function() { loadIndex(); });
  } else {
    setTimeout(function() { loadIndex(); }, 1500);
  }
})();
