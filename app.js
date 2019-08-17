const express = require('express')
const app = express()
const CronJob = require('cron').CronJob;
const fetchUrl = require("fetch").fetchUrl

app.get('/', (req, res) => {
  res.send('forts')
})

new CronJob('*/1 * * * *', async function() {
  console.log('--------------------------------')
  console.log(new Date())
  fetchUrl("https://www.cbr-xml-daily.ru/daily_json.js", function(error, meta, body){
    var data = JSON.parse(body)
    console.log(data.Valute.USD.Value);
  })

  fetchUrl("https://iss.moex.com/iss/engines/futures/markets/forts/boards/RFUD/securities/RIU9.jsonp", function(error, meta, body){
    var data = JSON.parse(body)
    console.log(data.marketdata.data[0][8]);
  })
}, null, true, 'America/Los_Angeles')


app.listen(3000, () => {
  console.log('Server started')
})