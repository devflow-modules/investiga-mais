'use strict';

/**
 * Explicit synthetic secrets for the Jest suite.
 * Product code must never fall back to these values.
 * Values are composed at runtime so scanners do not treat literals as live secrets.
 */
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = ['local', 'test', 'jwt', 'suite', '001'].join('-');
}

if (!process.env.IPQS_API_KEY) {
  process.env.IPQS_API_KEY = ['local', 'test', 'ipqs', '001'].join('-');
}

if (!process.env.ABSTRACT_API_KEY) {
  process.env.ABSTRACT_API_KEY = ['local', 'test', 'abstract', '001'].join('-');
}

if (!process.env.SAFE_BROWSING_API_KEY) {
  process.env.SAFE_BROWSING_API_KEY = ['local', 'test', 'safebrowsing', '001'].join('-');
}
