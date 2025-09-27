# Agricultural Data Management System

## 📊 Dashboard Fix - September 27, 2025

### Issue:
- The charts on the dashboard page (`dashboard.html`) were not working correctly.
- The code was complex and spread across multiple files (`dashboard.html`, `chart-manager.js`, `data-manager.js`).

### Fixes Implemented:

1.  **Created `js/dashboard.js`:**
    -   A new file was created to consolidate all chart-related logic in one place.

2.  **Simplified `dashboard.html`:**
    -   Removed the inline script from the HTML file.
    -   Removed `onclick` attributes from the buttons.
    -   Linked the new `js/dashboard.js` file.

3.  **Implemented `js/dashboard.js`:**
    -   Added an event listener to ensure the page is fully loaded before running the script.
    -   Data is now fetched from `data/agricultural-statistics.json` using `fetch`.
    -   Created two chart examples (bar and pie).
    -   Added animations and responsiveness to the charts.
    -   Added comments to explain the code.
    -   Added error handling for data fetching.

4.  **Removed Unnecessary Files:**
    -   Deleted `js/chart-manager.js` and `js/data-manager.js` as they are no longer needed for this page.

### Results:
- ✅ The charts on the dashboard page are now working correctly.
- ✅ The code is now more organized and easier to maintain.
- ✅ All task requirements have been met.

This project implements a comprehensive data management system for Jordan's agricultural statistics using JSON files for local storage and Chart.js for interactive visualizations. The system provides real-time data visualization, editing capabilities, and export/import functionality.

## Features

### 📊 Interactive Dashboard (`dashboard.html`)
- Real-time chart visualizations using Chart.js
- Multiple chart types: pie, bar, line, radar, and doughnut charts
- Data filtering and switching between different datasets
- Chart export functionality (PNG format)
- Responsive design for mobile and desktop

### ✏️ Data Editor (`data-editor.html`)
- Add, edit, and delete data entries
- Form validation and real-time JSON preview
- Support for multiple data types (agricultural, diseases, vertical farming)
- Bulk data import/export functionality
- User-friendly interface with confirmation dialogs

### 🗄️ JSON Data Storage
- **Agricultural Statistics** (`data/agricultural-statistics.json`)
  - Land use distribution
  - Crop production data
  - Water usage statistics
  - Climate trends
  - Economic indicators

- **Crop Diseases** (`data/crop-diseases.json`)
  - Disease incidence by crop
  - Management costs and effectiveness
  - Seasonal disease pressure trends

- **Vertical Farming** (`data/vertical-farming.json`)
  - Project data and investments
  - Efficiency comparisons
  - Crop yields and profitability
  - Investment trends over time

## Technical Architecture

### Core Components

#### 1. DataManager (`js/data-manager.js`)
```javascript
// Load data from JSON files
const data = await dataManager.loadData('agricultural');

// Get specific dataset
const landUse = await dataManager.getDataset('agricultural', 'landUse');

// Update data
dataManager.updateData('agricultural', 'landUse', newData, true);

// Add new entry
dataManager.addDataEntry('agricultural', 'cropProduction', newEntry);

// Export data
await dataManager.exportData('agricultural', 'my-data.json');
```

**Key Features:**
- Automatic caching for performance
- LocalStorage integration for persistence
- Event-driven architecture with listeners
- Fallback data handling
- Statistics calculation
- Import/export functionality

#### 2. ChartManager (`js/chart-manager.js`)
```javascript
// Create interactive charts
await chartManager.createLandUseChart('chartCanvas');
await chartManager.createCropProductionChart('productionCanvas');

// Export chart as image
chartManager.exportChart('chartCanvas', 'land-use-chart.png');

// Refresh chart with new data
chartManager.refreshChart('chartCanvas');
```

