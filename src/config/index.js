import dotenv from 'dotenv'; 
dotenv.config();

const defaultConfig = {
  dbUri: process.env.DB_URI,
  bodyLimit: process.env.BODY_LIMIT,
  auth: {
      tokenTime: process.env.TOKEN_TIME,
      secret: process.env.SECRET_TOKEN,
  }
};

const envConfig = {
  production: {},
  development: {},
  test: {}
};

function loadConfig() {
  const env = process.env.NODE_ENV || 'dev';

  if (!envConfig[env]) {
    throw new Error(
      `Environment config for environment '${env}' not found. process.env.NODE_ENV must be one of '${Object.keys(
        envConfig
      )}'`
    );
  }

  console.log('[INFO] config loaded for environment: ', env);

  // merge default config with environment specific config
  return Object.assign({}, defaultConfig, envConfig[env]);
}

export const config = loadConfig();
