import jsonRes from '../utils/jsonRes.js';
import { loginOauth } from '../services/authService.js';

export const oAuthCallback = async (req, res) => {
  const user = req.user;

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
