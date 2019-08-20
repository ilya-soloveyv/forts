const express = require('express')
const app = express()
const CronJob = require('cron').CronJob
const fetchUrl = require("fetch").fetchUrl
const parseString = require('xml2js').parseString
app.set('view engine', 'pug')

const data = {}
data.usd = 0
data.rts = 0

app.get('/', (req, res) => {
  res.render('hello', data)
})

new CronJob('*/5 * * * * *', async function() {
  fetchUrl("http://www.cbr.ru/scripts/XML_daily.asp", function(error, meta, body){
    parseString(body, function (err, result) {
      result.ValCurs.Valute.forEach(element => {
        if (element.CharCode[0] == 'USD') {
          data.usd = parseFloat(element.Value[0].replace(',', '.'))
        }
      })
    })
  })
  fetchUrl("https://iss.moex.com/iss/engines/futures/markets/forts/boards/RFUD/securities/RIU9.jsonp", function(error, meta, body){
    var result = JSON.parse(body)
    data.rts = result.marketdata.data[0][8]
  })
}, null, true, 'America/Los_Angeles')


app.listen(3000, () => {
  console.log('Server started')
})