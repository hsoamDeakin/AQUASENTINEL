// main.js

$(function () {
  // Sortable column and direction
  let sortColumn = null;
  let sortDirection = 'asc';

  $("#startProducerButton").on("click", function () {
    // Call the startProducer API
    $.get("/streaming/start-producer")
      .done(function (data) {
        console.log("Producer started successfully", data);
      })
      .fail(function (error) {
        console.error("Error starting Producer:", error.responseText);
      });
  });

  $("#startConsumerButton").on("click", function () {
    // Call the startConsumer API
    $.get("/streaming/start-consumer")
      .done(function (data) {
        console.log("Consumer started successfully", data);
      })
      .fail(function (error) {
        console.error("Error starting Consumer:", error.responseText);
      });
  });

  $('#refreshPageButton').on('click', function() {
    location.reload(true); // Pass true to force a reload from the server
  });

  $('.sortable').on('click', function(e) {
    e.preventDefault(); // Prevent the default link behavior

    const clickedColumn = $(e.currentTarget).data('column'); // Use e.currentTarget instead of this
    console.log(clickedColumn);
    // Toggle sort direction if clicking the same column
    if (sortColumn === clickedColumn) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = clickedColumn;
      sortDirection = 'asc';
    }
    // Make an AJAX request to get sorted data
    $.get('/visulisation/sort-data', { sortColumn, sortDirection }, function(sortedData) {
      console.log(sortColumn)
      console.log(sortedData)
      // Update the table with the sorted data    
      updateTable(sortedData);
    });
  });
  
// Function to update the table with new data
function updateTable(data) {
  const tbody = $('table tbody');
  tbody.empty(); // Clear the existing rows

  data.forEach((item) => {
    const row = `<tr>
      <td>${item.key}</td>
      <td>${item.value.location.name}</td>
      <td>[${item.value.location.lat}, ${item.value.location.lon}]</td>
      <td>${item.value.data.ph.toFixed(2)}</td>
      <td>${item.value.data.Organic_carbon.toFixed(2)}</td>
      <td>${item.value.data.Turbidity.toFixed(2)}</td>
      <td>${item.value.data.Solids.toFixed(2)}</td>
      <td>${item.value.data.Trihalomethanes.toFixed(2)}</td>
      <td>${item.value.wqi.toFixed(2)}</td>
    </tr>`;

    tbody.append(row);
  });
}


});

// document.addEventListener('DOMContentLoaded', function() {
//   var elems = document.querySelectorAll('.fixed-action-btn');
//   var instances = M.FloatingActionButton.init(elems, options);
// });

// Or with jQuery

$(document).ready(function(){
  $('.fixed-action-btn').floatingActionButton();
});