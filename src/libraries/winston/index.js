import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, prettyPrint } = format;

import path from 'path';
import fs from 'fs';
import appRoot from 'app-root-path';
import DailyRotateFile from 'winston-daily-rotate-file';

const logDirectory = path.resolve(`${appRoot}`, "logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const logger = createLogger({
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new DailyRotateFile({
            level: 'info',
            filename: path.resolve(logDirectory, 'combined-%DATE%.log'),
            datePattern: 'YYYYMMDD',
            handleExceptions: true,
            json: true,
            zippedArchive: true,
            maxSize: '50m',
            maxFiles: '14d',
    }),
    new DailyRotateFile({
      level: 'error',
      filename: path.resolve(logDirectory, 'error-%DATE%.log'),
      datePattern: 'YYYYMMDD',
      handleExceptions: true,
      json: true,
      zippedArchive: true,
      maxSize: '50m',
      maxFiles: '14d',
    })
  ],
  exitOnError: false
});

logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;
