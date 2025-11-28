(function() {
    const data = [
        { year: 2020, type: "Painting", count: 3 },
        { year: 2020, type: "Sculpture", count: 6 },
        { year: 2020, type: "Digital Art", count: 4 },
        { year: 2021, type: "Painting", count: 7 },
        { year: 2021, type: "Photography", count: 5 },
        { year: 2021, type: "Digital Art", count: 2 },
        { year: 2022, type: "Sculpture", count: 9 },
        { year: 2022, type: "Digital Art", count: 5 },
        { year: 2023, type: "Painting", count: 6 },
        { year: 2023, type: "Photography", count: 4 },
        { year: 2023, type: "Sculpture", count: 3 },
        { year: 2023, type: "Digital Art", count: 7 }
    ];

    // Precompute cumulative data
    const years = [2020, 2021, 2022, 2023];
    const types = [...new Set(data.map(d => d.type))];
    const cumulByType = {};
    types.forEach(t => cumulByType[t] = 0);
    const cumulData = [];
    years.forEach(year => {
        types.forEach(type => {
            const entry = data.find(d => d.year === year && d.type === type);
            const count = entry ? entry.count : 0;
            cumulByType[type] += count;
            if (cumulByType[type] > 0) {
                cumulData.push({ year, type, count, cumul: cumulByType[type] });
            }
        });
    });

    // Set up dimensions and margins
    const margin = { top: 50, right: 20, bottom: 50, left: 120 }; // Increased top margin for title
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Create SVG container
    const visContainer = d3.select("#vis-scatterplot");
    const svg = visContainer
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("background", "#0a0a1a") // Technology style background
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add main title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("fill", "#00ffff")
        .text("Cumulative Hobbies Over Time");

    // Define scales
    const xScale = d3.scaleBand()
        .domain(years)
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleBand()
        .domain(types)
        .range([height, 0])
        .padding(0.1);

    const radiusScale = d3.scaleLinear()
        .domain([0, d3.max(cumulData, d => d.cumul)])
        .range([2, 20]); // Adjusted for larger cumulatives

    const colorScale = d3.scaleOrdinal()
        .domain(types)
        .range(d3.schemeCategory10);

    // Create tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Add X axis
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("fill", "#00ffff"); // Neon color

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .style("text-anchor", "middle")
        .text("Year")
        .style("fill", "#00ffff");

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("fill", "#00ffff");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Type of Hobby")
        .style("fill", "#00ffff");

    // Function to update visualization
    function updateVis(selectedYear) {
        const filtered = cumulData.filter(d => d.year <= selectedYear);

        const circles = svg.selectAll("circle")
            .data(filtered, d => `${d.year}-${d.type}`);

        circles.exit()
            .transition().duration(500)
            .attr("r", 0)
            .remove();

        const enter = circles.enter()
            .append("circle")
            .attr("cx", d => xScale(d.year) + xScale.bandwidth() / 2)
            .attr("cy", d => yScale(d.type) + yScale.bandwidth() / 2)
            .style("fill", d => colorScale(d.type))
            .attr("r", 0)
            .on("mouseover", function(event, d) {
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(`Year: ${d.year}<br>Type: ${d.type}<br>Added This Year: ${d.count}<br>Cumulative: ${d.cumul}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");

                d3.select(this).transition().duration(200).attr("r", radiusScale(d.cumul) * 1.2);
            })
            .on("mouseout", function(event, d) {
                tooltip.transition().duration(500).style("opacity", 0);

                d3.select(this).transition().duration(200).attr("r", radiusScale(d.cumul));
            });

        enter.merge(circles)
            .transition().duration(500)
            .attr("r", d => radiusScale(d.cumul));
    }

    // Initial draw with max year
    updateVis(2023);

    // Append controls
    const controls = visContainer.append("div")
        .style("text-align", "center")
        .style("margin-top", "10px");

    controls.append("label")
        .attr("for", "yearSlider")
        .text("Show cumulative up to year: ");

    const slider = controls.append("input")
        .attr("type", "range")
        .attr("id", "yearSlider")
        .attr("min", "2020")
        .attr("max", "2023")
        .attr("step", "1")
        .attr("value", "2023")
        .on("input", function() {
            const selectedYear = +this.value;
            d3.select("#yearValue").text(selectedYear);
            updateVis(selectedYear);
        });

    const yearValue = controls.append("span")
        .attr("id", "yearValue")
        .text("2023");

    const playButton = controls.append("button")
        .attr("id", "playButton")
        .text("Play Animation")
        .on("click", function() {
            let currentYear = 2020;
            slider.property("value", currentYear);
            yearValue.text(currentYear);
            updateVis(currentYear);

            const interval = setInterval(() => {
                currentYear += 1;
                if (currentYear > 2023) {
                    clearInterval(interval);
                    return;
                }
                slider.property("value", currentYear);
                yearValue.text(currentYear);
                updateVis(currentYear);
            }, 1000); // 1 second per year
        });

    // Add legend table
    const legend = controls.append("table")
        .style("margin-top", "20px")
        .style("border-collapse", "collapse")
        .style("background-color", "black"); // Changed to black

    legend.append("thead")
        .append("tr")
        .selectAll("th")
        .data(["Color", "Type"])
        .enter()
        .append("th")
        .text(d => d)
        .style("padding", "5px")
        .style("border", "1px solid #00ffff")
        .style("color", "#00ffff");

    const legendRows = legend.append("tbody")
        .selectAll("tr")
        .data(types)
        .enter()
        .append("tr");

    legendRows.append("td")
        .append("div")
        .style("width", "20px")
        .style("height", "20px")
        .style("background-color", d => colorScale(d))
        .style("border-radius", "50%");

    legendRows.append("td")
        .text(d => d)
        .style("padding", "5px")
        .style("border", "1px solid #00ffff")
        .style("color", "#fff");

})();


// ... (前面代碼不變) ...

// 修改 SVG 背景為透明或深色
const svg = visContainer
    .append("svg")
    // ...
    .style("background", "transparent") // 讓它透出 CSS 定義的漸變背景
    .append("g")
    // ...

// 修改標題和文字顏色
svg.append("text")
    // ...
    .style("fill", "#f5f5f5") // White title
    .text("Cumulative Hobbies Over Time");

// 修改坐標軸文字顏色
svg.selectAll("text").style("fill", "#a0a0a0"); // Dimmed text

// 修改顏色比例尺 (Color Scale) - 使用 Electric Blue 的變體
const colorScale = d3.scaleOrdinal()
    .domain(types)
    .range(["#00d1ff", "#0088ff", "#ffffff", "#5e5ce6"]); // Electric Blue, Deep Blue, White, Purple

// ... (其餘邏輯不變) ...