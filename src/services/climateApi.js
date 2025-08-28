// File: src/services/climateApi.js
// API client for Kenya Climate AI Platform

class ClimateAPIClient {
    constructor(baseURL = 'http://localhost:8000') {
        this.baseURL = baseURL;
        this.headers = {
            'Content-Type': 'application/json',
        };
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.headers,
            ...options
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`API request failed: ${error.message}`);
            throw error;
        }
    }

    // Climate status methods
    async getClimateStatus(county) {
        return this.makeRequest(`/climate-status/${county}`, {
            method: 'POST',
            body: JSON.stringify({
                county,
                include_predictions: true,
                include_alerts: true
            })
        });
    }

    async getSupportedCounties() {
        return this.makeRequest('/counties');
    }

    // Agriculture methods
    async getAgriculturePredictions(county) {
        return this.makeRequest(`/agriculture/predictions/${county}`);
    }

    // Early warning methods
    async getEarlyWarningAlerts(county) {
        return this.makeRequest(`/early-warning/alerts/${county}`);
    }

    // Carbon monitoring methods
    async getCarbonStatus(county) {
        return this.makeRequest(`/carbon/status/${county}`);
    }

    // Energy grid methods
    async getGridStatus() {
        return this.makeRequest('/energy/grid-status');
    }

    // Urban climate methods
    async getAirQuality(city) {
        return this.makeRequest(`/urban/air-quality/${city}`);
    }
}

export default ClimateAPIClient;