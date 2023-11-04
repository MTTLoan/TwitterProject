import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import usersService from '~/services/user.services'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  EmailVerifyReqBody,
  ForgotPasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload
} from '~/models/requests/User.requests'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enums'

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  //lấy user_id từ user của request
  const user = req.user as User
  const user_id = user._id as ObjectId
  //dùng user_id tạo access token và refresh token
  const result = await usersService.login(user_id.toString())
  //response về access token và refresh token cho client
  res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body)
  res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  //logout nhận vào refresh token để tìm và xóa refresh token đó trong database
  const result = await usersService.logout(refresh_token)
  res.json(result)
}

export const emailVerifyController = async (req: Request<ParamsDictionary, any, EmailVerifyReqBody>, res: Response) => {
  //khi mà req vào đc đây nghĩa là email_verify_token đã valid
  //đồng thời trong req cũng có decoded_email_verify_token
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  //tìm xem có user có mã user_id này không
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    //nếu không có thì báo lỗi
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  //nếu có thì mk sẽ kiểm tra xem user này lưu email_verify_token hay không
  if (user.email_verify_token === '') {
    //nếu không lưu thì báo lỗi
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  //nếu xuống đc đây thì nghĩa là user này là có và chưa verify
  //verify email là tìm user đó bằng user_id và update email_verify_token = null và verify = 1
  //viết hàm verifyEmail(user_id)
  const result = await usersService.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}

export const resendEmailVerifyController = async (req: Request, res: Response) => {
  //nếu qua được hàm này tức alf đã qua accessTokenValidator
  //trong req đã có decoded_authorization
  const { user_id } = req.decoded_authorization as TokenPayload
  //tìm user có user_id này
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  //nếu không có thì res lỗi
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  //nếu có thì kiểm tra xem user này đã verify email chưa
  if (user.verify === UserVerifyStatus.Verified) {
    //nếu đã verify thì res lỗi
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  //nếu mà xuống đc đây nghĩa là user này chưa verify thì gữi lại email verify
  //tạo email_verify_token mới và lưu vào database
  const result = await usersService.resendEmailVerify(user_id)
  return res.json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response
) => {
  //vì đã qua forgotPasswordValidator nên trong req đã có user
  const { _id } = req.user as User
  //tiến hành tạo forgot_password_token mới và lưu vào database
  const result = await usersService.forgotPassword((_id as ObjectId).toString())
  return res.json(result)
}

export const verifyForgotPasswordTokenController = async (req: Request, res: Response) => {
  res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
) => {
  //muốn cập nhật mật khẩu mới thì cần user_id, password mới
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  //cập nhật mật khẩu mới cho user có user_id này
  const result = await usersService.resetPassword({ user_id, password })
  return res.json(result)
}

export const getMeController = async (req: Request, res: Response) => {
  //muốn lấy thông tin của user thì cần user_id
  const { user_id } = req.decoded_authorization as TokenPayload
  //tìm user có user_id này và lấy thông tin
  const user = await usersService.getMe(user_id)
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    result: user
  })
}
