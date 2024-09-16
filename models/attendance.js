class Attendance {
    constructor(day, startTime, endTime, roomCode) {
        this.day = parseInt(day)
        this.startTime = startTime
        this.endTime = endTime
        this.roomCode = roomCode
    }

    getMinutes() {
        let [startHour, startMinute] = this.startTime.split(':').map(Number)
        let [endHour, endMinute] = this.endTime.split(':').map(Number)
        return (endHour * 60 + endMinute) - (startHour * 60 + startMinute)
    }
}

module.exports = Attendance
