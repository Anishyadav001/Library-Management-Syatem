function CategoryChart({ data }) {
  try {
    const chartRef = React.useRef(null);
    const chartInstance = React.useRef(null);
    const ChartJS = window.Chart;

    React.useEffect(() => {
      if (!chartRef.current || !data.length) return;

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new ChartJS(ctx, {
        type: 'doughnut',
        data: {
          labels: data.map(d => d.name),
          datasets: [{
            data: data.map(d => d.count),
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: true, position: 'bottom' } }
        }
      });

      return () => {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
      };
    }, [data]);

    return (
      <div style={{ height: '300px' }} data-name="category-chart" data-file="components/CategoryChart.js">
        <canvas ref={chartRef}></canvas>
      </div>
    );
  } catch (error) {
    console.error('CategoryChart component error:', error);
    return null;
  }
}