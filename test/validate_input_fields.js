var assert = require('assert');
var Wizard = require(__dirname+'/../app/lib/wizard');
var gatewayd = require('/Users/abiy/code/gatewayd');
var fixtures = require(__dirname+'/fixtures');

describe('Validate input fields', function(){

  var wizard = new Wizard({
    gatewayd: gatewayd
  });

  it('should validate all input fields -- pass', function(done){
    wizard._validateInput(fixtures.valid_input_fields)
      .then(function(validated){
        assert.strictEqual(validated, fixtures.valid_input_fields);
        done();
      })
      .error(function(error){
        assert(!error);
        done();
      });
  });

  it('should validate all input fields: no ripple_address -- fail', function(done){
    wizard._validateInput(fixtures.invalid_input_no_address)
      .error(function(error){
        assert(error instanceof Error);
        assert.strictEqual(error.message, 'NoRippleAddressError');
        done();
      });
  });

  it('should validate all input fields: ripple_address -- fail', function(done){
    wizard._validateInput(fixtures.invalid_input_address)
      .error(function(error){
        assert(error instanceof Error);
        assert.strictEqual(error.message, 'InvalidRippleAddressError');
        done();
      });
  });

  it('should validate all input fields: no secret -- fail', function(done){
    wizard._validateInput(fixtures.invalid_input_no_secret)
      .error(function(error){
        assert(error instanceof Error);
        assert.strictEqual(error.message, 'RippleSecretError');
        done();
      });
  });

  it('should validate all input fields: no currency -- fail', function(done){
    wizard._validateInput(fixtures.invalid_input_no_currency)
      .error(function(error){
        assert(error instanceof Error);
        assert.strictEqual(error.message, 'MissingCurrencyError');
        done();
      });
  });

  it('should validate all input fields: currency -- fail', function(done){
    wizard._validateInput(fixtures.invalid_input_currency)
      .error(function(error){
        assert(error instanceof Error);
        assert.strictEqual(error.message, 'InvalidCurrencyAmountError');
        done();
      });
  });

});