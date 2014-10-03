var assert = require('assert');
var Wizard = require(__dirname+'/../app/lib/wizard');
var gatewayd = require('/Users/abiy/code/gatewayd');

describe('Check for Postgres connection', function(){

  var wizard = new Wizard({
    gatewayd: gatewayd
  });

  it('should ping provided database connection -- /v1', function(done){
    wizard._verifyPostgresConnection()
      .then(function(connection_status){
        assert(connection_status, true);
        done();
      })
      .error(function(error){
        assert(!error);
        done();
      });
  });

  it('should return error on no ripple rest connection', function(done){
    done();
  })

});