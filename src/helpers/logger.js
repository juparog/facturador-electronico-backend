import pino from 'pino';
import pinoms from 'pino-multi-stream';
import { configEnv } from '../config/env/config';

const appName = configEnv.get('app.name');
const logLevel = configEnv.get('app.logger.logLevel') ;

const levels = {
  trace: 10,
  debug: 20,
  http: 25,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

const streams = [
  { level: logLevel, stream: process.stdout },
  { 
    stream: 
      pino.destination({
        dest: `${process.cwd()}/logs/logger.log`,
        sync: false,
      }),
  },
  { 
    level: 'error',
    stream: 
      pino.destination({
        dest: `${process.cwd()}/logs/logger.error.log`,
        sync: false,
      }),
  }
]

const getCallerFile = () => {
  let filename;

  let _pst = Error.prepareStackTrace
  Error.prepareStackTrace = (err, stack) => { return stack; };
  try {
      let err = new Error();
      let callerfile;
      let currentfile;

      currentfile = err.stack.shift().getFileName();

      while (err.stack.length) {
          callerfile = err.stack.shift().getFileName();

          if(currentfile !== callerfile) {
              filename = callerfile;
              break;
          }
      }
  } catch (err) {}
  Error.prepareStackTrace = _pst;
  
  if(filename.toString().split("\\").length > 0) {
      filename = filename.toString().split("\\");
      filename = filename[filename.length - 1]
  }
  return filename;
};

const parentLogger = pino(
  {
    name: appName,
    customLevels: levels, // our defined levels
    useOnlyCustomLevels: true,
    level: logLevel,
    useLevelLabels: false,
    prettyPrint: {
      colorize: true, // colorizes the log
      levelFirst: true,
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
      messageFormat: '{location}: {msg}',
      ignore: "hostname,pid,location"
    }
  },
  pinoms.multistream(streams),
);

export {
  parentLogger,
  getCallerFile
}
