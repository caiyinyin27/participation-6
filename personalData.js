(function(){
const personalData = {
  "name": "Education",
  "children": [
    {
      "name": "Degrees",
      "children": [
        {
          "name": "Heung To Middle School (S2-S6)"
        },
        {
          "name": "2018: DSE "
        },
        {
          "name": "2019-2021: HKUSPACE"
        },
        {
          "name": "2021-Present: City University of Hong Kong "
        }
      ]
    },
    {
      "name": "Courses",
      "children": [
        {
          "name": "GE2413T03 Wrd,Sound,Image:Wrt fr Crt Mda"
        }
      ]
    },
    {
      "name": "Key Assignments",
      "children": [
        {
          "name": "Peer Assessment of Proposal drafts"
        },
        {
          "name": "proposal for a project idea"
        }
      ]
    },
    {
      "name": "Self Learning",
      "children": [
        {
          "name": "New Media Art"
        }
      ]
    },
    {
      "name": "SM1103AC02 Introduction to Media Compt'ng",
      "children": []
    },
    {
      "name": "Certificates",
      "children": [
        {
          "name": "Talent Development "
        }
      ]
    },
    {
      "name": "Nodes",
      "children": [
        {
          "name": "Skills Gained",
          "children": [
            {
              "name": "Illustrator"
            },
            {
              "name": "InDesign"
            },
            {
              "name": "Microsoft Office Suite (Word, Excel, PowerPoint, Outlook)"
            }
          ]
        },
        {
          "name": "Mentors",
          "children": [
            {
              "name": "Team Captain"
            },
            {
              "name": "Artistic Director"
            }
          ]
        },
        {
          "name": "Grades",
          "children": [
            {
              "name": "DSE - 22"
            }
          ]
        }
      ]
    }
  ]
};

// Responsive dimensions based on content
// CHANGED: Reduced margin.top from 600 to 50 to optimize space (PDF: Resolution beats immersion)
const margin = { top: 50, right: 300, bottom: 40, left: 80 };
const treeLayout = d3.tree().nodeSize([50, 250]); 

// BUG FIX: Changed 'educationData' (undefined) to 'personalData'
const root = d3.hierarchy(personalData); 
treeLayout(root);

// Calculate dynamic dimensions
const descendants = root.descendants();
const maxDepth = root.height;
const totalNodes = descendants.length;
const minWidth = totalNodes * 250 + margin.left + margin.right; 
const minHeight = (maxDepth + 1) * 50 + margin.top + margin.bottom; 

const width = Math.min(minWidth, window.innerWidth * 0.9); 
const height = Math.min(minHeight, 1200); 

// Create SVG container
const svg = d3.select("#vis-personalData")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Apply tree layout
const treeData = treeLayout(root);

// Links
svg.selectAll(".link")
    .data(treeData.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 2);

// Nodes
const nodes = svg.selectAll(".node")
    .data(treeData.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.y},${d.x})`);

// Circles
nodes.append("circle")
    .attr("r", 6)
    .attr("fill", "#1a73e8");

// Text labels with improved wrapping
nodes.append("text")
    .attr("dy", "0.35em")
    .attr("x", d => d.children ? -15 : 15) 
    .attr("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name)
    .style("font-size", "10px")
    .attr("fill", "#333")
    .call(wrap, 300); 

// Tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background", "#fff")
    .style("border", "1px solid #ccc")
    .style("padding", "5px")
    .style("border-radius", "3px");

// Interactivity
nodes.on("mouseover", function(event, d) {
    d3.select(this).select("circle").attr("fill", d3.rgb("#1a73e8").brighter(0.5));
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip.html(`Node: ${d.data.name}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
})
.on("mouseout", function() {
    d3.select(this).select("circle").attr("fill", "#1a73e8");
    tooltip.transition().duration(500).style("opacity", 0);
});

// Title (Commented out as h2 is in HTML)
// svg.append("text").attr("x", width / 2).attr("y", -10)...

// Text wrapping function
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.2, 
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}
})();

// ... (前面代碼不變) ...

// Links (線條)
svg.selectAll(".link")
    // ...
    .attr("stroke", "#333") // 深灰色線條，低調
    .attr("stroke-width", 1.5);

// Circles (節點)
nodes.append("circle")
    .attr("r", 6)
    .attr("fill", "#00d1ff") // Electric Blue 節點
    .attr("stroke", "#fff")
    .attr("stroke-width", 1);

// Text (文字)
nodes.append("text")
    // ...
    .attr("fill", "#f5f5f5") // 白色文字
    .style("font-family", "Inter, sans-serif"); // 匹配新字體