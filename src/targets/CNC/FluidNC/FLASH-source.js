/*
 FLASH-source.js - ESP3D WebUI Target file

 Copyright (c) 2020 Luc Lebosse. All rights reserved.

 This code is free software; you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public
 License as published by the Free Software Foundation; either
 version 2.1 of the License, or (at your option) any later version.

 This code is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public
 License along with This code; if not, write to the Free Software
 Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
import { h } from "preact";
import {
  formatFileSizeToString,
  sortedFilesList,
  formatStatus,
  filterResultFiles,
} from "../../../components/Helpers";

const capabilities = {
  Process: () => false,
  UseFilters: () => false,
  IsFlatFS: () => true,
  Upload: () => {
    return true;
  },
  Mount: () => {
    return false;
  },
  UploadMultiple: () => {
    return false;
  },
  Download: () => {
    return true;
  },
  DeleteFile: () => {
    return true;
  },
  DeleteDir: () => {
    return false;
  },
  CreateDir: () => {
    return false;
  },
};

const normalizePath = (path) => {
  let re = /\/\//g
  let p = path.replace(re, "/");
  return p;
}

const mountPrefix = "/localfs";

const mountedPath = (path, filename) => {
  if (typeof(path) == 'undefined') {
    if (typeof(filename) == 'undefined') {
      return mountPrefix + "/";
    }
    return normalizePath(mountPrefix + "/" + encodeURIComponent(filename));
  }
  if (typeof(filename) == 'undefined') {
    return normalizePath(mountPrefix + path);
  }
  return normalizePath(mountPrefix + path + "/" + encodeURIComponent(filename));
}

const commands = {
  list: (path, filename) => {
    return {
      type: "url",
      url: mountedPath(path, filename),
      args: { action: "list" },
    };
  },
  upload: (path, filename) => {
    return {
      type: "url",
      url: "files",
      args: { path },
    };
  },
  formatResult: (resultTxT) => {
    const res = JSON.parse(resultTxT);
    res.files = sortedFilesList(res.files);
    res.status = formatStatus(res.status);
    return res;
  },

  filterResult: (data, path) => {
    const res = {};
    res.files = sortedFilesList(filterResultFiles(data.files, path));
    res.status = formatStatus(data.status);
    return res;
  },

  delete: (path, filename) => {
    return {
      type: "url",
      url: mountedPath(path, filename),
      args: { action: "delete", filename },
    };
  },
  download: (path, filename) => {
    return {
      type: "url",
      url: mountedPath(path, filename),
      args: {},
    };
  },
};

const FLASH = { capabilities, commands };

export { FLASH };
