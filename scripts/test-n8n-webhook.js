/**
 * Script para probar el flujo de n8n sin llenar el formulario en la web.
 *
 * Uso:
 *   node scripts/test-n8n-webhook.js            -> Prueba con sitio web (auditoría Lighthouse)
 *   node scripts/test-n8n-webhook.js --no-web   -> Prueba sin sitio web
 */

const https = require('https');
const http = require('http');

// Configuración de destino
const WEBHOOK_URL =
  process.env.N8N_DIAGNOSTICO_URL ||
  'https://n8n-n8n.eegva3.easypanel.host/webhook-test/diagnostico-idealy';
const SECRET = process.env.N8N_DIAGNOSTICO_SECRET || 'idealy_diag_secret_2026_x9k2';

const conWeb = !process.argv.includes('--no-web');

const payload = {
  nombre: 'Carlos Prueba',
  empresa: conWeb ? 'Distribuidora Alpha' : 'Taller Mecánico Beta',
  email: 'carlos.test@idealy.com.mx',
  whatsapp: '2221234567', // Pon tu número real aquí para probar el WhatsApp
  sitio_url: conWeb ? 'https://idealy.com.mx' : '',
  giro: 'comercio',
  tamano: '6-20',
  registro_ventas: 'excel',
  sistemas_conectados: 'no',
  horas_repetitivas: '15-30',
  seguimiento: 'manual',
  sitio_web: conWeb ? 'algunos' : 'no_tengo',
  movil: conWeb ? 'regular' : 'no_tengo',
  autoservicio: 'no',
  dolor: 'tiempo',
  presupuesto: '20-50k',
  urgencia: 'este_mes',
  utm_source: 'test_script',
  utm_medium: 'developer_console',
  utm_campaign: 'pruebas_n8n',
};

console.log(`\n🚀 Enviando payload de prueba a n8n (${conWeb ? 'CON' : 'SIN'} sitio web)...`);
console.log(`URL: ${WEBHOOK_URL}`);

const urlObj = new URL(WEBHOOK_URL);
const client = urlObj.protocol === 'https:' ? https : http;

const dataString = JSON.stringify(payload);

const req = client.request(
  urlObj,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Idealy-Secret': SECRET,
      'Content-Length': Buffer.byteLength(dataString),
    },
  },
  (res) => {
    let body = '';
    res.on('data', (chunk) => (body += chunk));
    res.on('end', () => {
      console.log(`\n✅ Status HTTP: ${res.statusCode}`);
      try {
        console.log('📦 Respuesta de n8n:', JSON.stringify(JSON.parse(body), null, 2));
      } catch {
        console.log('📦 Respuesta de n8n:', body);
      }
    });
  }
);

req.on('error', (err) => {
  console.error('❌ Error enviando a n8n:', err.message);
});

req.write(dataString);
req.end();

