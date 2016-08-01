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
      return new Promise((resolve, reject) => {
        if (!userId) {
          return reject(new TypeError("Invalid user id"));
        }
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
        if (!userToken) {
          return reject(new TypeError("Invalid user token"));
        }
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
      return new Promise((resolve, reject) => {
        if (!userId) {
          return reject(new TypeError("Invalid user id"));
        }
        if (!userToken) {
          return reject(new TypeError("Invalid user token"));
        }
        if (!duration) {
          return reject(new TypeError("Invalid token duration"));
        }
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
     * Saves user/token data.
     *
     * @param {String} userId
     * @param {String} userToken
     * @param {Number} duration
     * @return {Promise}
     */
    save(userId, userToken, duration = DEFAULT_DURATION) {
      return new Promise((resolve, reject) => {
        if (!userId) {
          return reject(new TypeError("Invalid user id"));
        }
        if (!userToken) {
          return reject(new TypeError("Invalid user token"));
        }
        if (!duration) {
          return reject(new TypeError("Invalid token duration"));
        }
        client
          .multi()
          .set(userId, userToken)
          .set(userToken, userId)
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
     * Removes user/token data.
     *
     * @param {String} userId
     * @param {String} userToken
     * @param {Number} duration
     * @return {Promise}
     */
    remove(userId, userToken, duration = DEFAULT_DURATION) {
      return new Promise((resolve, reject) => {
        if (!userId) {
          return reject(new TypeError("Invalid user id"));
        }
        if (!userToken) {
          return reject(new TypeError("Invalid user token"));
        }
        if (!duration) {
          return reject(new TypeError("Invalid token duration"));
        }
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
