const redis = require("redis");
const client = redis.createClient();

module.exports = {
  /**
   * Returns the userToken using the userId
   *
   * @param {String} userId
   * @return {Promise}
   */
  getUserToken(userId) {
    return new Promise((resolve, reject) => {
      client
        .multi()
        .get(userId)
        .ttl(userId)
        .exec((err, [userToken, ttl]) => {
          if (err) {
            return reject(err);
          }
          return resolve({ id: userId, token: userToken, ttl });
        });
    });
  },
  /**
   * Returns the userId using the userToken
   *
   * @param {String} userToken
   * @return {Promise}
   */
  getUserId(userToken) {
    return new Promise((resolve, reject) => {
      client
        .multi()
        .get(userToken)
        .ttl(userToken)
        .exec((err, [userId, ttl]) => {
          if (err) {
            return reject(err);
          }
          return resolve({ id: userId, token: userToken, ttl });
        });
    });
  },
  /**
   * Refreshes the userId and userToken expiration time.
   *
   * @param {String} userId
   * @param {String} userToken
   * @param {Number} duration
   * @return {Promise}
   */
  update(userId, userToken, duration) {
    return new Promise((resolve, reject) => {
      client
        .multi()
        .expire(userId, duration)
        .expire(userToken, duration)
        .exec((err, replies) => {
          if (err) {
            return reject(err)
          }
          return resolve(replies);
        });
    });
  },
  /**
   * Authenticates the user.
   */
  authenticate(userId, userToken, duration) {
    return new Promise((resolve, reject) => {
      client
        .multi()
        .mset(userId, userToken, userToken, userId)
        .expire(userId, duration)
        .expire(userToken, duration)
        .exec((err, replies) => {
          if (err) {
            return reject(err);
          }
          return resolve(replies);
        });
    });
  },
  /**
   * Deauthenticates the user.
   */
  deauthenticate(userId, userToken, duration) {
    return new Promise((resolve, reject) => {
      client
        .multi()
        .del(userId)
        .del(userToken)
        .exec((err, replies) => {
          if (err) {
            return reject(err);
          }
          return resolve(replies);
        });
    });
  }
};
