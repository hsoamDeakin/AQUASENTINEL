// main.js

$(function () {
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

});

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = M.FloatingActionButton.init(elems, options);
});

// Or with jQuery

$(document).ready(function(){
  $('.fixed-action-btn').floatingActionButton();
});