import dotenv from 'dotenv'; 
dotenv.config();

export const config = {
  env: process.env.NODE_ENV,
  dbUri: process.env.DB_URI,
  bodyLimit: process.env.BODY_LIMIT,
  auth: {
      tokenTime: process.env.TOKEN_TIME,
      secret: process.env.SECRET_TOKEN,
  }
};