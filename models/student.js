class Student {
    constructor(name) {
        this.name = name;
        this.attendanceRecords = []
    }

    addAttendance(attendance) {
        if (attendance.getMinutes() >= 5) {
            this.attendanceRecords.push(attendance)
        }
    }

    getTotalMinutes() {
        return this.attendanceRecords.reduce((total, record) => total + record.getMinutes(), 0)
    }

    getUniqueDays() {
        let days = new Set(this.attendanceRecords.map(record => record.day))
        return days.size
    }
}

module.exports = Student
