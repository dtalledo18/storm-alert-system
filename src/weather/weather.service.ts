import { Injectable } from '@nestjs/common';
import axios from 'axios';

// 1. Exportamos la interfaz para que AppService también la use
export interface NWSAlert {
  properties: {
    event: string;
    headline: string;
    description: string;
  };
}

@Injectable()
export class WeatherService {
  private readonly nwsUrl = 'https://api.weather.gov/alerts/active?area=IL';

  async getActiveAlerts(): Promise<NWSAlert[]> {
    // 2. Definimos los headers dentro o como constante (NWS exige User-Agent)
    const config = {
      headers: {
        'User-Agent': '(StormAlertPOC, tu-correo@gmail.com)',
      },
    };

    // 3. Tipamos la respuesta de Axios directamente en la petición <any, any>
    // para evitar que 'data' sea tratado como unsafe.
    const response = await axios.get<{ features: NWSAlert[] }>(
      this.nwsUrl,
      config,
    );

    // 4. Ahora response.data está tipado correctamente
    return response.data.features;
  }

  getSimulatedAlert(): NWSAlert {
    return {
      properties: {
        event: 'Tornado Warning',
        headline: 'Tornado Warning issued March 26 for Kankakee, IL',
        description:
          'DANGEROUS TORNADO DETECTED NEAR KANKAKEE. TAKE SHELTER NOW.',
      },
    };
  }
}
