var fs = require('fs');
var path = require('path');
var should = require('should');
var config = require('../lib/config');

describe('config', function(){

    describe('#treeFile', function(){
        it('returns a valid path', function() {
            var treefile = config.treeFile();
            should.exists(treefile);
            fs.statSync(path.dirname(treefile)).isDirectory().should.be.true;
        });
    })

    describe('#scanRootDir', function(){
        it('returns an existing path', function() {
            var scanRootDir = config.scanRootDir();
            console.log(scanRootDir);
            should.exists(scanRootDir);
            fs.statSync(path.dirname(scanRootDir)).isDirectory().should.be.true;
        });
    })

})
