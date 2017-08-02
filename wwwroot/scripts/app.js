var loadJSON = function (callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'fields.json', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState === 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

var init = function(){
    loadJSON(function(response) {
        var jsonObject = JSON.parse(response),
            contentPh = document.querySelector('.content-ph'),
            requestFields = jsonObject._embedded.request_fields,
            userFields = jsonObject._embedded.user_fields;

            window.requestFields = requestFields;

            for (var i in requestFields) {
                var field = requestFields[i],
                    div = document.createElement('div'),
                    simpleField = this.buildSimpleField(field),
                    title = document.createElement('label');

                    title.setAttribute('for', field.name);
                    title.innerText = field.name;

                    div.setAttribute('class', field.name + '-ph');
                    div.appendChild(title);
                    
                    if(field.type == 'enumerable'){
                        var ul = document.createElement('ul');
                        ul.setAttribute('id', field.name);
                        ul.setAttribute('name',field.name);
                        
                        
                        for (var j in simpleField) {
                            var li = simpleField[j];                            
                            ul.appendChild(li);
                        }

                        div.appendChild(ul);

                        contentPh.appendChild(div);
                    }

                    console.log('simpleField', simpleField);
                    window.simpleField = simpleField;
            }
        
    });
}

var buildSimpleField = function(field){
    this.buildCheckBoxes = function(field)
    {
        var values = field.values,
            name = field.name,
            arrRetorno = [];

        for (var i in values) {
            var value = values[i],
                key = i,
                li = document.createElement('li'),                
                input = document.createElement('input'),
                label = document.createElement('label');
                
                input.setAttribute('type','checkbox');
                input.setAttribute('name',name);
                input.setAttribute('id', key);

                label.setAttribute('for', key);
                label.innerText = value;

                li.appendChild(input);
                li.appendChild(label);

                arrRetorno.push(li)
        }

        return arrRetorno;
    }
    
    var type = field.type;
    console.log('type', type);
    switch(type){
        case 'enumerable':
            if(field.allow_multiple_value){
                var checkboxes = this.buildCheckBoxes(field);
                return checkboxes;
            }
    }
}

init();