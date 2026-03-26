import { Injectable } from '@nestjs/common';
import { WeatherService } from './weather/weather.service';
import { SmsService } from './sms/sms.service';
import { MOCK_CONTACTS } from './jobnimbus/mock-contacts';
import { NWSAlert } from './weather/weather.service';

@Injectable()
export class AppService {
  constructor(
    private readonly weather: WeatherService,
    private readonly messages: SmsService,
  ) {}

  async runStormProtocol() {
    console.log(
      `[${new Date().toISOString()}] Iniciando chequeo de tormentas...`,
    );
    const alerts: NWSAlert[] = await this.weather.getActiveAlerts();
    const hasTornado: boolean =
      alerts.some((a: NWSAlert) => a.properties.event.includes('Tornado')) ||
      true; // El || true es para tu prueba del 26/03

    if (hasTornado) {
      const cityToAlert = 'Kankakee';
      const eventName = 'Tornado Warning';

      console.log(`⚠️ ALERTA DETECTADA: ${eventName} para ${cityToAlert}`);

      // 3. Filtrar clientes de JobNimbus en la zona
      const affectedCustomers = MOCK_CONTACTS.filter(
        (c) => c.city === cityToAlert,
      );

      // 4. Disparar alertas por WhatsApp (Sandbox)
      const message = `🚨 URGENTE: Se ha detectado un ${eventName} en ${cityToAlert}. Busque refugio de inmediato. Llama a Advanced plumbing`;

      for (const customer of affectedCustomers) {
        await this.messages.sendWhatsAppAlert(customer.mobile_phone, message);
      }

      return {
        success: true,
        alert: eventName,
        recipients: affectedCustomers.map((c) => c.display_name),
      };
    }

    return { success: true, message: 'No hay amenazas activas.' };
  }
}
