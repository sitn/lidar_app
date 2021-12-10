    /**********
    *** Geomapfish compliant full text search & localisation (x,y,z using mns)
    */
  $( function() {
    function log( message ) {
      $( "<div>" ).text( message ).prependTo( "#log" );
      $( "#log" ).scrollTop( 0 );
    }
 
    $( "#places" ).autocomplete({
        classes: {
            "ui-autocomplete": "sitn-autocomplete"
        },
        source: function( request, response ) {
            $.ajax( {
                url: "https://sitn.ne.ch/search?",
                data: {
                    query: request.term,
                    limit: 20,
                    partitionlimit: 24,
                },
                success: function(data) {
                    let features = data.features;
                    let jquiFeatures = [];
                    for(let i=0; i<features.length; i++) {
                        let f = features[i];
                        let jquiF = {
                            geom: f.geometry,
                            id: f.id,
                            label: f.properties.label,
                            feature: f
                        }
                        jquiFeatures.push(jquiF);
                    }

                    response( jquiFeatures );

                }
            });
        },

        select: function(event, ui) {

            if (ui.item.geom.type ==='Point') {
                coord = ui.item.geom.coordinates;
            } else {
                // Create an ol feature
                const geojson = new ol.format.GeoJSON();
                const geom = geojson.readFeature(ui.item.feature).getGeometry();
                const extent = geom.getExtent();
                const center_x = extent[0] + ((extent[2] - extent[0]) / 2);
                const center_y = extent[1] + ((extent[3] - extent[1]) / 2);
                coord = [
                    center_x,
                    center_y,
                ];
            }

            $.ajax({
                url: "https://sitn.ne.ch/raster?",
                data: {
                    lon: coord[0],
                    lat: coord[1],
                    'layers': 'mns'
                },
                success: function(data) {
                    let zoom_out = 200;
                    let alti = parseInt(data.mns);
                    let z = alti + zoom_out;                    
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
