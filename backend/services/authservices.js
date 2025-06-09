export const loginOauth = async (user) => {
  const userId = user._id;

  const accessToken = generateAccessToken({ id: userId });
  const refreshToken = generateRefreshToken(userId);
  const csrfToken = randomBytes(20).toString('hex');

  return { accessToken, refreshToken, csrfToken };
};
