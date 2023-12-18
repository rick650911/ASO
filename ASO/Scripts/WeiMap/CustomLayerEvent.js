function CustomLayerEvent_onLegendReturn(lookup) {
    //lookup = {[{url,label}]}
    $("#img_icon").attr('src', lookup[0][0].url);
}
function CustomLayerEvent_onQueryCompleted(features) {
    //features :[{objid, g}]
    //var a = [];
    //a.push(features[0].g);

    ////arc.loadDrawGraphic(a, 1);
    //arc.fitGeometry(a);
}

function CustomLayerEvent_onSubLayerVisibleChanged() {
    debugger;
}