/* global $, _, crossfilter, d3 */
(function (mcviz) {
    'use strict';

    mcviz.data = {}; // our main data object
    mcviz.activeValue = null;
    mcviz.activePoint = 0;

    mcviz.FRONTIERS = [
        {   menu_name:'Wolf Creek: Nitrogen',
            dirname:'wolf_creek_n',
            title: 'Wolf Creek: Optimized for N Reduction'},
        {   menu_name:'Wolf Creek: Phosphorus',
            dirname:'wolf_creek_p',
            title: 'Wolf Creek: Optimized for P Reduction'},
        {   menu_name:'Wolf Creek: Sediment',
            dirname:'wolf_creek_s',
            title: 'Wolf Creek: Optimized for S Reduction'},
        {   menu_name:'Middle Cedar: Nitrogen',
            dirname:'middle_cedar_n',
            title:'Middle Cedar: Optimized for N Reduction'},
        {   menu_name:'Middle Cedar: Nitrogen + 10% Prairie',
            dirname:'middle_cedar_n_10pct_prairie',
            title:'Middle Cedar: Optimized for N Reduction with >= 10% Prairie'},
    ];
    mcviz.activeFrontier = 0;

    mcviz.VALUES = [
        {code:'nreduc', display:'Nitrogen'},
        {code:'preduc', display:'Phosphorus'},
        {code:'sreduc', display:'Sediment'}];
    mcviz.LULC_NAMES = ['AllCrop','CC','CT','Forest','GrW','NT',
                        'NTCC','Prairie','RF','RFCC','RFNT','RFNTCC'];
    mcviz.LULC_FULL_NAMES = [
        'Conventional',
        'Cover Crop',
        'Conservation Till',
        'Forest',
        'Grassed Waterways',
        'No Till',
        'No Till + Cover Crop',
        'Prairie',
        'Reduced Fertilizer',
        'Red Fert + Cover Crop',
        'Red Fert + No Till',
        'Red Fert + No Till + Cover Crop'
    ];
    mcviz.watershed = 'middle_cedar';
    mcviz.LULC_COLORS = {
        AllCrop:'yellow',
        Developed:'grey',
        CC:'darkkhaki',
        Forest:'forestgreen',
        GrW:'greenyellow',
        NT:'wheat',
        Prairie:'mediumseagreen',
        RF:'burlywood',
        RFCC:'darksalmon',
        RFNT:'darkorange',
        RFNTCC:'saddlebrown',
        Pasture:'lightpink',
        Wetland:'darkturquoise',
        Baseline:'dimgrey',
        NTCC:'olive',
        CT:'tomato',
        Water:'royalblue'
    };
    mcviz.TABLE_VALUE_LABELS = ['Annual cost', 'N reduction', 'P reduction', 'S reduction'];
    mcviz.TABLE_VALUE_KEYS = ['cost', 'nreduc', 'preduc', 'sreduc'];
    var millions_format = {'mult':1e-6,
                           'prefix':'$',
                           'suffix':' Million',
                           'roundingFunc': function(n) {
                                return n.toFixed(2);}
                           };
    var pct_format = {     'mult':1e2,
                           'prefix':'',
                           'suffix':'%',
                           'roundingFunc': function(n) {
                                return Math.abs(n.toPrecision(3));}
                     };
    mcviz.TABLE_FORMATS = [millions_format, pct_format, pct_format, pct_format];
    mcviz.mapWidth = 650;
    mcviz.mapHeight = 350;

    mcviz.setResults = function() {
        queue()
            .defer(d3.json, "static/data/"+
                mcviz.FRONTIERS[mcviz.activeFrontier]['dirname']+
                "/frontier.json")
            .await(ready);

        function ready(error, frontierData) {
            if(error) {
                return console.warn(error);
            }

            mcviz.data.frontierData = frontierData;
            mcviz.onDataChange();
            console.log(mcviz.FRONTIERS[mcviz.activeFrontier]['title']);
            d3.select('#data-title')
                .html(mcviz.FRONTIERS[mcviz.activeFrontier]['title']);
        }

    };

    mcviz.initMenu = function() {
        // Configure the frontier-selection menu
        var frontierSelect = d3.select('#data-choice select');
        frontierSelect.selectAll('option')
            .data(mcviz.FRONTIERS).enter()
            .append('option')
            .attr('value', function(d, i) { return i; })
            .html(function(d) { return d['menu_name']; });
        frontierSelect.on('change', function(d) {
            // var f = mcviz.FRONTIERS[d3.select(this).property('value')];
            mcviz.activeFrontier = d3.select(this).property('value');
            mcviz.setResults();
            mcviz.onDataChange();
            mcviz.newPointSelected();

        });
        // mcviz.activeValue = mcviz.VALUES[0]['code'];

        // Configures the value-selection menu dropdown
        var valSelect = d3.select('#value-select select');
        valSelect.selectAll('option')
            .data(mcviz.VALUES).enter()
            .append('option')
            .attr('value', function(d) { return d['code']; })
            .html(function(d) { return d['display']; });
        valSelect.on('change', function(d) {
            console.log(this);
            var value = d3.select(this).property('value');
            mcviz.activeValue = value;
            mcviz.onDataChange();
        });
        mcviz.activeValue = mcviz.VALUES[0]['code'];

    };

    mcviz.getValueData = function(){
        var value = mcviz.activeValue;
        var data = mcviz.data.frontierData.map(function(o){ 
                                    return o[value]
                                });
        return data;
    };

    mcviz.getFrontierData = function() {
        var xval = 'cost';
        var yval = mcviz.activeValue;
        var data = mcviz.data.frontierData.map(
            function(d) {
                return {xval: d[xval], yval:d[yval]};
            });
        return data;
    };

    mcviz.getPieData = function() {
        var data = mcviz.data.frontierData.find(function(d) {
                    return d['solution']==mcviz.activePoint;
        });
        return data;
    };

    mcviz.getPointReportData = function() {
        var data = mcviz.data.frontierData.find(function(d) {
                    return d['solution']==mcviz.activePoint;
        });
        return data;
    };

    mcviz.onDataChange = function() {
        // var data = mcviz.getValueData();
        // mcviz.updateBarChart(data);
        var data = mcviz.getFrontierData();
        mcviz.updateFrontierPlot(data);
        mcviz.newPointSelected();
    };

    mcviz.newPointSelected = function() {
        console.log('point: '+mcviz.activePoint);
        mcviz.updateMap(mcviz.activePoint);

        var data = mcviz.getPieData();
        mcviz.updatePiePlot(data, mcviz.LULC_NAMES, mcviz.LULC_COLORS);

        data = mcviz.getPointReportData();
        mcviz.updatePointReport(data, mcviz.TABLE_VALUE_KEYS, 
                                mcviz.TABLE_VALUE_LABELS,
                                mcviz.TABLE_FORMATS);
    }


}(window.mcviz = window.mcviz || {}));