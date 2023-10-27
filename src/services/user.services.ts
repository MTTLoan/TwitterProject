///chứa cách hàm lấy dữ liệu từ database cho user
import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { TokenType } from '~/constants/enums'
import { signToken } from '~/utils/jwt'
import { config } from 'dotenv'
config()

class UsersService {
  //viết hàm nhận vào user_id để bỏ vào payload tạo access token
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN }
    })
  }

  //viết hàm nhận vào user_id để bỏ vào payload tạo refresh token
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN }
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
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    //lấy user_id từ user vừa tạo
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id)

    return { access_token, refresh_token }
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken(user_id)

    return { access_token, refresh_token }
  }
}

const usersService = new UsersService()
export default usersService
