// Pretvara Date u "YYYY-MM-DD" po LOKALNOM vremenu (bez UTC pomeranja).
// Koristi se za popunjavanje <input type="date"> polja.
export function toInputDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}