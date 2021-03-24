import express from "express"
import { config as dotenv } from "dotenv"

const app = express()

app.use(express.json())

dotenv({ path: `${__dirname}/config/.env` })

export { app }