const express = require('express');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

app.use(express.json());

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

let users = [
    {
      id: 1,
      username: 'tester',
      email: 'tester@mail.com',
      password: '$2y$06$PhZ74dT8/5g6B8SgssFq6ey4ojLxmP6pos2DcevMUGw25Vc9jGEou', // testerpassword
      validApiKey: null
    },
    {
      id: 2,
      username: "johndoe",
      email: 'john@mail.com',
      password: '$2y$06$eQav1OaIyWSUnlvPSaFXRe5gWRqXd.s9vac1SV1GafxAr8hdmsgCy', // johndoepassword
      validApiKey: null
    },
];

passport.use(new BasicStrategy(
  function(username, password, done) {

    const user = users.find(u => u.username == username)
    if(user == undefined) {
      // Username not found
      console.log("HTTP Basic username not found");
      return done(null, false, { message: "HTTP Basic username not found" });
    }

    /* Verify password match */
    if(bcrypt.compareSync(password, user.password) == false) {
      // Password does not match
      console.log("HTTP Basic password not matching username");
      return done(null, false, { message: "HTTP Basic password not found" });
    }
    return done(null, user);
  }
));

app.get('/',
        passport.authenticate('basic', { session: false }),
        (req, res) => {
  res.json({
    yourProtectedResource: req.route
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))