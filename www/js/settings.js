var scl = []; // setting_configList
var setting_error_msg = "";
var setting_lasti = -1;
var setting_lastj = -1;
var current_setting_filter = 'network';
var setup_is_done = false;
var do_not_build_settings = false;

function refreshSettings(hide_setting_list) {
    if (http_communication_locked) {
        id('config_status').innerHTML = translate_text_item("Communication locked by another process, retry later.");
        return;
    }
    if (typeof hide_setting_list != 'undefined') do_not_build_settings = hide_setting_list;
    else do_not_build_settings = false;
    displayBlock('settings_loader');
    displayNone('settings_list_content');
    displayNone('settings_status');
    displayNone('settings_refresh_btn');

    scl = [];
    //removeIf(production)
    var response_text = "{\"EEPROM\":[{\"F\":\"network\",\"P\":\"0\",\"T\":\"B\",\"V\":\"2\",\"H\":\"Wifi mode\",\"O\":[{\"AP\":\"1\"},{\"STA\":\"2\"}]},{\"F\":\"network\",\"P\":\"1\",\"T\":\"S\",\"V\":\"totolink_luc\",\"S\":\"32\",\"H\":\"Station SSID\",\"M\":\"1\"},{\"F\":\"network\",\"P\":\"34\",\"T\":\"S\",\"V\":\"********\",\"S\":\"64\",\"H\":\"Station Password\",\"M\":\"0\"},{\"F\":\"network\",\"P\":\"99\",\"T\":\"B\",\"V\":\"1\",\"H\":\"Station IP Mode\",\"O\":[{\"DHCP\":\"1\"},{\"Static\":\"2\"}]},{\"F\":\"network\",\"P\":\"100\",\"T\":\"A\",\"V\":\"192.168.0.1\",\"H\":\"Station Static IP\"},{\"F\":\"network\",\"P\":\"104\",\"T\":\"A\",\"V\":\"255.255.255.0\",\"H\":\"Station Static Mask\"},{\"F\":\"network\",\"P\":\"108\",\"T\":\"A\",\"V\":\"192.168.0.12\",\"H\":\"Station Static Gateway\"},{\"F\":\"network\",\"P\":\"130\",\"T\":\"S\",\"V\":\"lucesp\",\"H\":\"Hostname\" ,\"S\":\"32\", \"M\":\"1\"},{\"F\":\"network\",\"P\":\"112\",\"T\":\"I\",\"V\":\"115200\",\"H\":\"Baud Rate\",\"O\":[{\"9600\":\"9600\"},{\"19200\":\"19200\"},{\"38400\":\"38400\"},{\"57600\":\"57600\"},{\"115200\":\"115200\"},{\"230400\":\"230400\"},{\"250000\":\"250000\"}]},{\"F\":\"network\",\"P\":\"116\",\"T\":\"B\",\"V\":\"2\",\"H\":\"Station Network Mode\",\"O\":[{\"11b\":\"1\"},{\"11g\":\"2\"},{\"11n\":\"3\"}]},{\"F\":\"network\",\"P\":\"117\",\"T\":\"B\",\"V\":\"0\",\"H\":\"Sleep Mode\",\"O\":[{\"None\":\"0\"},{\"Light\":\"1\"},{\"Modem\":\"2\"}]},{\"F\":\"network\",\"P\":\"118\",\"T\":\"B\",\"V\":\"9\",\"H\":\"AP Channel\",\"O\":[{\"1\":\"1\"},{\"2\":\"2\"},{\"3\":\"3\"},{\"4\":\"4\"},{\"5\":\"5\"},{\"6\":\"6\"},{\"7\":\"7\"},{\"8\":\"8\"},{\"9\":\"9\"},{\"10\":\"10\"},{\"11\":\"11\"}]},{\"F\":\"network\",\"P\":\"119\",\"T\":\"B\",\"V\":\"2\",\"H\":\"Authentication\",\"O\":[{\"Open\":\"0\"},{\"WPA\":\"2\"},{\"WPA2\":\"3\"},{\"WPA/WPA2\":\"4\"}]},{\"F\":\"network\",\"P\":\"120\",\"T\":\"B\",\"V\":\"1\",\"H\":\"SSID Visible\",\"O\":[{\"No\":\"0\"},{\"Yes\":\"1\"}]},{\"F\":\"network\",\"P\":\"121\",\"T\":\"I\",\"V\":\"80\",\"H\":\"Web Port\",\"S\":\"65001\",\"M\":\"1\"},{\"F\":\"network\",\"P\":\"125\",\"T\":\"I\",\"V\":\"8881\",\"H\":\"Data Port\",\"S\":\"65001\",\"M\":\"1\"},{\"F\":\"network\",\"P\":\"176\",\"T\":\"S\",\"V\":\"********\",\"S\":\"16\",\"H\":\"Admin Password\",\"M\":\"1\"},{\"F\":\"network\",\"P\":\"197\",\"T\":\"S\",\"V\":\"********\",\"S\":\"16\",\"H\":\"User Password\",\"M\":\"1\"},{\"F\":\"network\",\"P\":\"218\",\"T\":\"S\",\"V\":\"MYESP\",\"S\":\"32\",\"H\":\"AP SSID\",\"M\":\"1\"},{\"F\":\"network\",\"P\":\"251\",\"T\":\"S\",\"V\":\"********\",\"S\":\"64\",\"H\":\"AP Password\",\"M\":\"0\"},{\"F\":\"network\",\"P\":\"329\",\"T\":\"B\",\"V\":\"2\",\"H\":\"AP IP Mode\",\"O\":[{\"DHCP\":\"1\"},{\"Static\":\"2\"}]},{\"F\":\"network\",\"P\":\"316\",\"T\":\"A\",\"V\":\"192.168.0.1\",\"H\":\"AP Static IP\"},{\"F\":\"network\",\"P\":\"320\",\"T\":\"A\",\"V\":\"255.255.255.0\",\"H\":\"AP Static Mask\"},{\"F\":\"network\",\"P\":\"324\",\"T\":\"A\",\"V\":\"192.168.0.1\",\"H\":\"AP Static Gateway\"},{\"F\":\"network\",\"P\":\"330\",\"T\":\"B\",\"V\":\"1\",\"H\":\"AP Network Mode\",\"O\":[{\"11b\":\"1\"},{\"11g\":\"2\"}]},{\"F\":\"printer\",\"P\":\"461\",\"T\":\"B\",\"V\":\"4\",\"H\":\"TargetFW\",\"O\":[{\"Repetier\":\"5\"},{\"Repetier for Davinci\":\"1\"},{\"Marlin\":\"2\"},{\"MarlinKimbra\":\"3\"},{\"Smoothieware\":\"4\"},{\"Unknown\":\"0\"}]},{\"F\":\"printer\",\"P\":\"129\",\"T\":\"B\",\"V\":\"3\",\"H\":\"Temperature Refresh Time\",\"S\":\"99\",\"M\":\"0\"},{\"F\":\"printer\",\"P\":\"164\",\"T\":\"I\",\"V\":\"1500\",\"H\":\"XY feedrate\",\"S\":\"9999\",\"M\":\"1\"},{\"F\":\"printer\",\"P\":\"168\",\"T\":\"I\",\"V\":\"110\",\"H\":\"Z feedrate\",\"S\":\"9999\",\"M\":\"1\"},{\"F\":\"printer\",\"P\":\"172\",\"T\":\"I\",\"V\":\"400\",\"H\":\"E feedrate\",\"S\":\"9999\",\"M\":\"1\"},{\"F\":\"printer\",\"P\":\"331\",\"T\":\"S\",\"V\":\"NO\",\"S\":\"128\",\"H\":\"Camera address\",\"M\":\"0\"},{\"F\":\"printer\",\"P\":\"460\",\"T\":\"B\",\"V\":\"3\",\"H\":\"Position Refresh Time\",\"S\":\"99\",\"M\":\"0\"}]}";
    getESPsettingsSuccess(response_text);
    return;
    //endRemoveIf(production)
    var url = "/command?plain=" + encodeURIComponent("[ESP400]");
    SendGetHttp(url, getESPsettingsSuccess, getESPsettingsfailed)
}

