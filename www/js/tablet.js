aud=new AudioContext() // browsers limit the number of concurrent audio contexts, so you better re-use'em

var gCodeLoaded = false;

function beep(vol, freq, duration){
    //    v=aud.createOscillator()
    v=aud.createConstantSource()
    u=aud.createGain()
    v.connect(u)
//    v.frequency.value=freq
//    v.type='square'
    u.connect(aud.destination)
    u.gain.value=vol*0.1
    v.start(aud.currentTime)
    v.stop(aud.currentTime+duration*0.001)
}

function tabletClick() {
    window.navigator.vibrate(200);
    beep(3, 400, 10);
    //    id('click').play();
}

sendCommand = function(cmd) {
    console.log(cmd);
    SendPrinterCommand(cmd, true, get_Position);
}

moveTo = function(location) {
    // Always force G90 mode because synchronization of modal reports is unreliable
    var feedrate = 1000;
    var cmd;
    // For controllers that permit it, specifying mode and move in one block is safer
    cmd = 'G90 G0 ' + location;
    sendCommand(cmd);
}

MDI = function(field) {
    tabletClick();
    mdicmd = id(field).value;
    sendCommand(mdicmd);
}

inputFocused = function() {
    isInputFocused = true;
}

inputBlurred = function() {
    isInputFocused = false;
}

zeroAxis = function(axis) {
    tabletClick();
    sendCommand('G10 L20 P1 ' + axis + '0');
}

toggleUnits = function() {
    tabletClick();
    if (modal.units == 'G21') {
	sendCommand('G20');
    } else {
	sendCommand('G21');
    }
    // The button label will be fixed by the response to $G
    sendCommand('$G');
}

btnSetDistance = function() {
    tabletClick();
    var distance = event.target.innerText;
    id('jog-distance').value = distance;
}

setDistance = function(distance) {
    tabletClick();
    id('jog-distance').value = distance;
}

jogTo = function(location) {
    // Always force G90 mode because synchronization of modal reports is unreliable
    var feedrate = 1000;
    var cmd;
    cmd = 'G91 G0 ' + location + '\nG90';
    sendCommand(cmd);
}

goAxis = function(axis, coordinate) {
    tabletClick();
    moveTo(axis + coordinate);
}

moveAxis = function(axis, field) {
    coordinate = id(field).value;
    goAxis(axis, coordinate)
}

setAxis = function(axis, field) {
    tabletClick();
    coordinate = id(field).value;
    var cmd = 'G10 L20 P1 ' + axis + coordinate;
    sendCommand(cmd);
}

sendMove = function(cmd) {
    tabletClick();
    var jog = function(params) {
        params = params || {};
        var s = '';
        for (key in params) {
            s += key + params[key]
        }
        jogTo(s);
    };
    var move = function(params) {
        params = params || {};
        var s = '';
        for (key in params) {
            s += key + params[key];
        }
        moveTo(s);
    };

    var distance = Number(id('jog-distance').value) || 0;

    var fn = {
        'G28': function() {
            sendCommand('G28');
        },
        'G30': function() {
            sendCommand('G30');
        },
        'X0Y0Z0': function() {
            move({ X: 0, Y: 0, Z: 0 })
        },
        'X0': function() {
            move({ X: 0 });
        },
        'Y0': function() {
            move({ Y: 0 });
        },
        'Z0': function() {
            move({ Z: 0 });
        },
        'X-Y+': function() {
            jog({ X: -distance, Y: distance });
        },
        'X+Y+': function() {
            jog({ X: distance, Y: distance });
        },
        'X-Y-': function() {
            jog({ X: -distance, Y: -distance });
        },
        'X+Y-': function() {
            jog({ X: distance, Y: -distance });
        },
        'X-': function() {
            jog({ X: -distance });
        },
        'X+': function() {
            jog({ X: distance });
        },
        'Y-': function() {
            jog({ Y: -distance });
        },
        'Y+': function() {
            jog({ Y: distance });
        },
        'Z-': function() {
            jog({ Z: -distance });
        },
        'Z+': function() {
            jog({ Z: distance });
        }
    }[cmd];

    fn && fn();
};
function tabletShowMessage(msg) {
    if (msg.startsWith('<') || msg.startsWith('ok') || msg.startsWith('\n') || msg.startsWith('\r')) {
        return;
    }
    serial1 = id("serial1");
    id("serial0").innerText = serial1.innerText;
    serial1.innerText = msg;
}

