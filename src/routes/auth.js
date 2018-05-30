const User = require("../models/User");

exports.login = function(req, res) {
  const { credentials } = req.body;
  User.findOne({ email: credentials.email }).then(user => {
    if (user && user.isValidPassword(credentials.password)) {
      res.json({ user: user.toAuthJSON() });
    } else {
      res.status(400).json({ errors: { global: "Invalid Credentials" } });
    }
  });
};

exports.confirm = (req, res) => {
  const { token } = req.body;
  User.findOneAndUpdate(
    { confirmationToken: token },
    { confirm: true, confirmationToken: "" },
    { new: true }
  )
    .then(
      user =>
        user
          ? res.json(user.toAuthJSON())
          : res.status(400).json({ errors: "User does not exist" })
    )
    .catch(err => {
      res.status(400).json({});
    });
};
