function YTickers() {
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
    urls[i] = `https://finance.yahoo.com/quote/${tickers[i]}`;
  }

  const res = UrlFetchApp.fetchAll(urls);


  for(var i=0; i<res.length; i++) {
    const contentText = res[i].getContentText();

    //get Current price
    const regex = new RegExp(`<fin-streamer\\b[^>]*\\bdata-symbol="${tickers[i].replace('.', '\\.')}"[^>]*\\bdata-field="regularMarketPrice"[^>]*><span>(.*?)<\/span><\\/fin-streamer>`, 'g');
    const matches = [];
    let match;
    while ((match = regex.exec(contentText)) !== null) {
      matches.push(match[1]);
    }
    currentPrices[i] = matches[0];

    //get Previous close price
    const regex_close = new RegExp(`<fin-streamer\\b[^>]*\\bdata-symbol="${tickers[i].replace('.', '\\.')}"[^>]*\\bdata-field="regularMarketPreviousClose"[^>]*>(.*?)<\\/fin-streamer>`, 'g');
    const dataValueRegex = /data-value="([^"]*)"/;

    const _matches = [];
    let _match;
    
    while ((_match = regex_close.exec(contentText)) !== null) {
      const fullMatch = _match[0];
      const dataValueMatch = dataValueRegex.exec(fullMatch);
      if (dataValueMatch) {
        _matches.push(dataValueMatch[1]);
      }
    }
  
    closePrices[i] = _matches[0];
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
