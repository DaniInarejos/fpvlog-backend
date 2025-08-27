let faker;

async function initializeFaker() {
  if (!faker) {
    const fakerModule = await import('@faker-js/faker');
    faker = fakerModule.faker;
  }
  return faker;
}

async function generateTestData(context, events, done) {
  try {
    const fakerInstance = await initializeFaker();
    
    // Generate unique identifiers
    context.vars.uniqueEmail = fakerInstance.internet.email();
    context.vars.uniqueUsername = fakerInstance.internet.username() + '_' + Date.now();
    context.vars.randomString = fakerInstance.string.alphanumeric(8);
    
    // Generate realistic test data
    context.vars.spotId = fakerInstance.string.uuid();
    context.vars.droneId = fakerInstance.string.uuid();
    context.vars.flightId = fakerInstance.string.uuid();
    context.vars.groupId = fakerInstance.string.uuid();
    context.vars.topicId = fakerInstance.string.uuid();
    context.vars.componentId = fakerInstance.string.uuid();
    context.vars.brandId = fakerInstance.string.uuid();
    context.vars.typeId = fakerInstance.string.uuid();
    
    // Handle both callback and non-callback scenarios
    if (typeof done === 'function') {
      return done();
    }
  } catch (error) {
    console.error('Error generating test data:', error);
    if (typeof done === 'function') {
      return done(error);
    }
    throw error;
  }
}

module.exports = {
  generateTestData
};