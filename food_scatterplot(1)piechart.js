// Pie Chart – Advertising Skills Distribution (Updated Version)
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 最新广告技能比例 ---
    const data = [
        { label: 'Brand Storytelling',   value: 18 },
        { label: 'Social Media Content', value: 32 },
        { label: 'Video Editing',        value: 25 },
        { label: 'Photography',          value: 15 },
        { label: 'UI / Visual Design',   value: 10 }
    ];

    // --- 2. 科技感霓虹色 ---
    const colors = d3.scaleOrdinal()
        .domain(data.map(d => d.label))
        .range(['#00FFFF', '#FF00FF', '#4CAF50', '#FFC300', '#9966FF']);

    // --- 3. SVG 基本设置 ---
    const w = 500, h = 500, r = Math.min(w, h) / 2;
    const svg = d3.select('#pie-chart')
        .attr('width', w)
        .attr('height', h)
        .append('g')
        .attr('transform', `translate(${w / 2}, ${h / 2})`);

    // --- 4. 饼图生成器 ---
    const pie = d3.pie()
        .sort(null)
        .value(d => d.value);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(r);

    const arcHover = d3.arc()
        .innerRadius(0)
        .outerRadius(r + 10);

    // --- 5. 绘制扇形 ---
    const arcs = svg.selectAll('.arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc');

    arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => colors(d.data.label))
        .on('mouseover', function () {
            d3.select(this)
                .transition()
                .duration(150)
                .attr('d', arcHover);
        })
        .on('mouseout', function () {
            d3.select(this)
                .transition()
                .duration(150)
                .attr('d', arc);
        });

    // --- 6. 百分比文字 ---
    arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '.35em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', 'white')
        .style('font-weight', 'bold')
        .text(d => `${d.data.value}%`);

    // --- 7. 图例 ---
    const legend = d3.select('#pie-legend');
    const items = legend.selectAll('.legend-item')
        .data(data)
        .enter()
        .append('div')
        .attr('class', 'legend-item');

    items.append('div')
        .attr('class', 'color')
        .style('background-color', d => colors(d.label));

    items.append('span')
        .text(d => `${d.label} (${d.value}%)`);
});
