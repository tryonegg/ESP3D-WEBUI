#!/usr/bin/env python3

# This is a simple web server that partially emulates the FluidNC web server
# It lets you test some aspects of WebUI without uploading index.html.gz to
# an actual FluidNC ESP32
# To use it, run
#   python3 fluidnc-web-sim.py
# Then browse to localhost:8080
#
# You might have to install some Python packages first.
#
# It uses the most recently compiled index.html from the dist subdirectory
# The test_files/ directory contains 'localfs/' and 'sd/' directory whose
# files that are presented as though they were in the FluidNC localfs FLASH
# filesystem and the FluidNC SD card filesystem.
#
# The emulation is incomplete.  In particular, the following things are
# not implemented:
#  - File upload
#  - OTA
#  - changing settings
#  - Running GCode - or anything that involves making FluidNC do any motion things
# But you can load the UI into your browser and do file downloads and whatnot

import asyncio
import os
import subprocess
import sys
import time
import websockets
import json
import warnings
import shutil

try:
  from flask import Flask, request, Response, send_from_directory
except:
  print("flash module missing; try 'pip3 install flask'")
  sys.exit(1)

python_path = sys.executable
script_path = os.path.realpath(__file__)
domain = 'localhost'
http_port = '8080'
ws_port = '8081'

### Flask Stuff
app = Flask(__name__)

test_files = 'test_files'

def file_entry(directory, filename):
    fullpath = os.path.join(directory, filename)
    if os.path.isfile(fullpath):
        size = os.path.getsize(fullpath)
    else:
        size = -1
    return {
        'name': filename,
        'shortname': filename,
        'size': size,
        'datetime':''
    }

def format_bytes(n):
    if n < 1024:
        return str(n) + ' B'
    n = n / 1024
    if n < 1024:
        return str(round(n,2)) + ' KB'
    n = n / 1024
    if n < 1024:
        return str(round(n,2)) + ' MB'
    n = n / 1024
    if n < 1024:
        return str(round(n,2)) + ' GB'
    n = n / 1024
    return str(round(n,2)) + ' TB'

def make_files_list(fs, subdir, status):
    print("mfl", fs, subdir)
    if len(subdir) and subdir[0] == '/':
        subdir = subdir[1:]
    directory = os.path.join(test_files, fs, subdir)
    print("dir", directory)
    diskusage = shutil.disk_usage(directory)
    disktotalsize = diskusage.total
    diskusedsize = diskusage.used
    files = {
        'files': [],
        'path': '',
        'total': format_bytes(disktotalsize),
        'used': '',
        'occupation': 0,
        'status': status
    }
    dirusedsize = 0
    for filename in os.listdir(directory):
        entry = file_entry(directory, filename)
        size = entry['size']
        files['files'].append(entry)
        if size != -1:
             dirusedsize = dirusedsize + size
    occupation = 100 * diskusedsize / disktotalsize
    files['used'] = format_bytes(diskusedsize)
    files['occupation'] = int(round(occupation, 0))
    return json.dumps(files)

sdfiles = '{"files":[{"name":"localfs","shortname":"localfs","size":"-1","datetime":""},{"name":"t2.nc","shortname":"t2.nc","size":"597","datetime":""},{"name":"SchluesselAutoX.nc","shortname":"SchluesselAutoX.nc","size":"61954","datetime":""}],"path":"","total":"14.83 GB","used":"384.00 KB","occupation":"0","status":"Ok"}'

gresp = "[GC:G1 G54 G17 G21 G90 G94 M5 M9 T0 F1000 S0]"

esp800resp = 'FW version: FluidNC v3.6.7 (Devt-5692a7c1-dirty) # FW target:grbl-embedded  # FW HW:Direct SD  # primary sd:/sd # secondary sd:none  # authentication:no # webcommunication: Sync: 8081:localhost # hostname:fluidnc # axis:3'

esp400resp = '''
{"EEPROM":[
    {"F":"nvs",
      "P":"Firmware/Build",
      "H":"Firmware/Build",
      "T":"S",
      "V":"",
      "S":"20",
      "M":"0"
    },
    {"F":"tree",
      "P":"/board",
      "H":"/board",
      "T":"S",
      "V":"None",
      "S":"255",
      "M":"0"
    }
]
}
'''

connection_list = []
CONNECTIONS =  set()

@app.route('/command')
def do_command():
    plainval = request.args.get('plain')
    if plainval != None:
        if plainval == '[ESP800]':
            return esp800resp
        elif plainval == '[ESP400]':
            return esp400resp
    commandtextval = request.args.get('commandText')
    if commandtextval != None:
        print("commandText:", commandtextval)
        if commandtextval == '$G':
            if len(CONNECTIONS):
                wsock = CONNECTIONS[0]
                wsock.send(gresp)
                # return ""
    return "\r\n"

def handle_files(fs, request):
    method = request.method
    action = request.args.get('action')
    filename = request.args.get('filename')
    path = request.args.get('path')
    print("handle_files", method, action, filename, path)
    if path == None:
        path = ''
    print("handle_files", action, filename, path)

    if filename == None or filename == 'all':
        filename = ''

    if len(path) and path[0] == '/':
        path = path[1:]
    if path == '':
        filepath = filename
    else:
        filepath = path + '/' + filename

    localpath = os.path.join(test_files, fs, filepath)
    if method == 'POST':
        status = 'Upload not implemented'
    else:
        status = 'Ok'
        if action == 'delete':
            print("Deleting", filepath)
            try:
                os.remove(localpath)
            except:
                status = 'Cannot delete ' + filepath
        elif action == 'deletedir':
            try:
                shutil.rmtree(localpath)
            except:
                status = 'Cannot delete ' + filepath
        elif action == 'createdir':
            try:
                os.mkdir(localpath)
            except:
                status = 'Cannot create ' + filepath

    if request.args.get('dontlist') == None:
        return make_files_list(fs, path, status)
    return ""

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    return handle_files('sd', request)

@app.route('/files', methods=['GET', 'POST'])
def do_files():
        return handle_files('localfs', request)

@app.route('/<path:filename>', methods=['GET'])
def do_get_file(filename):
    print("/ ", filename)
    if filename.startswith('SD/'):
        filename = filename[3:]
        return send_from_directory(os.path.join(test_files, 'sd'), filename)
    return send_from_directory(os.path.join(test_files, 'localfs'), filename)

@app.route('/', methods=['GET'])
def index():
    return send_from_directory('dist', 'index.html')

### Websocket stuff

async def register(websocket):
    CONNECTIONS.add(websocket)

async def unregister(websocket):
    CONNECTIONS.remove(websocket)

async def notify_users(message, websocket):
    global connection_list
    for connection in CONNECTIONS:
        if connection != websocket:
            connection_list.append(connection)

    await asyncio.wait([
        connection.send(message) for connection in connection_list
    ])

async def message_control(websocket, path):
    await register(websocket)
    try:
        await websocket.send("Connected")
        async for message in websocket:
            await notify_users(message, websocket)
    finally:
        await unregister(websocket)


if len(sys.argv) == 2:
    if sys.argv[1] == 'run_socket':
        start_server = websockets.serve(message_control, domain, ws_port, subprotocols=['arduino'])

        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()

else:
    time.sleep(1)
    print("Triggering websocket server")
    return_value = (subprocess.Popen([
        python_path,
        script_path,
        'run_socket'
    ]))

    print("Starting flask server")
    app.run(port=http_port)