function build_select_flag_for_setting_list(i, j) {
    var html = "";
    var flag =
        html += "<select class='form-control' id='setting_" + i + "_" + j + "' onchange='setting_checkchange(" + i + "," + j + ")' >";
    html += "<option value='1'";
    var tmp = scl[i].defaultvalue
    tmp |= getFlag(i, j);
    if (tmp == scl[i].defaultvalue) html += " selected ";
    html += ">";
    html += translate_text_item("Disable", true);
    html += "</option>\n";
    html += "<option value='0'";
    var tmp = scl[i].defaultvalue
    tmp &= ~(getFlag(i, j));
    if (tmp == scl[i].defaultvalue) html += " selected ";
    html += ">";
    html += translate_text_item("Enable", true);
    html += "</option>\n";
    html += "</select>\n";
    //console.log("default:" + scl[i].defaultvalue);
    //console.log(html);
    return html;
}

function build_select_for_setting_list(i, j) {
    var html = "<select class='form-control input-min wauto' id='setting_" + i + "_" + j + "' onchange='setting_checkchange(" + i + "," + j + ")' >";
    for (var oi = 0; oi < scl[i].Options.length; oi++) {
        html += "<option value='" + scl[i].Options[oi].id + "'";
        if (scl[i].Options[oi].id == scl[i].defaultvalue) html += " selected ";
        html += ">";
        html += translate_text_item(scl[i].Options[oi].display, true);
        //Ugly workaround for OSX Chrome and Safari
        if (browser_is("MacOSX")) html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        html += "</option>\n";
    }
    html += "</select>\n";
    //console.log("default:" + scl[i].defaultvalue);
    //console.log(html);
    return html;
}