var setJogSelector = function(units) {
    var buttonDistances = [];
    var menuDistances = [];
    var selected = 0;
    if (units == 'G20') {
        // Inches
        buttonDistances = [0.001, 0.01, 0.1, 1, 0.003, 0.03, 0.3, 3, 0.005, 0.05, 0.5, 5];
        menuDistances = [0.00025, 0.0005, 0.001, 0.003, 0.005, 0.01, 0.03, 0.05, 0.1, 0.3, 0.5, 1, 3, 5, 10, 30];
        selected = '1';
    } else  {
        // millimeters
        buttonDistances = [0.01, 0.1, 1, 10, 0.03, 0.3, 3, 30, 0.05, 0.5, 5, 50];
        menuDistances = [0.005, 0.01, 0.03, 0.05, 0.1, 0.3, 0.5, 1, 3, 5, 10, 30, 50, 100, 300, 1000];
        selected = '10';
    }
    var buttonNames = ['jog00', 'jog01', 'jog02', 'jog03', 'jog10', 'jog11', 'jog12', 'jog13', 'jog20', 'jog21', 'jog22', 'jog23'];
    buttonNames.forEach( function(n, i) { id(n).innerHTML = buttonDistances[i]; } );

    var selector = id('jog-distance');
    selector.length = 0;
    selector.innerText = null;
    menuDistances.forEach(function(v) {
        var option = document.createElement("option");
        option.textContent=v;
        option.selected = (v == selected);
        selector.appendChild(option);
    });
}

var runTime = 0;

function setButton(name, isEnabled, color, text) {
    var button = id(name);
    button.disabled = !isEnabled;
    button.style.backgroundColor = color;
    button.innerText = text;
}

var leftButtonHandler;
function setLeftButton(isEnabled, color, text, click) {
    setButton('btn-start', isEnabled, color, text);
    leftButtonHandler = click;
}
function doLeftButton() {
    if (leftButtonHandler) {
        leftButtonHandler();
    }
}

var rightButtonHandler;
function setRightButton(isEnabled, color, text, click) {
    setButton('btn-pause', isEnabled, color, text);
    rightButtonHandler = click;
}
function doRightButton() {
    if (rightButtonHandler) {
        rightButtonHandler();
    }
}

var green = '#86f686';
var red = '#f64646';
var gray = '#f6f6f6';

function setRunnable() {
    if (gCodeLoaded) {
        // A GCode file is ready to go
        setLeftButton(true, green, 'Start', runGCode);
        setRightButton(false, gray, 'Pause', null);
    } else {
        // Can't start because no GCode to run
        setLeftButton(false, gray, 'Start', null);
        setRightButton(false, gray, 'Pause', null);
    }
}

