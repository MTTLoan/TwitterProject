//file dùng để định nghĩa lại req truyền lên từ client
import { Request } from 'express'
import User from './models/schemas/User.schema'

declare module 'express' {
  interface Request {
    user?: User //trong request có thể có hoặc ko có user
  }
  
}
