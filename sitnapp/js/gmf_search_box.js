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
                    let z = parseInt(data.mns) + zoom_out;
                    let newPosition = new THREE.Vector3(coord[0], coord[1], z);
   
                    
                    let annotations = viewer.scene.getAnnotations();
                    for (let index in annotations.children) {
                        if (annotations.children[index].description == "Adresse SITN") {
                            annotations.children[index].visible = false;
                            // remove from annotation list
                        }
                    }

                    viewer.scene.addAnnotation([coord[0], coord[1], z - zoom_out], {
                        "title": ui.item.label,
                        "description": 'Adresse SITN'
                    });
                    
                    viewer.scene.view.position.x = coord[0];
                    viewer.scene.view.position.y = coord[1];
                    viewer.scene.view.position.z = z;
                    viewer.scene.view.radius = 150;
                    viewer.setMoveSpeed(150);
                    // viewer.scene.view.pitch = 1.57;

                }
            })
        }
    });
 });
