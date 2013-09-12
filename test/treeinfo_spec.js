var fs = require('fs');
var path = require('path');
var sinon = require('sinon');
var should = require('should');
var util = require('../lib/util');
var config = require('../lib/config');
var treeinfo = require('../lib/treeinfo');
var scan_tree = require('../lib/scan_tree');

describe('treeinfo', function () {
    var tree = [];
    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        tree = [];

        treeinfo._is_valid = sandbox.stub().returns(true);
        config.treeFile = sandbox.stub().returns("INVALID_FILE");
        treeinfo._readTreeFile = sandbox.stub().throws(new Error());
        treeinfo._writeTreeFile = sandbox.stub();

        scan_tree.fullScan = function(root, progress) {
            tree.forEach(function (dir) {
                progress(1, dir);
            });
            return tree;
        }
    });

    afterEach(function () {
        sandbox.restore();
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

    it('defaults to fast rescan', function() {
        sandbox.spy(scan_tree, "scan");

        treeinfo.rescan();

        should.exists(scan_tree.scan.getCall(0).args[1]);
    });

    it('forces full rescan if told so', function() {
        sandbox.spy(scan_tree, "scan");

        treeinfo.rescan(true);

        should.not.exists(scan_tree.scan.getCall(0).args[1]);
    });
});

