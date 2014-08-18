var gatewayd = require('gatewayd');
/**
 * @description Wizard class that handles the entire process
 * @class Wizard
 * @constructor
 */
function Wizard () {
  this.errors = [];
  this.setupConfig = {};
}

/**
 * @description Validates each input's data.
 * @function validateInput
 * @param config
 * @param callback
 */
Wizard.prototype.validateInput = function(config, callback) {
  var errors = this.errors;

  if (!config.currencies) {
    errors.push({ field: 'currencies', message: 'please provide currencies' });
  } else {
    var allCurrenciesAreValid = true;

    for (var currency in config.currencies){
      if(!validator.isNumeric(config.currencies[currency])){
        allCurrenciesAreValid = false;
      }
    }

    if (!allCurrenciesAreValid) {
      errors.push({ field: 'currency_limit', message: 'please provide a valid currency limit amount' });
    }
  }

  if (!validator.isRippleAddress(config.ripple_address)) {
    errors.push({ field: 'ripple_address', message: 'please provide a valid ripple_address' });
  }

  if (!validator.isURL(config.database_url, { protocols: ['postgres'] })){
    errors.push({ field: 'database_url', message: 'please provide a valid database_url' });
  }

  if (!validator.isURL(config.ripple_rest_url)){
    errors.push({ field: 'ripple_rest_url', message: 'please provide a valid ripple_rest_url' });
  }

  if(!config.cold_wallet_secret) {
    errors.push({ field: 'cold_wallet_secret', message: 'please provide a valid cold_wallet_secret. It will not be stored to disk!' });
  }

  if(errors.length > 0){
    callback(errors, null);
  } else {
    callback(null, config);
  }

};

/**
 * @description Sets the specified cold wallet address in the config file.
 * @function _setColdWallet
 * @param config
 * @param callback
 * @private
 */
Wizard.prototype._setColdWallet = function(config, callback){
  gatewayd.api.setColdWallet(config.ripple_address, function(error, address){
    if(error){
      callback(new error(error));
    } else {
      callback(null, address);
    }
  });
};

/**
 * @description Generates a new ripple account/secret and sets it to the config file.
 * @function _setHotWallet
 * @param callback
 * @private
 */

