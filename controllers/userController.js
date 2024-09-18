import axios from 'axios';
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { oauth2Client } from '../utils/googleClient.js';

// @desc    Register
// @route   POST /user/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, googleUser = false } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    googleUser,
  });

  if (user) {
    res.status(201).json({
      token: generateToken(user),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login & get token
// @route   POST /user/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    if (user.googleUser || (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  }
});

const googleLogin = asyncHandler(async (req, res) => {
  const authorizeUrl = oauth2Client.generateAuthUrl({
    scope: ['profile', 'email'], // We only request basic profile and email
    redirect_uri:
      'https://task-manager-pro.up.railway.app/user/google/callback',
  });
  res.redirect(authorizeUrl);
});

const googleCallback = asyncHandler(async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokens.access_token}`
    );

    const userInfo = {
      googleId: data.sub,
      email: data.email,
      name: data.name,
      picture: data.picture,
      given_name: data.given_name,
      family_name: data.family_name,
    };

    const user = await googleUserAccount(userInfo);

    if (user) {
      const token = generateToken(user);
      res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);
    }
  } catch (error) {
    console.error('Error during Google OAuth callback:', error);
    res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
});

const googleUserAccount = async (userInfo) => {
  try {
    let user = await User.findOne({ email: userInfo.email });

    if (!user) {
      // If user doesn't exist, create a new user
      user = await User.create({
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        email: userInfo.email,
        googleUser: true,
      });
    }

    return user;
  } catch (error) {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

export { registerUser, loginUser, googleLogin, googleCallback };
