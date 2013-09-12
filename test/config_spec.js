var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var config = require('../lib/config');

describe('config', function(){

    describe('#treeFile', function(){
        it('returns a valid path', function() {
            var treefile = config.treeFile();
            expect(treefile).to.be.defined;
            expect(fs.statSync(path.dirname(treefile)).isDirectory()).to.equal(true);
        });
    })

    describe('#scanRootDir', function(){
        it('returns an existing path', function() {
            var scanRootDir = config.scanRootDir();
            expect(scanRootDir).to.be.defined;
            expect(fs.statSync(path.dirname(scanRootDir)).isDirectory()).to.equal(true);
        });
    })

})
