const API_BASE = "https://hiv.purepixel.io.vn/api";

export async function login(email, password) {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
}

export async function register({ fullName, email, phone, password, role, gender }) {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, phone, password, role, gender }),
  });
  if (!response.ok) throw new Error('Register failed');
  return response.json();
}