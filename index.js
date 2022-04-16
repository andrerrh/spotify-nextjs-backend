import express from 'express'
import cors from 'cors'

import {
    login,
    requestToken,
    refreshToken
} from './api.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/login', (req, res) => login(req, res))
app.post('/request_token', (req, res) => requestToken(req, res))
app.post('/refresh_token', (req, res) => refreshToken(req, res))

app.listen(4000, () => { console.log("Listening port 4000") })