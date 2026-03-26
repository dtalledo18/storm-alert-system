import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class JobnimbusService {
  // En producción, usa variables de entorno (.env)
  private readonly apiKey = 'TU_API_KEY_AQUI';
  private readonly baseUrl = 'https://app.jobnimbus.com/api1';

  async getContactsByCity(city: string) {
    try {
      const { data } = await axios.get(`${this.baseUrl}/contacts`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: {
          // JobNimbus permite filtrar o puedes traerlos y filtrar en JS
          city: city,
        },
      });

      // La API suele devolver un objeto con un array 'results'
      return data.results || data;
    } catch (error) {
      console.error(
        'Error fetching JobNimbus data:',
        error.response?.data || error.message,
      );
      return [];
    }
  }
}
