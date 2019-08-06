import dotenv from 'dotenv';
dotenv.config();

const defaultConfig = {
  cors: [
    'http://0.0.0.0:4000',
    'http://localhost:4000',
    'http://192.168.1.101:4000',
    'https://omindbrand.com',
    'https://www.omindbrand.com',
    'https://omind.io',
    'https://www.omind.io',
    'https://omind-frontend-production.herokuapp.com',
    'https://omind-frontend-staging.herokuapp.com',
    'http://omind-frontend-staging.herokuapp.com',
  ],
  mongoOpts: {
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 100, // Reconnect every 100ms
    useCreateIndex: true,
    useNewUrlParser: true,
    autoIndex: false,
    useFindAndModify: false,
  },
  dbName: process.env.DB_NAME,
  dbUri: process.env.DB_URI,
  env: process.env.NODE_ENV,
  bodyLimit: process.env.BODY_LIMIT,
  contactEmail: process.env.CONTACT_EMAIL,
  sendgridApiKey: process.env.SENDGRID_API_KEY,
  auth: {
    tokenTime: process.env.TOKEN_TIME,
    secret: process.env.SECRET_TOKEN,
  },
  backblaze: {
    bucketId: process.env.BACKBLAZE_BUCKET_ID,
    keyId: process.env.BACKBLAZE_KEY_ID,
    keyName: process.env.BACKBLAZE_KEY_NAME,
    applicationKey: process.env.BACKBLAZE_APPLICATION_KEY,
  },
  rateLimiter: {
    tableName: process.env.RATE_LIMITER_TABLE_NAME,
    points: process.env.RATE_LIMITER_POINTS,
    duration: process.env.RATE_LIMITER_DURATION,
    blockDuration: process.env.RATE_LIMITER_BLOCK_DURATION,
    inMemoryBlockOnConsumed: process.env.RATE_LIMITER_IN_MEMORY_BLOCK_ON_CONSUMED,
    inMemoryBlockDuration: process.env.RATE_LIMITER_IN_MEMORY_BLOCK_DURATION,
    pointsToConsume: process.env.RATE_LIMITER_POINTS_TO_CONSUME,
    // userPointsToConsume: process.env.RATE_LIMITER_USER_POINTS_TO_CONSUME,
    // visitorPointsToConsume: process.env.RATE_LIMITER_VISITOR_POINTS_TO_CONSUME
  },
};

const envConfig = {
  production: {},
  development: {},
  test: {
    dbUri: process.env.DB_TEST_URI,
  },
};

function loadConfig() {
  const env = process.env.NODE_ENV || 'test';

  if (!envConfig[env]) {
    throw new Error(
      `Environment config for environment '${env}' not found. process.env.NODE_ENV must be one of '${Object.keys(
        envConfig,
      )}'`,
    );
  }

  return Object.assign({}, defaultConfig, envConfig[env]);
}

export const config = loadConfig();
