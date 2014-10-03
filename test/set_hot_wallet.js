var assert = require('assert');
var Wizard = require(__dirname+'/../app/lib/wizard');
var gatewayd = require('/Users/abiy/code/gatewayd');
var fixtures = require(__dirname+'/fixtures');

describe('Set hot wallet', function(){

  var wizard = new Wizard({
    gatewayd: gatewayd
  });

  it('should set hot wallet -- pass', function(done){
    wizard._setHotWallet()
      .then(function(wallet){
        assert(typeof wallet, 'object');
        assert(wallet.hasOwnProperty('hot_wallet'));
        assert(wallet.hot_wallet.hasOwnProperty('address'));
        assert(wallet.hot_wallet.hasOwnProperty('secret'));
        console.log('wallet', wallet);
        done();
      })
      .error(function(error){
        assert(!error);
        done();
      });

  });

});