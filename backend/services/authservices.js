

export const oAuth = async (res)=>{
     const accessToken = generateAcessToken({});
  const refreshToken = generateRefreshToken(user._id);
  const csrfToken = randomBytes(20).toString('hex');
}