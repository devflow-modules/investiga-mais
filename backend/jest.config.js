module.exports = {
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/setupEnv.js'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
