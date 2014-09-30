var assert = require('assert');
var Wizard = require(__dirname+'/../app/lib/wizard');
var gatewayd = require('/Users/abiy/code/gatewayd');

describe('Check for Ripple-REST connection', function(){

  var wizard = new Wizard({
    gatewayd: gatewayd
  });

  it('should ping ripple rest to verify connection -- /v1', function(done){
    wizard._verifyRippleRestConnection({
        ripple_address: 'rLtys1YJHGj8oTpECWSzDv77YRGDWGduUX'
      }, function(error, response) {
        assert(!error);
        assert.strictEqual(response, true);
        done();
      });
  });

});