import jsonRes from '../utils/response.js';
import { loginOauth,refreshTokens,logout,logoutAll} from '../services/authservices.js'

export const oAuthCallback = async (req, res) => {
  const user = req.user;
  console.log(user)
  if (!user) {
    return jsonRes(res, 401, false, 'Authentication failed');
  }

  try {
    const { accessToken, refreshToken, csrfToken } = await loginOauth(user);

      res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false, // true in production
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.cookie('csrfToken', csrfToken, {
      httpOnly: false, 
      sameSite: 'Lax',
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    return jsonRes(res, 200, true, 'OAuth login successful');
  } catch (err) {
    console.error(err);
    return jsonRes(res, 500, false, 'OAuth login failed');
  }
};


export const refreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) return jsonRes(res, 401, false, 'No refresh token provided');

    const { accessToken, refreshToken, csrfToken } = await refreshTokens(oldRefreshToken);

    // Set new tokens cookies
    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'lax', maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.cookie('csrfToken', csrfToken, { httpOnly: false, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });

    return jsonRes(res, 200, true, 'Token refreshed');
  } catch (err) {
    console.error(err);
    return jsonRes(res, 403, false, err.message || 'Refresh failed');
  }
};


export const logoutCont = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return jsonRes(res, 400, false, 'No refresh token provided');

    await logout(refreshToken);

    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('csrfToken');

    return jsonRes(res, 200, true, 'Logged out successfully');
  } catch (err) {
    console.error(err);
    return jsonRes(res, 500, false, 'Logout failed');
  }
};

export const logoutAllCont = async (req, res) => {
  try {
    const userId = req.user._id; 

    await logoutAll(userId);

    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('csrfToken');

    return jsonRes(res, 200, true, 'Logged out from all sessions');
  } catch (err) {
    console.error(err);
    return jsonRes(res, 500, false, 'Logout all failed');
  }
};