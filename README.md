# Redis Auth Token

```javascript
const auth = require("redis-auth-token");

auth.authenticate(id, token, duration).then(() => {

}).catch((err) => {

});

auth.deauthenticate(id, token).then(() => {

}).catch((err) => {

});

auth.update(id, token, duration).then(() => {

}).catch((err) => {

});

auth.getUserToken(id).then(() => {

}).catch((err) => {

});

auth.getUserId(token).then(() => {

}).catch((err) => {

});
```

Made with ❤ by ROJO 2 (http://rojo2.com)
