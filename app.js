const client = require('./api')()
const moment = require('moment-timezone')
const fs = require('fs')

const stationId = process.env.STATION_ID || 96918

const sheetName = process.env.SHEET_NAME || 'weatherlink-data.csv'
const readIntervalSeconds = process.env.READ_INTERVAL || 12

async function getData() {
    try {
        let data = await client.getStationCurrentData(stationId)
        writeToCsv(data.data)
        console.log('Successfully wrote new line.')
    } catch(e) {
        console.error('Error retrieving and writing data.')
        console.error(e.response.data)
    }
}

function writeToCsv(data) {
    let rowData = { 'Timestamp': moment.unix(data.generated_at).tz('America/Vancouver').format() }
    let sensors = {}
    data.sensors.map(s =>sensors[s.lsid] = s)
    
    console.log('Writing data to CSV')
    Object.keys(idToNameMap).map(id => {
        let productName = idToNameMap[id]
        sensors[id].data.map(dataItem => {
            Object.keys(dataItem).map(rowName => {
                let rowValue = dataItem[rowName]
                if (rowValue != null && ['ts', 'rain_storm_start_time', 'rain_storm_last_end_at', 'rain_storm_last_start_at'].includes(rowName)) {
                    let timedata = moment.unix(rowValue).tz('America/Vancouver').format()
                    rowData[`${productName}: ${rowName}`] = timedata
                } else {
                    rowData[`${productName}: ${rowName}`] = rowValue
                }
            })
        })
    })

    fs.appendFileSync(sheetName, columns.map(c => rowData[c]).join(',') + "\n")
}


let idToNameMap = {
    343963: "WeatherLink LIVE Health",
    343964: "Barometer",
    343965: "Inside Temp/Hum",
    343966: "Vantage Vue, Wireless",
}

