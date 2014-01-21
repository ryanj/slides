require('reveal.js/lib/js/head.min.js');
require('reveal.js/js/reveal.min.js');
var shoe = require('shoe');
var through = require('through');
require('./key_id.js');
window.shoe = shoe;

// Full list of configuration options available here:
// https://github.com/hakimel/reveal.js#configuration
Reveal.initialize({
  controls: true,
  progress: true,
  history: true,
  center: true,
  theme: Reveal.getQueryHash().theme || 'default', // available themes are in /css/theme
  transition: Reveal.getQueryHash().transition || 'default', // default/cube/page/concave/zoom/linear/fade/none

  // Parallax scrolling
  // parallaxBackgroundImage: 'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg',
  // parallaxBackgroundSize: '2100px 900px',

  multiplex: {
    id: key_id,
    url: document.location.host
  },
  // Optional libraries used to extend on reveal.js
  dependencies: [
    { src: 'js/multiplex.js', async: true },
    { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
    { src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
    { src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
    { src: 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
    { src: 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }
  ]
});

var stream = shoe('/slidetransitions');
stream.pipe(through(function (msg) { 
  console.log(msg);
  //this.queue(String(Number(msg)^1));
})).pipe(stream);
