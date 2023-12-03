import jwt from 'jsonwebtoken'
import CONFIG from '../config/environment'

export const signJWT = (payload: object, options?: jwt.SignOptions | undefined) => {
  const secretKey: any = CONFIG.secretKey
  return jwt.sign(payload, secretKey, {
    ...(options && options),
    algorithm: 'HS256'
  })
}

export const verifyJWT = (token: string) => {
  try {
    const secretKey: any = CONFIG.secretKey
    const decoded: any = jwt.verify(token, secretKey)
    return {
      valid: true,
      expired: false,
      decoded
    }
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === 'jwt is expired or not eligible to use',
      decoded: null
    }
  }
}
