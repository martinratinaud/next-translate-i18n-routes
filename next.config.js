const nextTranslate = require('./src/modules/I18n/next.config');
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextTranslate(nextConfig);
