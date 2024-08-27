const url = 'https://apidemo.geoeducacion.com.ar/api/testing/calificaciones/1';

fetch(url)
    .then(response => response.json())
    .then(responseData => {
        const cursos = responseData.data;

        if (!Array.isArray(cursos)) {
            throw new Error('El resultado de la API no contiene un array válido de cursos');
        }

        // Extraer nombres de cursos y los valores de aprobados y desaprobados
        const nombresCursos = cursos.map(item => item.curso);
        const aprobados = cursos.map(item => item.aprobados * 100);
        const desaprobados = cursos.map(item => item.desaprobados * 100);

        var dom = document.getElementById('chart-container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        var option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: nombresCursos
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} %'
                }
            },
            series: [
                {
                    name: 'Aprobados',
                    data: aprobados,
                    type: 'line',
                    areaStyle: {},
                    color: '#4CAF50'
                },
                {
                    name: 'Desaprobados',
                    data: desaprobados,
                    type: 'line',
                    areaStyle: {},
                    color: '#F44336'
                }
            ],
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    let result = `${params[0].name}<br/>`;
                    params.forEach(item => {
                        result += `${item.marker} ${item.seriesName}: ${item.data}%<br/>`;
                    });
                    return result;
                }
            },
            legend: {
                top: '5%',
                left: 'center'
            }
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    })
    .catch(error => console.log(error));
