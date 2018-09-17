// Set the cursor on the search bar
$("#inlineFormCustomSelect").focus();

// Search for student ID based on an index number (Using 0 for now)
$.get("/students", function (data) {
  if (data != undefined) {
    var student = {
      id: data[0]._id,
      studentName: data[0].studentName,
      firstName: data[0].firstName,
      lastName: data[0].lastName,
      classNumber: data[0].classNumber,
    }
    // Add Welcome message to page with student name
    console.log(student.studentName)
    var welcome = $("<div>");
    welcome.text("Welcome " + student.studentName);
    welcome.attr("id", student.id)
    $(".welcome").append(welcome);
  }
}).then(function (data) {
  // Do something
});


// Create table variable and header
var table = $("<table>");
table.addClass("table");
var tableHead = $("<thead>");
var tableRow = $("<tr>");
// Create column names
tableRow.append($("<th scope='col'>Symbol</th>"));
tableRow.append($("<th scope='col'>Name</th>"));
tableRow.append($("<th scope='col'>Exchange</th>"));
tableRow.append($("<th scope='col'>Current Price</th>"));
tableRow.append($("<th scope='col'>$ Change</th>"));
tableRow.append($("<th scope='col'>% Change</th>"));
// Add heads and rows to the table
tableHead.append(tableRow);
table.append(tableHead);
var tableBody = $("<tbody>");
tableBody.addClass("tableBody");
table.append(tableBody);
// Add Table to the page
$(".stockInfo").append(table);

// On click function for searching for new stocks
$("#submit").on("click", function () {
  var ticker = ($("#inlineFormCustomSelect")[0].value)
  // Using a RegEx Pattern to format the ticker symbol
  ticker = ticker.replace(/\s+/g, "").toUpperCase();

  // Get request to the stock api for the searched ticker
  $.get("/api/" + ticker, function (data) {
    // Just grab the ticker portion of the URL - drop the '/api/'
    var ticker = this.url.substr(5);
    // if successful, create object with values
    if (data[ticker] != undefined) {
      var stock = {
        symbol: data[ticker].quote.symbol,
        name: data[ticker].quote.companyName,
        exchange: data[ticker].quote.primaryExchange,
        currentPrice: data[ticker].quote.close,
        dollarChange: data[ticker].quote.change,
        percentChange: (data[ticker].quote.changePercent * 100).toFixed(2) + '%'
      }
      // Create new row for each search
      var tableRow = $("<tr>");
      tableRow.addClass(data[ticker].quote.symbol);
      tableRow.addClass("table-row");
      tableRow.attr("value", data[ticker].quote.symbol);

      // Set on click function for each row of the table
      tableRow.on("click", function () {
        // Pull ticker from attr value
        var tickerSelected = $(this).attr("value");

        // Add a box for purchasing
        var purchaseBox = $("<div>");
        purchaseBox.addClass("purchase-box");
        var message = $("<div>");
        message.text("Purchase " + tickerSelected + "?");

        var form = $("<form>");
        form.addClass("form-inline");

        var inputForm = $("<input>");
        inputForm.addClass("form-control");
        inputForm.attr("type", "text");
        inputForm.attr("id", "buyform");
        inputForm.attr("placeholder", "Number of shares");

        // Create two buttons. One to buy, and one to add to watch list
        var BuyButton = $("<button>");
        BuyButton.attr("type", "button");
        BuyButton.addClass("btn btn-primary");
        BuyButton.attr("id", "orderButton");
        BuyButton.text("Buy");

        // Set on click function for Buy button
        BuyButton.on("click", function () {
          // Pull # shares from form
          var numberShares = $("#buyform").val();

          // Create transaction object. This will be passed to the POST and added to the db
          var transaction = {
            type: 'buy',
            numberShares: numberShares,
            tickerSelected: tickerSelected
          }

          // Grad the student id (THERE IS A BETTER WAY TO DO THIS)
          $.get("/students", function (data) {
            if (data != undefined) {
              var student = {
                id: data[0]._id,
                studentName: data[0].studentName,
                firstName: data[0].firstName,
                lastName: data[0].lastName,
                classNumber: data[0].classNumber,
              }
              // ajax call to the server to add transaction to db
              // When the user clicks buy, the server will look up the price again, to get most up to date
              $.ajax({
                  method: "POST",
                  url: "/buy/" + student.id,
                  data: transaction
                })
                // With that done
                .then(function (data) {
                  // Log the response
                  console.log(data);
                });
            }
          }).then(function (data) {
            // Log the response
          });
        });

        // Create the watch button
        var watchButton = $("<button>");
        watchButton.attr("type", "button");
        watchButton.addClass("btn btn-primary");
        watchButton.attr("id", "orderButton");
        watchButton.text("Watch");

        // Set the on click event for the watch button
        watchButton.on("click", function () {
          var watchlist = {
            tickerSelected: tickerSelected
          }
          // Once again, calling the student lookup for the student id (FIND A BETTER WAY)
          $.get("/students", function (data) {
            if (data != undefined) {
              var student = {
                id: data[0]._id,
                studentName: data[0].studentName,
                firstName: data[0].firstName,
                lastName: data[0].lastName,
                classNumber: data[0].classNumber,
              }
              // ajax call to the server to add ticker to watchlist db
              $.ajax({
                  method: "POST",
                  url: "/watch/" + student.id,
                  data: watchlist
                })
                // With that done
                .then(function (data) {
                  // Log the response
                  console.log(data);
                });
            }
          });
        });
        // Adding the forms and buttons to the purchase box
        form.append(message);
        form.append(inputForm);
        form.append(BuyButton);
        form.append(watchButton);
        purchaseBox.append(form);
        // Placing the purchase box on the page
        $(".purchaseStock").html(purchaseBox);
      });
      // For each property in the Stock object, add data to the row
      for (var property in stock) {
        tableRow.append($("<td>" + stock[property] + "</td>"));
      }
      // Append row to table body, clear search box, and reposition cursor
      $(".tableBody").append(tableRow);
      $("#inlineFormCustomSelect").val("");
      $("#inlineFormCustomSelect").focus();
    } else {
      alert("Stock not found");
    }
  });
});
