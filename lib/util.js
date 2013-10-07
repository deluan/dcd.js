(function () {
    var _ = require('underscore');
    var fs = require('fs');
    var path = require('path');
    var GlobTrie = require("glob-trie.js");

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
    };

    exports.extractBreadCrumb = function (dir) {
        var parts = dir.split(path.sep);
        var result = "";

        parts.forEach(function (part) {
            result = result + part.charAt(0);
        });

        return result;
    };

    exports.renderTemplate = function (templateName, values) {
        var mustache = require('mustache');
        var templatePath = path.join(path.dirname(fs.realpathSync(__filename)), "../" + templateName);
        var template = fs.readFileSync(templatePath, "utf8");
        return mustache.render(template, values);
    };

    var trie;
    var lastPatterns = null;

    exports.match = function (path, patterns) {
        if (patterns.length == 0) {
            return false;
        }
        if (patterns != lastPatterns) {
            trie = new GlobTrie();
            _.each(patterns, function(p){
                trie.add(p, p)
            });
            lastPatterns = patterns;
        }

        return trie.collect(path).length > 0
    };

}).call(this);


