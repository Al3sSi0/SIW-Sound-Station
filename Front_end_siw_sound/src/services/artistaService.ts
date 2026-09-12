import api from './api';
import type { Artista } from '../types';

export async function getArtisti(): Promise<Artista[]> {
  try {
    const { data } = await api.get<Artista[]>('/artisti');
    return data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati dal server:', error);
    return []; 
  }
}