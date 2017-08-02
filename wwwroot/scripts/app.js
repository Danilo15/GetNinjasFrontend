var loadJSON = function (callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'fields.json', true);
    xobj.onreadystatechange = function() {
        console.log('xobj',xobj);
        if (xobj.readyState === 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

var init = function(){
    loadJSON(function(response) {
        // Parse JSON string into object
        console.log('response',response);        window.actual_JSON = JSON.parse(response);
    });
}

init();