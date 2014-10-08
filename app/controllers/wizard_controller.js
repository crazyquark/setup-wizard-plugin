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

    _this.wizard.setup(options)
      .then(function(setup){
        response
          .status(200)
          .send({
            success: true,
            setup: setup
        });
      })
      .error(function(error){
        return response
          .status(500)
          .send({
            success: false,
            message: error.message
          });
      });
  },
  verify: function(request, response) {
    var _this = this;

    _this.wizard.verifyConfiguration()
      .then(function(setup){
        delete setup.admin_login.password;
        delete setup.hot_wallet.secret;
        response
          .status(200)
          .send({
            success: true,
            configuration: setup
          });
      })
      .error(function(error){
        return response
          .status(500)
          .send({
            success: false,
            message: error.message
          });
      });
  }
};

module.exports = WizardController;
