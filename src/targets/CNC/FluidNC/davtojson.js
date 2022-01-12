xmlDoc = parser.parseFromString(xml, "text/xml");
fileObjs = xmlDoc.getElementsByTagName("d:response");
files = [];

for (let i = 0; i < fileObjs.length; i++) {
    files[i] = {};
    let f = fileObjs[i];
    const fileObj = parser.parseFromString(f.outerHTML, "text/xml");
    files[i].name = fileObj.getElementsByTagName("d:href")[0].textContent.trim();
    const isDir = fileObj.getElementsByTagName("d:collection").length;
    files[i].size = isDir ? -1 : Number(fileObj.getElementsByTagName("d:getcontentlength")[0].textContent);
}
