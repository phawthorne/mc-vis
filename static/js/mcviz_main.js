(function (mcviz) {
    'use strict';

    // queue()
    //     .defer(d3.json, "static/data/"+
    //         mcviz.FRONTIERS[mcviz.activeFrontier]['dirname']+"/frontier.json")
    //     .await(ready);

    // function ready(error, frontierData) {
    //     if(error) {
    //         return console.warn(error);
    //     }

    //     mcviz.data.frontierData = frontierData;
    //     mcviz.initMenu();
    //     mcviz.onDataChange();
    // }

    mcviz.initMenu();
    mcviz.setResults();


}(window.mcviz = window.mcviz || {}));