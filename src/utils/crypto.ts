import { createHash } from 'crypto'
import { config } from 'dotenv'
config()

//viết 1 hàm nhận vào 1 chuỗi và mã hóa chuỗi đó bằng thuật toán SHA256
//đặc trưng của thuật toán này là mã hóa 1 chiều, không thể giải mã
//hàm nhận vào 1 chuỗi và trả về 1 chuỗi đã mã hóa
function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

//viết 1 hàm nhận vào password và mã hóa
export function hashPassword(password: string) {
  return sha256(password + (process.env.PASSWORD_SECRET as string)) //mã hóa password + chuỗi bí mật để hacker khó đoán hơn
}