function getFWshortnamefromid(value) {
    var response = 0;
    if (value == 1) response = "repetier4davinci";
    else if (value == 5) response = "repetier";
    else if (value == 2) response = "marlin";
    else if (value == 3) response = "marlinkimbra";
    else if (value == 4) response = "smoothieware";
    else if (value == 6) response = "grbl";
    else response = "???";
    return response;
}

function update_UI_setting() {
    for (var i = 0; i < scl.length; i++) {
        switch (scl[i].pos) {
            //EP_TARGET_FW		461 
            case "461":
                target_firmware = getFWshortnamefromid(scl[i].defaultvalue);
                update_UI_firmware_target();
                init_files_panel(false);
                break;
                // EP_IS_DIRECT_SD   850
            case "850":
                direct_sd = (scl[i].defaultvalue == 1) ? true : false;
                update_UI_firmware_target();
                init_files_panel(false);
                break;
            case "130":
                //set title using hostname
                Set_page_title(scl[i].defaultvalue);
                break;
        }


    }
}
//to generate setting editor in setting or setup
function build_control_from_index(i, extra_set_function) {
    var content = "<table>";
    if (i < scl.length) {
        var nbsub = 1;
        if (scl[i].type == "F") {
            nbsub = scl[i].Options.length;
        }
        for (var sub_element = 0; sub_element < nbsub; sub_element++) {
            if (sub_element > 0) {
                content += "<tr><td style='height:10px;'></td></tr>";
            }
            content += "<tr><td style='vertical-align: middle;'>";
            if (scl[i].type == "F") {
                content += translate_text_item(scl[i].Options[sub_element].display, true);
                content += "</td><td>&nbsp;</td><td>";
            }

            content += "<div id='status_setting_" + i + "_" + sub_element + "' class='form-group has-feedback' style='margin: auto;'>";
            content += "<div class='item-flex-row'>";
            content += "<table><tr><td>";
            content += "<div class='input-group'>";
            content += "<div class='input-group-btn'>";
            content += "<button class='btn btn-default btn-svg' onclick='setting_revert_to_default(" + i + "," + sub_element + ")' >";
            content += get_icon_svg("repeat");
            content += "</button>";
            content += "</div>";
            content += "<input class='hide_it'></input>";
            content += "</div>";
            content += "</td><td>";
            content += "<div class='input-group'>";
            content += "<span class='input-group-addon hide_it' ></span>";
            //flag
            if (scl[i].type == "F") {
                //console.log(scl[i].label + " " + scl[i].type);
                //console.log(scl[i].Options.length);
                content += build_select_flag_for_setting_list(i, sub_element);

            }
            //drop list
            else if (scl[i].Options.length > 0) {
                content += build_select_for_setting_list(i, sub_element);
            }
            //text
            else {
                input_type = scl[i].defaultvalue.startsWith("******") ? "password" : "text";
                content += "<input id='setting_" + i + "_" + sub_element + "' type='" + input_type + "' class='form-control input-min'  value='" + scl[i].defaultvalue + "' onkeyup='setting_checkchange(" + i + "," + sub_element + ")' >";
                }
            content += "<span id='icon_setting_" + i + "_" + sub_element + "'class='form-control-feedback ico_feedback'></span>";
            content += "<span class='input-group-addon hide_it' ></span>";
            content += "</div>";
            content += "</td></tr></table>";
            content += "<div class='input-group'>";
            content += "<input class='hide_it'></input>";
            content += "<div class='input-group-btn'>";
            content += "<button  id='btn_setting_" + i + "_" + sub_element + "' class='btn btn-default' onclick='settingsetvalue(" + i + "," + sub_element + ");";
            if (typeof extra_set_function != 'undefined') {
                content += extra_set_function + "(" + i + ");"
            }
            content += "' translate english_content='Set' >" + translate_text_item("Set") + "</button>";
            if (scl[i].pos == EP_STA_SSID) {
                content += "<button class='btn btn-default btn-svg' onclick='scanwifidlg(\"" + i + "\",\"" + sub_element + "\")'>";
                content += get_icon_svg("search");
                content += "</button>";
            }
            content += "</div>";
            content += "</div>";
            content += "</div>";
            content += "</div>";
            content += "</td></tr>";
        }
    }
    content += "</table>";
    return content;
}

