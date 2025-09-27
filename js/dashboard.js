
// Wait for the DOM to be fully loaded before initializing the charts
document.addEventListener('DOMContentLoaded', () => {
  // ************************************************************************************
  // CHART CREATION AND DATA FETCHING
  // ************************************************************************************

  // Get the canvas elements for the charts
  const cropProductionCanvas = document.getElementById('chartCropProduction');
  const landUseCanvas = document.getElementById('chartLandUse');
  const climateCanvas = document.getElementById('chartClimate');

    // Store chart instances to manage them later (e.g., for exporting)
    const charts = {};

    const waterUsageCanvas = document.getElementById('chartWaterUsage');

  /**
   * Fetches data from a local JSON file.
   * @param {string} url - The URL of the JSON file to fetch.
   * @returns {Promise<object|null>} The fetched data as a JavaScript object, or null if an error occurs.
   */
  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('Could not load chart data. Please try again later.');
      return null;
    }
  };

  /**
   * Initializes and renders all the charts on the dashboard.
   * Fetches data and creates two chart examples: a Bar chart and a Pie chart.
   */
  const createCharts = async () => {
    showLoading(true);
    const data = await fetchData('../data/agricultural-statistics.json');
    showLoading(false);

    if (!data) {
      return;
    }

    // --- 1. Crop Production Bar Chart ---
    // This chart shows the production volume of different crops.
    // To add a new crop, add its data to the 'cropProduction.data' array in the JSON file.
    if (cropProductionCanvas && data.cropProduction) {
      charts['cropProduction'] = new Chart(cropProductionCanvas, {
        type: 'bar',
        data: {
          labels: data.cropProduction.data.map(item => item.crop),
          datasets: [{
            label: 'Production (1000 tons)',
            data: data.cropProduction.data.map(item => item.production),
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1500,
            easing: 'easeInOutQuart'
          },
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Crop Production in Jordan (1000 tons)'
            },
            legend: {
              display: false
            }
          }
        }
      });
    }

    // --- 2. Land Use Pie Chart ---
    // This chart displays the distribution of different land use types.
    // To edit this chart, modify the 'landUse.data' array in the JSON file.
    if (landUseCanvas && data.landUse) {
      charts['landUse'] = new Chart(landUseCanvas, {
        type: 'pie',
        data: {
          labels: data.landUse.data.map(item => item.category),
          datasets: [{
            label: 'Land Use Distribution',
            data: data.landUse.data.map(item => item.percentage),
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 206, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)'
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            animateScale: true,
            animateRotate: true
          },
          plugins: {
            title: {
              display: true,
              text: 'Land Use Distribution in Jordan (%)'
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }

    // --- 3. Water Usage Doughnut Chart ---
    // This chart shows the percentage of water usage from different sources.
    if (waterUsageCanvas && data.waterUsage) {
      charts['waterUsage'] = new Chart(waterUsageCanvas, {
        type: 'doughnut',
        data: {
          labels: data.waterUsage.data.map(item => item.source),
          datasets: [{
            label: 'Water Usage by Source',
            data: data.waterUsage.data.map(item => item.percentage),
            backgroundColor: data.waterUsage.data.map(item => item.color),
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            animateScale: true,
            animateRotate: true
          },
          plugins: {
            title: {
              display: true,
              text: 'Water Usage by Source (%)'
            },
            legend: {
              position: 'right'
            }
          }
        }
      });
    }

    // --- 4. Climate Trends Line Chart ---
    if (climateCanvas && data.climateData) {
      const climateLabels = data.climateData.data.map(item => item.year);
      charts['climate'] = new Chart(climateCanvas, {
        type: 'line',
        data: {
          labels: climateLabels,
          datasets: [
            {
              label: 'Rainfall (mm)',
              data: data.climateData.data.map(item => item.rainfall_mm),
              borderColor: '#2196F3',
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              yAxisID: 'yRainfall',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Avg Temperature (°C)',
              data: data.climateData.data.map(item => item.temperature_avg),
              borderColor: '#F44336',
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              yAxisID: 'yTemp',
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yRainfall: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Rainfall (mm)'
              }
            },
            yTemp: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Avg Temp (°C)'
              },
              grid: {
                drawOnChartArea: false // only draw grid for rainfall axis
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Climate Trends Over Time'
            },
            legend: {
              position: 'top'
            }
          }
        }
      });
    }

    // --- 4. Climate Trends Line Chart ---
    if (climateCanvas && data.climateData) {
      const climateLabels = data.climateData.data.map(item => item.year);
      charts['climate'] = new Chart(climateCanvas, {
        type: 'line',
        data: {
          labels: climateLabels,
          datasets: [
            {
              label: 'Rainfall (mm)',
              data: data.climateData.data.map(item => item.rainfall_mm),
              borderColor: '#2196F3',
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              yAxisID: 'yRainfall',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Avg Temperature (°C)',
              data: data.climateData.data.map(item => item.temperature_avg),
              borderColor: '#F44336',
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              yAxisID: 'yTemp',
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yRainfall: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Rainfall (mm)'
              }
            },
            yTemp: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Avg Temp (°C)'
              },
              grid: {
                drawOnChartArea: false // only draw grid for rainfall axis
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Climate Trends Over Time'
            },
            legend: {
              position: 'top'
            }
          }
        }
      });
    }

    updateStatistics();
    showSuccess('Dashboard loaded successfully!');
  };

  // ************************************************************************************
  // UI AND EVENT HANDLERS
  // ************************************************************************************

  let currentDataType = 'agricultural';

  const setupEventListeners = () => {
    // Data type selector
    document.getElementById('dataType').addEventListener('change', (e) => {
      switchDataType(e.target.value);
    });

    // Control buttons
    document.getElementById('refreshData').addEventListener('click', refreshAllData);
    document.getElementById('exportAllCharts').addEventListener('click', exportAllCharts);
    document.getElementById('fullscreen').addEventListener('click', toggleFullscreen);

    // Data management
    document.getElementById('exportData').addEventListener('click', exportCurrentData);
    document.getElementById('importDataBtn').addEventListener('click', () => {
      document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', (e) => {
      importData(e.target.files[0]);
    });
    document.getElementById('clearCache').addEventListener('click', clearCache);
    document.getElementById('downloadSample').addEventListener('click', downloadSampleData);
  };

  /**
   * Switches the displayed charts based on the selected data type.
   * @param {string} dataType - The new data type to display ('agricultural', 'diseases', 'vertical').
   */
  const switchDataType = (dataType) => {
    currentDataType = dataType;
    document.querySelectorAll('.chart-container').forEach(container => {
      container.style.display = container.dataset.type === dataType ? 'block' : 'none';
    });
    updateStatistics();
  };

  /**
   * Updates the statistics cards with the latest data.
   */
  const updateStatistics = async () => {
    const statsContainer = document.getElementById('dataStats');
    const data = await fetchData(`../data/${currentDataType}-statistics.json`);

    if (data && data.summary) {
      statsContainer.innerHTML = `
        <div class="stat-card">
            <span class="stat-number">${data.summary.totalDataPoints}</span>
            <span class="stat-label">Data Points</span>
        </div>
        <div class="stat-card">
            <span class="stat-number">${data.summary.lastUpdated}</span>
            <span class="stat-label">Last Updated</span>
        </div>
        <div class="stat-card">
            <span class="stat-number">${data.summary.fields}</span>
            <span class="stat-label">Numeric Fields</span>
        </div>
        <div class="stat-card">
            <span class="stat-number">${Object.keys(charts).length}</span>
            <span class="stat-label">Active Charts</span>
        </div>
      `;
    }
  };

  /**
   * Refreshes all data and re-renders the charts.
   */
  const refreshAllData = () => {
    // Clear existing charts before creating new ones
    Object.values(charts).forEach(chart => chart.destroy());
    createCharts();
  };

  /**
   * Exports all visible charts as PNG images.
   */
  const exportAllCharts = () => {
    Object.entries(charts).forEach(([name, chart]) => {
      const a = document.createElement('a');
      a.href = chart.toBase64Image();
      a.download = `${name}-chart.png`;
      a.click();
    });
    showSuccess('Charts exported successfully!');
  };

  /**
   * Toggles fullscreen mode for the browser window.
   */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        showError(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // ************************************************************************************
  // DATA MANAGEMENT FUNCTIONS
  // ************************************************************************************

  /**
   * Exports the current data as a JSON file.
   */
  const exportCurrentData = async () => {
    const data = await fetchData(`../data/${currentDataType}-statistics.json`);
    if (data) {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentDataType}-data.json`;
      a.click();
      URL.revokeObjectURL(url);
      showSuccess('Data exported successfully!');
    }
  };

  /**
   * Imports data from a user-selected JSON file.
   * @param {File} file - The file selected by the user.
   */
  const importData = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        // Here you would typically handle the imported data,
        // for example, by updating the charts or storing it.
        console.log('Imported data:', data);
        showSuccess('Data imported successfully! Check the console for the data.');
        // As a demo, we can refresh the charts if the data structure matches
        refreshAllData();
      } catch (error) {
        showError('Failed to parse JSON file. Please ensure it is valid.');
      }
    };
    reader.readAsText(file);
  };

  /**
   * Clears any cached data (in this implementation, we just log a message).
   */
  const clearCache = () => {
    // In a real-world scenario, you might clear localStorage or other caches.
    console.log('Cache cleared.');
    showSuccess('Cache cleared successfully!');
  };

  /**
   * Downloads a sample JSON data file for the user.
   */
  const downloadSampleData = () => {
    const sampleData = {
      cropProduction: {
        title: 'Sample Crop Production',
        data: [
          { crop: 'New Crop', production: 150, trend: 'up' },
          { crop: 'Another Crop', production: 250, trend: 'down' },
        ]
      },
      landUse: {
        title: 'Sample Land Use',
        data: [
          { category: 'New Land', percentage: 25, area_km2: 5000, color: '#ff0000' },
          { category: 'Other Land', percentage: 75, area_km2: 15000, color: '#00ff00' },
        ]
      }
    };
    const jsonString = JSON.stringify(sampleData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-agricultural-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ************************************************************************************
  // UTILITY FUNCTIONS (LOADING, ERROR, SUCCESS MESSAGES)
  // ************************************************************************************

  const loadingIndicator = document.getElementById('loadingIndicator');
  const errorMessageDiv = document.getElementById('errorMessage');
  const successMessageDiv = document.getElementById('successMessage');

  /**
   * Shows or hides the main loading indicator.
   * @param {boolean} show - True to show, false to hide.
   */
  const showLoading = (show) => {
    loadingIndicator.style.display = show ? 'block' : 'none';
  };

  /**
   * Displays an error message for a few seconds.
   * @param {string} message - The error message to display.
   */
  const showError = (message) => {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
    setTimeout(() => {
      errorMessageDiv.style.display = 'none';
    }, 5000);
  };

  /**
   * Displays a success message for a few seconds.
   * @param {string} message - The success message to display.
   */
  const showSuccess = (message) => {
    successMessageDiv.textContent = message;
    successMessageDiv.style.display = 'block';
    setTimeout(() => {
      successMessageDiv.style.display = 'none';
    }, 3000);
  };

  // ************************************************************************************
  // INITIALIZATION
  // ************************************************************************************

  // Set up all event listeners for the page
  setupEventListeners();

  // Initial creation of the charts
  createCharts();
});
