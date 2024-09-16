const Student = require('../models/student')
const Attendance = require('../models/attendance')
const PersistenceService = require('./persistenceService')

class AttendanceService {
    constructor(persistenceType) {
        this.students = []
        this.persistenceService = new PersistenceService(persistenceType)
    }

    async addStudent(name) {
        this.persistenceService.type == 'inmemory' ? 
            this.students.push(new Student(name)) : await this.persistenceService.addStudent(name)
    }

    async addPresence(studentName, day, startTime, endTime, roomCode) {

        let attendance = new Attendance(day, startTime, endTime, roomCode)

        if(this.persistenceService.type == 'inmemory') {
            let student =  this.students.find(student => student.name.trim() === studentName)
            student.addAttendance(attendance)
        } else{
            await this.persistenceService.addAttendance(studentName, day, startTime, endTime, roomCode)
        }
    }

    async getAttendanceReport() {
        
        let report = this.students.map(student => {

            return{
                name: student.name,
                minutes: student.getTotalMinutes(),
                days: student.getUniqueDays()
            }
        })

        report.sort((a, b) => b.minutes - a.minutes)

        let resp = report.map(r => {
            return r.minutes > 0 ?
                `${r.name.trim()}: ${r.minutes} minute(s) in ${r.days} day(s)` : `${r.name.trim()}: ${r.minutes} minute(s)`
        }).join('\n')

        return resp
    }

    async getStudent(name) {

        let studentList = this.persistenceService.type == 'inmemory' ? 
            this.students : await this.persistenceService.getAllStudents()

        let student = studentList.find(student => student.name.trim() === name)

        return student
    }

    async getStudentNames() {

        let studentList = this.persistenceService.type == 'inmemory' ? 
            this.students : await this.persistenceService.getAllStudents()

        return studentList.map(student => student.name.trim())
    }

}

module.exports = AttendanceService
