const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const {
  signupValidation,
  signinValidation,
} = require("../validators/authValidator");

exports.signUp = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  const { error } = signupValidation(req.body);

  if (error) return res.json({ error: error.details[0].message });

  const findUser = await User.findOne({ email });
  if (findUser)
    return res.json({ error: "User already exists! How about signing in?" });

  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hashSync(password, salt);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hash,
  });
  try {
    const savedUser = await newUser.save();
    const token = await jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      process.env.SECRET
    );
    return res.json({
      token,
      user: {
        name: savedUser.fullName,
        email: savedUser.email,
        id: savedUser._id,
      },
    });
  } catch (err) {
    res.json({ error: "Error saving user" });
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  const { error } = signinValidation(req.body);

  if (error) return res.json({ error: error.details[0].message });

  const findUser = await User.findOne({ email });
  if (!findUser) return res.json({ error: "Email/Password is wrong" });

  const checkPassword = bcrypt.compareSync(password, findUser.password);
  if (!checkPassword) return res.json({ error: "Email/Password is wrong" });

  const token = await jwt.sign(
    { id: findUser._id, role: findUser.role },
    process.env.SECRET
  );
  return res.json({
    token,
    user: { name: findUser.fullName, email: findUser.email, id: findUser._id },
  });
};
