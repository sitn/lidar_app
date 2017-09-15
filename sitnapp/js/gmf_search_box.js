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
                    let zoom_out = 200;
                    let alti = parseInt(data.mns);
                    let z = alti + zoom_out;
                    let newPosition = new THREE.Vector3(coord[0], coord[1], z);
   
                    
                    let annotationsA = viewer.scene.getAnnotations();
                    for (let index in annotationsA.children) {
                        if (annotationsA.children[index].description == "Adresse SITN") {
                            annotationsA.children[index].visible = false;
                        }
                    }

                    viewer.scene.addAnnotation([coord[0], coord[1], z - zoom_out], {
                        "title": ui.item.label,
                        "description": 'Adresse SITN',
                        "cameraPosition": [coord[0], coord[1], alti + zoom_out],
                        "cameraTarget": [coord[0], coord[1], alti]
                    });
                    let annotationsB = viewer.scene.getAnnotations();
                    for (let index in annotationsB.children) {
                        if (annotationsB.children[index].description == "Adresse SITN") {
                            annotationsB.children[index].elDescription.css('opacity', 0); // hugly hack
                            annotationsB.children[index].moveHere(viewer.scene.camera);
                        }
                    }

                }
            })
        }
    });
 });
