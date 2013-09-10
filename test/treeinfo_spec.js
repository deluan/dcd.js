var fs = require('fs');
var path = require('path');
var sinon = require('sinon');
var util = require('../lib/util');
var config = require('../lib/config');
var treeinfo = require('../lib/treeinfo');

describe('treeinfo', function () {
    var tree = [];

    before(function () {
        config.treeFile = sinon.stub().returns("INVALID_FILE");
        treeinfo._readTreeFile = sinon.stub().throws(new Error());
        treeinfo._writeTreeFile = sinon.stub();
        util.recurseTree = function(root, progress) {
            tree.forEach(function (dir) {
                progress(1, dir);
            });
            return tree;
        }
    });

    beforeEach(function () {
        tree = [];
        treeinfo._is_valid = sinon.stub().returns(true);
    });

    it('matches by leaves', function() {
        tree = [
            '/bin',
            '/usr/bin'
        ];

        treeinfo.find("bin").should.be.equal("/bin");
    });

    it('return empty string if path does not exists', function() {
        tree = [
            '/bin',
            '/usr/bin'
        ];
        treeinfo._is_valid = sinon.stub().withArgs("/bin").returns(false);

        treeinfo.find("bin").should.be.equal("");
    });

    it('matches next leaf, cyclic', function() {
        tree = [
            '/bin',
            '/usr/bin'
        ];
        treeinfo.find("bin", "/bin").should.be.equal("/usr/bin");
        treeinfo.find("bin", "/usr/bin").should.be.equal("/bin");
    });

    it('matches by breadcrumb', function() {
        tree = [
            '/bin',
            '/usr/bin',
            '/usr/local/bin'
        ];
        treeinfo.find("ulb").should.be.equal("/usr/local/bin");
    });

    it('gives priority to breadcrumb', function() {
        tree = [
            '/bin',
            '/ulb',
            '/usr/bin',
            '/usr/local/bin'
        ];
        treeinfo.find("ulb").should.be.equal("/usr/local/bin");
        treeinfo.find("ulb", "/usr/local/bin").should.be.equal("/ulb");
    });
});
