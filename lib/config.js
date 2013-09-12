var fs = require('fs')
var os = require('os')
var path = require('path-extra')

exports.isWin32 = function () {
    return os.type().toLowerCase().indexOf('win') === 0;
}

exports.treeFile = function () {
    var datadir = path.datadir('dcd');

    if (!fs.existsSync(datadir)) {
        require('mkdirp').sync(datadir);
    }
    var sep = require('path').sep
    return datadir + sep + 'treedata.dcd';
}

exports.scanRootDir = function () {
    if (exports.isWin32()) {
        return "c:\\";
    } else {
        return "/";
    }
}
