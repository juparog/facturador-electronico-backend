import createLogger from 'logging';
import { configEnv } from '../config/env/config';

const options = true ? {} : { logFunction: () => {} };

const logger = createLogger(configEnv.get('app.name'), options);

const _getCallerFile = () => {
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
    
    // if(filename.toString().split("\\").length > 0) {
    //     filename = filename.toString().split("\\");
    //     filename = filename[filename.length - 1]
    // }
    return filename;
}

export { logger, _getCallerFile };
