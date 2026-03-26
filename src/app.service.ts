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
    const tornadoAlert = alerts.find(
      (a) =>
        (a.properties.event === 'Tornado Warning' ||
          a.properties.event === 'Tornado Watch') &&
        a.properties.areaDesc.includes('Kankakee'),
    );

    const hasTornado = !!tornadoAlert;

    if (hasTornado) {
      const cityToAlert = 'Kankakee';
      const eventName = 'Tornado Warning';

      console.log(`⚠️ ALERTA DETECTADA: ${eventName} para ${cityToAlert}`);

      // 3. Filtrar clientes de JobNimbus en la zona
      const affectedCustomers = MOCK_CONTACTS.filter(
        (c) => c.city === cityToAlert,
      );

      // 4. Disparar alertas por WhatsApp (Sandbox)
      for (const customer of affectedCustomers) {
        const message = `🚨 URGENT: Hello ${customer.display_name}. A ${eventName} has been issued for ${cityToAlert}. Seek shelter immediately. Call Advance Team for emergency services.`;

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
