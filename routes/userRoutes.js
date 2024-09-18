import express from 'express';
import {
  googleCallback,
  googleLogin,
  loginUser,
  registerUser,
} from '../controllers/userController.js';

const router = express.Router();

// @desc  Register
router.route('/register').post(registerUser);

// @desc  Login
router.route('/login').post(loginUser);

// @desc  Google Auth
router.get('/google/auth', googleLogin);

// @desc  Google Callback
router.get('/google/callback', googleCallback);

export default router;
