export default {
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  redis: {
    url: process.env.REDIS_URI,
    token: process.env.REDIS_TOKEN,
    ttl: parseInt(process.env.REDIS_TTL || '300') // 5 minutos por defecto
  },
  firebase:{
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  }
}