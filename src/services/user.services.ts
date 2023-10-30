///chứa cách hàm lấy dữ liệu từ database cho user
import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { signToken } from '~/utils/jwt'
import { config } from 'dotenv'
config()
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'

class UsersService {
  //viết hàm nhận vào user_id để bỏ vào payload tạo access token
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN }
    })
  }

  //viết hàm nhận vào user_id để bỏ vào payload tạo refresh token
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN }
    })
  }

  //viết hàm nhận vào user_id để bỏ vào payload tạo email verify token
  private signEmailVerifyToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerificationToken },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: { expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN }
    })
  }

  //hàm ký access token và refresh token
  private signAccessTokenAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async checkEmailExist(email: string) {
    // tìm trong database xem có user nào có email này chưa -> nếu có trả về object user, nếu ko có trả về null
    const user = await databaseService.users.findOne({ email /*: email --> giống nên bỏ đi*/ })
    // -> ép kiểu về boolean (object -> true, null -> false)
    return Boolean(user)
  }

  //payload là 1 object --> để truyền vào dễ hơn
  //register( { email: 'abc@gmail.com', password: '123456' } )
  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString())
    //tạo user mới
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    //từ user_id tạo access token và refresh token
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id.toString())

    //lưu refresh token vào database
    databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )

    //mô phỏng gửi email
    console.log(email_verify_token)

    return { access_token, refresh_token }
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id)
    databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )
    return { access_token, refresh_token }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return { message: USERS_MESSAGES.LOGOUT_SUCCESS }
  }

  async verifyEmail(user_id: string) {
    //tạo access token và refresh token gui về cho client và lưu refresh token vào database
    //đồng thời tìm user có user_id này và update email_verify_token = null và verify = 1, update_at = now
    const [token] = await Promise.all([
      this.signAccessTokenAndRefreshToken(user_id), //tạo access token và refresh token
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) }, //tìm user thông qua user_id
        [
          {
            $set: {
              email_verify_token: '',
              verify: UserVerifyStatus.Verified, //1
              updated_at: '$$NOW'
            }
          }
        ]
      )
    ])
    //destructuring
    const [access_token, refresh_token] = token
    //lưu refresh token vào database
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )
    //trả về access token và refresh token cho client
    return { access_token, refresh_token }
  }
}

const usersService = new UsersService()
export default usersService
