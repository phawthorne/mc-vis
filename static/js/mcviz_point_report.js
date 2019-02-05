/* global $, _, crossfilter, d3 */
(function (mcviz) {
    'use strict';

    var table_holder = d3.select('#point-report')
        .append('table')
            .attr('align', 'center');

    mcviz.updatePointReport = function(data, keys, labels, fmts) {

        var prData = [];
        for (var i in keys) {
            prData[i] = {label:labels[i], value:data[keys[i]]};
        }

        // bind the data to rows and make sure we have the right number
        var rows = table_holder.selectAll("tr")
            .data(prData);
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
                var item = d3.select(this);

                if (i==0) {
                    // This is the label column
                    item.attr('class', 'label')
                        .text(d);
                }
                else {
                    // This is the data column
                    item.text(function(d) {
                        var j = prData.findIndex(
                            function(o) {
                                return o['value'] == d;
                            });
                        var fmt = fmts[j];
                        var n = fmt['roundingFunc'](fmt['mult']*d);
                        return fmt['prefix'] + n + fmt['suffix'];
                    });

                }
            });



    };
}(window.mcviz = window.mcviz || {}));