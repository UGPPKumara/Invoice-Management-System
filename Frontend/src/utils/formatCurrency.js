// src/utils/formatCurrency.js

/**
 * Currency Formatter for LKR
 */
export const formatCurrency = (amount) => {
  return `LKR ${Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};