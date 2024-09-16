const { expect } = require('chai')
const Attendance = require('../models/attendance')

describe('Attendance Model', () => {
    it('should create an attendance record with correct properties', () => {
        let attendance = new Attendance(1, '09:00', '10:30', 'R100')
        expect(attendance.day).to.equal(1)
        expect(attendance.startTime).to.equal('09:00')
        expect(attendance.endTime).to.equal('10:30')
        expect(attendance.roomCode).to.equal('R100')
    })

    it('should calculate the correct number of minutes of attendance', () => {
        let attendance = new Attendance(1, '09:00', '10:30', 'R100');
        expect(attendance.getMinutes()).to.equal(90) // 90 minutos de 09:00 a 10:30
    })

    it('should handle zero duration correctly', () => {
        let attendance = new Attendance(1, '09:00', '09:00', 'R100') // Mismo tiempo de inicio y fin
        expect(attendance.getMinutes()).to.equal(0)
    })

    it('should handle single-minute duration correctly', () => {
        let attendance = new Attendance(1, '09:00', '09:01', 'R100') // Duración de 1 minuto
        expect(attendance.getMinutes()).to.equal(1)
    })

    it('should handle duration crossing hours correctly', () => {
        let attendance = new Attendance(1, '09:45', '11:15', 'R100') // Duración de 90 minutos cruzando la hora
        expect(attendance.getMinutes()).to.equal(90)
    })
})
