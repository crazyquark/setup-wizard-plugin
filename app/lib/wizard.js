var async = require('async');
var RippleRestClient = require('ripple-rest-client');
var request = require('superagent');
var Promise = require('bluebird');
/**
 * @description Wizard class that handles the entire process
 * @class Wizard
 * @constructor
 */
function Wizard (options) {
  var _this = this;
  this.gatewayd = options.gatewayd;
  this.setupConfig = {};
}



/**
 * @description Validates each input's data.
 * @function validateInput
 * @param config
 * @param callback
 */


Wizard.prototype.setup = function(config, callback) {
  var _this = this;
  async.waterfall([
    function(next) {
      _this.validateInput(config, next)
    },
    function(config, next) {
      _this._verifyRippleRestConnection(config, next);
    },
    function(config, next) {
      _this._setColdWallet(config, next);
    },
    function(config, next) {
      _this._checkAccountBalance(config, next);
    },
    function(config, next) {
      _this._setHotWallet(config, next);
    },
    function(config, next) {
      _this._fundHotWallet(config, next);
    },
    function(config, next) {
      _this._addCurrency(config, next);
    },
    function(config, next) {
      _this._setTrustLine(config, next);
    },
    function(config, next) {
      _this._issueCurrency(config, next);
    },
    function(config, next) {
      _this._updateAccountSettings(config, next);
    },
    function(config, next) {
      _this._setKey(config, next);
    },
    function(config, next) {
      _this._setLastPaymentHash(config, next);
    },
    function(config, next) {
      _this._finalizeSetup(config, next);
    }
  ], callback);
};

Wizard.prototype._validateInput = function(config, callback) {

  var _this = this;

  return new Promise(function(resolve, reject){
    if (!config.ripple_address) {
      return reject(new Error('NoRippleAddressError'));
    }

    if (!_this.gatewayd.validator.isRippleAddress(config.ripple_address)) {
      return reject(new Error('InvalidRippleAddressError'));
    }

    if(!config.cold_wallet_secret) {
      return reject(new Error('RippleSecretError'));
    }

    if (!config.currencies) {
      return reject(new Error('MissingCurrencyError'));
    } else {
      var allCurrenciesAreValid = true;

      for (var currency in config.currencies){
        if(!_this.gatewayd.validator.isNumeric(config.currencies[currency])){
          allCurrenciesAreValid = false;
        }
      }

      if (!allCurrenciesAreValid) {
        return reject(new Error('InvalidCurrencyAmountError'));
      }
    }

    resolve(config);
  });

};

/**
 * @description Sets the specified cold wallet address in the config file.
 * @function _setColdWallet
 * @param config
 * @param callback
 * @private
 */
Wizard.prototype._setColdWallet = function(config, callback){
  var _this = this;

  return new Promise(function(resolve, reject){
    _this.gatewayd.config.set('COLD_WALLET', config.ripple_address);
    _this.gatewayd.config.save(function(error){
      if (error) {
        return reject(new Error('SetColdWalletSaveError'));
      }
        resolve({ cold_wallet: _this.gatewayd.config.get('COLD_WALLET') });
      });
    });
};

/**
 * @description Generates a new ripple account/secret and sets it to the config file.
 * @function _setHotWallet
 * @param callback
 * @private
 */

Wizard.prototype._setHotWallet = function(){

  var _this = this;
  return new Promise(function(resolve, reject){
    _this.gatewayd.api.generateWallet(function(error, wallet){
      if (error) {
        return reject(new Error('RippleWalletGenerateError'));
      }
      _this.gatewayd.api.setHotWallet(wallet.address, wallet.secret, function(error, response){
        if (error) {
          return reject(new Error('SetHotWalletError'));
        }
        resolve({ hot_wallet: response });
      });

    });

  });

};

/**
 * @describe Funds newly create newly set hot wallet
 * @function _fundHotWallet
 * @param configProperties
 * @param secret
 * @param callback
 * @private
 */
Wizard.prototype._fundHotWallet = function (config, callback){
  var _this = this;
  var opts = {
    amount: 60,
    currency: 'XRP',
    secret: config.cold_wallet_secret,
    destination_tag: 0
  };

  _this.gatewayd.api.fundHotWallet(opts, function(error, payment){
    if(error){
      callback(error);
    } else {
      _this.setupConfig.hash = payment.hash;
      callback(null, config);
    }
  });
};

/**
 *
 * @param config
 * @param callback
 * @private
 */

Wizard.prototype._setLastPaymentHash = function(config, callback){
  var _this = this;

  _this.gatewayd.api.setLastPaymentHash(_this.setupConfig, function(error, response){
    if(error){
      callback(error);
    } else {
      _this.setupConfig.hash = response;
      callback(null, _this.setupConfig);
    }
  });

};