//get setting UI for specific component instead of parse all   
function get_index_from_eeprom_pos(pos) {
    for (var i = 0; i < scl.length; i++) {
        if (pos == scl[i].pos) {
            return i;
        }
    }
    return -1;
}

function build_control_from_pos(pos, extra) {
    return build_control_from_index(get_index_from_eeprom_pos(pos), extra);
}

function build_HTML_setting_list(filter) {
    //this to prevent concurent process to update after we clean content
    if (do_not_build_settings) return;
    var content = "";
    current_setting_filter = filter;
    id(current_setting_filter + "_setting_filter").checked = true;
    for (var i = 0; i < scl.length; i++) {
        if ((scl[i].F.trim().toLowerCase() == filter) || (filter == "all")) {
            content += "<tr>";
            content += "<td style='vertical-align:middle'>";
            content += translate_text_item(scl[i].label, true);
            content += "</td>";
            content += "<td style='vertical-align:middle'>";
            content += "<table><tr><td>" + build_control_from_index(i) + "</td></tr></table>";
            content += "</td>";
            content += "</tr>\n";
        }
    }
    if (content.length > 0) id('settings_list_data').innerHTML = content;
}

function setting_check_value(value, i, j) {
    var valid = true;
    var entry = scl[i];
    //console.log("checking value");
    if (entry.type == "F") return valid;
    //does it part of a list?
    if (entry.Options.length > 0) {
        var in_list = false;
        for (var i = 0; i < entry.Options.length; i++) {
            //console.log("checking *" + entry.Options[i].id + "* and *"+ value + "*" );
            if (entry.Options[i].id == value) in_list = true;
        }
        valid = in_list;
        if (!valid) setting_error_msg = " in provided list";
    }
    //check byte / integer
    if (entry.type == "B" || entry.type == "I") {
        //cannot be empty
        value.trim();
        if (value.length == 0) valid = false;
        //check minimum?
        if (parseInt(entry.min_val) > parseInt(value)) valid = false;
        //check maximum?
        if (parseInt(entry.max_val) < parseInt(value)) valid = false;
        if (!valid) setting_error_msg = " between " + entry.min_val + " and " + entry.max_val;
        if (isNaN(value)) valid = false;
    } else if (entry.type == "S") {
        //check minimum?
        if (entry.min_val > value.length) valid = false;
        //check maximum?
        if (entry.max_val < value.length) valid = false;
        if (value == "********") valid = false;
        if (!valid) setting_error_msg = " between " + entry.min_val + " char(s) and " + entry.max_val + " char(s) long, and not '********'";
    } else if (entry.type == "A") {
        //check ip address
        var ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!value.match(ipformat)) {
            valid = false;
            setting_error_msg = " a valid IP format (xxx.xxx.xxx.xxx)";
        }
    }
    return valid;
}

function process_settings_answer(response_text) {
    var result = true;
    try {
        var response = JSON.parse(response_text);
        if (typeof response.EEPROM == 'undefined') {
            result = false;
            console.log('No EEPROM');
        } else {
            //console.log("EEPROM has " + response.EEPROM.length + " entries");
            if (response.EEPROM.length > 0) {
                var vi = 0;
                for (var i = 0; i < response.EEPROM.length; i++) {
                    vi = create_setting_entry(response.EEPROM[i], vi);

                }
                if (vi > 0) {
                    if (setup_is_done) build_HTML_setting_list(current_setting_filter);
                    update_UI_setting();
                } else result = false;
            } else result = false;
        }
    } catch (e) {
        console.error("Parsing error:", e);
        result = false;
    }
    return result;
}

