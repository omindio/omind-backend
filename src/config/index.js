import dotenv from 'dotenv'; 
dotenv.config();

const defaultConfig = {
  dbUri: process.env.DB_URI,
  env: process.env.NODE_ENV,
  bodyLimit: process.env.BODY_LIMIT,
  auth: {
      tokenTime: process.env.TOKEN_TIME,
      secret: process.env.SECRET_TOKEN,
  }
};

const envConfig = {
  production: {},
  development: {},
  test: {
    dbUri: process.env.DB_TEST_URI,
  }
};

function loadConfig() {
  const env = process.env.NODE_ENV || 'test';

  if (!envConfig[env]) {
    throw new Error(
      `Environment config for environment '${env}' not found. process.env.NODE_ENV must be one of '${Object.keys(
        envConfig
      )}'`
    );
  }

  return Object.assign({}, defaultConfig, envConfig[env]);
}

export const config = loadConfig();