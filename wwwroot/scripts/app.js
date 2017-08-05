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
            requestFields = jsonObject._embedded.request_fields,
            userFields = jsonObject._embedded.user_fields;

        buildRequestFields(requestFields);
        buildUserFields(userFields);
        
    });
}

var buildRequestFields = function(requestFields){
    var fieldset = document.createElement('fieldset');

    fieldset.setAttribute('class','request-fields');

    iterationFields(requestFields, fieldset);

    var buttonBuscarProfissionais = document.createElement('button');

    buttonBuscarProfissionais.setAttribute('class', 'btn btn-buscar-profissionais');
    buttonBuscarProfissionais.setAttribute('type', 'button');
    buttonBuscarProfissionais.innerText = 'Buscar Profissionais';
    
    fieldset.appendChild(buttonBuscarProfissionais);
    
    buttonBuscarProfissionais.addEventListener('click', onBtnBuscarProfissionaisClick)
}

var buildUserFields = function(userFields){
    var fieldset = document.createElement('fieldset');

    fieldset.setAttribute('class','user-fields');
    fieldset.style.display = 'none';

    iterationFields(userFields, fieldset);

    var buttonFinalizar = document.createElement('button');

    buttonFinalizar.setAttribute('class', 'btn btn-finalizar');
    buttonFinalizar.setAttribute('type', 'button');
    buttonFinalizar.innerText = 'Finalizar';
    
    buttonFinalizar.addEventListener('click', onBtnFinalizarClick)

    fieldset.appendChild(buttonFinalizar);
}

var iterationFields = function(fields, fieldset)
{
    for (var i in fields) {
        var field = fields[i],
            div = document.createElement('div'),
            simpleField = buildSimpleField(field),
            title = document.createElement('label');

            title.setAttribute('for', field.name);
            title.innerText = field.label;

            div.className += field.name + '-ph' + ' box-ph'

            div.appendChild(title);
            appendFieldByType(field, div, simpleField, fieldset);
    }
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

        this.buildDropDown = function(field)
        {
            var values = field.values,
                name = field.name,
                arrRetorno = [],
                select = document.createElement('select'),
                label = document.createElement('label'),
                defaultOption = document.createElement('option');
                
            select.setAttribute('name',name);
            select.setAttribute('id',name);

            label.setAttribute('for', name);
            label.innerText = field.label;

            defaultOption.innerText = field.mask;
            select.appendChild(defaultOption);

            for (var i in values) {
                var value = values[i],
                    key = i,
                    option = document.createElement('option');

                    option.innerText = key;
                    option.value = value;

                    select.appendChild(option)
            }

            return select;
    }

    this.buildTextArea = function(field){
        // var div = document.createElement('div'),
            var textarea = document.createElement('textarea');
            // label = document.createElement('label');

        textarea.setAttribute('name', field.name);
        textarea.setAttribute('id', field.name);
        textarea.setAttribute('placeholder', field.placeholder);

        return textarea;
    }

     this.buildInput = function(field){
        // var div = document.createElement('div'),
            var input = document.createElement('input');
            // label = document.createElement('label');

        var type = field.type == 'lat_lng' || 'small_text' ? 'text' : fied.type;

        input.setAttribute('name', field.name);
        input.setAttribute('id', field.name);
        input.setAttribute('placeholder', field.placeholder);
        input.setAttribute('type', type);

        if(field.type == 'phone'){
            input.setAttribute('pattern', '\(\d{2}\)\d{4}-\d{4}');
        }

        return input;
    }
    
    switch(field.type){
        case 'enumerable':
            if(field.allow_multiple_value){
                var checkboxes = this.buildCheckBoxes(field);
                return checkboxes;
            }
            else{
                var select = this.buildDropDown(field);
                return select;
            }
        break;
        case 'big_text':
            var textarea = this.buildTextArea(field);
            return textarea;
            break;
        case 'lat_lng':
        case 'small_text':
        case 'email':
        case 'phone':
            var input = this.buildInput(field);
            return input;
            break;
    }
}

var appendFieldByType = function(field, div, simpleField, fieldset){
    var contentPh = document.querySelector('.content-ph');
    var requiredMessage = 'Este campo é requerido';

    switch(field.type){
        case 'enumerable':
        if(field.allow_multiple_value)
        {
            var ul = document.createElement('ul');
            ul.setAttribute('id', field.name);
            ul.setAttribute('name',field.name);
            
            if(field.required){
                requiredMessage = 'Marque pelo menos uma opção';
                ul.className += 'required';
            }
            
            for (var j in simpleField) {
                var li = simpleField[j];                            
                ul.appendChild(li);
            }

            div.appendChild(ul);

        }else{
            div.appendChild(simpleField);
        }
                    
        break;
        case 'big_text':
        case 'lat_lng':
        case 'small_text':
        case 'email':
        case 'phone':
            div.appendChild(simpleField);
        break;
    }

    if(field.required){
        var spanRequired = createSpanRequired(requiredMessage);
        div.appendChild(spanRequired);
        simpleField.className += 'required';
    }

    fieldset.appendChild(div);    

    contentPh.appendChild(fieldset);
}

var createSpanRequired = function(msg){
    var spanRequired = document.createElement('span');
    spanRequired.className = 'error-message';
    spanRequired.style.display = 'none';
    spanRequired.innerText = msg;

    return spanRequired;
}

/* events */

var onBtnBuscarProfissionaisClick = function(event) {
    var fieldset = event.currentTarget.closest('fieldset');
    var valid = validar(fieldset);

    if(valid){
        document.querySelector('.request-fields').style.display = 'none';
        document.querySelector('.user-fields').style.display = 'block';
    }
}

var onBtnFinalizarClick = function(event) {
    var fieldset = event.currentTarget.closest('fieldset');
    var  valid = validar(fieldset);
}

var validar = function(fieldset)
{
    var valid = true;
    var requiredFields = fieldset.querySelectorAll('.required');

    requiredFields.forEach(function(element) {
        var falhou = false;
        switch(element.tagName) {
            case 'UL':
                var qtdSelecionados = element.querySelectorAll('input[type="checkbox"]:checked').length;
                falhou = qtdSelecionados === 0;     
            break;
            case 'SELECT':
                var valorDefaultSelecionado = element.querySelector('option').selected;
                falhou = valorDefaultSelecionado;
            break;
            case 'INPUT':
                falhou = element.value.length == 0;
            break;
        }

        if(falhou)
        {
            valid = false;
            element.parentElement.querySelector('.error-message').style.display = 'block';                                    
        }
        else{
            var errorsMessages = document.querySelectorAll('.error-message');

            if(errorsMessages.length > 0)
            errorsMessages.forEach(function(element){
                element.style.display = 'none';
            });
        }
    }, this);

    return valid;
}

init();