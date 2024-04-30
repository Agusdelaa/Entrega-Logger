import winston from 'winston'

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'cyan',
        debug: 'white'
    }
}

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'errors.log'
        })
    ]
})

winston.addColors(customLevelOptions.colors)

export const addLogger = (req, res, next) => {
    const environment = process.env.NODE_ENV || 'development'
    const logger = environment === 'development' ? devLogger : prodLogger
    Object.keys(customLevelOptions.levels).forEach(level => {
        logger[level] = (message) => logger.log({ level, message })
    })
    req.logger = logger
    next()
}