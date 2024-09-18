import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

// Create and export the Google OAuth2 client instance
dotenv.config();

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.SERVER_CALLBACK // Ensure this URI is set correctly in .env
);

export { oauth2Client };
