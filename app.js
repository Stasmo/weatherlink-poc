const client = require('./api')()

const stationId = process.env.STATION_ID

async function getData() {
    let endTimestamp = Math.floor(Date.now() / 1000)
    let startTimestamp = endTimestamp - 3600
    try {
        let data = await client.getStations()
        console.log(data.data)
        data = await client.getStationCurrentData(stationId)
        console.log(data.data)
        data = await client.getStationHistoricData(stationId, startTimestamp, endTimestamp)
        console.log(data)
        writeToCsv(data)
    } catch(e) {
        console.error(e.response.data)
    }
    
}

function writeToCsv() {
    // format the data
    // write to csv
}

getData()