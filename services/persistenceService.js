const redisClient = require('../db/redisClient')
const pgClient = require('../db/postgresClient')

class PersistenceService {
    constructor(type) {
        this.type = type
        if (type === 'postgres') {
            this.initPostgres()
        }
    }

    async initPostgres() {
        //Ejemplo para creación de tablas para persistencia de students y attendances
        await pgClient.query(`

            DROP TABLE IF EXISTS students;
            DROP TABLE IF EXISTS attendances;

            CREATE TABLE students (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL
            );

            CREATE TABLE attendances (
                id SERIAL PRIMARY KEY,
                student_id INTEGER NOT NULL,
                day INTEGER NOT NULL,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                room_code VARCHAR(50) NOT NULL,
                FOREIGN KEY (student_id) REFERENCES students(id)
            );
        `)
    }

    async addStudent(name) {
        if (this.type === 'redis') {
            throw new Error(`'addStudent' para Redis aún no está implementado`)
        } else if (this.type === 'postgres') {
            throw new Error(`'addStudent' para PostgreSQL aún no está implementado`)
        }
    }

    async addAttendance(studentName, day, startTime, endTime, roomCode) {
        if (this.type === 'redis') {
            throw new Error(`'addAttendance' para Redis aún no está implementado`)
        } else if (this.type === 'postgres') {
            throw new Error(`'addAttendance' para PostgreSQL aún no está implementado`)
        }
    }

    
    async getAllStudents() {

        if (this.type === 'redis') {
            throw new Error(`'getAllStudents' para Redis aún no está implementado`)
        } else if (this.type === 'postgres') {
            throw new Error(`'getAllStudents' para PostgreSQL aún no está implementado`)
                    
        }
        return []

    }
}

module.exports = PersistenceService
