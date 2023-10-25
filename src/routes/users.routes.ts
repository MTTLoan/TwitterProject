import { Router } from 'express'

import { loginController, registerController } from '~/controllers/users.controllers'
import loginValidator, { registerValidator } from '~/middlewares/users.middlewares'

const usersRouter = Router()

usersRouter.get('/login', loginValidator, loginController)

/*
Description: Đăng ký tài khoản
Path: /users/register
Method: POST
body: {
    email: string,
    password: string,
    confirm_password: string,
    date_of_birth: string,
}
 */
usersRouter.post(
  '/register',
  registerValidator,
  (req, res, next) => {
    console.log('request handler 1')
    next(new Error('lỗi chà bá'))
  },
  (req, res, next) => {
    console.log('request handler 2')
    next()
  },
  (req, res, next) => {
    console.log('request handler 3')
    res.json({ message: 'successful' })
  },
  (err, req, res, next) => {
    console.log('error handler')
    res.status(400).json({ message: err.message })
  }
)

export default usersRouter
