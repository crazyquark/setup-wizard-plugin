setup-wizard-plugin
===================

A webapp that automates the setup of gatewayd

### Installation

    npm install --save gatewayd-setup-wizard-plugin

In the Gatewaydfile of your gatewayd installation:

    var WizardPlugin = require('gatewayd-setup-wizard-plugin');

    var WizardPlugin = require('gatewayd-setup-wizard-plugin');

    module.exports = function(gatewayd) {
      var wizardPlugin = new WizardPlugin({
        gatewayd: gatewayd
      });

      gatewayd.server.use('/', wizardPlugin.router);

    };

### Raison d'être

The purpose of the Wizard plugin is to configure gateway in order
to easily and quickly get starting developing and using gatewayd.


The Wizard configures your gatewayd by presenting an admin user interface, 
setting several configuration options, and creating ripple accounts for hot
wallet and cold wallet with the appropriate ripple settings for gateway accounts,
setting trustlines, and generating balances.

### Steps

  - gatewayd.api.setColdWallet
  - gatewayd.api.generateWallet
  - gatewayd.api.setHotWallet (with the generated wallet)
  - gatewayd.api.fundHotWallet (with 60 XRP)
  - gatewayd.api.setLastPaymentHash (from hot wallet transaction)
  - gatewayd.api.addCurrency (for each currency)
  - gatewayd.api.updateRippleAccountSettings
  - gatewayd.api.setTrustLines (for each currency)
  - gatewayd.api.issueCurrency (for each currency)
  - gatewayd.api.setDatabaseUrl
  - gatewayd.api.setRippleRestUrl
  - gatewayd.api.setKey
  
