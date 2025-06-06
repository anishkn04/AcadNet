import * as authService from '../services/authservices.js'

export const oAuthCallback = async (req,res)=>{
 const {
      accessToken,
      refreshToken,
      csrfToken,
      accessOptions,
      refreshOptions,
      csrfOptions
    } = await authService.loginOauth(res,username, password);
}