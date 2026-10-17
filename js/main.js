const loading = document.getElementById('loading');
const contenedor = document.getElementById('clima-container');

const LATITUD_CDMX = 19.4326;
const LONGITUD_CDMX = -99.1332;

const mostrarToast = (mensaje, tipo) => {
  Toastify({
    text: mensaje,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    stopOnFocus: true,
    style: {
      background: tipo === 'error'
        ? 'linear-gradient(to right, #e74c3c, #c0392b)'
        : 'linear-gradient(to right, #27ae60, #1e8449)',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    }
  }).showToast();
};

const interpretarClima = (codigo) => {
  if (codigo === 0) return 'Cielo despejado';
  if (codigo >= 1 && codigo <= 3) return 'Parcialmente nublado';
  if (codigo >= 45 && codigo <= 48) return 'Niebla';
  if (codigo >= 51 && codigo <= 55) return 'Llovizna';
  if (codigo >= 61 && codigo <= 65) return 'Lluvia';
  if (codigo >= 71 && codigo <= 77) return 'Nieve';
  if (codigo >= 80 && codigo <= 82) return 'Chubascos';
  if (codigo >= 95 && codigo <= 99) return 'Tormenta eléctrica';
  return 'Condición desconocida';
};

const renderizarClima = (datos) => {
  const climaActual = datos.current_weather;
  const temperatura = climaActual.temperature;
  const viento = climaActual.windspeed;
  const codigoClima = climaActual.weathercode;
  const descripcion = interpretarClima(codigoClima);
  const hora = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  contenedor.innerHTML = `
    <div class="clima-card">
      <div class="ciudad">Ciudad de México, México</div>
      <div class="temperatura">${temperatura}°C</div>
      <div class="descripcion">${descripcion}</div>
      <div class="detalles">
        <div class="detalle-item">
          <span class="detalle-label">Viento</span>
          <span class="detalle-valor">${viento} km/h</span>
        </div>
        <div class="detalle-item">
          <span class="detalle-label">Actualizado</span>
          <span class="detalle-valor">${hora}</span>
        </div>
      </div>
    </div>
  `;
};

const cargarClima = async () => {
  loading.classList.remove('oculto');

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUD_CDMX}&longitude=${LONGITUD_CDMX}&current_weather=true`;

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    if (!datos.current_weather) {
      throw new Error('Datos de clima no disponibles');
    }

    renderizarClima(datos);
    mostrarToast('✅ Clima cargado con éxito', 'exito');

  } catch (error) {
    console.error('Error al cargar clima:', error);
    mostrarToast(`❌ Error: ${error.message}`, 'error');

    contenedor.innerHTML = `
      <p class="error-mensaje">No se pudo obtener el clima. Intente nuevamente.</p>
    `;

  } finally {
    loading.classList.add('oculto');
  }
};

cargarClima();