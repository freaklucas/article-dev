/** @type {import('next').NextConfig} */


const dotenv = require('dotenv');


dotenv.config();

const nextConfig = {
  reactStrictMode: true,
  env: {
    API_KEY_FIREBASE: process.env.API_KEY_FIREBASE,
    AUTH_DOMAIN_FIREBASE: process.env.AUTH_DOMAIN_FIREBASE,
    PROJECT_ID_FIREBASE: process.env.PROJECT_ID_FIREBASE,
    STORAGE_BUCKET_FIREBASE: process.env.STORAGE_BUCKET_FIREBASE,
    MESSAGING_SENDER_ID_FIREBASE: process.env.MESSAGING_SENDER_ID_FIREBASE,
    APP_ID_FIREBASE: process.env.APP_ID_FIREBASE,
  },
}

module.exports = nextConfig;
