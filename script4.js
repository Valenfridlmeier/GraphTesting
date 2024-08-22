const url = 'https://apidemo.geoeducacion.com.ar/api/testing/asistencia/1';

fetch(url)
    .then(response => response.json())
    .then(responseData => {
        const estudiantes = responseData.data;

        if (!Array.isArray(estudiantes)) {
            throw new Error('El resultado de la API no contiene un array válido de estudiantes');
        }

        // Preparar los datos para el gráfico de barras
        const nivelesContados = estudiantes.reduce((acc, item) => {
            if (!acc[item.nivel]) {
                acc[item.nivel] = { presentes: 0, ausentes: 0 };
            }
            acc[item.nivel].presentes += item.presentes;
            acc[item.nivel].ausentes += item.ausentes;
            return acc;
        }, {});

        // Convertir a formato adecuado para el gráfico de barras
        const niveles = Object.keys(nivelesContados);
        const porcentajeAsistencia = niveles.map(nivel => {
            const { presentes, ausentes } = nivelesContados[nivel];
            return (presentes / (presentes + ausentes)) * 100;
        });

        var dom = document.getElementById('chart-container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: '{b}: {c}%'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: niveles, // Utiliza los niveles
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}%' // Mostrar como porcentaje
                    }
                }
            ],
            series: [
                {
                    name: 'Asistencia',
                    type: 'bar',
                    barWidth: '60%',
                    data: porcentajeAsistencia // Porcentaje de asistencia
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    })
    .catch(error => console.log(error));
