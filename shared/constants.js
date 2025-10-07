// Updated shared/constants.js (Pure CommonJS for backend)
const FIELDS = {
  number: 'number',
  date: 'date',
  vendor: 'vendor',
  total: 'total',
  lineItems: 'lineItems',
  currency: 'currency'
};

const STATUS = {
  MATCH: 'MATCH',
  REVIEW: 'REVIEW',
  MISMATCH: 'MISMATCH',
  NO_MATCH: 'NO_MATCH'
};

module.exports = { FIELDS, STATUS };