require('dotenv').config()
const { Client } = require('pg')

// Configura el cliente de PostgreSQL usando variables de entorno
let client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
})

client.connect().catch(console.error)

module.exports = client