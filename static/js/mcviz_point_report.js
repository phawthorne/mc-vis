/* global $, _, crossfilter, d3 */
(function (mcviz) {
    'use strict';

    console.log('building point-report table');

    var table_holder = d3.select('#point-report')
    	.append('table')
    		.attr('align', 'center');

    var row = table_holder.append('tbody')
    	.append('tr')
    row.append('td')
		.attr('class', 'label')
		.html('testing');
    row.append('td')
		.html('1234');

    mcviz.update_point_report = function() {
    };
}(window.mcviz = window.mcviz || {}));