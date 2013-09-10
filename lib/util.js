(function () {
    var _ = require('underscore');
    var fs = require('fs');
    var path = require('path');

    exports.recurseTree = function (dir, progress) {
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

            list.forEach(function (file) {
                if (file[0] != '.') {
                    file = path.sep + file
                    if (dir !== path.sep) {
                        file = dir + file;
                    }
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

    exports.pathSortValue = function (fullPath) {
        return path.basename(fullPath);
    };

    exports.sortByLeaves = function (list) {
        return _.sortBy(list, exports.pathSortValue);
    };

    exports.pathComparator = function (d1, d2) {
        var f1 = exports.pathSortValue(d1);
        var f2 = exports.pathSortValue(d2);
        if (f1 > f2) return 1;
        else if (f1 < f2) return -1;
        return 0;
    }

    exports.extractBreadCrumb = function(dir) {
        var parts = dir.split(path.sep);
        var result = "";

        parts.forEach(function (part) {
            result = result + part.charAt(0);
        });

        return result;
    }

}).call(this);


