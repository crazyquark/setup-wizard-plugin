var assert = require('assert');
var Wizard = require(__dirname+'/../app/lib/wizard');
var gatewayd = require('gatewayd');

describe('Check for Ripple-REST connection', function(){

  var wizard = new Wizard({
    gatewayd: gatewayd
  });

  it('should ping ripple rest to verify connection -- /v1', function(done){
    wizard._verifyRippleRestConnection()
      .then(function(ripple_rest_status){
        assert.strictEqual(ripple_rest_status.success, true);
        done();
      })
      .error(function(error){
        assert(!error);
        done();
      });
  });

  it('should return error on no ripple rest connection', function(done){
    wizard._verifyRippleRestConnection()
      .then(function(ripple_rest_status){
        assert.strictEqual(ripple_rest_status.success, true);
        done();
      })
      .error(function(error){
        assert(!error);
        done();
      });

  })

});