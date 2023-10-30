import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

// hàm validate này sẽ nhận vào 1 checkSchema và trả về 1 middleware --> dùng hàm này ở users.middleware
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req) //chạy hàm validation và lưu lỗi vào request

    const errors = validationResult(req) //lấy lỗi từ request
    //nếu ko có lỗi thì next
    if (errors.isEmpty()) {
      return next()
    }

    const errorObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })
    //xử lí errorObject
    for (const key in errorObject) {
      //lấy msg của từng key
      const { msg } = errorObject[key]
      //nếu msg có dạng ErrorWithStatus và status !== 422 thì ném lỗi về default errorhandler
      if (msg instanceof ErrorWithStatus && msg.status !== 422) {
        return next(msg)
      }

      entityError.errors[key] = msg
    }

    //mapped() giúp cho FE dễ dàng đọc, lấy lỗi hơn là dùng array()
    next(entityError)
  }
}
