const Wizard = require(__dirname+'/../lib/wizard');

function WizardController (options) {
  this.wizard = new Wizard({
    gatewayd: options.gatewayd
  });
}

WizardController.prototype = {
  info: function(request, response) {
    response.send({
      success: true,
      plugin: {
        name: 'gatewayd-setup-plugin',
        version: '0.1.0',
        documentation: 'https://github.com/gatewayd/gatewayd-setup-wizard-plugin'
      }
    });
  },
  setup: function(request, response) {
    var _this = this;
    var options = request.body;

    _this.wizard.setup(options, function(error, setup){
      if (error) {
        return response
          .status(500)
          .send({
            success: false,
            message: error
        });
      }

      response
        .status(200)
        .send({
          success: true,
          setup: setup
      });
    });
  }
};

module.exports = WizardController;
