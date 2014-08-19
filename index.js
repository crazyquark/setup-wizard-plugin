var express = require('express');
var Wizard = require(__dirname+'/lib/wizard');


function WizardPlugin (options) {
  this.router = new express.Router();

  var wizard = new Wizard({
    gatewayd: options.gatewayd
  });

  this.router.use('/wizard', express.static(__dirname+'/public'));
  this.router.post('/wizard/setup', wizard.setup);
}

module.exports = WizardPlugin;
