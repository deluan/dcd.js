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
        tree = exports.fastRescan(treeFile, processLeaf);
    } else {
        mode = "Full";
        tree = exports.fullScan(rootDir, processLeaf);
    }

    var sortedTree = util.sortByLeaves(tree);
    var sortedBreadCrumbs = util.sortByLeaves(breadCrumbs);

    return {tree: sortedTree, breadCrumbs: sortedBreadCrumbs};
};

exports.fastRescan = function(treeFile, progress) {

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
                        if (_.indexOf(oldData, file) === -1 && _.indexOf(newData, file) === -1) {
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
            // Ignore folders that don't exist anymore or we don't have permission
        }
    }

    return newData;
}

exports.fullScan = function(dir, progress) {
    var total = 0;
    return walk(dir, function(dir) {
        total = total + 1;
        progress(total, dir);
    });
}

var walk = function (dir, progress) {
    var results = [];

    try {
        var list = fs.readdirSync(dir)
        if (progress != null) {
            progress(dir);
        }
        results.push(dir);

        if (dir.charAt(dir.length-1) !== path.sep) {
            dir = dir + path.sep;
        }

        list.forEach(function (file) {
            if (file[0] != '.') {
                file = dir + file
                var stat = fs.lstatSync(file)
                if (stat && stat.isDirectory() && !stat.isSymbolicLink()) {
                    results = results.concat(walk(file, progress));
                }
            }
        })
    } catch (e) {
    }

    return results;
}



