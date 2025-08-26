const { faker } = require('@faker-js/faker');

function generateTestData(context, events, done) {
  // Generate unique identifiers
  context.vars.uniqueEmail = faker.internet.email();
  context.vars.uniqueUsername = faker.internet.userName() + '_' + Date.now();
  context.vars.randomString = faker.string.alphanumeric(8);
  
  // Generate realistic test data
  context.vars.spotId = faker.string.uuid();
  context.vars.droneId = faker.string.uuid();
  context.vars.flightId = faker.string.uuid();
  context.vars.groupId = faker.string.uuid();
  context.vars.topicId = faker.string.uuid();
  context.vars.componentId = faker.string.uuid();
  context.vars.brandId = faker.string.uuid();
  context.vars.typeId = faker.string.uuid();
  
  return done();
}

module.exports = {
  generateTestData
};