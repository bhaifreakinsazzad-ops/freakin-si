const FALLBACK_JWT_SECRET = 'engine-notreal-dev-fallback-jwt-secret-set-JWT_SECRET-in-production';

function getJwtSecret() {
  return process.env.JWT_SECRET || FALLBACK_JWT_SECRET;
}

module.exports = { getJwtSecret };
