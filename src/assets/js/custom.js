/* Google Tag Manager */

var GTM_ID = "GTM-5R4S8V4"; /* GA/GTM Container ID for environment */

const gtmId = GTM_ID;
function addGTM(doc) {
  const newScript = doc.createElement("script");
  const scriptText = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&amp;l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;
  newScript.innerHTML = scriptText;
  doc.head.append(newScript);

  const noscript = doc.createElement("noscript");
  const noscriptText = `&lt;iframe src="//www.googletagmanager.com/ns.html?id=${gtmId}"
height="0" width="0" style="display:none;visibility:hidden"&gt;&lt;/iframe&gt;`;
  noscript.innerHTML = noscriptText;
  doc.body.insertBefore(noscript, doc.body.firstChild);
}
addGTM(document);

/* Hide chat widget on the home page */
function updateChatWidgetStyle() {
  const styleId = "hide-chat-widget-style";
  let styleEl = document.getElementById(styleId);

  if (window.location.href.includes("/nde/home")) {
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.innerHTML = ".lh3-chat-widget { display: none !important; }";
      document.head.appendChild(styleEl);
    }
  } else {
    if (styleEl) {
      styleEl.remove();
    }
  }
}

// Check periodically since Primo is a Single Page Application (SPA) where the URL changes dynamically
setInterval(updateChatWidgetStyle, 500);
