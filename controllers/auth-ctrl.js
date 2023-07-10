const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models/user');
const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../helpers');
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email already in use');
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const result = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    name: result.name,
    subscription: result.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, 'Email or password is wrong');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw new HttpError(401, 'Invalid password');
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

  await User.findByIdAndUpdate(payload.id, { token });
  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
    },
  });
};

const getCurrent = async (req, res) => {
  const { name, subscription } = req.user;
  res.json({
    user: {
      name,
      subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.json({
    message: 'Logout successfully',
  });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { subscription: req.body.subscription });
  res.json({ message: 'Subscription changed' });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
};
