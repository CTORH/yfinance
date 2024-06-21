# Yahoo Finance to Google Sheets connector

There are two options (one to get the data from the HTML page - Code.gs, and another - to get the data from the Yahoo Finance JSON export which is twice as fast - CodeJSON.gs)

## Set up
From Services - add Google Sheets service

Modify to include the proper sheet name (here is Settings)

```
var settingsSheet = ss.getSheetByName("Settings");
```

Modify the ticker array to include the required tickers (See https://finance.yahoo.com for reference)

```
 const tickers =  [
    'SXR8.DE',
    'SXRV.DE',
    'ABEA.DE',
    'MSF.DE',
    'QDVE.DE'
  ]
```

Modify the cell range to receive the results for the current price.

```
  rgMyRange = settingsSheet.getRange("D2:D6"); //Modify cells for results
  rgMyRange.setValues(currentPrices.map(fn));
```


Modify the cell range to receive the results for the closing price.

```
  rgMyRange = settingsSheet.getRange("F2:F6"); //Modify cells for results
  rgMyRange.setValues(closePrices.map(fn));
```

Modify the cell to receive the results for the last updated datetime (last script run time).

```
  rgMyRange = settingsSheet.getRange("A10"); //Modify cell
  rgMyRange.setValues([[lastupdate]]);
```

Modify the used time format.

```
const lastupdate = Utilities.formatDate(new Date(), "GMT+3", "dd.MM.yyyy hh:mm:ss") //Modify DateTime format
```

#### Set a trigger timer for the script to run every minute or hour
