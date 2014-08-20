var WizardPlugin = require(__dirname+'/../lib/wizard.js');
var gatewayd = require('/Users/abiy/code/gatewayd');
var assert = require('assert');

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

  it.skip('should set the database url', function(done) {
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
      cold_wallet_secret: ''
    }, function(error, response){
      console.log('error', error);
      console.log('response', response);
      done();
    });

  });

  it.skip('should set the last payment hash', function(done) {
    wizardPligin._setLastPaymentHash({
      cold_wallet_secret: ''
    }, function(error, response){
      console.log('error', error);
      console.log('response', response);
      done();
    });
  });

  it.skip('should add currency', function(done) {
    wizardPligin._addCurrency({
      cold_wallet_secret: ''
    }, function(error, response){
      console.log('error', error);
      console.log('response', response);
      done();
    });
  });

  it.skip('should update ripple account settings', function(done) {
    wizardPligin._updateAccountSettings({
      cold_wallet_secret: ''
    }, function(error, response){
      console.log('error', error);
      console.log('response', response);
      done();
    });
  });

  it.skip('should set trust line between cold and hot wallet', function(done) {
    wizardPligin._setTrustLine({
      cold_wallet_secret: ''
    }, function(error, response){
      console.log('error', error);
      console.log('response', response);
      done();
    });
  });

  it.skip('should issue specified currencies', function(done) {
    wizardPligin._issueCurrency({
      cold_wallet_secret: ''
    }, function(error, response){
      console.log('error', error);
      console.log('response', response);
      done();
    });
  });

  it.skip('should set key', function(done) {
    wizardPligin._setKey(function(error, response){
      console.log('error', error);
      console.log('response', response);
      done();
    });
  });

  after(function(done){
    done();

  });
});