function tabletGrblState(grbl, mpos, wpos, ovr, modal) {
    var stateName = grbl.stateName;

    // Unit conversion factor - depends on both $13 setting and parser units
    var factor = 1.0;

    //  spindleSpeed = grbl.spindleSpeed;
    //  spindleDirection = grbl.spindle;
    //
    //  feedOverride = ovr.feed/100.0;
    //  rapidOverride = ovr.rapid/100.0;
    //  spindleOverride = ovr.spindle/100.0;

    var grblReportingUnits = 0;
    var mmPerInch = 25.4;
    switch (modal.units) {
        case 'G20':
            factor = grblReportingUnits === 0 ? 1/mmPerInch : 1.0 ;
            break;
        case 'G21':
            factor = grblReportingUnits === 0 ? 1.0 : mmPerInch;
            break;
    }

    if (mpos) {
        mpos.forEach( function(p) { p *= factor; } );
    }
    if (wpos) {
        wpos.forEach( function(p) { p *= factor; } );
    }

    // if (cnc.filename == '') {
    //	canStart = false;
    //}

    var cannotClick = stateName == 'Run' || stateName == 'Hold';
    selectDisabled('.jog-controls .btn-tablet', cannotClick);
    selectDisabled('.control-pad .form-control', cannotClick);
    selectDisabled('.mdi .btn', cannotClick);
    selectDisabled('.axis-position .btn', cannotClick);
    selectDisabled('.axis-position .position', cannotClick);

    var newUnits = modal.units == 'G21' ? 'mm' : 'Inch';
    if (getText('units') != newUnits) {
        setText('units', newUnits);
        setJogSelector(modal.units);
    }
    setDisabled('units', false);

    switch (stateName) {
        case 'Sleep':
        case 'Alarm':
            setLeftButton(true, gray, 'Start', null);
            setRightButton(false, gray, 'Pause', null);
            break;
        case 'Idle':
            setRunnable();
            break;
        case 'Hold':
            setLeftButton(true, green, 'Resume', resumeGCode);
            setRightButton(true, red, 'Stop', stopGCode);
            break;
        case 'Jog':
        case 'Home':
        case 'Run':
            setLeftButton(false, gray, 'Start', null);
            setRightButton(true, red, 'Pause', pauseGCode);
            break;
        case 'Check':
            setLeftButton(true, gray, 'Start', null);
            setRightButton(true, red, 'Stop', stopGCode);
            break;
    }

    if (grbl.spindleSpeed) {
        var spindleText = 'Off';
        switch (grbl.spindleDirection) {
            case 'M3': spindleText = 'CW'; break;
            case 'M4': spindleText = 'CCW'; break;
            case 'M5': spindleText = 'Off'; break;
            default:  spindleText = 'Off'; break;
        }
        setText('spindle', Number(grbl.spindleSpeed) + ' RPM ' + spindleText);
    }
    // Nonzero receivedLines is a good indicator of GCode execution
    // as opposed to jogging, etc.
    if (grbl.receivedLines) {
	var elapsed = new Date().getTime() - startTime;
	var elapsed = Math.max(elapsedTime, elapsed);
	if (elapsed < 0)
	    elapsed = 0;
	var seconds = Math.floor(elapsed / 1000);
	var minutes = Math.floor(seconds / 60);
	seconds = seconds % 60;
	if (seconds < 10)
	    seconds = '0' + seconds;
	runTime = minutes + ':' + seconds;
    }
    setText('runtime', runTime);

    setText('wpos-label', modal.wcs);
    var distanceText = modal.distance == 'G90'
	             ? modal.distance
	             : "<div style='color:red'>" + modal.distance + "</div>";
    setHTML('distance', distanceText);

    if (stateName == 'Run') {
	var rateText = modal.units == 'G21'
	             ? Number(grbl.feedrate).toFixed(0) + ' mm/min'
	             : Number(grbl.feedrate).toFixed(2) + ' in/min';
        setText('active-state', rateText);
    } else {
        // var stateText = errorText == 'Error' ? "Error: " + errorMessage : stateName;
        var stateText = stateName;
        setText('active-state', stateText);
    }

    if (grbl.receivedLines && (stateName == 'Run' || stateName == 'Hold' || stateName == 'Stop')) {
        if (grbl.lineNumber) {
            setText('line', grbl.lineNumber);
            scrollToLine(grbl.lineNumber);
        }
    }
    // root.displayer.reDrawTool(modal, mpos);

    var digits = modal.units == 'G20' ? 4 : 3;

    if (wpos) {
        wpos.forEach( function(pos, index) {
            setValue('wpos-'+axisNames[index], Number(pos).toFixed(index > 2 ? 2 : digits));
        });
    }

    //    mpos.forEach( function(pos, index) {
    //        setValue('mpos-'+axisNames[index], Number(pos).toFixed(index > 2 ? 2 : digits));
    //    });
}

function addOption(selector, name, isDisabled, isSelected) {
    var opt = document.createElement('option');
    opt.appendChild(document.createTextNode(name));
    opt.disabled = isDisabled;
    opt.selected = isSelected;
    opt.value = name;
    selector.appendChild(opt);
}
var filename = 'TEST.NC';
var watchPath = '';

function gotFiles(data) {
    var selector = id('filelist');
    var inRoot = watchPath === '';
    var legend = inRoot ? 'Load GCode File' : 'In ' + watchPath;

    var selectedFile = filename.split('/').slice(-1)[0];

    selector.length = 0;
    addOption(selector, legend, selectedFile == '');

    if (!inRoot) {
        addOption(selector, '..', false, false);
    }
    obj = JSON.parse(data);
    var files = obj.files.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    })
    files.forEach(function(file) {
        if (file.size == -1) {   // size -1 indicates a directory
            file.name += '/';
        }
        addOption(selector, file.name, false, file.name == selectedFile);
    });
}

function tabletGetFileList() {
    SendFileHttp('/upload', null, null, gotFiles, null);
}

function showGCode(gcode) {
    gCodeLoaded = gcode != '';
    if (!gCodeLoaded) {
	gcode = "(No GCode loaded)";
    }

    id('gcode').value = gcode;
    if (gCodeLoaded) {
        root.displayer.showToolpath(gcode, WPOS, MPOS);
    }
    // XXX this needs to take into account error states
    setRunnable();
}

var gCodeFilename = '';

function nthLineEnd(str, n){
    if (n <= 0)
        return 0;
    var L= str.length, i= -1;
    while(n-- && i++<L){
        i= str.indexOf("\n", i);
        if (i < 0) break;
    }
    return i;
}

