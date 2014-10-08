var assert = require('assert');
var Wizard = require(__dirname+'/../app/lib/wizard');
var gatewayd = require('gatewayd');
var fixtures = require(__dirname+'/fixtures');

describe('Check for for Cold wallet\'s XRP balance', function(){

  var wizard = new Wizard({
    gatewayd: gatewayd
  });

  it('should return XRP balance', function(done){
    wizard._addCurrency(fixtures.valid_input_fields)
      .then(function(balance){
        assert(balance);
        assert(balance.currencies);
        done();
      })
      .error(console.log);
  });

});