/**
 * In-memory data store — used when MongoDB is unavailable.
 * Data lives as long as the server process is running.
 */

const { randomBytes } = require('crypto');

const generateId = () => randomBytes(12).toString('hex');

const now = () => new Date().toISOString();

// ── Collections ──────────────────────────────────────────────────────────────
const store = {
  users: [],
  doctors: [],
  appointments: [],
  symptomHistory: []
};

// ── Generic helpers ───────────────────────────────────────────────────────────
const findById = (col, id) => store[col].find(d => d._id === id) || null;
const findOne = (col, predicate) => store[col].find(predicate) || null;
const findAll = (col, predicate) => predicate ? store[col].filter(predicate) : [...store[col]];
const insert = (col, doc) => {
  const record = { _id: generateId(), createdAt: now(), updatedAt: now(), ...doc };
  store[col].push(record);
  return record;
};
const updateById = (col, id, updates) => {
  const idx = store[col].findIndex(d => d._id === id);
  if (idx === -1) return null;
  store[col][idx] = { ...store[col][idx], ...updates, updatedAt: now() };
  return store[col][idx];
};
const deleteById = (col, id) => {
  const idx = store[col].findIndex(d => d._id === id);
  if (idx === -1) return false;
  store[col].splice(idx, 1);
  return true;
};
const count = (col, predicate) => predicate ? store[col].filter(predicate).length : store[col].length;

module.exports = { store, generateId, findById, findOne, findAll, insert, updateById, deleteById, count };
