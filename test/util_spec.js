var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var util = require('../lib/util');

describe('util', function () {

    describe('#pathSortValue', function () {
        it('returns the path basename (last leaf)', function () {
            expect(util.pathSortValue("/a/b/c")).to.equal("c");
        });
    });

    describe('#sortByLeaves', function () {
        it('sorts paths based on leafs', function () {
            var list = ["/a/b/3", "/c/d/1", "/x/y/2"];

            var result = util.sortByLeaves(list);

            expect(result).to.eql(["/c/d/1", "/x/y/2", "/a/b/3"]);
        });
    });

    describe('#pathComparator', function () {
        it('returns 0 when paths are equal', function () {
            var a = '/1/2/3';
            var b = '/1/2/3';

            expect(util.pathComparator(a, b)).to.be.equal(0);
        });

        it('returns -1 when first path should be before the second path', function () {
            var a = '/2/2/2';
            var b = '/1/1/3';

            expect(util.pathComparator(a, b)).to.be.equal(-1);
        });

        it('returns -1 when first path should be before the second path', function () {
            var a = '/1/1/3';
            var b = '/2/2/2';

            expect(util.pathComparator(a, b)).to.be.equal(1);
        });
    });

    describe('#extractBreadCrumb', function () {
        it('returns first char of each segment', function () {
            var dir = path.sep + "User" + path.sep + "Deluan" + path.sep + "bin";
            expect(util.extractBreadCrumb(dir)).to.be.equal("UDb");
        });

        it('returns empty for root dir', function () {
            var dir = path.sep;
            expect(util.extractBreadCrumb(dir)).to.be.empty;
        });
    });

    describe('#renderTemplate', function () {
        it('renders the template with the correct values', function () {

            var output = util.renderTemplate("test/test.template", {var1: "abc", var2: "a/b/c"});
            expect(output).to.be.equal("abc a/b/c");
        });
    });
});