var _ = require('underscore');
var fs = require('fs');
var bs = require('binarysearch');
var path = require('path');
var config = require('./config');
var util = require('./util');

function load() {
    try {
        var data = fs.readFileSync(config.treeFile());
        return JSON.parse(data);
    } catch (e) {
        return exports.rescan();
    }
}

function filter(list, searchString) {
    var res = bs.rangeValue(list, searchString, searchString, util.pathComparator);
    if (res.length === 0) {
        res = bs.rangeValue(list, searchString, searchString + "\xFF", util.pathComparator);
    }
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

exports.rescan = function () {
    var results = util.recurseTree(config.scanRootDir(), function (total, dir) {
        process.stderr.write("\r" + total);
    });

    var newList = util.sortByLeaves(results);

    process.stderr.write("\rSaving " + newList.length + " dirs.\n");
    fs.writeFileSync(config.treeFile(), JSON.stringify(newList));

    return newList;
}

exports.find = function (searchString) {
    var currentDir = path.resolve('.');
    var list = load();

    var filtered = filter(list, searchString);

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

    return filtered[idx];
}

