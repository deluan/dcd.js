(function () {

    var treeinfo = require('./treeinfo');

    if (process.argv[2] === '-r') {
        treeinfo.rescan();
    } else {
        console.log(treeinfo.find(process.argv[2]));
    }

}).call(this)
