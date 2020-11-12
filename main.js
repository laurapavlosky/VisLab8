// download data
d3.csv("driving.csv", d3.autoType).then((data) => {
// create margins, height and width of svg
const margin = ({top: 20, right: 20, bottom: 20, left: 40});
const width = 650 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// create SVG
const svg = d3.select(".connected-scatter")
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// create x and y scales
const xScale = d3.scaleLinear()
    .domain(d3.extent(data, (d) => d.miles))
    .nice()
    .range([0,width]);

const yScale = d3.scaleLinear()
    .domain(d3.extent(data, (d) => d.gas))
    .nice()
    .range([height, 0]);

// create axis
const xAxis = d3.axisBottom()
    .scale(xScale);

const yAxis = d3.axisLeft()
    .scale(yScale);

svg.append('g')
    .attr('class', 'axis x-axis');

svg.append('g')
    .attr('class', 'axis y-axis');

svg.select('.x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .call(g => g.select('.domain').remove())
    .call(g => 
        g.append('text')
        .text("Miles per person per year")
        .attr('fill', 'black')
        .attr('font-weight', 'bold')
        .attr('x', 540)
        .attr('y', -5))
    .selectAll('.tick line')
    .clone()
    .attr('y2', -height)
    .attr('stroke-opacity', 0.1);  

svg.select('.y-axis')
    .call(yAxis)
    .call(g => g.select('.domain').remove())
    .call(g => 
        g.append('text')
        .text("Cost per gallon")
        .attr('fill', 'black')
        .attr('font-weight', 'bold')
        .attr('x', 40)
        .attr('y', -9))
    .selectAll('.tick line')
    .clone()
    .attr('x2', width)
    .attr('stroke-opacity', 0.1);  

// defining line path generator
const line = d3.line()
        .x((d) => xScale(d.miles))
        .y((d) => yScale(d.gas));

// create line path
svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1.5)
    .attr('d', line);


// add circles for data points 
svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('fill', 'white')
    .attr('cx', (d) => xScale(d.miles))
    .attr('cy', (d) => yScale(d.gas))
    .style('stroke', 'black')
    .attr('r', 3);


// generate labels for data points
const label = svg.append('g')
    .attr('class', 'label')
    .attr('font-size', 10)
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', (d) => `translate(${xScale(d.miles)},${yScale(d.gas)})`);

    function position(d) {
        const t = d3.select(this);
        switch (d.side) {
          case "top":
            t.attr("text-anchor", "middle").attr("dy", "-0.7em");
            break;
          case "right":
            t.attr("dx", "0.5em")
              .attr("dy", "0.32em")
              .attr("text-anchor", "start");
            break;
          case "bottom":
            t.attr("text-anchor", "middle").attr("dy", "1.4em");
            break;
          case "left":
            t.attr("dx", "-0.5em")
              .attr("dy", "0.32em")
              .attr("text-anchor", "end");
            break;
        }
      }

      function halo(text) {
        text
          .select(function() {
            return this.parentNode.insertBefore(this.cloneNode(true), this);
          })
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 4)
          .attr("stroke-linejoin", "round");
      }

    // add labels for data points
    label
      .append('text')
      .text((d) => d.year)
      .each(position)
      .call(halo);

})
