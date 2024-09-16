require('dotenv').config()
const redis = require('redis')

// Configura el cliente de Redis usando variables de entorno
let client = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
})

client.connect().catch(console.error)

client.on('error', (err) => console.log('Redis Client Error', err))

module.exports = client
