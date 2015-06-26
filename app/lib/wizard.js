var async = require('async');
var RippleRestClient = require('ripple-rest-client');
var http = require('superagent');
var Promise = require('bluebird');

/**
 * @description Wizard class that handles the entire process
 * @class Wizard
 * @constructor
 */
function Wizard (options) {
  var _this = this;
  this.gatewayd = options.gatewayd;
}



/**
 * @description Validates each input's data.
 * @function validateInput
 * @param config
 
 */


Wizard.prototype.setup = function(config) {
  var _this = this;

  return new Promise(function(resolve, reject){
    _this._validateInput(config).then(function(validated){
      return _this._verifyRippleRestConnection();
    })
    .then(function(){
      return _this._verifyPostgresConnection();
    })
    .then(function(){
      return _this._setColdWallet(config);
    })
    .then(function(){
      return _this._checkAccountBalance(config);
    })
    .then(function(){
      return _this._setHotWallet();
    })
    .then(function(){
      return _this._fundHotWallet(config);
    })
    .then(function(){
      return _this._updateAccountSettings(config);
    })
    .then(function(){
      return _this._addCurrency(config);
    })
    .then(function(){
      return _this._setTrustLine(config);
    })
    .then(function(){
      return _this._issueCurrency(config);
    })
    .then(function(){
      return _this._setKey(config);
    })
    .then(function(){
      return _this.verifyConfiguration();
    })
    .then(resolve)
    .error(reject);
  });
};

Wizard.prototype._validateInput = function(config) {

  var _this = this;

  return new Promise(function(resolve, reject){
    if (!config.ripple_address) {
      reject(new Error('NoRippleAddressError'));
    }

    if (!_this.gatewayd.validator.isRippleAddress(config.ripple_address)) {
      reject(new Error('InvalidRippleAddressError'));
    }

    if(!config.cold_wallet_secret) {
      reject(new Error('RippleSecretError'));
    }

    if (!config.currencies) {
      reject(new Error('MissingCurrencyError'));
    } else {
      var allCurrenciesAreValid = true;

      for (var currency in config.currencies){
        if(!_this.gatewayd.validator.isNumeric(config.currencies[currency])){
          allCurrenciesAreValid = false;
        }
      }

      if (!allCurrenciesAreValid) {
        reject(new Error('InvalidCurrencyAmountError'));
      }
    }

    resolve(config);
  });

};

/**
 * @description Sets the specified cold wallet address in the config file.
 * @function _setColdWallet
 * @param config
 
 * @private
 */
Wizard.prototype._setColdWallet = function(config){
  var _this = this;

  return new Promise(function(resolve, reject){
    _this.gatewayd.config.set('COLD_WALLET', config.ripple_address);
    _this.gatewayd.config.save(function(error){
      if (error) {
        reject(new Error('SetColdWalletSaveError'));
      }
        resolve({ cold_wallet: _this.gatewayd.config.get('COLD_WALLET') });
      });
    });
};

/**
 * @description Generates a new ripple account/secret and sets it to the config file.
 * @function _setHotWallet
 
 * @private
 */

