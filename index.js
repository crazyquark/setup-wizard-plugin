var express = require('express');
var WizardController = require(__dirname+'/app/controllers/wizard_controller');

function WizardPlugin (options) {
  var router = new express.Router();

  var wizardController = new WizardController({
    gatewayd: options.gatewayd
  });

  router.get('/wizard/info', wizardController.info.bind(wizardController));
  router.post('/wizard/setup', wizardController.setup.bind(wizardController));

  router.use('/wizard', express.static(__dirname+'/public'));

  this.router = router;
}

module.exports = WizardPlugin;
