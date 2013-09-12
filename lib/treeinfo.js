var _ = require('underscore');
var fs = require('fs');
var bs = require('binarysearch');
var path = require('path');
var config = require('./config');
var util = require('./util');

exports._readTreeFile = function () {
    return fs.readFileSync(config.treeFile(), {encoding: 'ascii'});
}

exports._writeTreeFile = function (data) {
    process.stderr.write("\rSaving " + data.tree.length + " dirs." + "        \n");
    fs.writeFileSync(config.treeFile(), data.tree.join("\n") + "\n\xFF\xFF\n" + data.breadCrumbs.join("\n"));
}

exports._is_valid = function(result) {
    return fs.existsSync(result) && fs.lstatSync(result).isDirectory();
}

function load() {
    try {
        var data = exports._readTreeFile();
        var lines = data.split("\n");
        var length = lines.length;
        var tree = lines.slice(0, length / 2);
        var breadCrumbs = lines.slice((length / 2) + 2, length);
        return {tree: tree, breadCrumbs: breadCrumbs};
    } catch (e) {
        return exports.rescan();
    }
}

exports.rescan = function (full) {
    var treeFile = !!full ? null : config.treeFile();
    var data = require('./scan_tree').scan(config.scanRootDir(), treeFile);

    exports._writeTreeFile(data);

    return data;
}

function filterByBreadCrumbs(list, searchString) {
    var str = searchString;
    if (searchString.charAt(0) == "~") {
        var homeDir = require('path-extra').homedir();
        str = str.replace('~', util.extractBreadCrumb(homeDir));
    }
    var res = bs.rangeValue(list, str, str, util.pathComparator);

    return _.map(res, function (dir) {
        return path.dirname(dir);
    });
}

function filterByLeaves(list, searchString) {
    var res = bs.rangeValue(list, searchString, searchString + "\xFF", util.pathComparator);
    if (res.length === 0) {
        var str = searchString;
        do {
            str = str.substr(0, str.length - 1)
            res = bs.rangeValue(list, str, str + "\xFF", util.pathComparator);
        } while (str.length > 0 && res.length === 0);
    }
    if (res.length === 0) {
        res = [list[_.sortedIndex(list, searchString, util.pathSortValue)]];
    }

    return res;
}
function filter(data, searchString) {
    var res = filterByBreadCrumbs(data.breadCrumbs, searchString);
    res = res.concat(bs.rangeValue(data.tree, searchString, searchString, util.pathComparator));

    if (res.length === 0) {
        res = res.concat(filterByLeaves(data.tree, searchString));
    }

    return res;
}

exports.find = function (searchString, currentDir) {
    if (!currentDir) {
        currentDir = path.resolve('.');
    }
    var data = load();

    var filtered = filter(data, searchString);

    var idx = _.indexOf(filtered, currentDir);
    if (idx != -1) {
        if (idx < filtered.length - 1) {
            idx = idx + 1;
        } else {
            if (idx > 0) {
                idx = 0;
            }
        }
    } else {
        idx = 0;
    }

    var result = filtered[idx];
    if (exports._is_valid(result)) {
        return result;
    }
    return '';
}

