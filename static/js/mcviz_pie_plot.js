/* global $, _, crossfilter, d3 */
(function (mcviz) {
    'use strict';

    var chartHolder = d3.select('#pie-plot');

    var margin = {top:20, right:20, bottom:20, left:50};
    var boundingRect = chartHolder.node()
        .getBoundingClientRect();
    var width = boundingRect.width - margin.left - margin.right;
    var height = boundingRect.height - margin.top - margin.bottom;
    var radius = Math.min(width, height) / 2;

    var arc = d3.svg.arc()
        .outerRadius(radius-10)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d){ return d });

    var svg = chartHolder.append('svg')
        .attr('width', boundingRect.width)
        .attr('height', boundingRect.height)
        .append('g')
            .attr('class', 'pie')
            .attr("transform",  
                "translate(" + (margin.left + width/2) + "," + (margin.top + height/2) + ")");

    // construct the tooltip div
    var tooltip = d3.select('body')
        .append('div')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .text('tooltip');

    mcviz.updatePiePlot = function(data, fields, colors) {
        var pieData = fields.map( function(n) { return data[n]} );
        var totArea = d3.sum(pieData);
        var slices = svg.selectAll('path')
            .data(pie(pieData));            

        slices.enter()
            .append('path')
            .style('fill', function(d,i) { return colors[fields[i]]; })
            .attr('class', 'pie-slice')
            .on("mouseover", function(d, i){
                // console.log(d, i);
                var pctVal = (100*d['value']/totArea).toPrecision(3);
                tooltip.html(mcviz.LULC_FULL_NAMES[i] + '<br />' +
                    d['value'].toFixed(0) + ' ha <br />' +
                    pctVal + '%');
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
            .each(function(d) { this._current = d; });

        slices.exit().remove();
        
        slices = slices.data(pie(pieData));
        slices.transition()
            .duration(500)
            .attrTween('d', function(d) {
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return arc(interpolate(t));
                };
            });


    };

}(window.mcviz = window.mcviz || {}));