function generateTestData(context, events, done) {
  // Tag identificador para poder limpiar datos después
  const testTag = 'artillery_e2e_' + Date.now();
  const timestamp = Date.now();
  
  // Generate unique identifiers with test tag
  context.vars.testTag = testTag;
  context.vars.uniqueEmail = `test_${testTag}_${timestamp}@artillery.test`;
  context.vars.uniqueUsername = `user_${testTag}_${timestamp}`;
  
  // Log para debugging
  console.log(`Generated test data with tag: ${testTag}`);
  
  // Handle both callback and non-callback scenarios
  if (typeof done === 'function') {
    return done();
  }
}

module.exports = {
  generateTestData
};