function create_setting_entry(sentry, vi) {
    if (!is_setting_entry(sentry)) return vi;
    var slabel = sentry.H;
    var svalue = sentry.V;
    var scmd = "[ESP401]P=" + sentry.P + " T=" + sentry.T + " V=";
    var options = [];
    var min;
    var max;
    if (typeof sentry.M !== 'undefined') {
        min = sentry.M;
    } else { //add limit according the type
        if (sentry.T == "B") min = -127
        else if (sentry.T == "S") min = 0
        else if (sentry.T == "A") min = 7
        else if (sentry.T == "I") min = 0
    }
    if (typeof sentry.S !== 'undefined') {
        max = sentry.S;
    } else { //add limit according the type
        if (sentry.T == "B") max = 255;
        else if (sentry.T == "S") max = 255;
        else if (sentry.T == "A") max = 15;
        else if (sentry.T == "I") max = 2147483647;
    }
    //list possible options if defined
    if (typeof sentry.O !== 'undefined') {
        for (var i in sentry.O) {
            var key = i;
            var val = sentry.O[i];
            for (var j in val) {
                var sub_key = j;
                var sub_val = val[j];
                sub_val = sub_val.trim();
                sub_key = sub_key.trim();
                var option = {
                    id: sub_val,
                    display: sub_key
                };
                options.push(option);
                //console.log("*" + sub_key + "* and *" + sub_val + "*");
            }
        }
    }
    svalue = svalue.trim();
    //create entry in list
    var config_entry = {
        index: vi,
        F: sentry.F,
        label: slabel,
        defaultvalue: svalue,
        cmd: scmd,
        Options: options,
        min_val: min,
        max_val: max,
        type: sentry.T,
        pos: sentry.P
    };
    scl.push(config_entry);
    vi++;
    return vi;
}
//check it is valid entry
function is_setting_entry(sline) {
    if (typeof sline.T === 'undefined' || typeof sline.V === 'undefined' || typeof sline.P === 'undefined' || typeof sline.H === 'undefined') {
        return false
    }
    return true;
}

function getFlag(i, j) {
    var flag = 0;
    if (scl[i].type != "F") return -1;
    if (scl[i].Options.length <= j) return -1;
    flag = parseInt(scl[i].Options[j].id);
    return flag;
}

function getFlag_description(i, j) {
    if (scl[i].type != "F") return -1;
    if (scl[i].Options.length <= j) return -1;
    return scl[i].Options[j].display;
}

function setting(i,j) {
    return id('setting_' + i + "_" + j);
}
function setBtn(i, j, value) {
    id('btn_setting_' + i + "_" + j).className = "btn " + value;
}
function setStatus(i, j, value) {
    id('status_setting_' + i + "_" + j).className = "form-group " + value;
}
function setIcon(i, j, value) {
    id('icon_setting_' + i + "_" + j).className = "form-control-feedback " + value;
}
function setIconHTML(i, j, value) {
    id('icon_setting_' + i + "_" + j).innerHTML = value;
}

function setting_revert_to_default(i, j) {
    if (typeof j == 'undefined') j = 0;
    if (scl[i].type == "F") {
        var flag = getFlag(i, j);
        var enabled = 0;
        var tmp = parseInt(scl[i].defaultvalue);
        tmp |= flag;
        if (tmp == parseInt(scl[i].defaultvalue)) setting(i, j).value = "1";
        else setting(i,j).value = "0";
    } else setting(i, j).value = scl[i].defaultvalue
    setBtn(i, j, "btn-default");
    setStatus(i, j, "form-group has-feedback");
    setIconHTML(i, j, "");
}

