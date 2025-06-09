export const config = {
    port: process.env.PORT || 3000,
    mongoUrl: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    redis: {
        url: process.env.REDIS_URI,
        token: process.env.REDIS_TOKEN,
        ttl: parseInt(process.env.REDIS_TTL || '300') // 5 minutos por defecto
    }
}