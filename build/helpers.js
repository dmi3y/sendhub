$(function(){
    'use strict';

    function toggleButton(el, state) {

    if (state) {

        el.removeAttr('disabled');
    } else {

        el.attr('disabled', 'disabled');
    }
}

function getSubmitData(form) {
    var
        out = {},
        data = $(form).serializeArray(),
        len = data.length,
        name,
        val;

    for (; len--;) {

        name = data[len].name;
        val = data[len].value;
        out[name.toUpperCase()] = val;
    }
    return out;
}

function validateNumber(number) {
    var
        isValid;

    number = number || '';
    number = number.replace(/[()-\s\.]/g, '');
    isValid = number.length === 10;

    return isValid;
}

function sendMessage() {

    console.log.apply(console, arguments);
}

function parseJson(data) {
    var
        out;

    try {

        out = JSON.parse(data);
    } catch (e) {

        sendMessage('Parse error');
    }

    return out;
}


    SendHub.hlprs = {
        validateNumber: validateNumber,
        getSubmitData: getSubmitData,
        toggleButton: toggleButton,
        sendMessage: sendMessage,
        parseJson: parseJson
    };
});