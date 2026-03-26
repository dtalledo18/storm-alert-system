import { Injectable } from '@nestjs/common';
import { Vonage } from '@vonage/server-sdk';
import axios from 'axios';

@Injectable()
export class SmsService {
  private vonage: Vonage;

  constructor() {
    this.vonage = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
    });
  }
  async sendWhatsAppAlert(to: string, message: string) {
    const apiKey = process.env.VONAGE_API_KEY;
    const apiSecret = process.env.VONAGE_API_SECRET;
    const fromNumber = process.env.VONAGE_WHATSAPP_NUMBER;

    if (!apiKey || !apiSecret || !fromNumber) {
      throw new Error('Faltan credenciales de Vonage en el .env');
    }

    // ✅ SANDBOX endpoint (no el estándar)
    const url = 'https://messages-sandbox.nexmo.com/v1/messages';

    const data = {
      from: fromNumber, // "14157386102"
      to: to.replace(/\D/g, ''), // "51924052944"
      message_type: 'text',
      text: message,
      channel: 'whatsapp',
    };

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${auth}`,
        },
      });

      console.log(
        `[VONAGE SUCCESS] Mensaje enviado a ${to}. ID: ${response.data.message_uuid}`,
      );
      return response.data;
    } catch (err: any) {
      console.error('--- ERROR CRÍTICO DE VONAGE ---');
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Data:', JSON.stringify(err.response.data, null, 2));
      } else {
        console.error('Mensaje:', err.message);
      }
      throw err;
    }
  }
}
