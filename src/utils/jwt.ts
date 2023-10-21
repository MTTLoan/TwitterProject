import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string, //giá trị mặc định
  options = { algorithm: 'HS256' }
}: {
  payload: any | object | Buffer
  privateKey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) reject(err)
      resolve(token as string)
    })
  })
}
