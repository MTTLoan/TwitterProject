import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import loginValidator, {
  accessTokenValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const usersRouter = Router()

/*
description: Đăng nhập
path: /users/login
method: POST
body: {email, password}
*/
usersRouter.get('/login', loginValidator, wrapAsync(loginController))

/*
description: Đăng ký tài khoản
path: /users/register
method: POST
body: {
    name: string,
    email: string,
    password: string,
    confirm_password: string,
    date_of_birth: string,
}
 */
usersRouter.post('/register', registerValidator, wrapAsync(registerController))

/*
description: Đăng xuất
path: /users/logout
method: POST
header: {Authorization: 'Bearer <access_token>'}
body: {refresh_token: string}
*/
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))
export default usersRouter
