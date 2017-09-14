    /**********
    *** Geomapfish compliant full text search & localisation (x,y,z using mns)
    */


  $( function() {
    function log( message ) {
      $( "<div>" ).text( message ).prependTo( "#log" );
      $( "#log" ).scrollTop( 0 );
    }
 
    $( "#places" ).autocomplete({
        source: function( request, response ) {
            $.ajax( {
                url: "http://sitn.ne.ch/production/wsgi/fulltextsearch?",
                dataType: "jsonp",
                data: {
                    query: request.term,
                    limit: 20,
                    partitionlimit: 24,
                    layer_name: 'adresses_sitn'
                },
                success: function(data) {
                    let features = data.features;
                    let jquiFeatures = [];
                    for(let i=0; i<features.length; i++) {
                        let f = features[i];
                        let jquiF = {
                            geom: f.geometry,
                            id: f.id,
                            label: f.properties.label
                        }
                        jquiFeatures.push(jquiF);
                    }

                    response( jquiFeatures );

                }
            });
        },
        minLength: 2,
        select: function(event, ui) {

            coord = ui.item.geom.coordinates;

            $.ajax({
                url: "http://sitn.ne.ch/production/wsgi/raster?",
                dataType: "jsonp",
                data: {
                    lon: coord[0],
                    lat: coord[1],
                    'layers': 'mns'
                },
                success: function(data) {
                    console.log(data)
                    let z = parseInt(data.mns) + 200;
                    let newPosition = new THREE.Vector3(coord[0], coord[1], z);
                    viewer.scene.camera.position.set(newPosition);
                    viewer.scene.view.position.x = coord[0];
                    viewer.scene.view.position.y = coord[1];
                    viewer.scene.view.position.z = z;
                    viewer.scene.view.radius = 150
                    viewer.setMoveSpeed(150);
                }
            })
        }
    });
 });
