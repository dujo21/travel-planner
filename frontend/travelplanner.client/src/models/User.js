// Model koji mapira korisnika sa backend-a u objekat na frontendu.
export default class User {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.fullName = data.fullName ?? '';
    this.email = data.email ?? '';
    this.role = data.role ?? 'User';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
  }

  get isAdmin() {
    return this.role === 'Admin';
  }
}