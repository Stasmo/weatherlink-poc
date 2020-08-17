const crypto = require("crypto");
const axios = require('axios');
const querystring = require('querystring');


module.exports = function(options) {
    const client = axios.create({
        baseURL: "https://api.weatherlink.com/v2"
    })

    options = options || {}

    const apiKey = options.apiKey || process.env.WEATHERLINK_API_KEY;
    const apiSecret = options.apiSecret || process.env.WEATHERLINK_API_SECRET;

    function getSignature(parameters) {
        var parameterNamesSorted = Object.keys(parameters).sort();
        
        var data = "";
        for (var parameterName of parameterNamesSorted) {
            data = data + parameterName + parameters[parameterName];
        }

        console.log(data)
        
        var hmac = crypto.createHmac("sha256", apiSecret);
        hmac.update(data);
        var apiSignature = hmac.digest("hex");

        return apiSignature
    }

    async function getStations() {

        var parameters = {
            "api-key": apiKey,
            "t": Math.floor(Date.now() / 1000)
        };

        let apiSignature = getSignature(parameters)
        let qs = `/stations?${querystring.stringify({ "api-key": apiKey, "api-signature": apiSignature, t: parameters['t'] })}`
        let response = await client.get(qs)

        return response
    }

    async function getStationHistoricData(stationId, startTimestamp, endTimestamp) {

        var parameters = {
            "api-key": apiKey,
            "end-timestamp": endTimestamp,
            "start-timestamp": startTimestamp,
            "station-id": stationId,
            "t": Math.floor(Date.now() / 1000),
        };
        
        parameters["api-signature"] = getSignature(parameters)
        let qs = `/historic/${stationId}?${querystring.stringify(parameters)}`
        let response = await client.get(qs)

        return response
    }

    async function getStationCurrentData(stationId) {

        var parameters = {
            "api-key": apiKey,
            "station-id": stationId,
            "t": Math.floor(Date.now() / 1000),
        };
        
        parameters["api-signature"] = getSignature(parameters)
        let qs = `/current/${stationId}?${querystring.stringify(parameters)}`
        let response = await client.get(qs)

        return response
    }

    return { getStationHistoricData, getStations, getStationCurrentData }
}
