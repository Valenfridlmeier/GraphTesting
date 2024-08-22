const url = 'https://apidemo.geoeducacion.com.ar/api/testing/historial_asistencia/1';

fetch(url)
  .then(response => response.json())
  .then(responseData => {
    // Verifica el contenido de los datos recibidos
    console.log('Datos de la API:', responseData);

    const estudiantes = responseData.data;

    // Asegúrate de que responseData.data sea un array
    if (!Array.isArray(estudiantes)) {
      throw new Error('El resultado de la API no contiene un array válido de estudiantes');
    }

    // Verifica los datos antes del mapeo
    estudiantes.forEach(item => console.log('Elemento:', item));

    // Acceso correcto a las propiedades
    const cursos = estudiantes.map(item => item.curso || 'N/A'); // Uso de valor por defecto 'N/A'
    const presentes = estudiantes.map(item => item.presentes || 0); // Valor por defecto 0
    const ausentes = estudiantes.map(item => item.ausentes || 0); // Valor por defecto 0

    // Verifica los datos después del mapeo
    console.log('Cursos:', cursos);
    console.log('Presentes:', presentes);
    console.log('Ausentes:', ausentes);

    // Verifica si los arrays tienen la misma longitud
    if (cursos.length !== presentes.length || cursos.length !== ausentes.length) {
      throw new Error('Los datos no están alineados correctamente.');
    }

    // Formato de datos para el gráfico en ECharts
    const source = cursos.map((curso, index) => ({
      curso,
      Presentes: presentes[index],
      Ausentes: ausentes[index]
    }));

    console.log('Datos para el gráfico:', source);

    var dom = document.getElementById('chart-container');
    var myChart = echarts.init(dom);

    var option = {
      legend: {},
      tooltip: {},
      dataset: {
        dimensions: ['curso', 'Presentes', 'Ausentes'],
        source: source
      },
      xAxis: { type: 'category' },
      yAxis: {},
      series: [
        { type: 'bar', name: 'Presentes' },
        { type: 'bar', name: 'Ausentes' }
      ]
    };

    myChart.setOption(option);
    window.addEventListener('resize', myChart.resize);
  })
  .catch(error => console.log('Error:', error));
