import { createLogger, format, transports } from "winston";
const {combine, timestamp, json, colorize} = format;

//
const consoleLofFormat = format.combine(
    format.colorize(),
    format.printf(({level, message, timestamp}) => {
        return `${level}: ${message}`;
    })
);

const logger = createLogger({
    level: 'info',
    format: combine(
        colorize(),
        timestamp(), 
        json()
    ),
    transports: [
        new transports.Console({
            format: consoleLofFormat
        }),
        new transports.File({filename: 'app.log'})
    ]
});

export default logger;