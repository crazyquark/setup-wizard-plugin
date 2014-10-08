var assert = require('assert');
var Wizard = require(__dirname+'/../app/lib/wizard');
var gatewayd = require('gatewayd');
var fixtures = require(__dirname+'/fixtures');

describe('Set hot wallet', function(){

  var wizard = new Wizard({
    gatewayd: gatewayd
  });

  var hot_wallet;

  it('should set hot wallet -- pass', function(done){
    wizard._setHotWallet()
      .then(function(wallet){
        hot_wallet = wallet.hot_wallet;
        assert(typeof wallet, 'object');
        assert(wallet.hasOwnProperty('hot_wallet'));
        assert(wallet.hot_wallet.hasOwnProperty('address'));
        assert(wallet.hot_wallet.hasOwnProperty('secret'));
        assert(wallet.hot_wallet.hasOwnProperty('id'));
        done();
      })
      .error(function(error){
        assert(!error);
        done();
      });

  });

  after(function(done){
    wizard.gatewayd.models.rippleAddresses.find({ where: { id: hot_wallet.id }})
      .success(function(hot_wallet){
        hot_wallet.destroy().success(done);
      });
  });

});