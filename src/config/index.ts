export const DB = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ca: process.env.CA_CERTIFICATE,
};

export const REDIS = process.env.REDIS;

export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  JWT_PRIVATE,
  CORS_ORIGIN,
} = process.env;
