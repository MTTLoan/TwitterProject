import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  //err là lỗi từ các nơi khác truyền xuống --> lỗi có thể thiếu status (quy về lỗi 500)
  //err có thể có thuộc tính message hoặc msg --> ko thể error.message hoặc error.msg --> giải quyết bằng cách bỏ status --> dùng omit
  res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(err, ['status']))
}
