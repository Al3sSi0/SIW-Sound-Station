import api from './api';

interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export async function loginUser(username: string, password: string): Promise<AuthResponse | null> {
  try {
    const { data } = await api.post<AuthResponse>('/login', { username, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    return data;
  } catch (error) {
    console.error('Errore durante il login:', error);
    return null;
  }
}

export async function registerUser(nuovoUtente: any): Promise<boolean> {
  try {
    await api.post('/register', nuovoUtente);
    return true;
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    return false;
  }
}