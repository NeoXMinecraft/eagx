"use strict";var EPKLib;!function(t){var e;let a;function s(t){let e=window.location.href,a;a=t.includes("://")?new URL(t):new URL(t,e);let s=a.pathname.split("/");return s.pop(),a.pathname=s.join("/"),a}function n(t){return/^(https?:)?\/\//i.test(t)||/^[^/]+\//.test(t)}function i(t,e){let a=t.endsWith("/")?t:t+"/",s=new URL(e,a).toString();return s}function r(t){return new Promise((e,a)=>{let s=new FileReader;s.onload=()=>{let t=s.result;e(t)},s.onerror=()=>{a(s.error)},s.readAsText(t)})}async function l(t,e,a,s){let n={directoryFile:void 0,files:[]},i={filename:t,segments:[],hash:s},r=new Uint8Array(e),l=Math.ceil(e.byteLength/a);for(let o=0;o<l;o++){let h=o*a,f=Math.min(h+a,r.byteLength),u=r.slice(h,f),c=`${t.replace(/[^\x00-\x7F]/g,"")}.${o}.seg`;n.files.push({filename:c,data:u}),i.segments.push(c)}return n.directoryFile=JSON.stringify(i),n}(e=a||(a={})).URL="URL",e.DATA="DATA",t.getParentUrl=s,t.isAbsoluteUrl=n,t.joinUrls=i,t.stringifyBlob=r,t.compileLargeEPK=l,t.LargeEPK=class t{constructor(t,e){if(this.partial=!0,e==a.URL){if(t instanceof Blob)throw TypeError("Resource of type Blob is not allowed when resourceType is set to URL.");this.url=t}else if(e==a.DATA){if(t instanceof URL)throw TypeError("Resource of type URL is not allowed when resourceType is set to DATA.");(t instanceof Blob||"string"==typeof t)&&(this.rawData=t)}else throw TypeError("resourceType must be one of the following values: DATA, URL.")}async fetchMetadata(){if(!this.partial)throw Error("Metadata has already been fetched - you can't call fetchMeta() twice!");null!=this.url&&(this.rawData=await (await fetch(this.url)).text()),this.rawData instanceof Blob&&(this.rawData=await r(this.rawData));let t=JSON.parse(this.rawData);if(null==t.filename||"string"!=typeof t.filename)throw TypeError("metadata.filename must be a string!");if(null==t.segments||t.segments instanceof Array==!1)throw TypeError("metadata.segments must be an non-empty string array!");if(0==t.segments.length)throw TypeError("metadata.segments cannot be empty!");for(let e of t.segments)if("string"!=typeof e)throw TypeError(`metadata.segments[${t.segments.indexOf(e)}] must be a string!`);if(null==t.hash||"string"!=typeof t.hash)throw TypeError("metadata.hash must be a string!");return this.hash=t.hash,this.filename=t.filename,this.segments=t.segments.map(t=>new o(n(t)?t:null!=this.url?t.startsWith("/")?new URL(t,window.location.href):i(s(this.url instanceof URL?this.url.toString():this.url).toString(),t):t)),this}async fetch(){return this.segments=await Promise.all(this.segments.map(t=>t.fetchSegment())),this}getComplete(){let t=null;for(let e of this.segments)if(null!=e.data){if(t){let a=t,s=e.data,n=new Uint8Array(a.byteLength+s.byteLength);n.set(new Uint8Array(a),0),n.set(new Uint8Array(s),a.byteLength),t=n.buffer}else t=e.data}else throw Error("One or more LargeEPKSegment(s) haven't been fetched yet. Did you fall fetch() beforehand?");return t}};class o{constructor(t){this.url=t}async fetchSegment(){if(null!=this.data)throw TypeError("Cannot call fetchSegment() twice!");return this.data=await (await (await fetch(this.url)).blob()).arrayBuffer(),this}}t.LargeEPKSegment=o}(EPKLib||(EPKLib={}));