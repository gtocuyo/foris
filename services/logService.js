const fs = require('fs')
const path = require('path')

class LogService {
    constructor() {
        this.logFilePath = path.join(__dirname, '../logs/error.log')
        this.initLogFile()
    }

    initLogFile() {
        fs.writeFileSync(this.logFilePath, '', { flag: 'w' })
    }

    logError(lineNumber, errorDetail) {
        const errorMessage = `Error encontrado en línea: ${lineNumber} - ${errorDetail}\n`
        fs.appendFileSync(this.logFilePath, errorMessage)
    }
}

module.exports = LogService