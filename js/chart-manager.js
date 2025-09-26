/**
 * Chart Manager - Creates and manages interactive Chart.js visualizations
 * Integrates with DataManager for dynamic data visualization
 */

class ChartManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.charts = new Map();
        this.defaultColors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ];
        this.init();
    }

    /**
     * Initialize chart manager
     */
    init() {
        // Register Chart.js plugins and defaults
        Chart.defaults.font.family = "'Poppins', 'Cairo', sans-serif";
        Chart.defaults.color = '#333';
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        
        // Listen for data updates
        this.dataManager.addEventListener('agricultural', (event, data) => {
            this.onDataUpdate('agricultural', event, data);
        });
        
        this.dataManager.addEventListener('diseases', (event, data) => {
            this.onDataUpdate('diseases', event, data);
        });
        
        this.dataManager.addEventListener('vertical', (event, data) => {
            this.onDataUpdate('vertical', event, data);
        });
    }

    /**
     * Create land use pie chart
     * @param {string} canvasId - Canvas element ID
     * @returns {Promise<Chart>} Chart instance
     */
    async createLandUseChart(canvasId) {
        const dataset = await this.dataManager.getDataset('agricultural', 'landUse');
        if (!dataset || !dataset.data) return null;

        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'doughnut',
            data: {
                labels: dataset.data.map(item => item.category),
                datasets: [{
                    data: dataset.data.map(item => item.percentage),
                    backgroundColor: dataset.data.map(item => item.color),
                    borderWidth: 2,
                    borderColor: '#fff',
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: dataset.title,
                        font: { size: 16, weight: 'bold' },
                        padding: 20
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, i) => ({
                                    text: `${label}: ${data.datasets[0].data[i]}%`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    strokeStyle: data.datasets[0].backgroundColor[i],
                                    lineWidth: 0,
                                    pointStyle: 'circle'
                                }));
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const item = dataset.data[context.dataIndex];
                                return [
                                    `${context.label}: ${context.parsed}%`,
                                    `Area: ${item.area_km2.toLocaleString()} km²`
                                ];
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1500
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(canvasId, chart);
        return chart;
    }

    /**
     * Create crop production bar chart
     * @param {string} canvasId - Canvas element ID
     * @returns {Promise<Chart>} Chart instance
     */
    async createCropProductionChart(canvasId) {
        const dataset = await this.dataManager.getDataset('agricultural', 'cropProduction');
        if (!dataset || !dataset.data) return null;

        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'bar',
            data: {
                labels: dataset.data.map(item => item.crop),
                datasets: [{
                    label: 'Production (1000 tons)',
                    data: dataset.data.map(item => item.production),
                    backgroundColor: dataset.data.map((_, i) => this.defaultColors[i % this.defaultColors.length]),
                    borderColor: dataset.data.map((_, i) => this.defaultColors[i % this.defaultColors.length]),
                    borderWidth: 2,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: dataset.title,
                        font: { size: 16, weight: 'bold' },
                        padding: 20
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: (context) => {
                                const item = dataset.data[context.dataIndex];
                                return `Trend: ${item.trend}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Production (1000 tons)'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Crops'
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(canvasId, chart);
        return chart;
    }

    /**
     * Create water usage chart
     * @param {string} canvasId - Canvas element ID
     * @returns {Promise<Chart>} Chart instance
     */
    async createWaterUsageChart(canvasId) {
        const dataset = await this.dataManager.getDataset('agricultural', 'waterUsage');
        if (!dataset || !dataset.data) return null;

        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'pie',
            data: {
                labels: dataset.data.map(item => item.source),
                datasets: [{
                    data: dataset.data.map(item => item.volume_mcm),
                    backgroundColor: dataset.data.map(item => item.color),
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: dataset.title,
                        font: { size: 16, weight: 'bold' },
                        padding: 20
                    },
                    legend: {
                        position: 'right',
                        labels: {
                            generateLabels: (chart) => {
                                const data = chart.data;
                                return data.labels.map((label, i) => ({
                                    text: `${label}: ${data.datasets[0].data[i]} MCM`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    strokeStyle: data.datasets[0].backgroundColor[i],
                                    lineWidth: 0,
                                    pointStyle: 'circle'
                                }));
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const item = dataset.data[context.dataIndex];
                                return [
                                    `${context.label}: ${context.parsed} MCM`,
                                    `Percentage: ${item.percentage}%`
                                ];
                            }
                        }
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(canvasId, chart);
        return chart;
    }

    /**
     * Create climate trends line chart
     * @param {string} canvasId - Canvas element ID
     * @returns {Promise<Chart>} Chart instance
     */
    async createClimateChart(canvasId) {
        const dataset = await this.dataManager.getDataset('agricultural', 'climateData');
        if (!dataset || !dataset.data) return null;

        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'line',
            data: {
                labels: dataset.data.map(item => item.year),
                datasets: [
                    {
                        label: 'Rainfall (mm)',
                        data: dataset.data.map(item => item.rainfall_mm),
                        borderColor: '#36A2EB',
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        yAxisID: 'y',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Average Temperature (°C)',
                        data: dataset.data.map(item => item.temperature_avg),
                        borderColor: '#FF6384',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        yAxisID: 'y1',
                        tension: 0.4
                    },
                    {
                        label: 'Drought Index',
                        data: dataset.data.map(item => item.drought_index),
                        borderColor: '#FFCE56',
                        backgroundColor: 'rgba(255, 206, 86, 0.1)',
                        yAxisID: 'y2',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    title: {
                        display: true,
                        text: dataset.title,
                        font: { size: 16, weight: 'bold' },
                        padding: 20
                    },
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Rainfall (mm)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    },
                    y2: {
                        type: 'linear',
                        display: false,
                        position: 'right'
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(canvasId, chart);
        return chart;
    }

    /**
     * Create disease incidence chart
     * @param {string} canvasId - Canvas element ID
     * @returns {Promise<Chart>} Chart instance
     */
    async createDiseaseChart(canvasId) {
        const dataset = await this.dataManager.getDataset('diseases', 'diseaseIncidence');
        if (!dataset || !dataset.data) return null;

        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        // Group data by crop
        const cropData = {};
        dataset.data.forEach(item => {
            if (!cropData[item.crop]) {
                cropData[item.crop] = [];
            }
            cropData[item.crop].push(item);
        });

        const config = {
            type: 'bar',
            data: {
                labels: Object.keys(cropData),
                datasets: [{
                    label: 'Disease Incidence (%)',
                    data: Object.values(cropData).map(diseases => 
                        diseases.reduce((sum, d) => sum + d.incidence, 0) / diseases.length
                    ),
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Average Disease Incidence by Crop',
                        font: { size: 16, weight: 'bold' },
                        padding: 20
                    },
                    tooltip: {
                        callbacks: {
                            afterLabel: (context) => {
                                const diseases = cropData[context.label];
                                return diseases.map(d => `${d.disease}: ${d.incidence}%`);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Incidence (%)'
                        }
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(canvasId, chart);
        return chart;
    }

    /**
     * Create vertical farming efficiency comparison
     * @param {string} canvasId - Canvas element ID
     * @returns {Promise<Chart>} Chart instance
     */
    async createVerticalFarmingChart(canvasId) {
        const dataset = await this.dataManager.getDataset('vertical', 'efficiency');
        if (!dataset || !dataset.data) return null;

        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'radar',
            data: {
                labels: dataset.data.map(item => item.metric),
                datasets: [
                    {
                        label: 'Traditional Farming',
                        data: dataset.data.map(item => item.traditional),
                        borderColor: '#FF6384',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        pointBackgroundColor: '#FF6384',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#FF6384'
                    },
                    {
                        label: 'Vertical Farming',
                        data: dataset.data.map(item => item.vertical),
                        borderColor: '#36A2EB',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        pointBackgroundColor: '#36A2EB',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#36A2EB'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Traditional vs Vertical Farming Efficiency',
                        font: { size: 16, weight: 'bold' },
                        padding: 20
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 120,
                        ticks: {
                            stepSize: 20
                        }
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(canvasId, chart);
        return chart;
    }

    /**
     * Create investment trends chart
     * @param {string} canvasId - Canvas element ID
     * @returns {Promise<Chart>} Chart instance
     */
    async createInvestmentChart(canvasId) {
        const dataset = await this.dataManager.getDataset('vertical', 'investment');
        if (!dataset || !dataset.data) return null;

        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'line',
            data: {
                labels: dataset.data.map(item => item.year),
                datasets: [
                    {
                        label: 'Total Investment (USD)',
                        data: dataset.data.map(item => item.total_investment),
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        yAxisID: 'y',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Active Projects',
                        data: dataset.data.map(item => item.active_projects),
                        borderColor: '#FF9800',
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                        yAxisID: 'y1',
                        tension: 0.4
                    },
                    {
                        label: 'Jobs Created',
                        data: dataset.data.map(item => item.jobs_created),
                        borderColor: '#9C27B0',
                        backgroundColor: 'rgba(156, 39, 176, 0.1)',
                        yAxisID: 'y2',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Vertical Farming Investment Trends',
                        font: { size: 16, weight: 'bold' },
                        padding: 20
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Investment (USD)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Projects / Jobs'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    },
                    y2: {
                        type: 'linear',
                        display: false
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(canvasId, chart);
        return chart;
    }

    /**
     * Create agricultural timeline chart
     * @param {string} canvasId - Canvas element ID
     * @returns {Promise<Chart>} Chart instance
     */
    async createTimelineChart(canvasId) {
        const dataset = await this.dataManager.getDataset('agricultural', 'timeline');
        if (!dataset || !dataset.data) {
            // Fallback data if not available
            return this.createFallbackTimelineChart(canvasId);
        }

        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'line',
            data: {
                labels: dataset.data.map(item => item.year),
                datasets: [{
                    label: 'Agricultural Production Index',
                    data: dataset.data.map(item => item.production_index),
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2ecc71',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: dataset.title || 'Agricultural Development Timeline',
                        font: { size: 16, weight: 'bold' },
                        padding: 20
                    },
                    legend: { display: false }
                },
                scales: {
                    x: { 
                        title: {
                            display: true,
                            text: 'Year'
                        },
                        grid: { color: 'rgba(255,255,255,0.08)' }
                    },
                    y: { 
                        title: {
                            display: true,
                            text: 'Production Index'
                        },
                        grid: { color: 'rgba(255,255,255,0.08)' },
                        beginAtZero: true,
                        max: 110
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(canvasId, chart);
        return chart;
    }

    /**
     * Create fallback timeline chart with static data
     * @param {string} canvasId - Canvas element ID
     * @returns {Chart} Chart instance
     */
    createFallbackTimelineChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'line',
            data: {
                labels: ['1950', '1970', '1990', '2000', '2010', '2020', '2025'],
                datasets: [{
                    label: 'Agricultural Production Index',
                    data: [30, 45, 65, 75, 85, 95, 100],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2ecc71',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Agricultural Development Timeline',
                        font: { size: 16, weight: 'bold' },
                        padding: 20
                    },
                    legend: { display: false }
                },
                scales: {
                    x: { 
                        title: {
                            display: true,
                            text: 'Year'
                        },
                        grid: { color: 'rgba(255,255,255,0.08)' }
                    },
                    y: { 
                        title: {
                            display: true,
                            text: 'Production Index'
                        },
                        grid: { color: 'rgba(255,255,255,0.08)' },
                        beginAtZero: true,
                        max: 110
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(canvasId, chart);
        return chart;
    }

    /**
     * Handle data updates
     * @param {string} dataType - Type of data updated
     * @param {string} event - Event type
     * @param {Object} data - Updated data
     */
    onDataUpdate(dataType, event, data) {
        // Refresh relevant charts when data is updated
        this.charts.forEach((chart, canvasId) => {
            if (this.shouldRefreshChart(canvasId, dataType)) {
                this.refreshChart(canvasId);
            }
        });
    }

    /**
     * Check if chart should be refreshed for data type
     * @param {string} canvasId - Canvas ID
     * @param {string} dataType - Data type
     * @returns {boolean} Should refresh
     */
    shouldRefreshChart(canvasId, dataType) {
        const chartDataMapping = {
            'chartLandUse': 'agricultural',
            'chartCropProduction': 'agricultural',
            'chartWaterUsage': 'agricultural',
            'chartClimate': 'agricultural',
            'chartDiseases': 'diseases',
            'chartVerticalEfficiency': 'vertical',
            'chartInvestment': 'vertical'
        };

        return chartDataMapping[canvasId] === dataType;
    }

    /**
     * Refresh specific chart
     * @param {string} canvasId - Canvas ID to refresh
     */
    async refreshChart(canvasId) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.destroy();
            this.charts.delete(canvasId);
            
            // Recreate chart based on canvas ID
            const chartCreators = {
                'chartLandUse': () => this.createLandUseChart(canvasId),
                'chartCropProduction': () => this.createCropProductionChart(canvasId),
                'chartTimeline': () => this.createTimelineChart(canvasId),
                'chartWaterUsage': () => this.createWaterUsageChart(canvasId),
                'chartClimate': () => this.createClimateChart(canvasId),
                'chartDiseases': () => this.createDiseaseChart(canvasId),
                'chartVerticalEfficiency': () => this.createVerticalFarmingChart(canvasId),
                'chartInvestment': () => this.createInvestmentChart(canvasId)
            };

            const creator = chartCreators[canvasId];
            if (creator) {
                await creator();
            }
        }
    }

    /**
     * Destroy all charts
     */
    destroyAllCharts() {
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();
    }

    /**
     * Get chart instance
     * @param {string} canvasId - Canvas ID
     * @returns {Chart|null} Chart instance
     */
    getChart(canvasId) {
        return this.charts.get(canvasId) || null;
    }

    /**
     * Export chart as image
     * @param {string} canvasId - Canvas ID
     * @param {string} filename - Filename for download
     */
    exportChart(canvasId, filename) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            const url = chart.toBase64Image();
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || `chart-${canvasId}-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.dataManager) {
        window.chartManager = new ChartManager(window.dataManager);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartManager;
}
