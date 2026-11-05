const fs = require('fs');
const workflow = JSON.parse(fs.readFileSync('scripts/n8n_diagnostico_seguimiento_workflow.json', 'utf-8'));
const codeNode = workflow.nodes.find(n => n.id === 'code-consolidar-mensajes');

// Creamos un sandbox simulando el entorno de n8n
function runN8nCode(mockData) {
  const $input = {
    first: () => ({ json: mockData })
  };
  const fn = new Function('$input', codeNode.parameters.jsCode);
  return fn($input);
}

const casoA = runN8nCode({
  nombre: 'Carlos López',
  empresa: 'Clínica Dental San Ángel',
  email: 'carlos@sanangel.com',
  score_global: 48,
  registro_ventas: 'excel',
  horas_repetitivas: '15-30',
  sitio_web: 'no_trae',
  movil: 'regular',
  autoservicio: 'no',
  horas_mes: 22,
  costo_mes: 2640,
  areas: { operacion: 50, automatizacion: 35, ventas_web: 40, ux: 45 },
  web_audit_realizada: true,
  sitio_url: 'https://sanangeldental.com',
  web_perf_score: 38,
  web_seo_score: 72,
  web_load_time: '4.8s',
  web_audit_summary: 'Tu web en celular tarda 4.8s en mostrar contenido y tiene 38/100 de velocidad. Estás perdiendo hasta el 40% de visitas que se van antes de cargar.'
});

const casoB = runN8nCode({
  nombre: 'María Fernández',
  empresa: 'Pastelería La Delicia',
  email: 'maria@ladelicia.com',
  score_global: 35,
  registro_ventas: 'papel',
  horas_repetitivas: '30+',
  sitio_web: 'no_tengo',
  movil: 'no_tengo',
  autoservicio: 'no',
  horas_mes: 35,
  costo_mes: 4200,
  areas: { operacion: 35, automatizacion: 20, ventas_web: 25, ux: 30 },
  web_audit_realizada: false,
  sitio_url: '',
  web_perf_score: 0,
  web_seo_score: 0,
  web_load_time: 'Sin sitio',
  web_audit_summary: ''
});

console.log('=== MENSAJE CASO A (CON WEB) ===\n');
console.log(casoA.whatsapp_message_body);
console.log('\n=== MENSAJE CASO B (SIN WEB) ===\n');
console.log(casoB.whatsapp_message_body);

