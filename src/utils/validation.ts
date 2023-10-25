import { Request, Response, NextFunction } from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'

// hàm validate này sẽ nhận vào 1 checkSchema và trả về 1 middleware --> dùng hàm này ở users.middleware
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req) //chạy hàm validation và lưu lỗi vào request

    const errors = validationResult(req) //lấy lỗi từ request
    //nếu ko có lỗi thì next
    if (errors.isEmpty()) {
      return next()
    }

    res.status(400).json({ errors: errors.mapped() }) //mapped() giúp cho FE dễ dàng đọc, lấy lỗi hơn là dùng array()
  }
}
