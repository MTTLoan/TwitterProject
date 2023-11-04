import { verify } from 'crypto'
import { Router } from 'express'
import {
  emailVerifyController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  resetPasswordController,
  updateMeController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  loginValidator,
  accessTokenValidator,
  forgotPasswordValidator,
  refreshTokenValidator,
  registerValidator,
  verifyEmailValidator,
  verifyForgotPasswordTokenValidator,
  resetPasswordValidator,
  verifiedUserValidator,
  updateMeValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.requests'
import { wrapAsync } from '~/utils/handlers'

const usersRouter = Router()

/*
description: Đăng nhập
path: /users/login
method: POST
body: {email, password}
*/
usersRouter.post('/login', loginValidator, wrapAsync(loginController))

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

/*
des: forgot password
khi người dùng quên mật khẩu thì họ sẽ gữi email lên cho ta
mk sẽ xem có user nào có email đó k, nếu có thì mk sẽ tạo 1 forgot_password_token
và gửi vào email cho họ để họ đổi mk
path: /forgot-password
method: POST
Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
body: {email: string}
*/
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/*
des: verify forgot password token
người dùng sau khi báo forgot password, họ sẽ nhận được 1 link trong email
họ vào và click vào link đó, link đó sẽ có 1 request kèm theo forgot_password_token
và gửi lên cho ta, ta sẽ kiểm tra xem token đó có hợp lệ hay không
method: POST
path: /users/verify-forgot-password
body: {forgot_password_token: string}
*/
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)

/*
des: reset password
path: '/reset-password'
method: POST
Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
body: {forgot_password_token: string, password: string, confirm_password: string}
*/
usersRouter.post(
  '/reset-password',
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator,
  wrapAsync(resetPasswordController)
)

/*
des: get profile của user
path: '/me'
method: get
Header: {Authorization: Bearer <access_token>}
body: {}
*/
usersRouter.get('/me', accessTokenValidator, wrapAsync(getMeController))

usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  updateMeValidator,
  wrapAsync(updateMeController)
)

/*
des: get profile của user khác bằng unsername
path: '/:username'
method: get
không cần header vì, chưa đăng nhập cũng có thể xem
*/
usersRouter.get('/:username', wrapAsync(getProfileController))

export default usersRouter