Wizard.prototype._setHotWallet = function(){

  var _this = this;
  return new Promise(function(resolve, reject){
    _this.gatewayd.api.generateWallet(function(error, wallet){
      if (error) {
        reject(new Error('RippleWalletGenerateError'));
      }
      _this.gatewayd.api.setHotWallet(wallet.address, wallet.secret, function(error, response){
        if (error) {
          reject(new Error('SetHotWalletError'));
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
 
 * @private
 */
Wizard.prototype._fundHotWallet = function (config){
  var _this = this;
  var payment = {
    amount: 60,
    currency: 'XRP',
    secret: config.cold_wallet_secret,
    destination_tag: 0
  };

  return new Promise(function(resolve, reject){
    _this.gatewayd.api.fundHotWallet(payment, function(error, payment){
      if(error){
        reject(error);
      } else {
        resolve({ hot_wallet: payment });
      }
    });
  });

};

Wizard.prototype._updateAccountSettings = function (config) {
  var _this = this;
  var accounts;

  var rippleRestClient = new RippleRestClient({
    api: _this.gatewayd.config.get('RIPPLE_REST_API'),
    account: _this.gatewayd.config.get('COLD_WALLET')
  });

  accounts = [{
    account: _this.gatewayd.config.get('COLD_WALLET'),
    data: {
      secret: config.cold_wallet_secret,
      settings: {
          disallow_xrp: true,
          // TODO CS: Let's disable this for now
          //require_destination_tag: true,
          default_ripple: true
        }
      }
    },
    {
      account: _this.gatewayd.config.get('HOT_WALLET').address,
      data: {
        secret: _this.gatewayd.config.get('HOT_WALLET').secret,
        settings: {
          disallow_xrp: true,
          require_destination_tag: true
        }
      }
    }];

  function updateSettings(account) {
    return new Promise(function(resolve, reject){
      rippleRestClient.updateAccountSettings(account, function(error, response){
        if(error || !response.success){
          reject(new Error('AccountUpdateSettingsError'));
        } else {
          resolve(response);
        }
      });
    });
  }

  return new Promise(function(resolve, reject){
    Promise.all([
      updateSettings(accounts[0]),
      updateSettings(accounts[1]
      )])
      .then(function(settings){
        resolve({ account_settings: settings });
      })
      .error(reject);
  });

};

/**
 * @description Sets trust line between the cold wallet and the new let hot waller.
 * @function _setTrustLine
 * @param config
 
 * @private
 */
Wizard.prototype._setTrustLine = function(config){
  var _this = this;
  var trust_lines = [];
  return new Promise(function(resolve, reject){
    for (var currency in config.currencies) {
      _this.gatewayd.api.setTrustLine(currency, config.currencies[currency], function(error, response){
        if(error){
          reject(error);
        } else {
          trust_lines.push({ currency: response.currency, amount: response.limit});
          resolve(trust_lines);
        }
      });
    }

  });
};

Wizard.prototype._addCurrency = function(config){
  var _this = this;

  return new Promise(function(resolve, reject){
    for (var currency in config.currencies) {
      _this.gatewayd.api.addCurrency(currency, config.currencies[currency], function (error, response) {
        if (error) {
          reject(error);
        } else {
          resolve({ currencies: response });
        }
      });
    }
  });

};

Wizard.prototype._issueCurrency = function(config){
  var _this = this;

  var opts = {
    secret: config.cold_wallet_secret,
    destination_tag: 0
  };

  for (var currency in config.currencies) {
    opts.amount = config.currencies[currency];
    opts.currency = currency;
  }

  return new Promise(function(resolve, reject){
    _this.gatewayd.api.issueCurrency(opts.amount, opts.currency, opts.secret, function (error, response) {
      if (error) {
        reject(error);
      } else {
        resolve({ currency_issued: opts.currency });
      }
    });
  });

};


Wizard.prototype._setKey = function(){
  var _this = this;

  return new Promise(function(resolve, reject){
    _this.gatewayd.api.setKey(function(error, key){
      if(error){
        reject(error);
      } else {
        var admin_login = {
          username: 'admin@' + _this.gatewayd.config.get('DOMAIN'),
          password: key
        };

        resolve(admin_login);
      }
    });
  });
};

Wizard.prototype._verifyPostgresConnection = function() {
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
 
 * @private
 */
Wizard.prototype._verifyRippleRestConnection = function(){
  var _this = this;
  return new Promise(function(resolve, reject){
    http.get(_this.gatewayd.config.get('RIPPLE_REST_API')+'v1')
      .end(function(error, response){
        if (error) {
          reject(new Error('RippleRESTConnectionError'));
        }
        resolve(response.body);
      });
  });
};

Wizard.prototype._finalizeSetup = function(config) {
  var _this = this;

  //TODO: CHECK CONFIG FILE AND RESTART SERVER

};

/**
 * @description Checks account (cold wallet) balance to verify that there are at least 100 XRPs.
 * @function _checkAccountBalance
 * @param coldWalletAddress
 
 * @private
 */

Wizard.prototype._checkAccountBalance = function(){
  var _this = this;
  var get_balance_url = _this.gatewayd.config.get('RIPPLE_REST_API')+'v1/accounts/'+_this.gatewayd.config.get('COLD_WALLET')+'/balances';

  return new Promise(function(resolve, reject){
    http.get(get_balance_url)
      .end(function(error, response) {
        if (error) {
          reject(new Error('AccountBalanceError'));
        }

        if (!response && !response.body.balances[0]) {
          reject(new Error('AccountBalanceResponseError'));
        }

        if (response.body.balances[0].value < 100) {
          reject(new Error('BalanceLowError'));
        } else {
          resolve({ cold_wallet_balance: response.body.balances[0] });
        }

      });
  });

};

Wizard.prototype.verifyConfiguration = function() {
  var _this = this;
  return new Promise(function(resolve, reject){
    var config = _this.gatewayd.config.get();

    if (!config['COLD_WALLET']) {
      reject(new Error('ColdWalletNotFound'));
    }

    if (!config['HOT_WALLET']) {
      reject(new Error('HotWalletNotFound'));
    }

    if (!config['CURRENCIES']) {
      reject(new Error('CurrencyNotSet'));
    }

    if (!config['KEY']) {
      reject(new Error('GatewayKeyNotSet'));
    }

    resolve({
        cold_wallet: config['COLD_WALLET'],
        hot_wallet: {
          address: config['HOT_WALLET'].address,
          secret: config['HOT_WALLET'].secret
        },
        admin_login: {
          username: 'admin@'+config['DOMAIN'],
          password: config['KEY']
        }
      });
  });
}

module.exports = Wizard;
