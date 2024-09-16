const AttendanceService = require('../services/attendanceService')
const LogService = require('../services/logService')
const GenericUtils = require('../utils/generic')

class AttendanceController {
    constructor(persistenceType) {
        this.attendanceService = new AttendanceService(persistenceType)
        this.logService = new LogService()
        this.genericUtils = new GenericUtils()
    }

    async processCommand(command, lineNumber) {
        let parts = command.split(' ')
        let action = parts[0]

        try {
            if (action === 'Student') {
                this._processStudentCommand(parts, lineNumber)
            } 
            else if (action === 'Presence') {
                this._processPresenceCommand(parts, lineNumber)
            } 
            else {
                throw new Error(`Comando desconocido: '${action}'.`)
            }

        } catch (error) {
            this.logService.logError(lineNumber, error.message)
        }
    }

    async _processStudentCommand(parts, lineNumber) {
        try
        {
            if (parts.length !== 2) {
                throw new Error(`Formato incorrecto en la línea: ${lineNumber}. Se esperaba: 'Student <Nombre>' pero se encontró: '${parts.join(' ')}'`)
            }
            
            if (parts[0] !== 'Student'){
                throw new Error(`Comando incorrecto en la línea: ${lineNumber}. Se esperaba: 'Student' pero se encontró: '${parts[0]}'`)
            }
    
            let studentName = parts[1]

            let studentObj = await this.attendanceService.getStudent(studentName)
            
            if(studentObj){
                throw new Error(`Estudiante: ${studentName} ya se registró.`)
            }else
                await this.attendanceService.addStudent(studentName)
        }
        catch(error)
        {
            this.logService.logError(lineNumber, error.message)
        }
    }

    async _processPresenceCommand(parts, lineNumber) {
        try{

            if (parts.length !== 6) {
                throw new Error(`Formato incorrecto en la línea: ${lineNumber}. Se esperaba: 'Presence <Nombre> <Día> <Hora Inicio> <Hora Fin> <Sala>' pero se encontró: '${parts.join(' ')}'`)
            }
            
            if (parts[0] !== 'Presence'){
                throw new Error(`Comando incorrecto en la línea: ${lineNumber}. Se esperaba: 'Presence' pero se encontró: '${parts[0]}'`)
            }

            let [command, name, day, startTime, endTime, room] = parts;

            if (parseInt(day) < 1 || parseInt(day) > 7){
                throw new Error(`Valor incorrecto de día en la línea: ${lineNumber}. Se esperaba un valor entre 1 y 7, pero se encontró: ${parseInt(day)}.`)
            }

            if (!GenericUtils.isValidTimeFormat(startTime) || !GenericUtils.isValidTimeFormat(endTime)) {                
                throw new Error(`Formato de hora incorrecto en la línea: ${lineNumber}. Se esperaba 'HH:MM' en formato de 24 horas, pero se encontró: Hora de inicio '${startTime}', Hora de fin '${endTime}'`)
            }

            if (!GenericUtils.isStartTimeBeforeEndTime(startTime, endTime)) {
                throw new Error(`Hora de inicio mayor o igual a la hora de fin en la línea: ${lineNumber}. Se encontró: Hora de inicio '${startTime}', Hora de fin '${endTime}'`)
            }

            let currentStudent = await this.attendanceService.getStudent(name)

            if (!currentStudent) {            
                throw new Error(`El estudiante '${name}' no está registrado`)
            }

            let overlappingRecord = currentStudent.attendanceRecords.find(record => 
                record.day === parseInt(day) && 
                GenericUtils.doTimesOverlap(record.startTime, record.endTime, startTime, endTime)
            )

            if (overlappingRecord) {
                throw new Error(`Solapamiento de horarios en la línea: ${lineNumber}. El estudiante '${name}' ya tiene una asistencia registrada en el día ${day} desde '${overlappingRecord.startTime}' hasta '${overlappingRecord.endTime}' en la sala '${overlappingRecord.roomCode}'.`)
            }

            await this.attendanceService.addPresence(name, day, startTime, endTime, room)
        }
        catch(error){
            this.logService.logError(lineNumber, error.message)
        }
    }

    async generateReport() {
        return await this.attendanceService.getAttendanceReport()
    }

}

module.exports = AttendanceController