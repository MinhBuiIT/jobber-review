import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

export const healthyCheck = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: 'OK'
  })
}
