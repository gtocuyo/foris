const { expect } = require('chai')
const AttendanceController = require('../controllers/attendanceController')
const LogService = require('../services/logService')
const fs = require('fs')

describe('AttendanceController', () => {
    let controller
    let logService

    beforeEach(() => {
        logService = new LogService()
        controller = new AttendanceController('inmemory') // No se usa persistencia en los test
    })

    afterEach(() => {
        // Limpia el log después de cada prueba
        fs.writeFileSync('./logs/error.log', '', { flag: 'w' })
    })

    it('should log an error if a student is not registered when processing presence', async () => {
        let invalidPresenceCommand = 'Presence Juan 2 09:00 10:00 R100'
        await controller.processCommand(invalidPresenceCommand, 1)

        let logContent = fs.readFileSync('./logs/error.log', 'utf-8')
        expect(logContent).to.contain('Error encontrado en línea: 1')
        expect(logContent).to.contain("El estudiante 'Juan' no está registrado")
    })

    it('should log an error if day value is not between 1 and 7 when processing presence', async () => {
        let invalidDayValueCommand = 'Presence Marco -1 09:00 10:00 R100'
        await controller.processCommand(invalidDayValueCommand, 2)

        let logContent = fs.readFileSync('./logs/error.log', 'utf-8')
        expect(logContent).to.contain('Error encontrado en línea: 2')
        expect(logContent).to.contain("Valor incorrecto de día en la línea: 2")
        expect(logContent).to.contain("Se esperaba un valor entre 1 y 7, pero se encontró: -1")
    })

    it('should log an error if a command line is not in the correct format (missing fields)', async () => {
        let invalidCommand = 'Presence Juan 2 09:00 R100' // Falta la hora final
        await controller.processCommand(invalidCommand, 2)

        let logContent = fs.readFileSync('./logs/error.log', 'utf-8')
        expect(logContent).to.contain('Error encontrado en línea: 2')
        expect(logContent).to.contain("Formato incorrecto en la línea: 2")
        expect(logContent).to.contain("Se esperaba: 'Presence <Nombre> <Día> <Hora Inicio> <Hora Fin> <Sala>'")
    })

    it('should log an error for unknown commands', async () => {
        let unknownCommand = 'BlahBlahBlah'
        await controller.processCommand(unknownCommand, 3)

        let logContent = fs.readFileSync('./logs/error.log', 'utf-8')
        expect(logContent).to.contain('Error encontrado en línea: 3')
        expect(logContent).to.contain("Comando desconocido: 'BlahBlahBlah'.")
    })

    it('should log an error for invalid time format in Presence command', async () => {
        let invalidTimeCommand = 'Presence Andrea 2 09:75 10:00 R100' // Hora de inicio inválida
        await controller.processCommand(invalidTimeCommand, 4)

        let logContent = fs.readFileSync('./logs/error.log', 'utf-8')
        expect(logContent).to.contain('Error encontrado en línea: 4')
        expect(logContent).to.contain("Formato de hora incorrecto en la línea: 4")
        expect(logContent).to.contain("Hora de inicio '09:75', Hora de fin '10:00'")
    })

    it('should log an error when start time is not before end time', async () => {
        await controller.processCommand('Student Andrea', 5)
        let invalidTimeOrderCommand = 'Presence Andrea 2 10:00 09:00 R100' // Hora de inicio mayor que hora de fin
        await controller.processCommand(invalidTimeOrderCommand, 6)

        let logContent = fs.readFileSync('./logs/error.log', 'utf-8')
        expect(logContent).to.contain('Error encontrado en línea: 6')
        expect(logContent).to.contain("Hora de inicio mayor o igual a la hora de fin en la línea: 6");
        expect(logContent).to.contain("Hora de inicio '10:00', Hora de fin '09:00'")
    })

    it('should log an error for overlapping attendance records for the same student on the same day', async () => {
        await controller.processCommand('Student Andrea', 7);
        await controller.processCommand('Presence Andrea 2 09:00 10:00 R100', 8) // Asistencia válida
        await controller.processCommand('Presence Andrea 2 09:30 11:00 R101', 9) // Solapamiento

        let logContent = fs.readFileSync('./logs/error.log', 'utf-8')
        expect(logContent).to.contain('Error encontrado en línea: 9')
        expect(logContent).to.contain("Solapamiento de horarios en la línea: 9")
        expect(logContent).to.contain("El estudiante 'Andrea' ya tiene una asistencia registrada en el día 2")
    })

    it('should process a valid Student command correctly', async () => {
        let validStudentCommand = 'Student Andrea'
        await controller.processCommand(validStudentCommand, 1)

        let studentObj = await controller.attendanceService.getStudentNames()
        expect(studentObj).to.contain('Andrea')

    })

    it('should process a valid Presence command correctly for a registered student', async () => {
        await controller.processCommand('Student Andrea', 1)
        let validPresenceCommand = 'Presence Andrea 2 09:00 10:00 R100'
        await controller.processCommand(validPresenceCommand, 2)

        let logContent = fs.readFileSync('./logs/error.log', 'utf-8')
        expect(logContent).to.not.contain('Error encontrado en línea: 2')
    })
})
