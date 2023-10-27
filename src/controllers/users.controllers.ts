import { NextFunction, Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/user.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'

export const loginController = async (req: Request, res: Response) => {
  //lấy user_id từ user của request
  const user = req.user as User
  const user_id = user._id as ObjectId
  //dùng user_id tạo access token và refresh token
  const result = await usersService.login(user_id.toString())
  //response về access token và refresh token cho client
  res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS, 
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body)
  res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}
