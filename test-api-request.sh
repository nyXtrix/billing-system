#!/bin/bash

# Test POST request to verify the save API is working

URL="http://103.235.104.209/richwss.com/Testing/Order.php?LicenseId=101&DatabaseName=Rich_PolyBag_NT12_2000_002&ModuleEntryCode=TRANS-ORDER&CompanyId=1&FinancialPeriod=25-26&RequestType=EntrySave&OrderNo=NEW"

# Sample order data matching the working example format
ORDER_DATA='{
  "OrderHead": {
    "OrderNo": "NEW",
    "OrderDate": "11/23/2025",
    "CustomerName": "TEST CUSTOMER",
    "CustomerMobileNo": "",
    "PartyOrderNo": "TEST-001",
    "PartyOrderDate": "11/23/2025",
    "Measurement": "INCH",
    "Remarks": "Test order from API",
    "TotalOrderPiece": 100,
    "TotalOrderWeight": "50.000",
    "ModuleEntryCode": "TRANS-ORDER",
    "CompanyId": 1,
    "FinancialPeriod": "25-26",
    "UserId_UserHead": 15
  },
  "OrderDetail": [
    {
      "Sno": 1,
      "AutoIncrement": "new_1_12345678",
      "ProductName": "TEST PRODUCT",
      "Width": "10",
      "Length": "12",
      "Flop": "2",
      "Gauge": "150",
      "NoOfBackColors": "",
      "NoOfFrontColors": "",
      "Remarks": "Test item",
      "OrderPiece": "100",
      "OrderWeight": "50.000",
      "RequiredWeight": 0,
      "RateFor": "WEIGHT",
      "Rate": "100"
    }
  ]
}'

echo "Testing API endpoint..."
echo "URL: $URL"
echo ""
echo "Sending POST request..."
echo ""

curl -X POST "$URL" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "OrderData=$ORDER_DATA" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -v

echo ""
echo "Test complete!"
