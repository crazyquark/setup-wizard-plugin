var assert = require('assert');
var Wizard = require(__dirname+'/../app/lib/wizard');
var gatewayd = require('/Users/abiy/code/gatewayd');
var fixtures = require(__dirname+'/fixtures');

describe('Setup gatewayd', function(){

  var wizard = new Wizard({
    gatewayd: gatewayd
  });

  it.skip('should do everything', function(done){
    this.timeout(30000);
    wizard.setup(fixtures.valid_input_fields)
      .then(function(gatewayd){
        console.log(gatewayd);
        done();
      })
      .error(function(error){
        console.log(error);
        done();
      });
  });

});