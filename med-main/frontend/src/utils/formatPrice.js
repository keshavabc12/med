/**
 * Indian Rupee display (no $). Uses en-IN grouping.
 */
export function formatINR(amount) {
  const n = Number(amount);
  if (Number.isNaN(n)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}
