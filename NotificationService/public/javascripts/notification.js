function getApiHost() {
    return document.location.href.substring(0, document.location.href.length - 1);
}

function setSuccessValidation(isEnabled) {
    $.get(
        getApiHost() + "/setSuccessValidationResponse",
        {
            enabled: isEnabled
        },
    );
}

function getSuccessValidation() {
    return $.getJSON(
        getApiHost() + "/getSuccessValidationResponse"
    );
}

function sendSuccessValidation() {
    setSuccessValidation(
        $("#successValidationEnabled").is(":checked")
    );
}

function sendAddUserRequest() {
    var data = document.getElementById('promotion').value;

    $.post(
        getApiHost() + "/adduser",
        { result: data }
    ).fail(function () {
        alert("Error occured during SaveCustomResultCode");
    })
};

$(document).ready(function () {
    getSuccessValidation().then(function (result) {
        if (result.SuccessValidationResponse)
            $("#successValidationEnabled").attr('checked', 'checked');
    });


});