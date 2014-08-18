var Wizard = require(__dirname+'/../lib/wizard.js');

describe('Wizard setup', function(){
  var wizard;
  before(function(){
    wizard = new Wizard();
  });

  it('should set a cold wallet', function(done){
    wizard._setColdWallet('rMinhWxZz4jeHoJGyddtmwg6dWhyqQKtJz', function(error, response){
      console.log('error', error);
      console.log('response', response);
      done();
    });
  });

});
