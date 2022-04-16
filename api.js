import fetch from 'node-fetch'
import { client_id, client_secret } from './credentials.js'

const createRandomString = (length) => {
    let result = ''
    const chars = 'ABCEFGHIJKLMNOPQRSTUVWXYZabcefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
}

const redirect_uri = 'https://spotif-frontend.herokuapp.com'

export const login = (req, res) => {
    const state = createRandomString(16)
    const scope = 'user-modify-playback-state user-read-playback-position user-read-playback-state playlist-read-private playlist-read-collaborative'
    const query = new URLSearchParams({
        response_type: 'code',
        client_id,
        scope,
        redirect_uri,
        state
    })

    return res.send(`https://accounts.spotify.com/authorize?${decodeURIComponent(query)}`)
}

export const requestToken = (req, res) => {
    const { code, state } = req.body
    if (!state) return res.send('valor de state inválido')
    const query = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
    })

    fetch(`https://accounts.spotify.com/api/token?${decodeURIComponent(query)}`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
            'Content-type': 'application/x-www-form-urlencoded'
        }
    })
        .then(res => res.json())
        .then(data => res.status(200).send(JSON.stringify(data)))
}

export const refreshToken = (req, res) => {
    const {refresh_token} = req.body
    const query = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token
    })

    fetch(`https://accounts.spotify.com/api/token?${decodeURIComponent(query)}`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
            'Content-type': 'application/x-www-form-urlencoded'
        }
    })
    .then(res => res.json())
    .then(data => res.status(200).send(JSON.stringify(data)))
}