import { Router } from 'express'

import { loginController, registerController } from '~/controllers/users.controllers'
import loginValidator, { registerValidator } from '~/middlewares/users.middlewares'

const usersRouter = Router()

usersRouter.get('/login', loginValidator, loginController)

usersRouter.post('/register', registerValidator, registerController) //post vì đẩy dữ liệu lên

export default usersRouter
