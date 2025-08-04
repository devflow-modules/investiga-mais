'use client'

import Script from 'next/script'

export default function UtmifyScripts() {
  return (
    <>
      {/* Pixel da UTMiFY */}
      <Script id="utmify-pixel" strategy="afterInteractive">
        {`
          window.pixelId = "688e4338035d0684576dda14";
          var a = document.createElement("script");
          a.setAttribute("async", "");
          a.setAttribute("defer", "");
          a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
          document.head.appendChild(a);
        `}
      </Script>

      {/* Script de UTM da UTMiFY */}
      <Script
        id="utmify-utms"
        src="https://cdn.utmify.com.br/scripts/utms/latest.js"
        strategy="afterInteractive"
        data-utmify-prevent-xcod-sck
        data-utmify-prevent-subids
        async
        defer
      />
    </>
  )
}
