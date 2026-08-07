// Klijentska validacija. Ne zamenjuje serversku - dopunjuje je,
// da korisnik dobije brzu povratnu informaciju pre slanja zahteva.
export function validateEmail(email) {
  if (!email || email.trim() === '') return 'Email je obavezan.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Email nije u ispravnom formatu.';
  return null;
}

export function validatePassword(password) {
  if (!password || password === '') return 'Lozinka je obavezna.';
  if (password.length < 6) return 'Lozinka mora imati najmanje 6 karaktera.';
  return null;
}

export function validateFullName(name) {
  if (!name || name.trim() === '') return 'Ime i prezime je obavezno.';
  if (name.trim().length < 2) return 'Ime i prezime mora imati najmanje 2 karaktera.';
  return null;
}