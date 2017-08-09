function hidePasswordMessages() { //Uses jQuery to add classes to different ID's in the html
    $("#passwordChangeSuccess").addClass("hide");
    $("#passwordChangeError").addClass("hide");
}
function requestPasswordChange(username) {
    $.ajax({
        url: "/api/updatePassword",
        type: "POST",
        data: JSON.stringify({ //Uses jQuery to get values from the ID's in the html and turns them into
            user: username,    //a JSON string
            currentPassword: $("#currentPassword").val(),
            password: $("#password").val(),
            password2: $("#password2").val(),
        }),
        contentType: "application/json"
    })
        .done(function (data) {     //When done it calls the hide messages classes and then removes the classes
            hidePasswordMessages(); //from the ID's
            if (data.successMessage) {
                $("#passwordChangeSuccess").removeClass("hide").children(".alert").text(data.successMessage);
            } else if (data.errorMessage) {
                $("#passwordChangeError").removeClass("hide").children(".alert").text(data.errorMessage);
            }
        })
        .fail(function (jqXHR) {    //On fail it also removes the class and gives an error
            $("#passwordChangeError").removeClass("hide").children(".alert").text("AJAX Error: " + jqXHR.responseText);
        });
}
$(document).ready(function () {     //When the document is ready it adds the value of "" to class passwordReset
    $('#profileModal').on('hidden.bs.modal', function (e) {
        $(".passwordReset").val("");
        hidePasswordMessages();
    })
});
