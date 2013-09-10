var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var util = require('./util');


exports.scan = function (rootDir, treeFile) {
    var breadCrumbs = [];
    var tree = [];
    var mode = "";

    var processLeaf = function (total, dir) {
        if (total % 100 == 0) {
            process.stderr.write("\r" + mode + " scanning: " + total);
        }
        var breadcrumb = util.extractBreadCrumb(dir);
        breadCrumbs.push(dir + path.sep + breadcrumb);
    };

    if (treeFile && fs.existsSync(treeFile)) {
        mode = "Fast";
        tree = fastRescan(treeFile, processLeaf);

        // TODO Figure out why fastRescan is duplication some folders
        tree = _.uniq(tree.sort(), true);
        breadCrumbs = _.uniq(breadCrumbs.sort(), true);
    } else {
        mode = "Full";
        tree = util.recurseTree(rootDir, processLeaf);
    }

    var sortedTree = util.sortByLeaves(tree);
    var sortedBreadCrumbs = util.sortByLeaves(breadCrumbs);

    return {tree: sortedTree, breadCrumbs: sortedBreadCrumbs};
};

function fastRescan(treeFile, progress) {

    var lastUpdate = fs.statSync(treeFile).mtime;
    var data = fs.readFileSync(treeFile, {encoding: 'utf-8'});
    var oldData = data.split("\n");
    oldData = oldData.slice(0, oldData.length / 2);

    var newData = [];
    var total = 0;

    while (oldData.length > 0) {
        var dir = oldData.pop();

        try {
            var stat = fs.lstatSync(dir);
            if (stat.mtime > lastUpdate) {
                var children = fs.readdirSync(dir);
                children.forEach(function (file) {
                    if (file[0] != '.') {
                        file = path.sep + file
                        if (dir !== path.sep) {
                            file = dir + file;
                        }
                        if (_.indexOf(oldData, file) === -1) {
                            var filestat = fs.lstatSync(file)
                            if (filestat && filestat.isDirectory() && !filestat.isSymbolicLink()) {
                                oldData.push(file);
                            }
                        }
                    }
                });
            }
            newData.push(dir);
            total = total + 1;
            progress(total, dir);
        }
        catch (e) {
        }
    }

    return newData;
}
