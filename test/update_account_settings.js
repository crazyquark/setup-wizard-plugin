var assert = require('assert');
var Wizard = require(__dirname+'/../app/lib/wizard');
var gatewayd = require('gatewayd');
var fixtures = require(__dirname+'/fixtures');

describe('Update account settings', function(){

  var wizard = new Wizard({
    gatewayd: gatewayd
  });

  it('should disallow xrp and require destination tag of hot and cold wallets', function(done){
    this.timeout(10000);
    wizard._updateAccountSettings({ cold_wallet_secret: fixtures.valid_input_fields.cold_wallet_secret })
      .then(function(settings){
        assert(settings.account_settings[0].success);
        assert(settings.account_settings[0].hasOwnProperty('hash'));
        assert(settings.account_settings[0]['hash'] !== '');

        assert(settings.account_settings[1].success);
        assert(settings.account_settings[1].hasOwnProperty('hash'));
        assert(settings.account_settings[1]['hash'] !== '');
        done();
      })
      .error(function(error){
        console.log('err', error);
        assert(!error);
        done();
      });
  });

});