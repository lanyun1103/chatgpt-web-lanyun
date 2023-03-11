import * as console from 'console'
import express from 'express'
import type { ChatContext, ChatMessage } from './chatgpt'
import { chatConfig, chatReply, chatReplyProcess } from './chatgpt'
import { Auth } from './mysql'
import type { User } from './mysql'

const app = express()
const router = express.Router()
const auth = new Auth()

app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat', async (req, res) => {
  try {
    const { prompt, options = {} } = req.body as { prompt: string; options?: ChatContext }
    const response = await chatReply(prompt, options)
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/chat-process', async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')

  try {
    const { prompt, options = {} } = req.body as { prompt: string; options?: ChatContext }
    let firstChunk = true
    await chatReplyProcess(prompt, options, (chat: ChatMessage) => {
      res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
      global.console.log(prompt)
      global.console.log(new Date())
      firstChunk = false
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/config', async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})
router.post('/register', (req, res) => {
  const user = req.body as User
  console.log(user)
  if (user == null || user.username == null || user.password == null || user.password) {
    res.status(500).send({ error: '请输入信息' })
    return
  }
  auth.register(user, (error, userId) => {
    if (error) {
      console.error('Error registering user: ', error)
      res.status(500).send({ error: 'Internal server error' })
      return
    }
    console.log('Registered user with ID: ', userId)
    res.status(200).send({ message: 'User registered successfully' })
  })
})

router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (username === '' || password === '') {
    res.status(500).send({ error: '请输入信息' })
    return
  }
  auth.login(username, password, (error, token, pFlag) => {
    if (error) {
      console.error('Error logging in user: ', error)
      res.status(500).send({ error: 'Internal server error' })
      return
    }
    if (!token) {
      res.status(401).send({ error: 'Invalid username or password' })
      return
    }
    console.log('Logged in user with token: ', token)
    res.status(200).send({ token, pFlag })
  })
})

router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  const userId = auth.verifyToken(token)
  if (userId) {
    console.log('Verified user with ID: ', userId)
    res.status(200).send({ userId })
  }
  else {
    console.log('Invalid token!')
    res.status(401).send({ error: 'Invalid token' })
  }
})

app.use('', router)
app.use('/api', router)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
