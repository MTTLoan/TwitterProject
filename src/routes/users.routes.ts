import { Router } from 'express'
import { wrap } from 'module'

import { loginController, registerController } from '~/controllers/users.controllers'
import loginValidator, { registerValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const usersRouter = Router()

/*
des: đăng nhập
path: /users/login
method: POST
body: {email, password}
*/
usersRouter.get('/login', loginValidator, loginController)

/*
Description: Đăng ký tài khoản
Path: /users/register
Method: POST
body: {
    name: string,
    email: string,
    password: string,
    confirm_password: string,
    date_of_birth: string,
}
 */
usersRouter.post('/register', registerValidator, wrapAsync(registerController))

export default usersRouter
