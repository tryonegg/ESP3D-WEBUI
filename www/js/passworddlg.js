//changepassword dialog
function changepassworddlg() {
    var modal = setactiveModal('passworddlg.html');
    if (modal == null) return;
    id('password_loader').style.display = "none";
    id('change_password_content').style.display = "block";
    id('change_password_btn').style.display = "none";
    id('password_content').innerHTML = "";
    id('password_password_text').innerHTML = "";
    id('password_password_text1').innerHTML = "";
    id('password_password_text2').innerHTML = "";
    showModal();
}


function checkpassword() {
    var pwd = id('password_password_text').value.trim();
    var pwd1 = id('password_password_text1').value.trim();
    var pwd2 = id('password_password_text2').value.trim();
    id('password_content').innerHTML = "";
    id('change_password_btn').style.display = "none";
    if (pwd1 != pwd2) id('password_content').innerHTML = translate_text_item("Passwords do not matches!");
    else if (pwd1.length < 1 || pwd1.length > 16 || pwd1.indexOf(" ") > -1) id('password_content').innerHTML = translate_text_item("Password must be >1 and <16 without space!");
    else id('change_password_btn').style.display = "block";
}


function ChangePasswordfailed(errorcode, response_text) {
    var response = JSON.parse(response_text);
    if (typeof(response.status) !== 'undefined') id('password_content').innerHTML = translate_text_item(response.status);
    console.log("Error " + errorcode + " : " + response_text);
    id('password_loader').style.display = "none";
    id('change_password_content').style.display = "block";
}

function ChangePasswordsuccess(response_text) {
    id('password_loader').style.display = "none";
    closeModal("Connection successful");
}

function SubmitChangePassword() {
    var user = id('current_ID').innerHTML.trim();
    var password = id('password_password_text').value.trim();
    var newpassword = id('password_password_text1').value.trim();
    var url = "/login?USER=" + encodeURIComponent(user) + "&PASSWORD=" + encodeURIComponent(password) + "&NEWPASSWORD=" + encodeURIComponent(newpassword) + "&SUBMIT=yes";
    id('password_loader').style.display = "block";
    id('change_password_content').style.display = "none";
    SendGetHttp(url, ChangePasswordsuccess, ChangePasswordfailed);
}