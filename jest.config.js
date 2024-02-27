/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  baseUrl: "http://localhost:8080",
  authorization: { "Authorization":"authvalue" }
};