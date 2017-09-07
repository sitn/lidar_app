// SITN classes colors

sitn = {};

sitn.loadedAnnontations = [];

sitn.setup = function (){
    $("#sldPointBudget").slider('option',{max: 15000000});
    sitn.loadInitialAnnotations('sitnapp/data/annotations/ne_districts_simple.geojson', 1000);
// Potree.Classification = {
        // 'DEFAULT': {
            // 0: new THREE.Vector4(0.5, 0.5, 0.5, 1.0),
            // 1: new THREE.Vector4(0.5, 0.5, 0.5, 1.0),
            // 2: new THREE.Vector4(0.63, 0.32, 0.18, 1.0),
            // 3: new THREE.Vector4(0.0, 1.0, 0.0, 1.0),
            // 4: new THREE.Vector4(0.0, 0.8, 0.0, 1.0),
            // 5: new THREE.Vector4(0.0, 0.6, 0.0, 1.0),
            // 6: new THREE.Vector4(1.0, 0.66, 0.0, 1.0),
            // 7:	new THREE.Vector4(1.0, 0, 1.0, 1.0),
            // 8: new THREE.Vector4(1.0, 0, 0.0, 1.0),
            // 9: new THREE.Vector4(0.0, 0.0, 1.0, 1.0),
            // 12:	new THREE.Vector4(1.0, 1.0, 0.0, 1.0),
            // 'DEFAULT': new THREE.Vector4(0.3, 0.6, 0.6, 0.5)
        // }
    // };
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

            annotations = viewer.scene.getAnnotations().children;

            for (let i=0; i<annotations.length; i++) {
                annotations[i].domElement[0].onclick = function() {
                    sitn.loadAnnotations('sitnapp/data/annotations/' + geojson.features[i].properties.next_file, 250);
                }
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
        },
        error: function(req, status, err) {
            console.log('MC: Erreur au chargement du fichier geojson', status, err );
        }
    }); 

}
