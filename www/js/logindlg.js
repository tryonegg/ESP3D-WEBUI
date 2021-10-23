//login dialog
function logindlg(closefunc, check_first) {
    var modal = setactiveModal('logindlg.html', closefunc);
    var need_query_auth = false;
    if (modal == null) return;
    id('login_title').innerHTML = translate_text_item("Identification requested");
    id('login_loader').style.display = "none";
    id('login_content').style.display = "block";
    if (typeof check_first !== 'undefined') need_query_auth = check_first;
    if (need_query_auth) {
        var url = "/login";
        SendGetHttp(url, checkloginsuccess);
    } else {
        showModal();
    }
}

function checkloginsuccess(response_text) {
    var response = JSON.parse(response_text);
    if (typeof(response.authentication_lvl) !== 'undefined') {
        if (response.authentication_lvl != "guest") {
            if (typeof(response.authentication_lvl) !== 'undefined') id('current_auth_level').innerHTML = "(" + translate_text_item(response.authentication_lvl) + ")";
            if (typeof(response.user) !== 'undefined') id('current_ID').innerHTML = response.user;
            closeModal('cancel');
        } else showModal();
    } else {
        showModal();
    }
}

function login_id_OnKeyUp(event) {
    //console.log(event.keyCode);
    if ((event.keyCode == 13)) id('login_password_text').focus();
}

function login_password_OnKeyUp(event) {
    //console.log(event.keyCode);
    if ((event.keyCode == 13)) id('login_submit_btn').click();
}


function loginfailed(errorcode, response_text) {
    var response = JSON.parse(response_text);
    if (typeof(response.status) !== 'undefined') id('login_title').innerHTML = translate_text_item(response.status);
    else id('login_title').innerHTML = translate_text_item("Identification invalid!");
    console.log("Error " + errorcode + " : " + response_text);
    id('login_content').style.display = "block";
    id('login_loader').style.display = "none";
    id('current_ID').innerHTML = translate_text_item("guest");
    id('logout_menu').style.display = "none";
    id('logout_menu_divider').style.display = "none";
    id("password_menu").style.display = "none";
}

function loginsuccess(response_text) {
    var response = JSON.parse(response_text);
    if (typeof(response.authentication_lvl) !== 'undefined') id('current_auth_level').innerHTML = "(" + translate_text_item(response.authentication_lvl) + ")";
    id('login_loader').style.display = "none";
    id('logout_menu').style.display = "block";
    id('logout_menu_divider').style.display = "block";
    id("password_menu").style.display = "block";
    closeModal("Connection successful");
}

function SubmitLogin() {
    var user = id('login_user_text').value.trim();
    var password = id('login_password_text').value.trim();
    var url = "/login?USER=" + encodeURIComponent(user) + "&PASSWORD=" + encodeURIComponent(password) + "&SUBMIT=yes";
    id('current_ID').innerHTML = user;
    id('current_auth_level').innerHTML = "";
    id('login_content').style.display = "none";
    id('login_loader').style.display = "block";
    SendGetHttp(url, loginsuccess, loginfailed);
}

function GetIdentificationStatus() {
    var url = "/login";
    SendGetHttp(url, GetIdentificationStatusSuccess);
}

function GetIdentificationStatusSuccess(response_text) {
    var response = JSON.parse(response_text);
    if (typeof(response.authentication_lvl) !== 'undefined') {
        if (response.authentication_lvl == "guest") {
            id('current_ID').innerHTML = translate_text_item("guest");
            id('current_auth_level').innerHTML = "";
        }
    }
}

function DisconnectionSuccess(response_text) {
    id('current_ID').innerHTML = translate_text_item("guest");
    id('current_auth_level').innerHTML = "";
    id('logout_menu').style.display = "none";
    id('logout_menu_divider').style.display = "none";
    id("password_menu").style.display = "none";
}

function DisconnectionFailed(errorcode, response) {
    id('current_ID').innerHTML = translate_text_item("guest");
    id('current_auth_level').innerHTML = "";
    id('logout_menu').style.display = "none";
    id('logout_menu_divider').style.display = "none";
    id("password_menu").style.display = "none";
    console.log("Error " + errorcode + " : " + response);
}

function DisconnectLogin(answer) {
    if (answer == "yes") {
        var url = "/login?DISCONNECT=yes";
        SendGetHttp(url, DisconnectionSuccess, DisconnectionFailed);
    }
}