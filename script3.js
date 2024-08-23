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

    // Acceso correcto a las propiedades
    const cursos = estudiantes.map(item => item.curso || 'N/A'); // Uso de valor por defecto 'N/A'
    const presentes = estudiantes.map(item => item.presentes || 0); // Valor por defecto 0

    // Verifica si los arrays tienen la misma longitud
    if (cursos.length !== presentes.length) {
      throw new Error('Los datos no están alineados correctamente.');
    }

    var dom = document.getElementById('chart-container');
    var myChart = echarts.init(dom);

    // Configuración del gráfico usando tus datos
    var option = {
      xAxis: {
        type: 'category',
        data: cursos // Usamos los cursos como las etiquetas en el eje X
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: presentes, // Usamos los datos de presentes para las barras
          type: 'bar'
        }
      ]
    };

    myChart.setOption(option);
    window.addEventListener('resize', myChart.resize);
  })
  .catch(error => console.log('Error:', error));
