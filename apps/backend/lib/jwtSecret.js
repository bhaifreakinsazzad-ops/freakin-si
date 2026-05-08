const FALLBACK_JWT_SECRET = 'black-sheep-production-fallback-jwt-secret-change-in-vercel';

function getJwtSecret() {
  return process.env.JWT_SECRET || FALLBACK_JWT_SECRET;
}

module.exports = { getJwtSecret };
