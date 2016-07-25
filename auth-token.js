const redis = require("redis");

module.exports = function(...args) {

  // Creates the redis client.
  const client = redis.createClient(...args);

  // An hour.
  const DEFAULT_DURATION = 3600;

  return {
    /**
     * Returns the userToken using the userId
     *
     * @param {String} userId
     * @return {Promise}
     */
    getUserToken(userId) {
      if (!userId) {
        throw new TypeError("Invalid user id");
      }
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
      if (!userToken) {
        throw new TypeError("Invalid user token");
      }
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
    update(userId, userToken, duration = DEFAULT_DURATION) {
      if (!userId) {
        throw new TypeError("Invalid user id");
      }
      if (!userToken) {
        throw new TypeError("Invalid user token");
      }
      if (!duration) {
        throw new TypeError("Invalid token duration");
      }
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
     *
     * @param {String} userId
     * @param {String} userToken
     * @param {Number} duration
     * @return {Promise}
     */
    authenticate(userId, userToken, duration = DEFAULT_DURATION) {
      if (!userId) {
        throw new TypeError("Invalid user id");
      }
      if (!userToken) {
        throw new TypeError("Invalid user token");
      }
      if (!duration) {
        throw new TypeError("Invalid token duration");
      }
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
     *
     * @param {String} userId
     * @param {String} userToken
     * @param {Number} duration
     * @return {Promise}
     */
    deauthenticate(userId, userToken, duration = DEFAULT_DURATION) {
      if (!userId) {
        throw new TypeError("Invalid user id");
      }
      if (!userToken) {
        throw new TypeError("Invalid user token");
      }
      if (!duration) {
        throw new TypeError("Invalid token duration");
      }
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
};
