export const config = {
    port: process.env.PORT || 3000,
    mongoUrl: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN
}