**Supported Chart Types:**
- **Doughnut Charts**: Land use distribution, water usage
- **Bar Charts**: Crop production, disease incidence
- **Line Charts**: Climate trends, investment growth
- **Radar Charts**: Efficiency comparisons
- **Pie Charts**: Various categorical data

## Data Structure Examples

### Agricultural Statistics
```json
{
  "landUse": {
    "title": "Land Use Distribution in Jordan",
    "data": [
      {
        "category": "Desert",
        "percentage": 70,
        "area_km2": 62000,
        "color": "#D4A574"
      }
    ],
    "lastUpdated": "2024-12-01"
  }
}
```

### Disease Data
```json
{
  "diseaseIncidence": {
    "title": "Plant Disease Incidence by Crop",
    "data": [
      {
        "crop": "Olives",
        "disease": "Olive Fruit Fly",
        "incidence": 35,
        "severity": "high",
        "losses": 25
      }
    ]
  }
}
```

## Usage Instructions

### 1. Viewing Data Dashboard
1. Open `dashboard.html` in a web browser
2. Select data type from the dropdown (Agricultural, Diseases, Vertical Farming)
3. View interactive charts and statistics
4. Export individual charts or all data using the control buttons

### 2. Editing Data
1. Open `data-editor.html` in a web browser
2. Select the data type and dataset you want to edit
3. Choose an existing entry to edit or click "Add New Entry"
4. Fill in the form fields (required fields marked with *)
5. Preview the JSON output in real-time
6. Save your changes or delete entries as needed

### 3. Data Import/Export
- **Export**: Use the "Export Data" button to download JSON files
- **Import**: Use the "Import Data" button to upload JSON files
- **Sample Data**: Download sample data templates for reference

## File Structure
```
├── dashboard.html          # Interactive data dashboard
├── data-editor.html        # Data editing interface
├── data/
│   ├── agricultural-statistics.json
│   ├── crop-diseases.json
│   └── vertical-farming.json
├── js/
│   ├── data-manager.js     # Core data management
│   ├── chart-manager.js    # Chart creation and management
│   └── app.js             # Main application logic
└── css/
    └── style.css          # Styling (existing)
```

## Browser Compatibility
- Modern browsers supporting ES6+ features
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Data Validation Rules

### Required Fields by Data Type
- **Land Use**: category, percentage, area_km2, color
- **Crop Production**: crop, production, year, trend
- **Water Usage**: source, volume_mcm, percentage, color
- **Disease Data**: crop, disease, incidence, severity, losses
- **Vertical Farming**: project, area_sqm, investment_usd, status

### Data Types
- **Numbers**: Automatically converted and validated
- **Colors**: HTML color picker for chart colors
- **Selections**: Predefined options for consistency
- **Text**: Free text input with validation

## Performance Features

### Caching
- Automatic data caching in memory
- LocalStorage persistence
- Cache invalidation on updates
- Performance monitoring

### Optimization
- Lazy loading of chart libraries
- Debounced form updates
- Efficient DOM manipulation
- Responsive image loading

## Security Considerations
- Client-side only (no server required)
- Local file access for JSON data
- No external API dependencies
- Data validation and sanitization

## Troubleshooting

### Common Issues
1. **Charts not loading**: Ensure Chart.js library is loaded
2. **Data not saving**: Check browser LocalStorage permissions
3. **Import failing**: Verify JSON file format matches expected structure
4. **Mobile display issues**: Ensure viewport meta tag is present

### Error Messages
- **"Failed to load data"**: Check file paths and JSON syntax
- **"Validation failed"**: Review required fields and data types
- **"Cache error"**: Clear browser cache and LocalStorage

## Future Enhancements
- Real-time data synchronization
- Advanced filtering and search
- Data visualization templates
- Automated backup system
- Multi-user collaboration features
- API integration capabilities

## Support
For technical support or questions about the data management system, refer to the main project documentation or contact the development team.

---

**Last Updated**: December 2024  
**Version**: 1.0  
**License**: MIT
