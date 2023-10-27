import { Request, Response, RequestHandler } from 'express'
import { NextFunction } from 'express-serve-static-core'

// hàm này sẽ bọc một async function và thêm vào try catch
export const wrapAsync = (func: RequestHandler) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await func(req, res, next)
  } catch (error) {
    next(error)
  }
}
