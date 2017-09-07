// Basic Cutomization and extension of the standard Potree viewer


sitn = {};

sitn.loadedAnnontations = [];

sitn.setup = function (){
    $("#sldPointBudget").slider('option',{max: 15000000});
    sitn.loadInitialAnnotations('sitnapp/data/annotations/ne_districts_simple.geojson', 1000);
    
    // Customize UI...
    $("#lblCameraPosition").parents('ul').css("visibility", "hidden");
    $("#lblCameraPosition").parents('ul').css("height", "0px");
    
    // hide tile layer in ol3 map
    viewer.mapView.getSourcesLayer().setVisible(false);

}

sitn.loadInitialAnnotations = function (url, zoom_out) {

    $.ajax({
        url: url ,
        dataType: 'json',
        cache: false,
        success: function(geojson) {

        for (let i=0; i<geojson.features.length; i++) {

                let coord = geojson.features[i].geometry.coordinates;

                viewer.scene.addAnnotation([coord[0], coord[1], coord[2]], {
                    "title": geojson.features[i].properties.NAME,
                    "description": '',
                    "cameraPosition": [coord[0] + zoom_out, coord[1] + zoom_out, coord[2] + zoom_out],
                    "cameraTarget": [coord[0], coord[1], coord[2]]
                });
            }

            let annotations = viewer.scene.getAnnotations().children;

            for (let i=0; i<annotations.length; i++) {
                annotations[i].domElement[0].onclick = function() {
                    sitn.loadAnnotations('sitnapp/data/annotations/' + geojson.features[i].properties.next_file, 250);
                }
                annotations[i].firstLevel = true;
                console.log(annotations[i])
            }
        },
        error: function(req, status, err) {
            console.log('MC: Erreur au chargement du fichier geojson', status, err );
        }
    }); 

}


sitn.loadAnnotations = function (url, zoom_out) {

    $.ajax({
        url: url ,
        dataType: 'json',
        cache: false,
        success: function(geojson) {

            for (let i=0; i<geojson.features.length; i++) {
                    let aName = geojson.features[i].properties.NAME;
                    if(sitn.loadedAnnontations.indexOf(aName) == -1) {
                        let coord = geojson.features[i].geometry.coordinates;

                        viewer.scene.addAnnotation([coord[0], coord[1], coord[2]], {
                            "title": aName,
                            "description": '',
                            "cameraPosition": [coord[0] + zoom_out, coord[1] + zoom_out, coord[2] + zoom_out],
                            "cameraTarget": [coord[0], coord[1], coord[2]]
                        });
                        
                        sitn.loadedAnnontations.push(aName)
                    }
                }
            let annotations = viewer.scene.getAnnotations().children;
            for (let i=0; i<annotations.length; i++) {
                if (!annotations[i].firstLevel) {
                    annotations[i].domElement[0].style.fontSize ='12px';
                }
            }
        },
        error: function(req, status, err) {
            console.log('MC: Erreur au chargement du fichier geojson', status, err );
        }
    }); 

}
