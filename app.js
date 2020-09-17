const client = require('./api')()
const moment = require('moment-timezone')
const fs = require('fs')
const path = require('path')

const stationId = process.env.STATION_ID || 96918

const readIntervalSeconds = process.env.READ_INTERVAL || 300
const sheetDirectory = process.env.SHEET_DIR || '.'

async function getData() {
    try {
        let data = await client.getStationCurrentData(stationId)
        writeToCsv(data.data)
        console.log('Successfully wrote new line.')
    } catch(e) {
        console.error('Error retrieving and writing data.')
        console.error(e)
        console.error(e.response.data)
    }
}

function writeToCsv(data) {
    let d = moment()
    let sheetName = path.join(sheetDirectory ,`weatherlink-data-${d.format('YYYY-MM-DD')}-${d.format('HH')}.csv`)
    if (!fs.existsSync(sheetName)) {
        fs.appendFileSync(sheetName, Object.values(translations).join(',') + "\n")
    }

    let rowData = { 'Timestamp': moment.unix(data.generated_at).toISOString() }
    let sensors = {}
    data.sensors.map(s =>sensors[s.lsid] = s)
    
    console.log('Writing data to CSV')
    Object.keys(idToNameMap).map(id => {
        let productName = idToNameMap[id]
        sensors[id].data.map(dataItem => {
            Object.keys(dataItem).map(rowName => {
                let rowValue = dataItem[rowName]
                if (rowValue != null && ['ts', 'rain_storm_start_time', 'rain_storm_last_end_at', 'rain_storm_last_start_at'].includes(rowName)) {
                    let timedata = moment.unix(rowValue).toISOString()
                    rowData[`${productName}: ${rowName}`] = timedata
                } else {
                    rowData[`${productName}: ${rowName}`] = rowValue
                }
            })
        })
    })

    fs.appendFileSync(sheetName, Object.keys(translations).map(c => rowData[c]).join(',') + "\n")
}


let idToNameMap = {
    343963: "WeatherLink LIVE Health",
    343964: "Barometer",
    343965: "Inside Temp/Hum",
    343966: "Vantage Vue, Wireless",
}

const translations = {
    "Timestamp": "timestamp",
    "Barometer: bar_absolute": "bar_absolute",
    "Barometer: bar_sea_level": "bar_sealevel",
    "Barometer: bar_offset": "bar_offset",
    "Barometer: bar_trend": "bar_trend",
    "Inside Temp/Hum: temp_in": "inside_temp",
    "Inside Temp/Hum: heat_index_in": "inside_thw",
    "Inside Temp/Hum: dew_point_in": "inside_dew",
    "Inside Temp/Hum: hum_in": "inside_hum",
    "Vantage Vue, Wireless: wind_speed_hi_last_2_min": "wind_2min_gust_speed",
    "Vantage Vue, Wireless: hum": "outside_hum",
    "Vantage Vue, Wireless: wind_dir_at_hi_speed_last_10_min": "wind_10min_gust_dir",
    "Vantage Vue, Wireless: wind_chill": "outside_windchill",
    "Vantage Vue, Wireless: thw_index": "outside_thw",
    "Vantage Vue, Wireless: wind_dir_scalar_avg_last_10_min": "wind_10min_avg_dir",
    "Vantage Vue, Wireless: rain_size": "rain_size",
    "Vantage Vue, Wireless: wind_speed_last": "wind_speed",
    "Vantage Vue, Wireless: wet_bulb": "outside_wetbulb",
    "Vantage Vue, Wireless: wind_speed_avg_last_10_min": "wind_10min_avg_speed",
    "Vantage Vue, Wireless: wind_dir_at_hi_speed_last_2_min": "wind_2min_gust_dir",
    "Vantage Vue, Wireless: wind_dir_last": "wind_dir",
    "Vantage Vue, Wireless: rainfall_daily_mm": "rain_daily",
    "Vantage Vue, Wireless: dew_point": "outdoor_dewpoint",
    "Vantage Vue, Wireless: rainfall_last_15_min_mm": "rainfall_15min",
    "Vantage Vue, Wireless: rain_rate_hi_mm": "rainrate_hi",
    "Vantage Vue, Wireless: rain_storm_mm": "rain_storm",
    "Vantage Vue, Wireless: wind_dir_scalar_avg_last_2_min": "wind_2min_avg_dir",
    "Vantage Vue, Wireless: heat_index": "outside_heat_index",
    "Vantage Vue, Wireless: rainfall_last_60_min_mm": "rainfall_60min",
    "Vantage Vue, Wireless: trans_battery_flag": "trans_battery_flag",
    "Vantage Vue, Wireless: rainfall_last_24_hr_mm": "rainfall_24hr",
    "Vantage Vue, Wireless: wind_speed_hi_last_10_min": "wind_10min_gust_speed",
    "Vantage Vue, Wireless: rainfall_year_mm": "rainfall_yearly",
    "Vantage Vue, Wireless: wind_dir_scalar_avg_last_1_min": "wind_1min_avg_dir",
    "Vantage Vue, Wireless: temp": "outside_temp",
    "Vantage Vue, Wireless: wind_speed_avg_last_2_min": "wind_2min_avg_speed",
    "Vantage Vue, Wireless: rainfall_monthly_mm": "rainfall_monthly",
    "Vantage Vue, Wireless: rain_storm_last_mm": "rainfall_last_storm",
    "Vantage Vue, Wireless: wind_speed_avg_last_1_min": "wind_1min_avg_speed",
    "Vantage Vue, Wireless: rain_rate_last_mm": "rainrate",
    "Vantage Vue, Wireless: rain_rate_hi_last_15_min_mm": "rainrate_15min",
}

setInterval(getData, readIntervalSeconds * 1000)
getData()