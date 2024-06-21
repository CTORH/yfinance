function YTickersJSON() {
  var ss = SpreadsheetApp.getActive();
  var settingsSheet = ss.getSheetByName("Settings");

  const fn = function(v) {
    return [ v ];
  };

  //Ticker array
  const tickers =  [
    'SXR8.DE',
    'SXRV.DE',
    'ABEA.DE',
    'MSF.DE',
    'QDVE.DE'
  ]

  let currentPrices = [];
  let closePrices = [];
  let urls = [];

  for(var i=0; i<tickers.length; i++) {
    urls[i] = `https://query1.finance.yahoo.com/v8/finance/chart/${tickers[i]}`;
  }

  const res = UrlFetchApp.fetchAll(urls);

  for(var i=0; i<res.length; i++) {
    const contentText = res[i].getContentText();
    const data = JSON.parse(contentText);
    
    // Check if the result exists and has data
    if (data && data.chart && data.chart.result && data.chart.result.length > 0) {
      const regularMarketPrice = data.chart.result[0].meta.regularMarketPrice;
      currentPrices[i] = regularMarketPrice;

      const previousClose = data.chart.result[0].meta.previousClose;
      closePrices[i] = previousClose;
    } else {
      console.log("Error: Unable to retrieve data.");
      return null;
    }
  }

  //Write current regularMarketPrice
  rgMyRange = settingsSheet.getRange("D2:D6"); //Modify cells for results
  rgMyRange.setValues(currentPrices.map(fn));

  //Write current regularMarketPreviousClose
  rgMyRange = settingsSheet.getRange("F2:F6"); //Modify cells for results
  rgMyRange.setValues(closePrices.map(fn));

  //Write last updated 
  const lastupdate = Utilities.formatDate(new Date(), "GMT+3", "dd.MM.yyyy hh:mm:ss") //Modify DateTime format
  rgMyRange = settingsSheet.getRange("A10"); //Modify cell
  rgMyRange.setValues([[lastupdate]]);

  console.log('Success')
  return 0;

}
