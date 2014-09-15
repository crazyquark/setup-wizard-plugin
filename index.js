var express = require('express');
var WizardController = require(__dirname+'/app/controllers/wizard_controller');


function WizardPlugin (options) {
  this.router = new express.Router();

  var wizardController = new WizardController({
    gatewayd: options.gatewayd
  });

  this.router.use('/wizard', express.static(__dirname+'/public'));
  this.router.get('/wizard/info', wizardController.info.bind(wizardController));
  this.router.post('/wizard/setup', wizardController.setup.bind(wizardController));
}

module.exports = WizardPlugin;
