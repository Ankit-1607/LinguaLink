export default function formatDate(value) {
  if (!value) return ''; // If value is already in YYYY-MM-DD, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value; // Otherwise, convert to YYYY-MM-DD
  return new Date(value).toISOString().slice(0, 10);
}
