var fs = require('fs')
var path = require('path-extra')

exports.treeFile = function() {
    var datadir = path.datadir('dcd');

    if (!fs.existsSync(datadir)) {
        fs.mkdirSync(datadir);
    }
    return datadir + '/treeinfo.dcd';
}

exports.scanRootDir = function() {
    return path.homedir();
}
