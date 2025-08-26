module.exports = {
  // Función para generar datos de prueba únicos
  generateTestData: function(context, events, done) {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    
    // Generar email único
    context.vars.uniqueEmail = `test_${timestamp}_${randomId}@example.com`;
    
    // Generar username único (diferente del email)
    context.vars.uniqueUsername = `user_${timestamp}_${randomId}`;
    
    // Generar otros datos aleatorios
    context.vars.randomLat = (Math.random() * 180 - 90).toFixed(6);
    context.vars.randomLng = (Math.random() * 360 - 180).toFixed(6);
    context.vars.timestamp = timestamp;
    
    return done();
  },
  
  // Función para validar respuestas
  validateResponse: function(context, events, done) {
    if (context.response && context.response.statusCode >= 400) {
      console.log('Error response:', context.response.statusCode, context.response.body);
    }
    return done();
  },
  
  // Función para logging personalizado
  logProgress: function(context, events, done) {
    console.log(`User ${context.vars.uniqueEmail} completed scenario`);
    return done();
  }
};