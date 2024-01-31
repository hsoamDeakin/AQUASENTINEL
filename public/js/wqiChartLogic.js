document.addEventListener('DOMContentLoaded', function() {
    // Function to update the chart with new data
    function updateChart(data) {
        // Clear the existing chart before redrawing
        d3.select("#wqiChart svg").remove();

        // Parse the date and wqi values from the response
        const parsedData = data.map(d => ({
            timestamp: new Date(d.key),
            wqi: +d.value.wqi
        }));

        // Sort data by timestamp
        parsedData.sort((a, b) => a.timestamp - b.timestamp);

        // Set the dimensions and margins of the graph
        const margin = { top: 20, right: 30, bottom: 30, left: 60 },
              width = 960 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

        // Append the svg object to the body of the page
        const svg = d3.select("#wqiChart")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add X axis
        const x = d3.scaleTime()
          .domain(d3.extent(parsedData, d => d.timestamp))
          .range([0, width]);
        svg.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
          .domain([0, d3.max(parsedData, d => d.wqi)])
          .range([height, 0]);
        svg.append("g")
          .call(d3.axisLeft(y));

        // Add the line
        svg.append("path")
          .datum(parsedData)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", d3.line()
            .x(d => x(d.timestamp))
            .y(d => y(d.wqi))
          );
    }

    // Initial fetch to populate the chart with all data
    fetch('/api/data-by-time-range-and-location')
      .then(response => response.json())
      .then(data => {
        updateChart(data); // Draw the initial chart
      })
      .catch(error => console.error('Error fetching data:', error));

    // Event listener for the filter button
    document.getElementById('filterButton').addEventListener('click', function() {
        const location = document.getElementById('locationSelect').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        // Construct the query string for filters
        let queryString = '';
        if (location) queryString += `location=${encodeURIComponent(location)}&`;
        if (startDate) queryString += `startTime=${encodeURIComponent(startDate)}&`;
        if (endDate) queryString += `endTime=${encodeURIComponent(endDate)}`;
        if (queryString.endsWith('&')) {
            queryString = queryString.slice(0, -1); // Remove the trailing '&'
        }
        queryString = queryString ? '?' + queryString : ''; // Add the '?' only if there are query parameters

        // Fetch the filtered data and update the chart
        fetch(`/api/data-by-time-range-and-location${queryString}`)
          .then(response => response.json())
          .then(filteredData => {
            updateChart(filteredData); // Redraw the chart with the filtered data
          })
          .catch(error => console.error('Error fetching filtered data:', error));
    });
});
