/* global $, _, crossfilter, d3 */
(function (mcviz) {
    'use strict';

    console.log('building point-report table');

    var table_holder = d3.select('#point-report')
        .append('table')
            .attr('align', 'center');

    // var row = table_holder.append('tbody')
    //  .append('tr')
    // row.append('td')
    //     .attr('class', 'label')
    //     .html('testing');
    // row.append('td')
    //     .html('1234');

    mcviz.updatePointReport = function(data, keys, labels) {

        var prData = [];
        for (var i in keys) {
            prData[i] = {label:labels[i], value:data[keys[i]]};
        }
        console.log(prData);

        // bind the data to rows and make sure we have the right number
        var rows = table_holder.selectAll("tr")
            .data(prData)
        rows.enter().append('tr');
        rows.exit().remove();

        // make sure we have the columns all set up
        var columns = table_holder.selectAll('tr')
            .selectAll('td')
            .data(function(d) {
                return [d['label'], d['value']];
            });
        columns.enter().append("td");
        columns.exit().remove();

        // go through data cells setting text and styles
        table_holder.selectAll('tr')
            .selectAll('td')
            .each(function (d, i) {
                if (i==0) {
                    d3.select(this)
                        .attr('class', 'label')
                        .text(function(d){return d;});
                }
                else {
                    d3.select(this)
                        .text(function(d){return d;});
                }
            });



    };
}(window.mcviz = window.mcviz || {}));