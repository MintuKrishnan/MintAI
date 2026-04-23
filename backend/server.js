import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import config from './config/index.js'
import chatRouter from './routes/chat.js'
import productChatRouter from './routes/productChat.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: config.clientOrigin }))
app.use(express.json({ limit: '16kb' }))

app.get('/', (_req, res) => res.json({ status: 'ok' }))
app.use('/chat',         chatRouter)
app.use('/product-chat', productChatRouter)

app.listen(config.port, () => {
  console.log(`Mint AI backend running on port ${config.port}`)
})
