const {expect} = require("chai");
const redisAuth = require("../auth-token")();

describe("Redis Auth Token", function() {

  this.timeout(5000);

  it("should authenticate a user", (done) => {

    redisAuth.authenticate("id", "token", 3600).then(() => {
      done();
    }).catch((err) => {
      done(err);
    });

  });

  it("should get the user id using the token", (done) => {

    redisAuth.getUserId("token").then(({id,ttl}) => {
      expect(id).to.be.equal("id");
      done();
    }).catch((err) => {
      done(err);
    });

  });

  it("should get the user id using the token", (done) => {

    redisAuth.getUserToken("id").then(({token,ttl}) => {
      expect(token).to.be.equal("token");
      done();
    }).catch((err) => {
      done(err);
    });

  });

  it("should update the user expiration time", (done) => {

    setTimeout(() => {

      redisAuth.getUserToken("id").then(({id,token,ttl}) => {
        expect(ttl).to.be.most(3599);
        return redisAuth.update("id","token",3600);
      }).then(() => {
        return redisAuth.getUserToken("id");
      }).then(({id,token,ttl}) => {
        expect(ttl).to.be.equal(3600);
        done();
      }).catch((err) => {
        done(err);
      });

    }, 1000);

  });

  it("should deauthenticate the user", (done) => {

    redisAuth.deauthenticate("id", "token").then(() => {
      return redisAuth.getUserToken("id");
    }).then(({id,token,ttl}) => {
      expect(token).to.be.null;
      expect(ttl).to.be.equal(-2);
      done();
    }).catch((err) => {
      done(err);
    });

  });

});
