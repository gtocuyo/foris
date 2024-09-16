class GenericUtils {

    static isValidTimeFormat(time) {
        let timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/ // Expresión regular para HH:MM en formato 24 horas
        return timeRegex.test(time)
    }

    static isStartTimeBeforeEndTime(startTime, endTime) {
        let toMinutes = (time) => {
            let [hour, minute] = time.split(':').map(Number)
            return hour * 60 + minute
        };

        return toMinutes(startTime) < toMinutes(endTime)
    }

    static doTimesOverlap(startTime1, endTime1, startTime2, endTime2) {

        let toMinutes = (time) => {
            let [hour, minute] = time.split(':').map(Number)
            return hour * 60 + minute;
        };

        let [start1, end1, start2, end2] = [startTime1, endTime1, startTime2, endTime2].map(toMinutes)

        return (start1 < end2 && start2 < end1) // Retorna verdadero si hay solapamiento
    }

}

module.exports = GenericUtils