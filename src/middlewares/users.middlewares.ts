//ta sẽ làm chức năng đăng nhập /login
//khi mà đăng nhập, client truy cập vào /login
//tạo ra 1 request, và bỏ vào trong đó email và password
//nhét email và password vào trong body của request
//sau đó gửi lên server

import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import usersService from '~/services/user.services'
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      message: 'mising email or password'
    })
  }
  next()
}

// Body: {
//     email: string,
//     password: string,
//     confirm_password: string
//     date_of_birth: ISO8601
// }
export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      }
    },
    email: {
      notEmpty: true,
      isString: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const isExist = await usersService.checkEmailExist(value)
          if (isExist) {
            throw new Error('email already exists')
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
          // returnScore: true //trả về điểm số
        }
      },
      errorMessage:
        'password must be at least 8 chars long, contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol'
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
          // returnScore: true
        }
      },
      errorMessage:
        'confirm password must be at least 8 chars long, contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol',
      custom: {
        // kiểm tra xem confirm password có trùng với password hay không
        options: (value, { req }) => {
          if (value !== req.body.password) {
            // ném lỗi ra chỗ tập trung xử lý lỗi
            throw new Error('confirm password does not match')
          }
          return true
        }
      }
    },
    date_of_birth: {
      notEmpty: true,
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      },
      toDate: true
    }
  })
)

export default loginValidator
