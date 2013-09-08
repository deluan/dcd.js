(function () {

    var treeinfo = require('./treeinfo');

    var searchString = process.argv[2];

    if (searchString  === '-r') {
        treeinfo.rescan();
    } else {
        var result = treeinfo.find(searchString);
        if (result !== '') {
            console.log(result);
        } else {
            process.exit(2);
        }
    }

}).call(this)
