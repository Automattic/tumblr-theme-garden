(()=>{var e={942:(e,t)=>{var r;!function(){"use strict";var a={}.hasOwnProperty;function s(){for(var e="",t=0;t<arguments.length;t++){var r=arguments[t];r&&(e=m(e,n(r)))}return e}function n(e){if("string"==typeof e||"number"==typeof e)return e;if("object"!=typeof e)return"";if(Array.isArray(e))return s.apply(null,e);if(e.toString!==Object.prototype.toString&&!e.toString.toString().includes("[native code]"))return e.toString();var t="";for(var r in e)a.call(e,r)&&e[r]&&(t=m(t,r));return t}function m(e,t){return t?e?e+" "+t:e+t:e}e.exports?(s.default=s,e.exports=s):void 0===(r=function(){return s}.apply(t,[]))||(e.exports=r)}()}},t={};function r(a){var s=t[a];if(void 0!==s)return s.exports;var n=t[a]={exports:{}};return e[a](n,n.exports,r),n.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var a in t)r.o(t,a)&&!r.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";const e=window.React,t=window.wp.element,a=window.wp.i18n,s=window.wp.data,n=window.wp.compose,m=window.wp.apiFetch;var h=r.n(m);const l={logoUrl:themeGardenData.logoUrl,categories:themeGardenData.categories,baseUrl:themeGardenData.baseUrl,themes:themeGardenData.themes,selectedCategory:themeGardenData.selectedCategory,search:themeGardenData.search,selectedThemeId:themeGardenData.selectedThemeId,themeDetails:themeGardenData.themeDetails,isFetchingThemes:!1,isOverlayOpen:!!themeGardenData.selectedThemeId,isFetchingTheme:!1},c={closeOverlay:()=>({type:"CLOSE_OVERLAY"}),receiveTheme:(e,t)=>({type:"RECEIVE_THEME",theme:e,id:t}),receiveThemes:(e,t,r)=>({type:"RECEIVE_THEMES",themes:e,category:t,search:r}),beforeFetchTheme:()=>({type:"BEFORE_FETCH_THEME"}),beforeFetchThemes:()=>({type:"BEFORE_FETCH_THEMES"}),*fetchThemes(e){try{return i.FETCH_THEMES(e)}catch(e){throw new Error("Failed to fetch themes")}},*searchThemes(e){try{return i.SEARCH_THEMES(e)}catch(e){throw new Error("Failed to search themes")}},*fetchTheme(e){try{return i.FETCH_THEME(e)}catch(e){throw new Error("Failed to fetch theme")}}},o={getBaseUrl:()=>l.baseUrl,getCategories:()=>l.categories,getLogoUrl:()=>l.logoUrl,getSelectedCategory:e=>e.selectedCategory,getSearch:e=>e.search,getIsFetchingThemes:e=>e.isFetchingThemes,getIsFetchingTheme:e=>e.isFetchingTheme,getThemes:e=>e.themes,getIsOverlayOpen:e=>e.isOverlayOpen,getThemeDetails:e=>e.themeDetails},i={FETCH_THEMES:e=>h()({path:"/tumblr-theme-garden/v1/themes?category="+e,method:"GET"}).then((e=>e)).catch((e=>{throw e})),SEARCH_THEMES:e=>h()({path:"/tumblr-theme-garden/v1/themes?search="+e,method:"GET"}).then((e=>e)).catch((e=>{throw console.error("API Error:",e),e})),FETCH_THEME:e=>h()({path:"/tumblr-theme-garden/v1/theme?theme="+e,method:"GET"}).then((e=>e)).catch((e=>{throw console.error("API Error:",e),e}))},d=(0,s.createReduxStore)("tumblr-theme-garden/theme-garden-store",{reducer:(e=l,t)=>{switch(t.type){case"BEFORE_FETCH_THEMES":return{...e,isFetchingThemes:!0};case"BEFORE_FETCH_THEME":return{...e,isFetchingTheme:!0,isOverlayOpen:!0};case"RECEIVE_THEMES":return{...e,themes:t.themes,isFetchingThemes:!1,selectedCategory:t.category,search:t.search};case"RECEIVE_THEME":return{...e,isFetchingTheme:!1,themeDetails:t.theme,selectedThemeId:t.id};case"CLOSE_OVERLAY":return{...e,isOverlayOpen:!1,isFetchingTheme:!1,themeDetails:null};default:return e}},actions:c,selectors:o,controls:i});(0,s.register)(d);const g=(0,n.compose)((0,s.withSelect)((e=>({baseUrl:e("tumblr-theme-garden/theme-garden-store").getBaseUrl(),selectedCategory:e("tumblr-theme-garden/theme-garden-store").getSelectedCategory(),categories:e("tumblr-theme-garden/theme-garden-store").getCategories(),search:e("tumblr-theme-garden/theme-garden-store").getSearch(),themes:e("tumblr-theme-garden/theme-garden-store").getThemes()}))))((({baseUrl:r,selectedCategory:s,categories:n,search:m,themes:h,fetchThemesByQuery:l,fetchThemesByCategory:c})=>{const[o,i]=(0,t.useState)(s),[d,g]=(0,t.useState)(m),[u,E]=(0,t.useState)(h),b=(0,t.useRef)();return(0,t.useEffect)((()=>{E(h)}),[h]),(0,t.useEffect)((()=>{i(s)}),[s]),(0,t.useEffect)((()=>{g(m)}),[m]),(0,e.createElement)("div",{className:"wp-filter"},(0,e.createElement)("div",{className:"filter-count"},(0,e.createElement)("span",{className:"count"},u.length)),(0,e.createElement)("label",{htmlFor:"tumblr-theme-garden-categories"},(0,a._x)("Categories","label for a dropdown list of theme categories","tumblr-theme-garden")),(0,e.createElement)("select",{id:"tumblr-theme-garden-categories",name:"category",onChange:async({currentTarget:e})=>{const t=e.value;i(t),await c(t),window.history.pushState({},"",r+"&category="+t)}},(0,e.createElement)("option",{value:"featured"},(0,a._x)("Featured","The name of a category in a list of categories.","tumblr-theme-garden")),n.map((t=>(0,e.createElement)("option",{key:t.text_key,value:t.text_key,selected:o===t.text_key},t.name)))),(0,e.createElement)("p",{className:"search-box"},(0,e.createElement)("label",{htmlFor:"wp-filter-search-input"},(0,a._x)("Search Themes","label for a text input","tumblr-theme-garden")),(0,e.createElement)("input",{type:"search","aria-describedby":"live-search-desc",id:"wp-filter-search-input",className:"wp-filter-search",name:"search",value:d,onChange:async({currentTarget:e})=>{const t=e.value;g(t),clearTimeout(b.current),b.current=setTimeout((async()=>{await l(t),window.history.pushState({},"",r+"&search="+t)}),800)}})))})),u=()=>{const t=[(0,a._x)("Sadly, nothing.","The message displayed when no themes were found.","tumblr-theme-garden"),(0,a._x)("Tragically, nothing.","The message displayed when no themes were found.","tumblr-theme-garden"),(0,a._x)("We found nothing. Here it isn’t.","The message displayed when no themes were found.","tumblr-theme-garden"),(0,a._x)("Couldn’t find that. Please, don’t be upset. Please.","The message displayed when no themes were found.","tumblr-theme-garden"),(0,a._x)("Sincerely, we found nothing.","The message displayed when no themes were found.","tumblr-theme-garden"),(0,a._x)("Nothing to see here.","The message displayed when no themes were found.","tumblr-theme-garden"),(0,a._x)("If you were looking for nothing, congrats, you found it.","The message displayed when no themes were found.","tumblr-theme-garden")],r=Math.floor(Math.random()*t.length);return(0,e.createElement)("p",{className:"no-themes",id:"tumblr-no-themes"},t[r])},E=({theme:{activate_url:t,id:r,thumbnail:s,title:n},handleDetailsClick:m})=>{const h=`tumblr-theme-garden-theme-details-${r}`;return(0,e.createElement)("article",{className:"tumblr-theme",key:n},(0,e.createElement)("header",{className:"tumblr-theme-header"},(0,e.createElement)("div",{className:"tumblr-theme-title-wrapper"},(0,e.createElement)("span",{className:"tumblr-theme-title"},n))),(0,e.createElement)("div",{className:"tumblr-theme-content"},(0,e.createElement)("button",{className:"tumblr-theme-details",onClick:m,value:r,id:h},(0,e.createElement)("label",{htmlFor:h},(0,e.createElement)("span",{className:"tumblr-theme-detail-button"},(0,a._x)("Theme details","Text on a button that will show more information about a Tumblr theme","tumblr-theme-garden"))),(0,e.createElement)("img",{src:s,alt:""})),(0,e.createElement)("div",{className:"tumblr-theme-footer"},(0,e.createElement)("a",{className:"rainbow-button",href:t},"Activate"))))},b=(0,n.compose)((0,s.withSelect)((e=>({themes:e("tumblr-theme-garden/theme-garden-store").getThemes(),isFetchingThemes:e("tumblr-theme-garden/theme-garden-store").getIsFetchingThemes()}))),(0,s.withDispatch)((e=>({closeOverlay:()=>e("tumblr-theme-garden/theme-garden-store").closeOverlay()}))))((({themes:r,isFetchingThemes:a,fetchThemeById:s})=>{const[n,m]=(0,t.useState)(r);(0,t.useEffect)((()=>{m(r)}),[r]);const h=async({currentTarget:{value:e}})=>{const t=new URL(window.location.href),r=new URLSearchParams(t.search);r.append("theme",e),t.search=r.toString(),await s(e),window.history.pushState({},"",t.toString())};return a?(0,e.createElement)("div",{className:"loading-content"},(0,e.createElement)("span",{className:"spinner"})):0===n.length?(0,e.createElement)(u,null):(0,e.createElement)("div",{className:"tumblr-themes"},r.map((t=>(0,e.createElement)(E,{theme:t,handleDetailsClick:h}))))}));var p=r(942),w=r.n(p);const T=(0,n.compose)((0,s.withSelect)((e=>({themes:e("tumblr-theme-garden/theme-garden-store").getThemes(),isOverlayOpen:e("tumblr-theme-garden/theme-garden-store").getIsOverlayOpen(),isFetchingTheme:e("tumblr-theme-garden/theme-garden-store").getIsFetchingTheme(),themeDetails:e("tumblr-theme-garden/theme-garden-store").getThemeDetails()}))),(0,s.withDispatch)((e=>({closeOverlay:()=>e("tumblr-theme-garden/theme-garden-store").closeOverlay()}))))((({themes:r,isOverlayOpen:s,isFetchingTheme:n,closeOverlay:m,themeDetails:h,fetchThemeById:l})=>{const c=(0,t.useCallback)((()=>{const e=new URL(window.location.href),t=new URLSearchParams(e.search);t.delete("theme"),e.search=t.toString(),window.history.pushState({},"",e.toString()),m()}),[m]),o=(0,t.useCallback)((()=>n||!h?(0,e.createElement)("div",{className:"loading-content wp-clearfix"},(0,e.createElement)("span",{className:"spinner"})):(0,e.createElement)("div",{className:"theme-about wp-clearfix"},(0,e.createElement)("div",{className:"theme-screenshots"},(0,e.createElement)("div",{className:"screenshot"},(0,e.createElement)("img",{src:h.screenshots[0],alt:""}))),(0,e.createElement)("div",{className:"theme-info"},(0,e.createElement)("h2",{className:"theme-name"},h.title),(0,e.createElement)("div",{dangerouslySetInnerHTML:{__html:h.description}})))),[h,n]),i=(0,t.useCallback)((async e=>{const t=new URL(window.location.href),a=new URLSearchParams(t.search),s=r[e].id;a.delete("theme"),a.append("theme",s),t.search=a.toString(),await l(s),window.history.pushState({},"",t.toString())}),[r,l]),d=(0,t.useCallback)((()=>{const t=r.findIndex((e=>e.id===h.id)),s=-1===t||0===t,n=-1===t||t===r.length-1;return(0,e.createElement)("div",{className:"theme-header"},(0,e.createElement)("button",{className:w()("left","dashicons","dashicons-no",{disabled:s}),disabled:s,onClick:()=>i(t-1)},(0,e.createElement)("span",{className:"screen-reader-text"},(0,a._x)("Show previous theme","label for a button that will navigate to previous theme","tumblr-theme-garden"))),(0,e.createElement)("button",{className:w()("right","dashicons","dashicons-no",{disabled:n}),disabled:n,onClick:()=>i(t+1)},(0,e.createElement)("span",{className:"screen-reader-text"},(0,a._x)("Show next theme","label for a button that will navigate to next theme","tumblr-theme-garden"))),(0,e.createElement)("button",{className:"close dashicons dashicons-no",onClick:c},(0,e.createElement)("span",{className:"screen-reader-text"},(0,a._x)("Close theme details overlay","label for a button that will close an overlay","tumblr-theme-garden"))))}),[h,r,i,c]);return s&&h?(0,e.createElement)("div",{className:"theme-overlay",id:"tumblr-theme-overlay"},(0,e.createElement)("div",{className:"theme-backdrop"}),(0,e.createElement)("div",{className:"theme-wrap wp-clearfix"},d(),o())):null})),y=(0,n.compose)((0,s.withSelect)((e=>({logoUrl:e("tumblr-theme-garden/theme-garden-store").getLogoUrl(),selectedCategory:e("tumblr-theme-garden/theme-garden-store").getSelectedCategory(),search:e("tumblr-theme-garden/theme-garden-store").getSearch()}))),(0,s.withDispatch)((e=>({beforeFetchThemes:()=>e("tumblr-theme-garden/theme-garden-store").beforeFetchThemes(),fetchThemes:t=>e("tumblr-theme-garden/theme-garden-store").fetchThemes(t),searchThemes:t=>e("tumblr-theme-garden/theme-garden-store").searchThemes(t),receiveThemes:(t,r,a)=>e("tumblr-theme-garden/theme-garden-store").receiveThemes(t,r,a),beforeFetchTheme:()=>e("tumblr-theme-garden/theme-garden-store").beforeFetchTheme(),fetchTheme:t=>e("tumblr-theme-garden/theme-garden-store").fetchTheme(t),receiveTheme:(t,r)=>e("tumblr-theme-garden/theme-garden-store").receiveTheme(t,r),closeOverlay:()=>e("tumblr-theme-garden/theme-garden-store").closeOverlay()}))))((({logoUrl:r,beforeFetchThemes:s,fetchThemes:n,receiveThemes:m,searchThemes:h,beforeFetchTheme:l,fetchTheme:c,receiveTheme:o,closeOverlay:i,search:d,selectedCategory:u})=>{const E=(0,t.useCallback)((async e=>{s();const t=await n(e);m(t,e,"")}),[s,m,n]),p=(0,t.useCallback)((async e=>{s();const t=await h(e);m(t,"",e)}),[s,m,h]),w=(0,t.useCallback)((async()=>{const e=new URLSearchParams(window.location.search),t=e.get("category")||"featured",r=e.get("search")||"",a=e.get("theme")||"";if(""!==r&&r!==d?await p(r):""!==t&&t!==u&&await E(t),""!==a){l();const e=await c(a);o(e,a)}else i()}),[u,d,l,i,c,E,p,o]);(0,t.useEffect)((()=>(window.addEventListener("popstate",w),()=>{window.removeEventListener("popstate",w)})),[w]);const y=(0,t.useCallback)((async e=>{l();const t=await c(e);o(t,e)}),[l,o,c]);return(0,e.createElement)("div",{className:"wrap"},(0,e.createElement)("h1",{className:"wp-heading-inline",id:"theme-garden-heading"},(0,e.createElement)("img",{className:"tumblr-logo-icon",src:r,alt:""}),(0,e.createElement)("span",null,(0,a.__)("Tumblr Themes","tumblr-theme-garden"))),(0,e.createElement)(g,{fetchThemesByCategory:E,fetchThemesByQuery:p}),(0,e.createElement)(b,{fetchThemeById:y}),(0,e.createElement)(T,{fetchThemeById:y}))})),f=document.getElementById("tumblr-theme-garden");f?(0,t.createRoot)(f).render((0,e.createElement)(y,null)):console.error("Failed to find the root element for the settings panel.")})()})();