Wizard.prototype._updateAccountSettings = function (config, callback) {
  var _this = this;

  var rippleRestClient = new RippleRestClient({
    account: _this.gatewayd.config.get('COLD_WALLET')
  });

  var optsColdWallet = {
    account: _this.gatewayd.config.get('COLD_WALLET'),
    data: {
      secret: config.cold_wallet_secret,
      settings: {
        disallow_xrp: true,
        require_destination_tag: true
      }
    }
  };

  var optsHotWallet = {
    account: _this.gatewayd.config.get('HOT_WALLET').address,
    data: {
      secret: _this.gatewayd.config.get('HOT_WALLET').secret,
      settings: {
        disallow_xrp: true,
        require_destination_tag: true
      }
    }
  };

  async.series([
    function(next) {

      rippleRestClient.updateAccountSettings(optsColdWallet, function(error, response){
        if(error || !response.success){
          next({ field: 'ripple_address', message: 'cannot update cold wallet account settings' }, null);
        } else {
          _this.setupConfig.cold_wallet_settings = response.settings;
          next(null, config);
        }
      });
    },
    function(next) {

      rippleRestClient.updateAccountSettings(optsHotWallet, function(error, response){
        if(error || !response.success){
          next({ field: 'ripple_address', message: 'cannot update hot wallet account settings' }, null);
        } else {

          _this.setupConfig.hot_wallet_settings = response.settings;
          next(null, config);
        }
      });
    }
  ], function(error, response){
    if (error) {
      return callback(error);
    }
    callback(null, config);
  });

};

/**
 * @description Sets trust line between the cold wallet and the new let hot waller.
 * @function _setTrustLine
 * @param config
 * @param callback
 * @private
 */
Wizard.prototype._setTrustLine = function(config, callback){
  var _this = this;
  for (var currency in config.currencies) {

    _this.gatewayd.api.setTrustLine(currency, config.currencies[currency], function(error, response){
      if(error){
        callback(error);
      } else {
        _this.setupConfig.trust_lines = [];
        _this.setupConfig.trust_lines.push({ currency: response.currency, amount: response.limit});
        callback(null, config);
      }
    });
  }
};

Wizard.prototype._addCurrency = function(config, callback){
  var _this = this;
  for (var currency in config.currencies) {
    _this.gatewayd.api.addCurrency(currency, config.currencies[currency], function (error, response) {
      if (error) {
        callback(error);
      } else {
        _this.setupConfig.currencies = response;
        callback(null, config);
      }
    });
  }
};

Wizard.prototype._issueCurrency = function(config, callback){
  var _this = this;

  var opts = {
    secret: config.cold_wallet_secret,
    destination_tag: 0
  };

  for (var currency in config.currencies) {
    opts.amount = config.currencies[currency];
    opts.currency = currency;
  }

  _this.gatewayd.api.issueCurrency(opts.amount, opts.currency, opts.secret, function (error, response) {
    if (error) {
      callback(error);
    } else {

      _this.setupConfig.currencies_issued = response;
      callback(null, config);
    }
  });
};

Wizard.prototype._setRippleRestUrl = function(config, callback){
  var _this = this;
  _this.gatewayd.api.setRippleRestUrl(config, function(error, response){
    if(error){
      callback(error);
    } else {
      _this.setupConfig.ripple_rest_url = response;
      callback(null, _this.setupConfig);
    }
  });
};

Wizard.prototype._setDatabaseUrl = function(config, callback){
  var _this = this;
  _this.gatewayd.config.set('DATABASE_URL', config.database_url);
  _this.gatewayd.config.save(function(error, response){

    if(error){
      callback(error);
    } else {
      _this.setupConfig.database_url = _this.gatewayd.config.get('DATABASE_URL');
      callback(null, _this.setupConfig);
    }
  });
};

Wizard.prototype._setKey = function(config, callback){
  var _this = this;
  _this.gatewayd.api.setKey(function(error, key){
    if(error){
      callback(error);
    } else {
      _this.setupConfig.admin_login = {
        username: 'admin@' + _this.gatewayd.config.get('DOMAIN'),
        password: key
      };

      callback(null, config);
    }
  });
};

Wizard.prototype._verifyPostgresConnection = function(config, callback) {
  var _this = this;
  return new Promise(function(resolve, reject){
    _this.gatewayd.database
      .authenticate()
      .complete(function(error){
        if(error){
          reject(new Error('DatabaseConnectionError'));
        } else {
          resolve(true);
        }

      });
  });

};

/**
 * @description Verifies that Ripple REST is up and running.
 * @function _verifyRippleRestConnection
 * @param rippleRestUrl
 * @param callback
 * @private
 */
Wizard.prototype._verifyRippleRestConnection = function(){

  return new Promise(function(resolve, reject){
    request.get('http://localhost:5990/v1')
      .end(function(error, response){
        if (error) {
          return reject(new Error('RippleRESTConnectionError'));
        }
        resolve(response.body);
      });
  });
};

Wizard.prototype._finalizeSetup = function(config, callback) {
  var _this = this;
  if (!config) {
    callback(new Error('configurations failed'))
  } else {
    callback(null, _this.setupConfig);
    _this.setupConfig = {};
  }
}
/**
 * @description Checks account (cold wallet) balance to verify that there are at least 100 XRPs.
 * @function _checkAccountBalance
 * @param coldWalletAddress
 * @param callback
 * @private
 */

Wizard.prototype._checkAccountBalance = function(config, callback){
  var _this = this;
  var rippleRestClient = new RippleRestClient({
    account: _this.gatewayd.config.get('COLD_WALLET')
  });

  rippleRestClient.getAccountBalance(function(error, balance){
    if(error){
      callback(error);
    } else if (!balance.success) {
      callback({ field: 'ripple_address', message: balance.message }, null);
    } else if (Number(balance.balances[0].value) < 100) {
      callback({ field: 'ripple_address', message: 'account balance must be at least 100 XRP'}, null);
    } else {
      _this.setupConfig.cold_wallet_balance = balance.balances[0];
      callback(null, config);
    }
  });
};

Wizard.prototype._verifyConfiguration = function(callback) {
  var _this = this;

}

module.exports = Wizard;
