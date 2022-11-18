!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var i=t();for(var a in i)("object"==typeof exports?exports:e)[a]=i[a]}}(this,(()=>(()=>{"use strict";var e,t,i={},a={};function n(e){var t=a[e];if(void 0!==t)return t.exports;var s=a[e]={exports:{}};return i[e](s,s.exports,n),s.exports}n.m=i,n.d=(e,t)=>{for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},n.f={},n.e=e=>Promise.all(Object.keys(n.f).reduce(((t,i)=>(n.f[i](e,t),t)),[])),n.u=e=>e+".qr-bundle.js",n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e={},t="fhmap:",n.l=(i,a,s,r)=>{if(e[i])e[i].push(a);else{var o,h;if(void 0!==s)for(var d=document.getElementsByTagName("script"),c=0;c<d.length;c++){var l=d[c];if(l.getAttribute("src")==i||l.getAttribute("data-webpack")==t+s){o=l;break}}o||(h=!0,(o=document.createElement("script")).charset="utf-8",o.timeout=120,n.nc&&o.setAttribute("nonce",n.nc),o.setAttribute("data-webpack",t+s),o.src=i),e[i]=[a];var g=(t,a)=>{o.onerror=o.onload=null,clearTimeout(u);var n=e[i];if(delete e[i],o.parentNode&&o.parentNode.removeChild(o),n&&n.forEach((e=>e(a))),t)return t(a)},u=setTimeout(g.bind(null,void 0,{type:"timeout",target:o}),12e4);o.onerror=g.bind(null,o.onerror),o.onload=g.bind(null,o.onload),h&&document.head.appendChild(o)}},n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;n.g.importScripts&&(e=n.g.location+"");var t=n.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var i=t.getElementsByTagName("script");i.length&&(e=i[i.length-1].src)}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),n.p=e})(),(()=>{var e={179:0};n.f.j=(t,i)=>{var a=n.o(e,t)?e[t]:void 0;if(0!==a)if(a)i.push(a[2]);else{var s=new Promise(((i,n)=>a=e[t]=[i,n]));i.push(a[2]=s);var r=n.p+n.u(t),o=new Error;n.l(r,(i=>{if(n.o(e,t)&&(0!==(a=e[t])&&(e[t]=void 0),a)){var s=i&&("load"===i.type?"missing":i.type),r=i&&i.target&&i.target.src;o.message="Loading chunk "+t+" failed.\n("+s+": "+r+")",o.name="ChunkLoadError",o.type=s,o.request=r,a[1](o)}}),"chunk-"+t,t)}};var t=(t,i)=>{var a,s,[r,o,h]=i,d=0;if(r.some((t=>0!==e[t]))){for(a in o)n.o(o,a)&&(n.m[a]=o[a]);h&&h(n)}for(t&&t(i);d<r.length;d++)s=r[d],n.o(e,s)&&e[s]&&e[s][0](),e[s]=0},i=this.webpackChunkfhmap=this.webpackChunkfhmap||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))})();var s={};n.r(s);class r{constructor(e,t,i,a,n){this._legacyCanvasSize=r.DEFAULT_CANVAS_SIZE,this._preferredCamera="environment",this._maxScansPerSecond=25,this._lastScanTimestamp=-1,this._destroyed=this._flashOn=this._paused=this._active=!1,this.$video=e,this.$canvas=document.createElement("canvas"),i&&"object"==typeof i?this._onDecode=t:(i||a||n?console.warn("You're using a deprecated version of the QrScanner constructor which will be removed in the future"):console.warn("Note that the type of the scan result passed to onDecode will change in the future. To already switch to the new api today, you can pass returnDetailedScanResult: true."),this._legacyOnDecode=t),t="object"==typeof i?i:{},this._onDecodeError=t.onDecodeError||("function"==typeof i?i:this._onDecodeError),this._calculateScanRegion=t.calculateScanRegion||("function"==typeof a?a:this._calculateScanRegion),this._preferredCamera=t.preferredCamera||n||this._preferredCamera,this._legacyCanvasSize="number"==typeof i?i:"number"==typeof a?a:this._legacyCanvasSize,this._maxScansPerSecond=t.maxScansPerSecond||this._maxScansPerSecond,this._onPlay=this._onPlay.bind(this),this._onLoadedMetaData=this._onLoadedMetaData.bind(this),this._onVisibilityChange=this._onVisibilityChange.bind(this),this._updateOverlay=this._updateOverlay.bind(this),e.disablePictureInPicture=!0,e.playsInline=!0,e.muted=!0;let s=!1;if(e.hidden&&(e.hidden=!1,s=!0),document.body.contains(e)||(document.body.appendChild(e),s=!0),i=e.parentElement,t.highlightScanRegion||t.highlightCodeOutline){if(a=!!t.overlay,this.$overlay=t.overlay||document.createElement("div"),(n=this.$overlay.style).position="absolute",n.display="none",n.pointerEvents="none",this.$overlay.classList.add("scan-region-highlight"),!a&&t.highlightScanRegion){this.$overlay.innerHTML='<svg class="scan-region-highlight-svg" viewBox="0 0 238 238" preserveAspectRatio="none" style="position:absolute;width:100%;height:100%;left:0;top:0;fill:none;stroke:#e9b213;stroke-width:4;stroke-linecap:round;stroke-linejoin:round"><path d="M31 2H10a8 8 0 0 0-8 8v21M207 2h21a8 8 0 0 1 8 8v21m0 176v21a8 8 0 0 1-8 8h-21m-176 0H10a8 8 0 0 1-8-8v-21"/></svg>';try{this.$overlay.firstElementChild.animate({transform:["scale(.98)","scale(1.01)"]},{duration:400,iterations:1/0,direction:"alternate",easing:"ease-in-out"})}catch(e){}i.insertBefore(this.$overlay,this.$video.nextSibling)}t.highlightCodeOutline&&(this.$overlay.insertAdjacentHTML("beforeend",'<svg class="code-outline-highlight" preserveAspectRatio="none" style="display:none;width:100%;height:100%;fill:none;stroke:#e9b213;stroke-width:5;stroke-dasharray:25;stroke-linecap:round;stroke-linejoin:round"><polygon/></svg>'),this.$codeOutlineHighlight=this.$overlay.lastElementChild)}this._scanRegion=this._calculateScanRegion(e),requestAnimationFrame((()=>{let t=window.getComputedStyle(e);"none"===t.display&&(e.style.setProperty("display","block","important"),s=!0),"visible"!==t.visibility&&(e.style.setProperty("visibility","visible","important"),s=!0),s&&(console.warn("QrScanner has overwritten the video hiding style to avoid Safari stopping the playback."),e.style.opacity="0",e.style.width="0",e.style.height="0",this.$overlay&&this.$overlay.parentElement&&this.$overlay.parentElement.removeChild(this.$overlay),delete this.$overlay,delete this.$codeOutlineHighlight),this.$overlay&&this._updateOverlay()})),e.addEventListener("play",this._onPlay),e.addEventListener("loadedmetadata",this._onLoadedMetaData),document.addEventListener("visibilitychange",this._onVisibilityChange),window.addEventListener("resize",this._updateOverlay),this._qrEnginePromise=r.createQrEngine()}static set WORKER_PATH(e){console.warn("Setting QrScanner.WORKER_PATH is not required and not supported anymore. Have a look at the README for new setup instructions.")}static async hasCamera(){try{return!!(await r.listCameras(!1)).length}catch(e){return!1}}static async listCameras(e=!1){if(!navigator.mediaDevices)return[];let t,i=async()=>(await navigator.mediaDevices.enumerateDevices()).filter((e=>"videoinput"===e.kind));try{e&&(await i()).every((e=>!e.label))&&(t=await navigator.mediaDevices.getUserMedia({audio:!1,video:!0}))}catch(e){}try{return(await i()).map(((e,t)=>({id:e.deviceId,label:e.label||(0===t?"Default Camera":`Camera ${t+1}`)})))}finally{t&&(console.warn("Call listCameras after successfully starting a QR scanner to avoid creating a temporary video stream"),r._stopVideoStream(t))}}async hasFlash(){let e;try{if(this.$video.srcObject){if(!(this.$video.srcObject instanceof MediaStream))return!1;e=this.$video.srcObject}else e=(await this._getCameraStream()).stream;return"torch"in e.getVideoTracks()[0].getSettings()}catch(e){return!1}finally{e&&e!==this.$video.srcObject&&(console.warn("Call hasFlash after successfully starting the scanner to avoid creating a temporary video stream"),r._stopVideoStream(e))}}isFlashOn(){return this._flashOn}async toggleFlash(){this._flashOn?await this.turnFlashOff():await this.turnFlashOn()}async turnFlashOn(){if(!this._flashOn&&!this._destroyed&&(this._flashOn=!0,this._active&&!this._paused))try{if(!await this.hasFlash())throw"No flash available";await this.$video.srcObject.getVideoTracks()[0].applyConstraints({advanced:[{torch:!0}]})}catch(e){throw this._flashOn=!1,e}}async turnFlashOff(){this._flashOn&&(this._flashOn=!1,await this._restartVideoStream())}destroy(){this.$video.removeEventListener("loadedmetadata",this._onLoadedMetaData),this.$video.removeEventListener("play",this._onPlay),document.removeEventListener("visibilitychange",this._onVisibilityChange),window.removeEventListener("resize",this._updateOverlay),this._destroyed=!0,this._flashOn=!1,this.stop(),r._postWorkerMessage(this._qrEnginePromise,"close")}async start(){if(this._destroyed)throw Error("The QR scanner can not be started as it had been destroyed.");if((!this._active||this._paused)&&("https:"!==window.location.protocol&&console.warn("The camera stream is only accessible if the page is transferred via https."),this._active=!0,!document.hidden))if(this._paused=!1,this.$video.srcObject)await this.$video.play();else try{let{stream:e,facingMode:t}=await this._getCameraStream();!this._active||this._paused?r._stopVideoStream(e):(this._setVideoMirror(t),this.$video.srcObject=e,await this.$video.play(),this._flashOn&&(this._flashOn=!1,this.turnFlashOn().catch((()=>{}))))}catch(e){if(!this._paused)throw this._active=!1,e}}stop(){this.pause(),this._active=!1}async pause(e=!1){if(this._paused=!0,!this._active)return!0;this.$video.pause(),this.$overlay&&(this.$overlay.style.display="none");let t=()=>{this.$video.srcObject instanceof MediaStream&&(r._stopVideoStream(this.$video.srcObject),this.$video.srcObject=null)};return e?(t(),!0):(await new Promise((e=>setTimeout(e,300))),!!this._paused&&(t(),!0))}async setCamera(e){e!==this._preferredCamera&&(this._preferredCamera=e,await this._restartVideoStream())}static async scanImage(e,t,i,a,n=!1,s=!1){let o,h=!1;t&&("scanRegion"in t||"qrEngine"in t||"canvas"in t||"disallowCanvasResizing"in t||"alsoTryWithoutScanRegion"in t||"returnDetailedScanResult"in t)?(o=t.scanRegion,i=t.qrEngine,a=t.canvas,n=t.disallowCanvasResizing||!1,s=t.alsoTryWithoutScanRegion||!1,h=!0):t||i||a||n||s?console.warn("You're using a deprecated api for scanImage which will be removed in the future."):console.warn("Note that the return type of scanImage will change in the future. To already switch to the new api today, you can pass returnDetailedScanResult: true."),t=!!i;try{let d,c,l;if([i,d]=await Promise.all([i||r.createQrEngine(),r._loadImage(e)]),[a,c]=r._drawToCanvas(d,o,a,n),i instanceof Worker){let e=i;t||r._postWorkerMessageSync(e,"inversionMode","both"),l=await new Promise(((t,i)=>{let n,s,h,d=-1;s=a=>{a.data.id===d&&(e.removeEventListener("message",s),e.removeEventListener("error",h),clearTimeout(n),null!==a.data.data?t({data:a.data.data,cornerPoints:r._convertPoints(a.data.cornerPoints,o)}):i(r.NO_QR_CODE_FOUND))},h=t=>{e.removeEventListener("message",s),e.removeEventListener("error",h),clearTimeout(n),i("Scanner error: "+(t?t.message||t:"Unknown Error"))},e.addEventListener("message",s),e.addEventListener("error",h),n=setTimeout((()=>h("timeout")),1e4);let l=c.getImageData(0,0,a.width,a.height);d=r._postWorkerMessageSync(e,"decode",l,[l.data.buffer])}))}else l=await Promise.race([new Promise(((e,t)=>window.setTimeout((()=>t("Scanner error: timeout")),1e4))),(async()=>{try{var[t]=await i.detect(a);if(!t)throw r.NO_QR_CODE_FOUND;return{data:t.rawValue,cornerPoints:r._convertPoints(t.cornerPoints,o)}}catch(i){if(t=i.message||i,/not implemented|service unavailable/.test(t))return r._disableBarcodeDetector=!0,r.scanImage(e,{scanRegion:o,canvas:a,disallowCanvasResizing:n,alsoTryWithoutScanRegion:s});throw`Scanner error: ${t}`}})()]);return h?l:l.data}catch(t){if(!o||!s)throw t;let d=await r.scanImage(e,{qrEngine:i,canvas:a,disallowCanvasResizing:n});return h?d:d.data}finally{t||r._postWorkerMessage(i,"close")}}setGrayscaleWeights(e,t,i,a=!0){r._postWorkerMessage(this._qrEnginePromise,"grayscaleWeights",{red:e,green:t,blue:i,useIntegerApproximation:a})}setInversionMode(e){r._postWorkerMessage(this._qrEnginePromise,"inversionMode",e)}static async createQrEngine(e){return e&&console.warn("Specifying a worker path is not required and not supported anymore."),!r._disableBarcodeDetector&&"BarcodeDetector"in window&&BarcodeDetector.getSupportedFormats&&(await BarcodeDetector.getSupportedFormats()).includes("qr_code")?new BarcodeDetector({formats:["qr_code"]}):n.e(126).then(n.bind(n,126)).then((e=>e.createWorker()))}_onPlay(){this._scanRegion=this._calculateScanRegion(this.$video),this._updateOverlay(),this.$overlay&&(this.$overlay.style.display=""),this._scanFrame()}_onLoadedMetaData(){this._scanRegion=this._calculateScanRegion(this.$video),this._updateOverlay()}_onVisibilityChange(){document.hidden?this.pause():this._active&&this.start()}_calculateScanRegion(e){let t=Math.round(2/3*Math.min(e.videoWidth,e.videoHeight));return{x:Math.round((e.videoWidth-t)/2),y:Math.round((e.videoHeight-t)/2),width:t,height:t,downScaledWidth:this._legacyCanvasSize,downScaledHeight:this._legacyCanvasSize}}_updateOverlay(){requestAnimationFrame((()=>{if(this.$overlay){var e=this.$video,t=e.videoWidth,i=e.videoHeight,a=e.offsetWidth,n=e.offsetHeight,s=e.offsetLeft,r=e.offsetTop,o=window.getComputedStyle(e),h=o.objectFit,d=t/i,c=a/n;switch(h){case"none":var l=t,g=i;break;case"fill":l=a,g=n;break;default:("cover"===h?d>c:d<c)?l=(g=n)*d:g=(l=a)/d,"scale-down"===h&&(l=Math.min(l,t),g=Math.min(g,i))}var[u,m]=o.objectPosition.split(" ").map(((e,t)=>{const i=parseFloat(e);return e.endsWith("%")?(t?n-g:a-l)*i/100:i}));o=this._scanRegion.width||t,c=this._scanRegion.height||i,h=this._scanRegion.x||0;var v=this._scanRegion.y||0;(d=this.$overlay.style).width=o/t*l+"px",d.height=c/i*g+"px",d.top=`${r+m+v/i*g}px`,i=/scaleX\(-1\)/.test(e.style.transform),d.left=`${s+(i?a-u-l:u)+(i?t-h-o:h)/t*l}px`,d.transform=e.style.transform}}))}static _convertPoints(e,t){if(!t)return e;let i=t.x||0,a=t.y||0,n=t.width&&t.downScaledWidth?t.width/t.downScaledWidth:1;t=t.height&&t.downScaledHeight?t.height/t.downScaledHeight:1;for(let s of e)s.x=s.x*n+i,s.y=s.y*t+a;return e}_scanFrame(){!this._active||this.$video.paused||this.$video.ended||("requestVideoFrameCallback"in this.$video?this.$video.requestVideoFrameCallback.bind(this.$video):requestAnimationFrame)((async()=>{if(!(1>=this.$video.readyState)){var e=Date.now()-this._lastScanTimestamp,t=1e3/this._maxScansPerSecond;e<t&&await new Promise((i=>setTimeout(i,t-e))),this._lastScanTimestamp=Date.now();try{var i=await r.scanImage(this.$video,{scanRegion:this._scanRegion,qrEngine:this._qrEnginePromise,canvas:this.$canvas})}catch(e){if(!this._active)return;this._onDecodeError(e)}!r._disableBarcodeDetector||await this._qrEnginePromise instanceof Worker||(this._qrEnginePromise=r.createQrEngine()),i?(this._onDecode?this._onDecode(i):this._legacyOnDecode&&this._legacyOnDecode(i.data),this.$codeOutlineHighlight&&(clearTimeout(this._codeOutlineHighlightRemovalTimeout),this._codeOutlineHighlightRemovalTimeout=void 0,this.$codeOutlineHighlight.setAttribute("viewBox",`${this._scanRegion.x||0} ${this._scanRegion.y||0} ${this._scanRegion.width||this.$video.videoWidth} ${this._scanRegion.height||this.$video.videoHeight}`),this.$codeOutlineHighlight.firstElementChild.setAttribute("points",i.cornerPoints.map((({x:e,y:t})=>`${e},${t}`)).join(" ")),this.$codeOutlineHighlight.style.display="")):this.$codeOutlineHighlight&&!this._codeOutlineHighlightRemovalTimeout&&(this._codeOutlineHighlightRemovalTimeout=setTimeout((()=>this.$codeOutlineHighlight.style.display="none"),100))}this._scanFrame()}))}_onDecodeError(e){e!==r.NO_QR_CODE_FOUND&&console.log(e)}async _getCameraStream(){if(!navigator.mediaDevices)throw"Camera not found.";let e=/^(environment|user)$/.test(this._preferredCamera)?"facingMode":"deviceId",t=[{width:{min:1024}},{width:{min:768}},{}],i=t.map((t=>Object.assign({},t,{[e]:{exact:this._preferredCamera}})));for(let e of[...i,...t])try{let t=await navigator.mediaDevices.getUserMedia({video:e,audio:!1});return{stream:t,facingMode:this._getFacingMode(t)||(e.facingMode?this._preferredCamera:"environment"===this._preferredCamera?"user":"environment")}}catch(e){}throw"Camera not found."}async _restartVideoStream(){let e=this._paused;await this.pause(!0)&&!e&&this._active&&await this.start()}static _stopVideoStream(e){for(let t of e.getTracks())t.stop(),e.removeTrack(t)}_setVideoMirror(e){this.$video.style.transform="scaleX("+("user"===e?-1:1)+")"}_getFacingMode(e){return(e=e.getVideoTracks()[0])?/rear|back|environment/i.test(e.label)?"environment":/front|user|face/i.test(e.label)?"user":null:null}static _drawToCanvas(e,t,i,a=!1){i=i||document.createElement("canvas");let n=t&&t.x?t.x:0,s=t&&t.y?t.y:0,r=t&&t.width?t.width:e.videoWidth||e.width,o=t&&t.height?t.height:e.videoHeight||e.height;return a||(a=t&&t.downScaledWidth?t.downScaledWidth:r,t=t&&t.downScaledHeight?t.downScaledHeight:o,i.width!==a&&(i.width=a),i.height!==t&&(i.height=t)),(t=i.getContext("2d",{alpha:!1})).imageSmoothingEnabled=!1,t.drawImage(e,n,s,r,o,0,0,i.width,i.height),[i,t]}static async _loadImage(e){if(e instanceof Image)return await r._awaitImageLoad(e),e;if(e instanceof HTMLVideoElement||e instanceof HTMLCanvasElement||e instanceof SVGImageElement||"OffscreenCanvas"in window&&e instanceof OffscreenCanvas||"ImageBitmap"in window&&e instanceof ImageBitmap)return e;if(!(e instanceof File||e instanceof Blob||e instanceof URL||"string"==typeof e))throw"Unsupported image type.";{let t=new Image;t.src=e instanceof File||e instanceof Blob?URL.createObjectURL(e):e.toString();try{return await r._awaitImageLoad(t),t}finally{(e instanceof File||e instanceof Blob)&&URL.revokeObjectURL(t.src)}}}static async _awaitImageLoad(e){e.complete&&0!==e.naturalWidth||await new Promise(((t,i)=>{let a=n=>{e.removeEventListener("load",a),e.removeEventListener("error",a),n instanceof ErrorEvent?i("Image load error"):t()};e.addEventListener("load",a),e.addEventListener("error",a)}))}static async _postWorkerMessage(e,t,i,a){return r._postWorkerMessageSync(await e,t,i,a)}static _postWorkerMessageSync(e,t,i,a){if(!(e instanceof Worker))return-1;let n=r._workerMessageId++;return e.postMessage({id:n,type:t,data:i},a),n}}r.DEFAULT_CANVAS_SIZE=400,r.NO_QR_CODE_FOUND="No QR code found",r._disableBarcodeDetector=!1,r._workerMessageId=0;const o=r,h={maxScansPerSecond:3,preferedCamera:"environment",highlightScanRegion:!0,highlightCodeOutline:!1};return window.addEventListener("load",(function(){const e=document.createElement("video");e.setAttribute("width",window.innerWidth),e.setAttribute("height",window.innerHeight),e.style.position="absolute",document.querySelector(".container").appendChild(e),new o(e,(e=>{e.data&&(this.stop(),alert(e.data),console.log(e))}),h).start()}),!1),s})()));