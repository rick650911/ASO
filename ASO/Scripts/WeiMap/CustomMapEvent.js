function CustomMapEvent_onMosueMove(objxy) {
    //objxy.x, objxy.y 坐標
    $("#divxy").html(objxy.x + ',' + objxy.y);
}

function CustomMapEvent_onScaleChange(scale) {
    //scale 比例尺
}

function CustomMapEvent_onDrawEnd(groupId) {
    //groupId 群組編號
    //arc.stopDrawGraphic();
}

function CustomMapEvent_onPrintCompleted(url) {
    //url print image url
    debugger;
    open(url);
}
function CustomMapEvent_onClick(objxy) {
    //debugger;
}

function CustomMapEvent_onUploadShpZipCompleted(info) {
    debugger;
    //for (i = 0; i < info.features.length; i++) {
    //    if (info.features[i].attributes.TOWNNAME == '宜蘭市') {
    //        fcadastrallayer.getSpatialFeatures(info.features[i].geometry);
    //        break;
    //    }
    //}
}

function CustomMapEvent_onBufferCompleted(geometry) {
    //arc.loadDrawGraphic([geometry], 1);
}