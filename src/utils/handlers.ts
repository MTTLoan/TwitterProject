import { Request, Response, RequestHandler } from 'express'
import { NextFunction } from 'express-serve-static-core'

// hàm này sẽ bọc một async function và thêm vào try catch
export const wrapAsync = <P>(func: RequestHandler<P>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
