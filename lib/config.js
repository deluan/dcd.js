var fs = require('fs')
var path = require('path-extra')

exports.treeFile = function() {
    var datadir = path.datadir('dcd');

    if (!fs.existsSync(datadir)) {
        fs.mkdirSync(datadir);
    }
    var sep = require('path').sep
    return datadir + sep + 'treeinfo.dcd';
}

exports.scanRootDir = function() {
    return path.homedir();
}
