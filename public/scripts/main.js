// main.js

$(function () {
  $("#show_chart").on("click", function () {
    $.ajax({
      url: "/visulisation/data-by-location-avg",
      method: "GET",
      timeout: 10000, // Timeout in milliseconds (e.g., 5 seconds)
      success: function (data) {
        console.log("AVG WQI location", data);
        //       // Set up the SVG container
        // Assuming `data` is an array of objects with properties `averageWQI` and `_id`
// Assuming `data` is an array of objects with properties `averageWQI` and `_id`

const svg = d3.select("#shape1");
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create a group element and translate it to leave space for margins
const g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the scales
const xScale = d3.scaleBand()
  .domain(data.map(d => d._id))
  .range([0, width])
  .padding(0.1);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.averageWQI)])
  .range([height, 0]);

// Draw the bars
g.selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", d => xScale(d._id))
  .attr("y", d => yScale(d.averageWQI))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - yScale(d.averageWQI));

// Add x-axis labels
g.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale))
  .selectAll("text")
  .attr("transform", "rotate(-45)")
  .style("text-anchor", "end");

      },
      error: function (xhr, status, error) {
        console.error("Error fetching data:", error);
        // Handle error
      },
    });
  });

  //   $.get("/api/data-by-location-avg")
  //     .done(function (data) {
  //       console.log("AVG WQI location", data);
  //       // Sample data for the bar chart
  //       const data_items = [10, 20, 30, 40, 50];

  //       // Set up the SVG container
  //       const svg = d3.select("#shape1");

  //       // Set up the scales
  //       const xScale = d3
  //         .scaleBand()
  //         .domain(d3.range(data_items.length))
  //         .range([0, 400])
  //         .padding(0.1);

  //       const yScale = d3
  //         .scaleLinear()
  //         .domain([0, d3.max(data_items)])
  //         .range([0, 200]); // Updated to match height of SVG

  //       // Draw the bars
  //       svg
  //         .selectAll("rect")
  //         .data(data_items)
  //         .enter()
  //         .append("rect") // Append rect elements instead of circles
  //         .attr("class", "bar")
  //         .attr("x", (d, i) => xScale(i))
  //         .attr("y", (d) => 200 - yScale(d)) // Adjust y position based on height of SVG
  //         .attr("width", xScale.bandwidth())
  //         .attr("height", (d) => yScale(d)); // Use yScale to determine height
  //     })
  //     .fail(function (error) {
  //       console.error("Error fetching data:", error.responseText);
  //     });
  // });

  // Sortable column and direction
  let sortColumn = null;
  let sortDirection = "asc";

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

  $("#refreshPageButton").on("click", function () {
    location.reload(true); // Pass true to force a reload from the server
  });

  $(".sortable").on("click", function (e) {
    e.preventDefault(); // Prevent the default link behavior

    const clickedColumn = $(e.currentTarget).data("column"); // Use e.currentTarget instead of this
    console.log(clickedColumn);
    // Toggle sort direction if clicking the same column
    if (sortColumn === clickedColumn) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = clickedColumn;
      sortDirection = "asc";
    }
    // Make an AJAX request to get sorted data
    $.get(
      "/visulisation/sort-data",
      { sortColumn, sortDirection },
      function (sortedData) {
        console.log(sortColumn);
        console.log(sortedData);
        // Update the table with the sorted data
        updateTable(sortedData);
      }
    );
  });

  // Function to update the table with new data
  function updateTable(data) {
    const tbody = $("table tbody");
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

$(document).ready(function () {
  $(".fixed-action-btn").floatingActionButton();
});
