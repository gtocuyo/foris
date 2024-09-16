require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
const AttendanceController = require('./controllers/attendanceController');
const ReportView = require('./views/reportView');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

(async () => {
    // Preguntamos al usuario por la opción de persistencia de datos (si la desea)
    let persistenceOptions = ['inmemory', 'redis', 'postgres'];

    rl.question('Selecciona una opción de persistencia (opcional) para los datos (0: INMEMORY, 1: REDIS, 2: POSTGRES): ', async (answer) => {
        let persistenceChoice = parseInt(answer);
        if (isNaN(persistenceChoice) || persistenceChoice < 0 || persistenceChoice >= persistenceOptions.length) {
            console.error('Opción no válida. Por favor, elije 0, 1 o 2.');
            rl.close();
            process.exit(1);
        }else if (persistenceChoice == 1 || persistenceChoice == 2){
            console.info('Opción no implementada aún, por favor escoje la opción 0 (InMemory).');
            rl.close();
            process.exit(1);
        }

        let selectedPersistence = persistenceOptions[persistenceChoice];
        let controller = new AttendanceController(selectedPersistence);
        let view = new ReportView();

        let inputFile = process.argv[2];
        if (inputFile) {
            let lines = fs.readFileSync(inputFile, 'utf8').split('\n').filter(Boolean);
            for (let [index, line] of lines.entries()) {
                // Enumeración de líneas y procesamiento de cada comando (línea) del archivo input
                // (las líneas se enumaran para ganar especificidad en los mensajes del log)
                await controller.processCommand(line, index + 1);
            }
            let report = await controller.generateReport();
            view.display(report);
            process.exit(0);
        } else {
            console.error('Por favor, proporciona un archivo de entrada.');
            rl.close();
            process.exit(1);
        }

        rl.close();
    });
})();