Wizard.prototype._setHotWallet = function(callback){
  var self = this;
  gatewayd.api.generateWallet(function(error, wallet){
    if(error){
      callback(error, null);
    } else {
      gatewayd.api.setHotWallet(wallet.address, wallet.secret, function(error, hotWallet){
        if(error){
          callback(error, null)
        } else {
          self.setupConfig.hot_wallet = hotWallet;
          callback(null, self.setupConfig);
        }
      });
    }
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
Wizard.prototype._fundHotWallet = function (configProperties, callback){
  var self = this;
  var opts = {
    amount: 60,
    currency: 'XRP',
    secret: configProperties.cold_wallet_secret,
    destination_tag: 0
  };

  gatewayd.api.fundHotWallet(opts, function(error, payment){
    if(error){
      callback(error, null);
    } else {
      self.setupConfig.hash = payment.transaction.hash;
      callback(null, self.setupConfig);
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
  var self = this;
  gatewayd.api.setLastPaymentHash(config, function(error, response){
    if(error){
      callback(error, null);
    } else {
      self.setupConfig.hash_set = true;
      callback(null, self.setupConfig);
    }
  });

};

Wizard.prototype._updateAccountSettings = function (config, callback) {
  var self = this;

  var optsColdWallet = {
    account: config.ripple_address,
    data: {
      secret: config.cold_wallet_secret,
      settings: {
        disallow_xrp: true,
        require_destination_tag: true
      }
    }
  };

  var optsHotWallet = {
    account: self.setupConfig.hot_wallet.address,
    data: {
      secret: self.setupConfig.hot_wallet.secret,
      settings: {
        disallow_xrp: true,
        require_destination_tag: true
      }
    }
  };

  function updateColdWallet(setingsCallback){
    self.client.updateAccountSettings(optsColdWallet, function(error, response){
      if(error || !response.success){
        callback({ field: 'ripple_address', message: 'cannot update cold wallet account settings' }, null);
      } else {
        self.setupConfig.cold_wallet_settings = response.settings;
        setingsCallback();
      }
    });
  }

  function updateHotWallet(){
    self.client.updateAccountSettings(optsHotWallet, function(error, response){
      if(error || !response.success){
        callback({ field: 'ripple_address', message: 'cannot update hot wallet account settings' }, null);
      } else {
        self.setupConfig.hot_wallet_settings = response.settings;
        callback(null, self.setupConfig);
      }
    });
  }

  updateColdWallet(updateHotWallet);

};

/**
 * @description Sets trust line between the cold wallet and the new let hot waller.
 * @function _setTrustLine
 * @param config
 * @param callback
 * @private
 */
Wizard.prototype._setTrustLine = function(config, callback){
  var self = this;
  for (var currency in config.currencies) {
    gatewayd.api.setTrustLine(currency, config.currencies[currency], function(error, response){
      if(error){
        callback(error, null);
      } else {
        self.setupConfig.trust_line = response.transaction.LimitAmount;
        callback(null, self.setupConfig);
      }
    });
  }
};

Wizard.prototype._addCurrency = function(config, callback){
  var self = this;
  for (var currency in config.currencies) {
    gatewayd.api.addCurrency(currency, config.currencies[currency], function (error, response) {
      if (error) {
        callback(error, null);
      } else {
        self.setupConfig.currencies = response;
        callback(null, self.setupConfig);
      }
    });
  }
};

Wizard.prototype._issueCurrency = function(config, callback){
  var self = this;

  var opts = {
    secret: config.cold_wallet_secret,
    destination_tag: 0
  };

  for (var currency in config.currencies) {
    opts.amount = config.currencies[currency];
    opts.currency = currency;
  }

  console.log('_issueCurrency', opts.amount, opts.currency);

  gatewayd.api.issueCurrency(opts, function (error, response) {
    if (error) {
      callback(error, null);
    } else {
      self.setupConfig.currencies_issued = response;
      callback(null, self.setupConfig);
    }
  });
};

Wizard.prototype._setRippleRestUrl = function(config, callback){
  var self = this;
  gatewayd.api.setRippleRestUrl(config, function(error, response){
    if(error){
      callback(error, null);
    } else {
      self.setupConfig.ripple_rest_url = response;
      callback(null, self.setupConfig);
    }
  });
};

Wizard.prototype._setDatabaseUrl = function(config, callback){
  var self = this;
  gatewayd.api.setDatabaseUrl(config, function(error, response){
    if(error){
      callback(error, null);
    } else {
      self.setupConfig.database_url = response;
      callback(null, self.setupConfig);
    }
  });
};

Wizard.prototype._setKey = function(callback){
  var self = this;
  gatewayd.api.setKey(function(error, key){
    if(error){
      callback(error, null);
    } else {
      self.setupConfig.admin_login = {
        username: 'admin@' + config.get('DOMAIN'),
        password: key
      };
      callback(null, self.setupConfig);
    }
  });
};

Wizard.prototype._verifyPostgresConnection = function(callback) {

  db
    .authenticate()
    .complete(function(error){
      if(error){
        callback({ field: 'database_url', message: 'database is not connected' }, null);
      } else {
        callback(null, true);
      }

    });
};

/**
 * @description Verifies that Ripple REST is up and running.
 * @function _verifyRippleRestConnection
 * @param rippleRestUrl
 * @param callback
 * @private
 */
Wizard.prototype._verifyRippleRestConnection = function(rippleRestUrl, callback){

  this.client.ping(function(error, body){
    if(error || !body.success) {
      callback({ field: 'ripple_rest', message: 'ripple rest is not running' }, null);
    } else {
      callback(null, body.success);
    }
  });
};
/**
 * @description Checks account (cold wallet) balance to verify that there are at least 100 XRPs.
 * @function _checkAccountBalance
 * @param coldWalletAddress
 * @param callback
 * @private
 */

Wizard.prototype._checkAccountBalance = function(coldWalletAddress, callback){
  this.client.getAccountBalance(function(error, balance){
    if(error){
      callback({ field: 'ripple_address', message: 'account balance not available'}, null);
    } else if (!balance.success) {
      callback({ field: 'ripple_address', message: balance.message }, null);
    } else if (Number(balance.balances[0].value) < 100) {
      callback({ field: 'ripple_address', message: 'account balance must be at least 100 XRP'}, null);
    } else {
      callback(null, balance.balances[0]);
    }
  });
};

module.exports = Wizard;