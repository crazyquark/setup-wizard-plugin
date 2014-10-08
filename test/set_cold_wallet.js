var assert = require('assert');
var Wizard = require(__dirname+'/../app/lib/wizard');
var gatewayd = require('gatewayd');
var fixtures = require(__dirname+'/fixtures');

describe('Set cold wallet', function(){

  var wizard = new Wizard({
    gatewayd: gatewayd
  });

  it('should set cold wallet -- pass', function(done){
    wizard._setColdWallet(fixtures.valid_input_fields)
      .then(function(response){
        assert.strictEqual(response.cold_wallet, fixtures.valid_input_fields.ripple_address);
        done();
      })
      .error(function(error){
        assert(!error);
        done();
      });
  });

});