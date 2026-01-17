const fs = require('fs');

const cheerio = require('cheerio');
const path = require('path');

export default function templateContent() {
  // load all needed stuff - default index.html + loader script and styles
  // const html = fs.readFileSync(path.resolve(__dirname, 'index.html')).toString();
  const html = fs.readFileSync('./app/heySpace/index.html').toString();

  //const loaderScript = fs.readFileSync(path.resolve(__dirname, 'loader/loader.js')).toString();
  //const loaderStyles = fs.readFileSync(path.resolve(__dirname, 'loader/styles.css')).toString();

  const loaderScript = fs.readFileSync('./app/heySpace/loader/loader.js').toString();
  const loaderStyles = fs.readFileSync('./app/heySpace/loader/styles.css').toString();

  // cheerio gives us jQuery like API to modify 'DOM' in node environment like in browser
  // but first we need to 'load' html we will be working on
  const $ = cheerio.load(html, { _useHtmlParser2: true });

  $(`<script type="text/javascript" src="/config.js?v=${APP_VERSION}"></script>`).appendTo('head');
  $(`<style>${loaderStyles}</style>`).appendTo('head');
  $(`<script>
    (function () {
      var config = window.__tc3_config || {};
      var externalResources = config.externalResources || {};
      var head = document.getElementsByTagName('head')[0];

      function isEnabled(key) {
        return Boolean(externalResources[key]);
      }

      function appendScript(src, isAsync) {
        var script = document.createElement('script');
        script.src = src;
        if (isAsync) {
          script.async = true;
        }
        head.appendChild(script);
      }

      function appendStylesheet(href) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        head.appendChild(link);
      }

      if (isEnabled('calendly')) {
        appendStylesheet('https://assets.calendly.com/assets/external/widget.css');
        appendScript('https://assets.calendly.com/assets/external/widget.js', true);
      }

      if (isEnabled('googleFonts')) {
        appendStylesheet('https://fonts.googleapis.com/css?family=Varela+Round:');
        appendStylesheet('https://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,700italic,400,600,700');
      }

      if (isEnabled('googleApis')) {
        appendScript('https://apis.google.com/js/api.js?onload=loadPicker', true);
      }

      if (isEnabled('jitsi')) {
        appendScript('https://meet.jit.si/external_api.js', true);
      }
    })();
  </script>`).appendTo('head');
  if (process.env.NODE_ENV === 'production') {
    $(`<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`).appendTo('head');
  }
  $(`<script>${loaderScript}</script>`).insertAfter('.loader-wrapper');

  // html-webpack-plugin expects us to pass string template of html so it can inject all bundled files produced by webpack
  return '<!doctype html>'.concat($('html').toString());
}
