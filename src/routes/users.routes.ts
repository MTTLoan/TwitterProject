import { verify } from 'crypto'
import e, { Router } from 'express'
import {
  emailVerifyController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController
} from '~/controllers/users.controllers'
import loginValidator, {
  accessTokenValidator,
  refreshTokenValidator,
  registerValidator,
  verifyEmailValidator
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

/*
des: verify email 
khi người dùng đăng ký, trong email có 1 link, nếu ng dùng nhấn vào cái link trong email,
họ sẽ gữi lên email_verify_token để ta kiểm tra, tìm kiếm user đó và update account của họ
thành verify, đồng thời gữi at rf cho họ đăng nhập luôn, k cần login
path: /users/verify-email
method: POST
không cần Header vì chưa đăng nhập vẫn có thể verify-email
body: {email_verify_token: string}
*/
usersRouter.post('/verify-email', verifyEmailValidator, wrapAsync(emailVerifyController))

/*
des:gữi lại verify email khi người dùng nhấn vào nút gữi lại email,
path: /resend-verify-email
method: POST
Header:{Authorization: Bearer <access_token>} //đăng nhập mới cho resend email verify
body: {}
*/
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyController))

export default usersRouter
