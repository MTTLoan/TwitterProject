import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  //err là lỗi từ các nơi khác truyền xuống --> lỗi có thể thiếu status (quy về lỗi 500)
  if (err instanceof ErrorWithStatus) {
    //err có thể có thuộc tính message hoặc msg --> ko thể error.message hoặc error.msg --> giải quyết bằng cách bỏ status --> dùng omit
    res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(err, ['status']))
  }
  //nếu mà lỗi xuống được đây mà ko phải là lỗi của ErrorWithStatus --> lỗi 500
  //set name, message, stack về enumerable true --> để có thể truyền xuống client
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfor: omit(err, ['stack'])
  })
}