function settingsetvalue(i, j) {
    var sub = 0;
    if (typeof j != 'undefined') sub = j;
    //remove possible spaces
    value = setting(i, sub).value.trim();
    //Apply flag here
    if (scl[i].type == "F") {
        var tmp = scl[i].defaultvalue;
        if (value == "1") {
            tmp |= getFlag(i, j);
        } else {
            tmp &= ~(getFlag(i, j));
        }
        value = tmp;
    }
    if (value == scl[i].defaultvalue) return;
    //check validity of value
    var isvalid = setting_check_value(value, i, j);
    //if not valid show error
    if (!isvalid) {
        setsettingerror(i);
        alertdlg(translate_text_item("Out of range"), translate_text_item("Value must be ") + setting_error_msg + " !");
    } else {
        //value is ok save it
        var cmd = scl[i].cmd + value;
        setting_lasti = i;
        setting_lastj = j;
        scl[i].defaultvalue = value;
        setBtn(i, sub, "btn-success");
        setIcon(i, sub, "has-success ico_feedback");
        setIconHTML(i, sub, get_icon_svg("ok"));
        setStatus(i, sub, "has-feedback has-success");
        var url = "/command?plain=" + encodeURIComponent(cmd);
        SendGetHttp(url, setESPsettingsSuccess, setESPsettingsfailed);
    }
}

function setting_checkchange(i, j) {
    //console.log("list value changed");
    var val = setting(i, j).value.trim();
    if (scl[i].type == "F") {
        //console.log("it is flag value");
        var tmp = scl[i].defaultvalue;
        if (val == "1") {
            tmp |= getFlag(i, j);
        } else {
            tmp &= ~(getFlag(i, j));
        }
        val = tmp;
    }
    //console.log("value: " + val);
    //console.log("default value: " + scl[i].defaultvalue);
    if (scl[i].defaultvalue == val) {
        console.log("values are identical");
        setBtn(i, j, "btn-default");
        setIcon(i, j, "");
        setIconHTML(i, j, "");
        setStatus(i, j, "has-feedback");
    } else if (setting_check_value(val, i, j)) {
        //console.log("Check passed");
        setsettingchanged(i, j);
    } else {
        console.log("change bad");
        setsettingerror(i, j);
    }

}

function setsettingchanged(i, j) {
    setStatus(i, j, "has-feedback has-warning");
    setBtn(i, j, "btn-warning");
    setIcon(i, j, "has-warning ico_feedback");
    setIconHTML(i, j, get_icon_svg("warning-sign"));
}

function setsettingerror(i, j) {
    setBtn(i, j, "btn-danger");
    setIcon(i, j, "has-error ico_feedback");
    setIconHTML(i, j, get_icon_svg("remove"));
    setStatus(i, j, "has-feedback has-error");
}

function setESPsettingsSuccess(response) {
    //console.log(response);
    update_UI_setting();
}

function setESPsettingsfailed(error_code, response) {
    alertdlg(translate_text_item("Set failed"), "Error " + error_code + " :" + response);
    console.log("Error " + error_code + " :" + response);
    setBtn(setting_lasti, setting_lastj, "btn-danger");
    id('icon_setting_' + setting_lasti + "_" + setting_lastj).className = "form-control-feedback has-error ico_feedback";
    id('icon_setting_' + setting_lasti + "_" + setting_lastj).innerHTML = get_icon_svg("remove");
    setStatus(setting_lasti, setting_lastj, "has-feedback has-error");
}

function getESPsettingsSuccess(response) {
    if (!process_settings_answer(response)) {
        getESPsettingsfailed(406, translate_text_item("Wrong data"));
        console.log(response);
        return;
    }
    displayNone('settings_loader');
    displayBlock('settings_list_content');
    displayNone('settings_status');
    displayBlock('settings_refresh_btn');
}

function getESPsettingsfailed(error_code, response) {
    console.log("Error " + error_code + " :" + response);
    displayNone('settings_loader');
    displayBlock('settings_status');
    id('settings_status').innerHTML = translate_text_item("Failed:") + error_code + " " + response;
    displayBlock('settings_refresh_btn');
}

function restart_esp() {
    confirmdlg(translate_text_item("Please Confirm"), translate_text_item("Restart FluidNC"), process_restart_esp);
}

function process_restart_esp(answer) {
    if (answer == "yes") {
        restartdlg();
    }
}

function define_esp_role(index) {
    switch (Number(scl[index].defaultvalue)) {
        case SETTINGS_FALLBACK_MODE:
            displayBlock("setup_STA");
            displayBlock("setup_AP");
            break;
        case SETTINGS_AP_MODE:
            displayNone("setup_STA");
            displayBlock("setup_AP");
            break;
        case SETTINGS_STA_MODE:
            displayBlock("setup_STA");
            displayNone("setup_AP");
            break;
        default:
            displayNone("setup_STA");
            displayNone("setup_AP");
            break;
    }
}
function define_esp_role_from_pos(pos) {
    define_esp_role(get_index_from_eeprom_pos(pos))
}
