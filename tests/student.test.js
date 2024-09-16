const { expect } = require('chai')
const Student = require('../models/student')
const Attendance = require('../models/attendance')

describe('Student Model', () => {
    it('should create a student with a name', () => {
        let student = new Student('Marco')
        expect(student.name).to.equal('Marco')
        expect(student.attendanceRecords).to.be.an('array').that.is.empty
    })

    it('should add attendance correctly', () => {
        let student = new Student('Marco')
        let attendance = new Attendance(1, '09:00', '10:00', 'R100')
        student.addAttendance(attendance)
        expect(student.attendanceRecords).to.have.lengthOf(1)
    })

    it('should not add attendance if duration is less than 5 minutes', () => {
        let student = new Student('Marco')
        let shortAttendance = new Attendance(1, '09:00', '09:04', 'R100') // Duración de 4 minutos
        student.addAttendance(shortAttendance)
        expect(student.attendanceRecords).to.be.empty
    })

    it('should calculate total minutes of attendance correctly', () => {
        let student = new Student('Marco')
        let attendance1 = new Attendance(1, '09:00', '10:00', 'R100') // 60 minutos
        let attendance2 = new Attendance(2, '14:00', '15:30', 'R200') // 90 minutos
        student.addAttendance(attendance1)
        student.addAttendance(attendance2)
        expect(student.getTotalMinutes()).to.equal(150) // Total de 150 minutos
    })

    it('should calculate the number of unique days of attendance correctly', () => {
        let student = new Student('Marco')
        let attendance1 = new Attendance(1, '09:00', '10:00', 'R100')
        let attendance2 = new Attendance(2, '14:00', '15:30', 'R200')
        let attendance3 = new Attendance(2, '16:00', '17:00', 'R300') // Mismo día que attendance2
        student.addAttendance(attendance1)
        student.addAttendance(attendance2)
        student.addAttendance(attendance3)
        expect(student.getUniqueDays()).to.equal(2) // Dos días únicos
    })
})