const columns = [
    'Timestamp',
    'WeatherLink LIVE Health: battery_voltage',
    'WeatherLink LIVE Health: wifi_rssi',
    'WeatherLink LIVE Health: network_error',
    'WeatherLink LIVE Health: ip_v4_gateway',
    'WeatherLink LIVE Health: bluetooth_version',
    'WeatherLink LIVE Health: bgn',
    'WeatherLink LIVE Health: rapid_records_sent',
    'WeatherLink LIVE Health: firmware_version',
    'WeatherLink LIVE Health: uptime',
    'WeatherLink LIVE Health: touchpad_wakeups',
    'WeatherLink LIVE Health: ip_v4_address',
    'WeatherLink LIVE Health: bootloader_version',
    'WeatherLink LIVE Health: local_api_queries',
    'WeatherLink LIVE Health: rx_bytes',
    'WeatherLink LIVE Health: health_version',
    'WeatherLink LIVE Health: radio_version',
    'WeatherLink LIVE Health: espressif_version',
    'WeatherLink LIVE Health: ip_address_type',
    'WeatherLink LIVE Health: dns_type_used',
    'WeatherLink LIVE Health: link_uptime',
    'WeatherLink LIVE Health: network_type',
    'WeatherLink LIVE Health: input_voltage',
    'WeatherLink LIVE Health: tx_bytes',
    'WeatherLink LIVE Health: ts',
    'Barometer: bar_absolute',
    'Barometer: bar_sea_level',
    'Barometer: bar_offset',
    'Barometer: bar_trend',
    'Barometer: ts',
    'Inside Temp/Hum: temp_in',
    'Inside Temp/Hum: heat_index_in',
    'Inside Temp/Hum: dew_point_in',
    'Inside Temp/Hum: ts',
    'Inside Temp/Hum: hum_in',
    'Vantage Vue, Wireless: rx_state',
    'Vantage Vue, Wireless: wind_speed_hi_last_2_min',
    'Vantage Vue, Wireless: hum',
    'Vantage Vue, Wireless: wind_dir_at_hi_speed_last_10_min',
    'Vantage Vue, Wireless: wind_chill',
    'Vantage Vue, Wireless: rain_rate_hi_last_15_min_clicks',
    'Vantage Vue, Wireless: thw_index',
    'Vantage Vue, Wireless: wind_dir_scalar_avg_last_10_min',
    'Vantage Vue, Wireless: rain_size',
    'Vantage Vue, Wireless: uv_index',
    'Vantage Vue, Wireless: wind_speed_last',
    'Vantage Vue, Wireless: rainfall_last_60_min_clicks',
    'Vantage Vue, Wireless: wet_bulb',
    'Vantage Vue, Wireless: rainfall_monthly_clicks',
    'Vantage Vue, Wireless: wind_speed_avg_last_10_min',
    'Vantage Vue, Wireless: wind_dir_at_hi_speed_last_2_min',
    'Vantage Vue, Wireless: rainfall_daily_in',
    'Vantage Vue, Wireless: wind_dir_last',
    'Vantage Vue, Wireless: rainfall_daily_mm',
    'Vantage Vue, Wireless: rain_storm_last_clicks',
    'Vantage Vue, Wireless: tx_id',
    'Vantage Vue, Wireless: rain_storm_last_start_at',
    'Vantage Vue, Wireless: rain_rate_hi_clicks',
    'Vantage Vue, Wireless: rainfall_last_15_min_in',
    'Vantage Vue, Wireless: rainfall_daily_clicks',
    'Vantage Vue, Wireless: dew_point',
    'Vantage Vue, Wireless: rainfall_last_15_min_mm',
    'Vantage Vue, Wireless: rain_rate_hi_in',
    'Vantage Vue, Wireless: rain_storm_clicks',
    'Vantage Vue, Wireless: rain_rate_hi_mm',
    'Vantage Vue, Wireless: rainfall_year_clicks',
    'Vantage Vue, Wireless: rain_storm_in',
    'Vantage Vue, Wireless: rain_storm_last_end_at',
    'Vantage Vue, Wireless: rain_storm_mm',
    'Vantage Vue, Wireless: wind_dir_scalar_avg_last_2_min',
    'Vantage Vue, Wireless: heat_index',
    'Vantage Vue, Wireless: rainfall_last_24_hr_in',
    'Vantage Vue, Wireless: rainfall_last_60_min_mm',
    'Vantage Vue, Wireless: trans_battery_flag',
    'Vantage Vue, Wireless: rainfall_last_60_min_in',
    'Vantage Vue, Wireless: rain_storm_start_time',
    'Vantage Vue, Wireless: rainfall_last_24_hr_mm',
    'Vantage Vue, Wireless: rainfall_year_in',
    'Vantage Vue, Wireless: wind_speed_hi_last_10_min',
    'Vantage Vue, Wireless: rainfall_last_15_min_clicks',
    'Vantage Vue, Wireless: rainfall_year_mm',
    'Vantage Vue, Wireless: wind_dir_scalar_avg_last_1_min',
    'Vantage Vue, Wireless: temp',
    'Vantage Vue, Wireless: wind_speed_avg_last_2_min',
    'Vantage Vue, Wireless: solar_rad',
    'Vantage Vue, Wireless: rainfall_monthly_mm',
    'Vantage Vue, Wireless: rain_storm_last_mm',
    'Vantage Vue, Wireless: wind_speed_avg_last_1_min',
    'Vantage Vue, Wireless: thsw_index',
    'Vantage Vue, Wireless: rainfall_monthly_in',
    'Vantage Vue, Wireless: rain_rate_last_mm',
    'Vantage Vue, Wireless: rain_rate_last_clicks',
    'Vantage Vue, Wireless: rainfall_last_24_hr_clicks',
    'Vantage Vue, Wireless: rain_storm_last_in',
    'Vantage Vue, Wireless: rain_rate_last_in',
    'Vantage Vue, Wireless: rain_rate_hi_last_15_min_mm',
    'Vantage Vue, Wireless: rain_rate_hi_last_15_min_in',
    'Vantage Vue, Wireless: ts',
]


if (!fs.existsSync(sheetName)) {
    fs.appendFileSync(sheetName, columns.join(',') + "\n")
}

setInterval(getData, readIntervalSeconds * 1000)