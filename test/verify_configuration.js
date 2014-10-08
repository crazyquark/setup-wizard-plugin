var assert = require('assert');
var Wizard = require(__dirname+'/../app/lib/wizard');
var gatewayd = require(__dirname+'/../../../');
var fixtures = require(__dirname+'/fixtures');

describe('Verify gatewayd configuration', function(){

  var wizard = new Wizard({
    gatewayd: gatewayd
  });

  it('should return current configuration', function(done){
    wizard.verifyConfiguration()
      .then(function(configuration){
        assert(configuration);
        done();
      })
      .error(function(error){
        assert(!error)
        done();
      });
  });

});