function scrollToLine(lineNumber) {
    var gCodeLines = id('gcode');
    var lineHeight = parseFloat(getComputedStyle(gCodeLines).getPropertyValue('line-height'));
    var gCodeText = gCodeLines.value;

    gCodeLines.scrollTop = (lineNumber-2) * lineHeight;
    gCodeLines.select();

    var start;
    var end;
    if (lineNumber <= 0) {
        start = 0;
        end = 1;
    } else {
        start = (lineNumber == 1) ? 0 : start = nthLineEnd(gCodeText, lineNumber-1) + 1;
        end = gCodeText.indexOf("\n", start);
    }

    gCodeLines[0].selectionStart = start;
    gCodeLines[0].selectionEnd = end;
}

function runGCode() {
    gCodeFilename && sendCommand('$sd/run=' + gCodeFilename);
}

function loadGCode() {
    tabletClick();
    var filelist = id('filelist');
    var filename =  filelist.options[filelist.selectedIndex].textContent;
    if (filename === '..') {
        watchPath = watchPath.slice(0, -1).replace(/[^/]*$/,'');
        filename = '';
        getFileList();
    } else if (filename.endsWith('/')) {
        watchPath = watchPath + filename;
        filename = '';
        getFileList();
    } else {
        gCodeFilename = watchPath + filename;
        collectHandler = showGCode;
        sendCommand('$sd/show=' + gCodeFilename);
    }
}
function toggleDropdown() {
    id('tablet-dropdown-menu').classList.toggle('show');
}
function hideMenu() { toggleDropdown(); }
function menuReset() { grbl_reset(); hideMenu(); }
function menuUnlock() { sendCommand('$X'); hideMenu(); }
function menuHomeAll() { sendCommand('$H'); hideMenu(); }
function menuHomeA() { sendCommand('$HA'); hideMenu(); }
function menuSpindleOff() { sendCommand('M5'); hideMenu(); }

cycleDistance = function(up) {
    var sel = id('jog-distance');
    var newIndex = sel.selectedIndex + (up ? 1 : -1);
    if (newIndex >= 0 && newIndex < sel.length) {
        tabletClick();
        sel.selectedIndex = newIndex;
    }
}
clickon = function(name) {
//    $('[data-route="workspace"] .btn').removeClass('active');
    var button = id(name);
    button.classList.add('active');
    button.dispatchEvent(new Event('click'));
}
var shiftDown = false;
var ctrlDown = false;
var altDown = false;
function jogClick(name) {
//    if (shiftDown || altDown) {
//	var distanceElement = id('jog-distance');
//	var distance = distanceElement.value;
//	var factor = shiftDown ? 10 : 0.1;
//	distanceElement.val(distance * factor);
//	clickon(name);
//	distanceElement.val(distance);
//    } else {
	clickon(name);
//    }
}

// Reports whether a text input box has focus - see the next comment
var isInputFocused = false;
function tabletIsActive() {
    return id('tablettab').style.display !== 'none';
}
function handleKeyDown(event) {
    // When we are in a modal input field like the MDI text boxes
    // or the numeric entry boxes, disable keyboard jogging so those
    // keys can be used for text editing.
    if (!tabletIsActive()) {
        return;
    }
    if (isInputFocused) {
        return;
    }
    switch(event.key) {
	case "ArrowRight":
	    jogClick('jog-x-plus');
            event.preventDefault();
	    break;
	case "ArrowLeft":
	    jogClick('jog-x-minus');
            event.preventDefault();
	    break;
	case "ArrowUp":
	    jogClick('jog-y-plus');
            event.preventDefault();
	    break;
	case "ArrowDown":
	    jogClick('jog-y-minus');
            event.preventDefault();
	    break;
	case "PageUp":
	    jogClick('jog-z-plus');
            event.preventDefault();
	    break;
	case "PageDown":
	    jogClick('jog-z-minus');
            event.preventDefault();
	    break;
	case "Escape":
	case "Pause":
	    clickon('btn-pause');
	    break;
	case "Shift":
	    shiftDown = true;
	    break;
	case "Control":
	    ctrlDown = true;
	    break;
	case "Alt":
	    altDown = true;
	    break;
	case "=": // = is unshifted + on US keyboards
	case "+":
	    cycleDistance(true);
            event.preventDefault();
	    break;
	case '-':
	    cycleDistance(false);
            event.preventDefault();
	    break;
	default:
	    console.log(event);
    }
}
function handleKeyUp(event) {
    if (!tabletIsActive()) {
        return;
    }
    if (isInputFocused) {
        return;
    }
    switch(event.key) {
	case "Shift":
	    shiftDown = false;
	    break;
	case "Control":
	    ctrlDown = false;
	    break;
	case "Alt":
	    altDown = false;
	    break;
    }
}

setJogSelector('mm');

// I tried to add the listener to the tablettab element but it did not work.
// The event was not received.  Maybe something about focus? So I added it
// to window and then checked to see if the tablet is active in the handler.
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);
