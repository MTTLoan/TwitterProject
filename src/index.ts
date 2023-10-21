import express from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'

const app = express()
app.use(express.json()) //sửa lỗi 500

const PORT = 5000
databaseService.connect() //kết nối đến database.service.ts

// localhost:3000/
app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/users', usersRouter)
// localhost:3000/users

app.listen(PORT, () => {
  console.log(`Project twitter này đang chạy trên post ${PORT}`)
})
