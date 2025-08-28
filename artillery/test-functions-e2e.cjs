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

function generateDroneData(context, events, done) {
  const timestamp = Date.now();
  const testTag = context.vars.testTag || 'artillery_' + timestamp;
  
  // Generate drone-specific data
  context.vars.customDroneName = `Custom Drone ${testTag}`;
  context.vars.brandedDroneName = `DJI Mini ${testTag}`;
  context.vars.racingDroneName = `Racing Beast ${testTag}`;
  context.vars.serialNumber = `DJI${testTag}001`;
  
  console.log(`Generated drone data for tag: ${testTag}`);
  
  if (typeof done === 'function') {
    return done();
  }
}

module.exports = {
  generateTestData,
  generateDroneData
};