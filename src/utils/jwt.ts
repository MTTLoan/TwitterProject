import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string, //giá trị mặc định
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  privateKey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        reject(err)
      }
      resolve(token as string)
    })
  })
}

//hàm nhận vào token và secret key để verify
export const verifyToken = ({
  token,
  secretOrPublicKey = process.env.JWT_SECRET as string
}: {
  token: string
  secretOrPublicKey?: string
}) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) throw reject(error)
      resolve(decoded as jwt.JwtPayload)
    })
  })
}
