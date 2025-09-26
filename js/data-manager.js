/**
 * Data Manager - Handles JSON data loading, caching, and management
 * Supports local file storage and data manipulation for agricultural statistics
 */

class DataManager {
    constructor() {
        this.cache = new Map();
        this.dataFiles = {
            agricultural: 'data/agricultural-statistics.json',
            diseases: 'data/crop-diseases.json',
            vertical: 'data/vertical-farming.json'
        };
        this.listeners = new Map();
    }

    /**
     * Load data from JSON file with caching
     * @param {string} dataType - Type of data to load (agricultural, diseases, vertical)
     * @returns {Promise<Object>} Parsed JSON data
     */
    async loadData(dataType) {
        if (this.cache.has(dataType)) {
            return this.cache.get(dataType);
        }

        try {
            const filePath = this.dataFiles[dataType];
            if (!filePath) {
                throw new Error(`Unknown data type: ${dataType}`);
            }

            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load ${dataType} data: ${response.statusText}`);
            }

            const data = await response.json();
            this.cache.set(dataType, data);
            this.notifyListeners(dataType, 'loaded', data);
            
            return data;
        } catch (error) {
            console.error(`Error loading ${dataType} data:`, error);
            // Return fallback data structure
            return this.getFallbackData(dataType);
        }
    }

    /**
     * Get specific dataset from loaded data
     * @param {string} dataType - Type of data
     * @param {string} dataset - Specific dataset name
     * @returns {Promise<Object>} Dataset
     */
    async getDataset(dataType, dataset) {
        const data = await this.loadData(dataType);
        return data[dataset] || null;
    }

    /**
     * Update data in memory and optionally save to localStorage
     * @param {string} dataType - Type of data
     * @param {string} dataset - Dataset name
     * @param {Object} newData - New data to update
     * @param {boolean} persist - Whether to save to localStorage
     */
    updateData(dataType, dataset, newData, persist = true) {
        if (!this.cache.has(dataType)) {
            console.warn(`Data type ${dataType} not loaded yet`);
            return false;
        }

        const data = this.cache.get(dataType);
        if (data[dataset]) {
            data[dataset] = { ...data[dataset], ...newData };
            data[dataset].lastUpdated = new Date().toISOString().split('T')[0];
            
            if (persist) {
                this.saveToLocalStorage(dataType, data);
            }
            
            this.notifyListeners(dataType, 'updated', data[dataset]);
            return true;
        }
        
        return false;
    }

    /**
     * Add new data entry to a dataset
     * @param {string} dataType - Type of data
     * @param {string} dataset - Dataset name
     * @param {Object} entry - New entry to add
     */
    addDataEntry(dataType, dataset, entry) {
        if (!this.cache.has(dataType)) {
            console.warn(`Data type ${dataType} not loaded yet`);
            return false;
        }

        const data = this.cache.get(dataType);
        if (data[dataset] && Array.isArray(data[dataset].data)) {
            data[dataset].data.push(entry);
            data[dataset].lastUpdated = new Date().toISOString().split('T')[0];
            
            this.saveToLocalStorage(dataType, data);
            this.notifyListeners(dataType, 'entry_added', { dataset, entry });
            return true;
        }
        
        return false;
    }

    /**
     * Remove data entry from dataset
     * @param {string} dataType - Type of data
     * @param {string} dataset - Dataset name
     * @param {Function} predicate - Function to identify entry to remove
     */
    removeDataEntry(dataType, dataset, predicate) {
        if (!this.cache.has(dataType)) {
            return false;
        }

        const data = this.cache.get(dataType);
        if (data[dataset] && Array.isArray(data[dataset].data)) {
            const originalLength = data[dataset].data.length;
            data[dataset].data = data[dataset].data.filter(item => !predicate(item));
            
            if (data[dataset].data.length < originalLength) {
                data[dataset].lastUpdated = new Date().toISOString().split('T')[0];
                this.saveToLocalStorage(dataType, data);
                this.notifyListeners(dataType, 'entry_removed', { dataset });
                return true;
            }
        }
        
        return false;
    }

    /**
     * Save data to localStorage
     * @param {string} dataType - Type of data
     * @param {Object} data - Data to save
     */
    saveToLocalStorage(dataType, data) {
        try {
            const key = `agricultural_data_${dataType}`;
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }

    /**
     * Load data from localStorage
     * @param {string} dataType - Type of data
     * @returns {Object|null} Loaded data or null
     */
    loadFromLocalStorage(dataType) {
        try {
            const key = `agricultural_data_${dataType}`;
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return null;
        }
    }

    /**
     * Export data as JSON file
     * @param {string} dataType - Type of data to export
     * @param {string} filename - Optional filename
     */
    async exportData(dataType, filename) {
        const data = await this.loadData(dataType);
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || `${dataType}-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Import data from JSON file
     * @param {File} file - File to import
     * @param {string} dataType - Type of data
     * @returns {Promise<boolean>} Success status
     */
    async importData(file, dataType) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            this.cache.set(dataType, data);
            this.saveToLocalStorage(dataType, data);
            this.notifyListeners(dataType, 'imported', data);
            
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }

    /**
     * Get data statistics
     * @param {string} dataType - Type of data
     * @param {string} dataset - Dataset name
     * @returns {Promise<Object>} Statistics object
     */
    async getStatistics(dataType, dataset) {
        const data = await this.getDataset(dataType, dataset);
        if (!data || !Array.isArray(data.data)) {
            return null;
        }

        const stats = {
            count: data.data.length,
            lastUpdated: data.lastUpdated,
            numericFields: {}
        };

        // Calculate statistics for numeric fields
        if (data.data.length > 0) {
            const firstItem = data.data[0];
            Object.keys(firstItem).forEach(key => {
                const values = data.data.map(item => item[key]).filter(val => typeof val === 'number');
                if (values.length > 0) {
                    stats.numericFields[key] = {
                        min: Math.min(...values),
                        max: Math.max(...values),
                        avg: values.reduce((sum, val) => sum + val, 0) / values.length,
                        sum: values.reduce((sum, val) => sum + val, 0)
                    };
                }
            });
        }

        return stats;
    }

    /**
     * Register event listener for data changes
     * @param {string} dataType - Type of data to listen to
     * @param {Function} callback - Callback function
     */
    addEventListener(dataType, callback) {
        if (!this.listeners.has(dataType)) {
            this.listeners.set(dataType, []);
        }
        this.listeners.get(dataType).push(callback);
    }

    /**
     * Remove event listener
     * @param {string} dataType - Type of data
     * @param {Function} callback - Callback to remove
     */
    removeEventListener(dataType, callback) {
        if (this.listeners.has(dataType)) {
            const callbacks = this.listeners.get(dataType);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * Notify listeners of data changes
     * @param {string} dataType - Type of data
     * @param {string} event - Event type
     * @param {Object} data - Event data
     */
    notifyListeners(dataType, event, data) {
        if (this.listeners.has(dataType)) {
            this.listeners.get(dataType).forEach(callback => {
                try {
                    callback(event, data);
                } catch (error) {
                    console.error('Error in data listener:', error);
                }
            });
        }
    }

    /**
     * Get fallback data when loading fails
     * @param {string} dataType - Type of data
     * @returns {Object} Fallback data structure
     */
    getFallbackData(dataType) {
        const fallbacks = {
            agricultural: {
                landUse: { title: "Land Use Distribution", data: [], lastUpdated: new Date().toISOString().split('T')[0] },
                cropProduction: { title: "Crop Production", data: [], lastUpdated: new Date().toISOString().split('T')[0] }
            },
            diseases: {
                diseaseIncidence: { title: "Disease Incidence", data: [], lastUpdated: new Date().toISOString().split('T')[0] }
            },
            vertical: {
                projectData: { title: "Vertical Farming Projects", data: [], lastUpdated: new Date().toISOString().split('T')[0] }
            }
        };

        return fallbacks[dataType] || {};
    }

    /**
     * Clear all cached data
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get cache status
     * @returns {Object} Cache information
     */
    getCacheInfo() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            memoryUsage: JSON.stringify(Array.from(this.cache.values())).length
        };
    }
}

// Create global instance
window.dataManager = new DataManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
