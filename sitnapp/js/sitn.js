// Basic Cutomization and extension of the standard Potree viewer


sitn = {};

sitn.loadedAnnontations = [];

sitn.setup = function (){
    $("#sldPointBudget").slider('option',{max: 15000000});
    sitn.loadInitialAnnotations('sitnapp/data/annotations/ne_districts_simple.geojson', 1000);
    
    // Customize UI...
    $("#lblCameraPosition").parents('ul').css("visibility", "hidden");
    $("#lblCameraPosition").parents('ul').css("height", "0px");

    sitn.setupClassifications();

}

sitn.setupClassifications = function () {

    viewer.classifications = {
        0: { visible: true, name: 'Jamais classé' },
        1: { visible: true, name: 'Non classé' },
        2: { visible: true, name: 'Sol' },
        3: { visible: true, name: 'Végétation basse' },
        4: { visible: true, name: 'Végétation moyenne' },
        5: { visible: true, name: 'Végétation haute' },
        6: { visible: true, name: 'Bâtiment' },
        7: { visible: true, name: 'Bruit (bas)'},
        8: { visible: true, name: 'Point clef' },
        9: { visible: true, name: 'Eau' },
        10: { visible: true, name: 'Rail' },
        11: { visible: true, name: 'Route' },
        12: { visible: true, name: 'Chevauchement' },
        13: { visible: true, name: 'Câble (Bouclier)' },
        14: { visible: true, name: 'Câble - Conducteur (Phase)' },
        15: { visible: true, name: 'Tour de transmission' },
        16: { visible: true, name: 'Pylônes' },
        17: { visible: true, name: 'Tablier de pont' },
        18: { visible: true, name: 'Bruit (haut)' },
        64: { visible: true, name: 'Voitures' },
        65: { visible: true, name: 'Grues et temporaire' },
        70: { visible: true, name: 'Façades' },
        71: { visible: true, name: 'Murs' },
        99: { visible: true, name: 'Hors périmètre' },
    };

    let elClassificationList = $('#classificationList');
    elClassificationList.empty();
    let addClassificationItem = function (code, name) {
        let inputID = 'chkClassification_' + code;

        let element = $(`
            <li>
                <label style="whitespace: nowrap">
                    <input id="${inputID}" type="checkbox" checked/>
                    <span>${name}</span>
                </label>
            </li>
        `);

        let elInput = element.find('input');

        elInput.click(event => {
            viewer.setClassificationVisibility(code, event.target.checked);
        });

        elClassificationList.append(element);
    };

    for (cls in viewer.classifications) {
        console.log(cls);
        addClassificationItem(cls, viewer.classifications[cls].name);
    }
};

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
