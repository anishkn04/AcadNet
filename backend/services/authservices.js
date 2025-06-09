import RefreshToken from "../models/refresh.model.js";

export const loginOauth = async (user) => {
  const userId = user._id;

  const accessToken = generateAccessToken({ id: userId, role: user.role});
  const refreshToken = generateRefreshToken(userId);
  const csrfToken = randomBytes(20).toString('hex');

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  
  await RefreshToken.create({ user: userId, token: refreshToken, expiresAt });


  return { accessToken, refreshToken, csrfToken };
};

export const refreshTokens = async (oldRefreshToken) => {
  // Verify old token
  let decoded;
  try {
    decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new Error('Invalid refresh token');
  }

  // Check token existence in DB
  const savedToken = await RefreshToken.findOne({ token: oldRefreshToken });
  if (!savedToken) {
    throw new Error('Refresh token revoked or not found');
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new Error('User not found');

  // Token rotation: delete old refresh token
  await RefreshToken.deleteOne({ token: oldRefreshToken });

  // Generate new tokens
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken(user._id);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  await RefreshToken.create({ user: user._id, token: refreshToken, expiresAt });

  const csrfToken = randomBytes(20).toString('hex');

  return { accessToken, refreshToken, csrfToken };
};

export const logout = async (refreshToken) => {
  await RefreshToken.deleteOne({ token: refreshToken });
};

export const logoutAll = async (userId) => {
  await RefreshToken.deleteMany({ user: userId });
};