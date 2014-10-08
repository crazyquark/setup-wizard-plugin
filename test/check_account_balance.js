var assert = require('assert');
var Wizard = require(__dirname+'/../app/lib/wizard');
var gatewayd = require('/Users/abiy/code/gatewayd');

describe('Check for for Cold wallet\'s XRP balance', function(){

  var wizard = new Wizard({
    gatewayd: gatewayd
  });

  it('should return XRP balance', function(done){
    wizard._checkAccountBalance()
      .then(function(balance){
        console.log('balance', balance);
        assert(balance.cold_wallet_balance.hasOwnProperty('currency'));
        assert(balance.cold_wallet_balance.hasOwnProperty('value'));
        assert.strictEqual(balance.cold_wallet_balance.currency, 'XRP');
        assert.strictEqual(typeof Number(balance.cold_wallet_balance.value), 'number');
        done();
      })
      .error(function(error){
        console.log('error', error);
        done();
      });
  });


});