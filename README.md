setup-wizard-plugin
===================

A webapp that automates the setup of gatewayd

### Installation

    npm install --save gatewayd-setup-wizard-plugin

In the Gatewaydfile of your gatewayd installation:

    
    var WizardPlugin = require('gatewayd-setup-wizard-plugin');

    module.exports = function(gatewayd) {
      var wizardPlugin = new WizardPlugin();

      wizardPlugin.initialize({
        gatewayd: gatewayd
      });
    }

