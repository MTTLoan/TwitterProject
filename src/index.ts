import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
config()
import argv from 'minimist'
import { UPLOAD_DIR } from './constants/dir'
import staticRouter from './routes/static.routes'
const options = argv(process.argv.slice(2))
console.log(options)

const app = express()
app.use(express.json()) //sửa lỗi 500

const PORT = process.env.PORT || 4000

initFolder() // tạo folder uploads

databaseService.connect() //kết nối đến database.service.ts

// localhost:3000/
app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
// app.use('/static', express.static(UPLOAD_DIR))
app.use('/static', staticRouter)

databaseService.connect()

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Project twitter này đang chạy trên post ${PORT}`)
})
