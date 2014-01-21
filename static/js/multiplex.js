(function() {
    if ( window.location.search.match( /receiver/gi )
      || localStorage.secret == undefined
      || localStorage.secret == null
       ) {
        //Persist presenter token when supplied via hash:
        if ( window.location.hash.match( /#setToken-[^ ]/i )){
          console.log('Persisting presenter token');
          localStorage.secret = window.location.hash.slice(10);
          window.location.hash = '';
          window.location.reload();
        }
        console.log('Configuring client mode');
        var multiplex = Reveal.getConfig().multiplex;
        var socketId = multiplex.id;

        var stream = shoe('/slidetransitions');

        stream.on(multiplex.id, function(data) {
                // ignore data from sockets that aren't ours
                if (data.socketId !== socketId) { return; }
                if( window.location.host === 'localhost:1947' ) return;
          if( data.indexh !== undefined && data.indexv !== undefined){
                   Reveal.slide(data.indexh, data.indexv, null, 'remote');
          }else{
            if(data.direction == 'next'){
              Reveal.nextFragment();
            }else{
              Reveal.prevFragment();
            }
          }
        });
    }else{
        if ( window.location.hash.match( /#clearToken/i )){
          localStorage.clear();
          window.location.hash = '';
          window.location.reload();
        }
        console.log('sending broadcaster tokens...');
        var multiplex = Reveal.getConfig().multiplex;
        //var socket = io.connect(multiplex.url);
        var stream = shoe('/slidetransitions');

        Reveal.addEventListener( 'fragmentshown', function( event ) {
          console.log(event);
                var data = {
                        secret: localStorage.secret,
                        socketId : multiplex.id,
            direction: 'next'
                };
                if( typeof event.origin === 'undefined' && event.origin !== 'remote' ) stream.write('navigation', data);
        } );

        Reveal.addEventListener( 'fragmenthidden', function( event ) {
          console.log(event);
                var data = {
                        secret: localStorage.secret,
                        socketId : multiplex.id,
            direction: 'prev'
                };
                if( typeof event.origin === 'undefined' && event.origin !== 'remote' ) stream.write('navigation', data);
        } );

        Reveal.addEventListener( 'slidechanged', function( event ) {
                var nextindexh;
                var nextindexv;
                var slideElement = event.currentSlide;

                if (slideElement.nextElementSibling && slideElement.parentNode.nodeName == 'SECTION') {
                        nextindexh = event.indexh;
                        nextindexv = event.indexv + 1;
                } else {
                        nextindexh = event.indexh + 1;
                        nextindexv = 0;
                }

                var slideData = {
                        indexh : event.indexh,
                        indexv : event.indexv,
                        nextindexh : nextindexh,
                        nextindexv : nextindexv,
                        secret: localStorage.secret,
                        socketId : multiplex.id
                };

                if( typeof event.origin === 'undefined' && event.origin !== 'remote' ) stream.write('slidechanged', slideData);
        } );
    }
}());
