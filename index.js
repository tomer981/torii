"use strict";

let axios = require("axios");
var Airtable = require("airtable");
var base = new Airtable({ apiKey: "mykey" }).base(
  "appLEmJWAZ0oY93Xl"
);

const exchagesData = [];
const returnFunc = (err, records) => {
  if (err) {
    console.error(err);
    return;
  }
  exchagesData.splice(0, records.length);
  if (exchagesData.length > 0) {
    saveRecords();
    // base("BTC Table").create(slicedArray, returnFunc(err, records));
  }
  records.forEach(function (record) {
    console.log(record.getId());
  });
};

const saveRecords = () => {
  //   do {
  const slicedArray = exchagesData.slice(0, 10);
  base("BTC Table").create(slicedArray, (err, records) => returnFunc(err, records));
  //   } while (exchagesData.length > 0);
};

const btcExchangeRate = () => {
  axios
    .get(
      "https://api.nomics.com/v1/currencies/ticker?key=mykey&ids=BTC"
    )
    .then((response) => {
      const date = new Date(response.data[0].price_timestamp).toISOString();
      const price = Number(response.data[0].price);
      exchagesData.push({
        fields: {
          Time: date,
          Rates: price,
        },
      });

      saveRecords();
    });
};

// deleteRecord();
// btcExchangeRate();
setInterval(btcExchangeRate, 60 * 1000);
