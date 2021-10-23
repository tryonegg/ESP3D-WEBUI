var current_active_extruder = 'T0';
var currentFR=""
var currentFLR=""

function Set_active_extruder() {
    current_active_extruder = "T" + id('active_extruder').value;
    console.log(current_active_extruder);
}

function init_extruder_panel() {
}

function process_feedRate(msg){
        var fr = msg.replace("FR:","")
        id('feedratecatched').innerHTML = fr;
        if (currentFR==""){
            id('feedSelectedValue').value=parseInt(fr);
            currentFR=fr;
        }
}

function process_flowdRate(msg){
        var flr = msg.substring(msg.indexOf("Flow:")+5)
        id('flowratecatched').innerHTML = flr;
        if (currentFLR==""){
            id('flowSelectedValue').value=parseInt(flr);
            currentFLR=flr
        }
}

function on_extruder_length_Change() {
    var value = parseInt(id('filament_length').value);
    if (value < 0.001 || value > 9999 || isNaN(value) || (value === null)) {
        //we could display error but we do not
    }
}

function on_extruder_velocity_Change() {
    var value = parseInt(id('extruder_velocity').value);
    if (value < 0.001 || value > 9999 || isNaN(value) || (value === null)) {
        //we could display error but we do not
    }
}

function Extrude_cmd(extruder, direction) {
    var filament_length = parseInt(id('filament_length').value);
    var velocity = parseInt(id('extruder_velocity').value);
    if (velocity < 1 || velocity > 9999 || isNaN(velocity) || (velocity === null)) {
        alertdlg(translate_text_item("Out of range"), translate_text_item("Value of extruder velocity must be between 1 mm/min and 9999 mm/min !"));
        return;
    }
    if (filament_length < 0.001 || filament_length > 9999 || isNaN(filament_length) || (filament_length === null)) {
        alertdlg(translate_text_item("Out of range"), translate_text_item("Value of filament length must be between 0.001 mm and 9999 mm !"));
        return;
    }
    //Todo send command by command TBD
    var command = extruder + "\n" + "G91\nG1 E" + (filament_length * direction) + " F" + velocity + "\nG90"
    SendPrinterCommand(command, true);
    //console.log(command);
}

function flowInit_cmd() {
    id('flowSelectedValue').value = 100;
    flowSet_cmd();
}

function flowSet_cmd() {
    var command = "M221 S";
    var value = parseInt(id('flowSelectedValue').value);
    if (value < 50 || value > 300 || isNaN(value)) {
        id('flowSelectedValue').value = 100;
        alertdlg(translate_text_item("Out of range"), translate_text_item("Value must be between 50% and 300% !"));
    } else {
        SendPrinterCommand(command + value, true);
    }
}

function feedInit_cmd() {
    id('feedSelectedValue').value = 100;
    feedSet_cmd();
}

function feedSet_cmd() {
    var command = "M220 S";
    var value = parseInt(id('feedSelectedValue').value);
    if (value < 25 || value > 150 || isNaN(value)) {
        id('feedSelectedValue').value = 100;
        alertdlg(translate_text_item("Out of range"), translate_text_item("Value must be between 25% and 150% !"));
    } else {
        SendPrinterCommand(command + value, true);
    }
}

function fanOff_cmd() {
    id('fanSelectedValue').value = 0;
    fanSet_cmd();
}

function fanSet_cmd() {
    var command = "M106 S";
    var fvalue = parseInt(id('fanSelectedValue').value);
    var value = Math.round((fvalue * 255) / 100);
    if (fvalue < 0 || fvalue > 100 || isNaN(fvalue) || fvalue === null) {
        id('fanSelectedValue').value = 0;
        alertdlg(translate_text_item("Out of range"), translate_text_item("Value must be between 0% and 100% !"));
    } else {
        SendPrinterCommand(command + value, true);
    }
}

function extruder_handleKeyUp(event, target) {
    if (event.keyCode == 13) {
        if (target == 'Feed') feedSet_cmd();
        else if (target == 'Flow') flowSet_cmd();
        else if (target == 'Fan') fanSet_cmd();
    }
    return true;
}
