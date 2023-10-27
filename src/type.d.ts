//file dùng để định nghĩa lại req truyền lên từ client
import { Request } from 'express'
import User from './models/schemas/User.schema'
import { TokenPayload } from './models/requests/User.requests'

declare module 'express' {
  interface Request {
    user?: User //trong request có thể có hoặc ko có user
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
