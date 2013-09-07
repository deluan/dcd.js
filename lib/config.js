var fs = require('fs')
var path = require('path-extra')

exports.treeFile = function() {
    var datadir = path.datadir('dcd');

    if (!fs.existsSync(datadir)) {
        fs.mkdirSync(datadir);
    }
    var sep = require('path').sep
    return datadir + sep + 'treedata.dcd';
}

exports.scanRootDir = function() {
    return "/"; //path.homedir();
}
