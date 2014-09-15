var WizardPlugin = require(__dirname+'/../lib/wizard.js');
var gatewayd = require('/Users/abiy/code/gatewayd');
var assert = require('assert');

COLD_WALLET_SECRET = process.env.RIPPLE_ACCOUNT_SECRET;

describe('Wizard setup', function(){


  var wizardPligin;
  before(function(done){
    wizardPligin = new WizardPlugin({
      gatewayd: gatewayd
    });
    done();
  });

  it('should set ripple rest url', function(done) {
    wizardPligin._setRippleRestUrl({
      ripple_rest_url: 'http://localhost:5990/'
    }, function(error, response){
      assert(!error);
      assert.strictEqual(response.ripple_rest_url, 'http://localhost:5990/');
      done();
    });

  });

  it('should set the database url', function(done) {
    wizardPligin._setDatabaseUrl({
      database_url: 'postgres://postgres:password@localhost:5432/ripple_gateway'
    }, function(error, response){
      assert(!error);
      assert.strictEqual(response.database_url, 'postgres://postgres:password@localhost:5432/ripple_gateway');
      done();
    });

  });

  it.skip('should set a cold wallet', function(done){
    wizardPligin._setColdWallet({
      ripple_address: 'rMinhWxZz4jeHoJGyddtmwg6dWhyqQKtJz'
    }, function(error, response){
      console.log('error', error);
      console.log('response', response);
      done();
    });
  });



  it.skip('should generate and set a hot wallet', function(done) {
    wizardPligin._setHotWallet(function(error, response){
      console.log('error', error);
      console.log('response', response);
      done();
    });

  });

  it.skip('should fund the hot wallet', function(done) {
    wizardPligin._fundHotWallet({
      cold_wallet_secret: COLD_WALLET_SECRET
    }, function(error, response){
      assert(!error);
      console.log('error', error);
      console.log('response', response);
      done();
    });

  });

  it('should set the last payment hash', function(done) {
    wizardPligin._setLastPaymentHash(function(error, response){
      console.log('err', error);
//      assert(!error);
//      assert(response);
//      assert(response.hash);
      done();
    });
  });

  it('should add currency', function(done) {

    wizardPligin._addCurrency({ currencies : { CAT: 0 }}, function(error, response){
      assert(!error);
      assert(response.currencies.hasOwnProperty('CAT'));
      done();
    });
  });


  it.skip('should update ripple account settings', function(done) {
    this.timeout(10000);
    wizardPligin._updateAccountSettings({
      cold_wallet_secret: COLD_WALLET_SECRET
    }, function(error, response){
      console.log('error', error);
      console.log('response', response);
      done();
    });

  });

  it('should set trust line between cold and hot wallet', function(done) {
    this.timeout(20000);
    wizardPligin._setTrustLine({
      currencies: { CAT: 120, TES: 190 }
    }, function(error, response){

      console.log(error, response);
//      assert(!error);
//      assert(response);
      assert.strictEqual(response.trust_lines.length > 0);
      done();
    });
  });

  it('should issue specified currencies', function(done) {
    wizardPligin._issueCurrency({
      currencies: { pop: 120 },
      cold_wallet_secret: COLD_WALLET_SECRET
    }, function(error, response){
      console.log('error', error);
      console.log('response', response);
      done();
    });
  });

  it('should set key', function(done) {
    wizardPligin._setKey(function(error, response){
      assert(!error);
      assert(response.admin_login.hasOwnProperty('username'));
      assert(response.admin_login.hasOwnProperty('password'));
      assert(response.admin_login.username);
      assert(response.admin_login.password);
      console.log('response', response);
      done();
    });
  });

//  after(function(done){
//
//    done();
//
//  });
});
