// main.js

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".dropdown-trigger");
  var instances = M.Dropdown.init(elems);
});

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems);
});

$(function () {
  $("#show_chart").on("click", function () {
    // Function to update the chart
    function updateChart() {
      $.ajax({
        url: "/visulisation/data-by-location-avg",
        method: "GET",
        timeout: 10000, // Timeout in milliseconds (e.g., 5 seconds)
        success: function (data) {
          console.log("AVG WQI location", data);

          // Clear previous chart if exists
          d3.select("#shape1").selectAll("*").remove();

          // Set up the SVG container
          const svg = d3.select("#shape1");
          const margin = { top: 20, right: 20, bottom: 30, left: 40 };
          const width = 800 - margin.left - margin.right;
          const height = 400 - margin.top - margin.bottom;

          // Create a group element and translate it to leave space for margins
          const g = svg
            .append("g")
            .attr(
              "transform",
              "translate(" + margin.left + "," + margin.top + ")"
            );

          // Set up the scales
          const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d._id))
            .range([0, width])
            .padding(0.1);

          const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.averageWQI)])
            .range([height, 0]);

          // Draw the bars
          g.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => xScale(d._id))
            .attr("y", (d) => yScale(d.averageWQI))
            .attr("width", xScale.bandwidth())
            .attr("height", (d) => height - yScale(d.averageWQI));

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
    }

    // Call the updateChart function initially
    updateChart();

    // Update the chart every second
    setInterval(updateChart, 5000);
  });

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

  // get data by location
  $("#locationFilterDropdown").on("change", function (e) {
    var selectedLocation = $(this).val();
    console.log("Selected location:", selectedLocation);
    e.preventDefault(); // Prevent the default link behavior

    // Make an AJAX request to get sorted data
    $.get(
      "/visulisation/data-by-location",
      { selectedLocation },
      function (data) {
        //console.log(data);
        // Update the table with the sorted data
        updateTable(data);
      }
    );
  });
  
  // get data by location
  $("#locationFilter").on("change", function (e) {
    var selectedLocation = $(this).val();
    console.log("Selected location:", selectedLocation);
    e.preventDefault(); // Prevent the default link behavior

    // Make an AJAX request to get sorted data
    $.get(
      "/visulisation/data-by-location-avg-wqi",
      { selectedLocation },
      function (data) {
        // Parse the date string into JavaScript Date objects
        data.forEach((d) => {
          d._id = new Date(d._id);
        });

        // Set up the SVG container dimensions
        const margin = { top: 20, right: 30, bottom: 50, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        // Set up scales for x and y axes
        const xScale = d3
          .scaleTime()
          .domain(d3.extent(data, (d) => d._id))
          .range([0, width]);

        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.averageWQI)])
          .range([height, 0]);

        // Set up line generator
        const line = d3
          .line()
          .x((d) => xScale(d._id))
          .y((d) => yScale(d.averageWQI));

          // Clear previous chart
        d3.select("#chart-container svg").remove();

        // Create SVG container
        const svg = d3
          .select("#chart-container")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr(
            "transform",
            "translate(" + margin.left + "," + margin.top + ")"
          );

        // Draw x-axis
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale));

        // Draw y-axis
        svg.append("g").call(d3.axisLeft(yScale));

        // Draw line
        svg
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 2)
          .attr("d", line);

          // Add x-axis label
        svg
          .append("text")
          .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .text("Date");

        // Add y-axis
        svg
          .append("g")
          .call(d3.axisLeft(yScale));

        // Add y-axis label
        svg 
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .text("Average WQI");

        console.log(data);
        // Update the table with the sorted data
        updateLocationAvgWqiTable(data);
      }
    );
  });

  // Function to update the table with new data
  function updateLocationAvgWqiTable(data) {
    const tbody = $("table tbody");
    tbody.empty(); // Clear the existing rows
    
    data.forEach((item) => {
      const row = `<tr>
        <td>${new Date(item._id).toLocaleDateString()}</td>
        <td>${item.averageWQI.toFixed(2)}</td>
      </tr>`;
      
      tbody.append(row);
    });
  }
  // get data by date range
  $("#submitFilters").on("click", function (e) {
    var startDate = $("#startDate").val();
    var endDate = $("#endDate").val();

    e.preventDefault(); // Prevent the default link behavior

    // Make an AJAX request to get sorted data
    $.get(
      "/visulisation/data-by-date-range",
      { startDate, endDate },
      function (data) {
        console.log(data);
        // Update the table with the sorted data
        updateTable(data);
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
