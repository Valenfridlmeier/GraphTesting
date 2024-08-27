const url = 'https://apidemo.geoeducacion.com.ar/api/testing/comunicados/1';





fetch(url)
    .then(response => response.json())
    .then(responseData => {
        const datos = responseData.data[0]; 

        if (!datos) {
            throw new Error('No se encontraron datos válidos en la respuesta de la API');
        }

        // Preparar los datos para el gráfico
        const total = datos.total;
        const entregados = datos.entregados;
        const pendientes = datos.pendientes;
        const error = datos.error;

        const categorias = ['Entregados', 'Pendientes', 'Errores'];
        const valores = [entregados, pendientes, error];

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
                formatter: '{b}: {c}'
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
                    data: categorias,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Estado de Entrega',
                    type: 'bar',
                    barWidth: '60%',
                    data: valores,
                    itemStyle: {
                        color: '#2196F3' 
                    }
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    })
    .catch(error => console.log(error));
