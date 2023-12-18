var objMapEvent = null;

//*******************************************
//---- ArcGis Event Handler ---------------
//*******************************************
var Map_EventType = {
    EV_onMosueMove: 1,  
    EV_onScaleChange: 2,
    EV_onDrawEnd: 3,
    EV_onPrintCompleted: 4,
    EV_onClick: 5,
    EV_onUploadShpZipCompleted: 6,
    EV_onBufferCompleted: 7
}
function MapEventHandler(objAgCtrl) {
    this.objMapCtrl = objAgCtrl;
}


//config format:
//{
//    this.domDiv = 'map';
//    this.defExtent = { minx: 111.0, miny: 111.0, maxx: 222.0, maxy: 222.0, wkid: 102443 };
//    this.optionFuns = [
//        { fun: "proxy", param: "proxy_url" },
//        { fun: "geomtryService", param: "geometry_service_url" },
//        { fun: "printTask", param: "print_task_url" },
//        { fun: "userLocateBtn", param: "dom_div" },
//        { fun: "fenceToShp", param: "gp_service_url" },
//    ];
//};
//***************
//函式名稱：MapCtrl(options)
//函式用途：物件類別之初始參數
//傳入參數：地圖物件
//傳回參數：無
//函式說明：實作一物件類別，並設定物件相關初始參數
//***************
function MapCtrl(config) {
    options = {
        div: config.domDiv,
        minx: config.defExtent.minx,
        miny: config.defExtent.miny,
        maxx: config.defExtent.maxx,
        maxy: config.defExtent.maxy,
        wkid: config.defExtent.wkid
    };
    this.mapCtrl = new WeiMap(options);

    if (config.optionFuns != null) {
        for (var n = 0; n < config.optionFuns.length; n++) {  //.forEach(function enableFun(opFun) {
            if (config.optionFuns[n].fun == "proxy")
                this.mapCtrl.enableProxy(config.optionFuns[n].param);
            else if (config.optionFuns[n].fun == "geometryService")
                this.mapCtrl.enableGeometryService(config.optionFuns[n].param);
            else if (config.optionFuns[n].fun == "printTask")
                this.mapCtrl.enablePrintTask(config.optionFuns[n].param);
            else if (config.optionFuns[n].fun == "userLocateBtn")
                this.mapCtrl.enableUserLocateBtn(config.optionFuns[n].param);
            else if (config.optionFuns[n].fun == "fenceToShp")
                this.mapCtrl.enableFenceToShp(config.optionFuns[n].param);
        };
    }

    

    this.layers = [];

    if (objMapEvent == null)
        objMapEvent = new MapEventHandler(this);

    this.SetEventHandle(Map_EventType.EV_onMosueMove, CustomMapEvent_onMosueMove);
    this.SetEventHandle(Map_EventType.EV_onScaleChange, CustomMapEvent_onScaleChange);
    this.SetEventHandle(Map_EventType.EV_onDrawEnd, CustomMapEvent_onDrawEnd);
    this.SetEventHandle(Map_EventType.EV_onPrintCompleted, CustomMapEvent_onPrintCompleted);
    this.SetEventHandle(Map_EventType.EV_onClick, CustomMapEvent_onClick);
    this.SetEventHandle(Map_EventType.EV_onUploadShpZipCompleted, CustomMapEvent_onUploadShpZipCompleted);
    this.SetEventHandle(Map_EventType.EV_onBufferCompleted, CustomMapEvent_onBufferCompleted);
    

    //#region arcgis event  
    this.mapCtrl.on("MouseMove", function (objxy) {
        if (objMapEvent.objMapCtrl.event_onMouseMove != null) {
            objMapEvent.objMapCtrl.event_onMouseMove(objxy);
        }
    });
    this.mapCtrl.on("ScaleChange", function (scale) {
        if (objMapEvent.objMapCtrl.event_onScaleChange != null) {
            objMapEvent.objMapCtrl.event_onScaleChange(scale);
        }
    });
    this.mapCtrl.on("DrawEnd", function (groupId) {
        if (objMapEvent.objMapCtrl.event_onDrawEnd != null) {
            objMapEvent.objMapCtrl.event_onDrawEnd(groupId);
        }
    });
    this.mapCtrl.on("PrintCompleted", function (url) {
        if (objMapEvent.objMapCtrl.event_onPrintCompleted != null) {
            objMapEvent.objMapCtrl.event_onPrintCompleted(url);
        }
    });
    this.mapCtrl.on("Click", function (objxy) {
        if (objMapEvent.objMapCtrl.event_onClick != null) {
            objMapEvent.objMapCtrl.event_onClick(objxy);
        }
    });
    this.mapCtrl.on("UploadShpZipCompleted", function (info) {
        if (objMapEvent.objMapCtrl.event_onUploadShpZipCompleted != null) {
            objMapEvent.objMapCtrl.event_onUploadShpZipCompleted(info);
        }
    });
    this.mapCtrl.on("BufferCompleted", function (g) {
        if (objMapEvent.objMapCtrl.event_onBufferCompleted != null) {
            objMapEvent.objMapCtrl.event_onBufferCompleted(g);
        }
    });

    //#endregion

    
}

//***************
//函式名稱：new MapCtrl
//函式用途：物件類別
//傳入參數：無
//傳回參數：無
//函式說明：實作一物件類別，並設定物件相關函式
//***************
MapCtrl.prototype.moveCenter = moveCenter;
MapCtrl.prototype.fullExtent = fullExtent;
MapCtrl.prototype.prevExtent = prevExtent;
MapCtrl.prototype.nextExtent = nextExtent;
MapCtrl.prototype.zoomIn = zoomIn;
MapCtrl.prototype.zoomOut = zoomOut;
MapCtrl.prototype.setPanMode = setPanMode;
MapCtrl.prototype.locationCurrent = locationCurrent;
MapCtrl.prototype.print = print;
MapCtrl.prototype.fenceToShp = fenceToShp;
MapCtrl.prototype.connectYiApi = connectYiApi;
MapCtrl.prototype.addLayer = addLayer;
MapCtrl.prototype.getLayerCtrl = getLayerCtrl;
MapCtrl.prototype.locationCoord = locationCoord;
MapCtrl.prototype.clearTempGraphic = clearTempGraphic;
MapCtrl.prototype.startDrawGraphic = startDrawGraphic;
MapCtrl.prototype.stopDrawGraphic = stopDrawGraphic;
MapCtrl.prototype.getDrawGraphics = getDrawGraphics;
MapCtrl.prototype.removeDrawGraphic = removeDrawGraphic;
MapCtrl.prototype.loadDrawGraphic = loadDrawGraphic;
MapCtrl.prototype.fitGeometry = fitGeometry;
MapCtrl.prototype.fitGeometryXY = fitGeometryXY;
MapCtrl.prototype.createWeiRoadLayer = createWeiRoadLayer;
MapCtrl.prototype.setDrawPointIcon = setDrawPointIcon;
MapCtrl.prototype.loadSharpZip = loadSharpZip;
MapCtrl.prototype.bufferClick = bufferClick;
MapCtrl.prototype.mapUsable = mapUsable;
MapCtrl.prototype.StringToGeometry = stringtogeometry;

//---- Event Handlers
MapCtrl.prototype.SetEventHandle = SetEventHandle;
MapCtrl.prototype.event_onMouseMove = null;
MapCtrl.prototype.event_onScaleChange = null;
MapCtrl.prototype.event_onDrawEnd = null;
MapCtrl.prototype.event_onPrintCompleted = null;
MapCtrl.prototype.event_onClick = null;
MapCtrl.prototype.event_onUploadShpZipCompleted = null;
MapCtrl.prototype.event_onBufferCompleted = null;

//***************
//函式名稱：moveCenter()
//函式用途：點選移至中心點
//傳入參數：無
//傳回參數：無
//函式說明：點選移至中心點
//***************
function moveCenter() {
    this.mapCtrl.moveCenter();
}

//***************
//函式名稱：stringtogeometry(str) 
//函式用途：字串轉為 geometry
//傳入參數：str 字串
//傳回參數：無
//函式說明：無
//***************
function stringtogeometry(str) {
    return this.mapCtrl.stringtogeometry(str);
}

//***************
//函式名稱：fullExtent()
//函式用途：回到預設全視景
//傳入參數：無
//傳回參數：無
//函式說明：回到預設全視景
//***************
function fullExtent() {
    this.mapCtrl.toFullExtent();
}

//***************
//函式名稱：nextExtent()
//函式用途：回到下一視景
//傳入參數：無
//傳回參數：無
//函式說明：回到下一視景
//***************
function nextExtent() {
    this.mapCtrl.toNextExtent();
}

//***************
//函式名稱：zoomIn()
//函式用途：圈選放大
//傳入參數：無
//傳回參數：無
//函式說明：圈選放大
//***************
function zoomIn() {
    this.mapCtrl.toZoomIn();
}

//***************
//函式名稱：zoomOut()
//函式用途：圈選縮小
//傳入參數：無
//傳回參數：無
//函式說明：圈選縮小
//***************
function zoomOut() {
    this.mapCtrl.toZoomOut();
}

//***************
//函式名稱：prevExtent()
//函式用途：回到前一視景
//傳入參數：無
//傳回參數：無
//函式說明：回到前一視景
//***************
function prevExtent() {
    this.mapCtrl.toPrevExtent();
}

//***************
//函式名稱：setPanMode()
//函式用途：設定平移模式
//傳入參數：無
//傳回參數：無
//函式說明：設定平移模式
//***************
function setPanMode() {
    this.mapCtrl.toPan();
}

//***************
//函式名稱：locationCurrent()
//函式用途：定位於所在地
//傳入參數：無
//傳回參數：無
//函式說明：定位於所在地
//***************
function locationCurrent() {
    this.mapCtrl.toLocation();
}

//***************
//函式名稱：print()
//函式用途：列印
//傳入參數：無
//傳回參數：無
//函式說明：完成觸發 CustomMapEvent_onPrintCompleted
//***************
function print() {
    this.mapCtrl.Print();
}

//***************
//函式名稱：fenceToShp(layername)
//函式用途：選擇圖層轉出shp
//傳入參數：圖層名稱
//傳回參數：無
//函式說明：完成觸發 CustomMapEvent_onUploadShpZipCompleted
//***************
function fenceToShp(layername) {
    this.mapCtrl.fenceToShp(layername);
}

//***************
//函式名稱：connectYiApi()
//函式用途：與宜蘭定位連結
//傳入參數：無
//傳回參數：無
//函式說明：與宜蘭定位連結,需呼叫後方可定位
//***************
function connectYiApi() {
    this.mapCtrl.connectYiApi();
}

//***************
//函式名稱：addLayer(lyerCtrl)
//函式用途：加入圖層
//傳入參數：lyerCtrl:LayerCtrl
//傳回參數：無
//函式說明：加入圖層
//***************
function addLayer(lyerCtrl) {
    if (!lyerCtrl instanceof LayerCtrl) {
        alert('物件錯誤');
    }
    this.mapCtrl.addLayer(lyerCtrl.layer);
    this.layers.push(lyerCtrl);
}

//***************
//函式名稱：getLayerCtrl(id)
//函式用途：根據圖層id取得圖層控制
//傳入參數：id, 圖層id
//傳回參數：LayerCtrl or null
//函式說明：根據圖層id取得圖層控制
//***************
function getLayerCtrl(id) {
    var alayers = dojo.filter(this.layers, function (item) {
        return item.layer.id == id;
    });
    if (alayers != null && alayers.length > 0) {
        return alayers[0];
    }
    else {
        return null;
    }
}

//***************
//函式名稱：locationCoord(x, y, scale)
//函式用途：坐標定位
//傳入參數：坐標X, Y, scale:比例尺(選擇性)
//傳回參數：無
//函式說明：坐標定位
//***************
function locationCoord(x, y, scale) {
    this.mapCtrl.LocationCoord(x, y, scale);
}

//***************
//函式名稱：clearTempGraphic()
//函式用途：清除暫存圖層
//傳入參數：無
//傳回參數：無
//函式說明：清除暫存圖層
//***************
function clearTempGraphic() {
    this.mapCtrl.clearTempGraphic();
}

//***************
//函式名稱：startDrawGraphic(gType, groupId)
//函式用途：劃設圖層
//傳入參數：gType:OpgType,  groupId:組別
//傳回參數：無
//函式說明：劃設圖層
//***************
function startDrawGraphic(gType, groupId) {
    this.mapCtrl.startDrawGraphic(gType, groupId);
}

//***************
//函式名稱：stopDrawGraphic()
//函式用途：停止劃設
//傳入參數：無
//傳回參數：無
//函式說明：停止劃設
//***************
function stopDrawGraphic() {
    this.mapCtrl.stopDrawGraphic();
}

//***************
//函式名稱：getDrawGraphics(groupId)
//函式用途：取回劃設幾何
//傳入參數：groupId: 組別
//傳回參數：無
//函式說明：取回劃設幾何
//***************
function getDrawGraphics(groupId) {
    return this.mapCtrl.getDrawGraphics(groupId);
}

//***************
//函式名稱：removeGraphic(groupId)
//函式用途：刪除劃設
//傳入參數：groupId: 組別
//傳回參數：無
//函式說明：刪除劃設
//***************
function removeDrawGraphic(groupId) {
    return this.mapCtrl.removeDrawGraphic(groupId);
}

//***************
//函式名稱：loadDrawGraphic(geometrys, groupId)
//函式用途：載入幾何
//傳入參數：geometrys, groupId
//傳回參數：無
//函式說明：載入幾何
//***************
function loadDrawGraphic(geometrys, groupId) {
    return this.mapCtrl.loadDrawGraphic(geometrys, groupId);
}

//***************
//函式名稱：fitGeometry(geometrys)
//函式用途：定位
//傳入參數：geometrys : [geometry]
//傳回參數：無
//函式說明：定位
//***************
function fitGeometry(geometrys) {
    return this.mapCtrl.fitGeometry(geometrys);
}


//***************
//函式名稱：fitGeometryXY(xys)
//函式用途：定位
//傳入參數：xys : [[x,y]...]
//傳回參數：無
//函式說明：定位
//***************
function fitGeometryXY(xys) {
    return this.mapCtrl.fitGeometryXY(xys);
}

//***************
//函式名稱：createWeiRoadLayer(caselist)
//函式用途：Create 路平動態圖層
//傳入參數：caselist : array 
//傳回參數：無
//函式說明：Create 路平動態圖層
//***************
function createWeiRoadLayer(caselist) {
    return this.mapCtrl.createWeiRoadLayer(caselist);
}

//***************
//函式名稱：setDrawPointIcon(path, w,h)
//函式用途：設定劃設點icon
//傳入參數：path:icon路徑, w:寬, h:長 
//傳回參數：無
//函式說明：設定劃設點icon
//***************
function setDrawPointIcon(path, w, h) {
    return this.mapCtrl.setDrawPointIcon(path, w, h);
}

//***************
//函式名稱：loadSharpZip(obj)
//函式用途：載入ShpFile(*.zip)
//傳入參數：obj:upload 元件 
//傳回參數：Geometrys:[Geometry]
//函式說明：完成後觸發 CustomMapEvent_onUploadShpZipCompleted
//***************
function loadSharpZip(obj) {
    return this.mapCtrl.loadSharpZip(obj.file.value, obj.id);
}


//***************
//函式名稱：bufferClick(m) 
//函式用途：點選圖面取buffer 
//傳入參數：m:buffer 距離 
//傳回參數：無
//函式說明：完成後觸發 CustomMapEvent_onBufferCompleted
//***************
function bufferClick(m) {
    return this.mapCtrl.bufferClick(m);
}

//***************
//函式名稱：mapUsable() 
//函式用途：圖台可用與否
//傳入參數：無 
//傳回參數：無
//函式說明：圖台可用與否
//***************
function mapUsable() {
    return this.mapCtrl.arcMap.loaded;
}



//***************
//函式名稱：SetEventHandle()
//函式用途：設定EventHandle
//傳入參數：evtType:Map_EventType, function name
//傳回參數：無
//函式說明：設定EventHandle
//***************
function SetEventHandle(evtType, func) {
    switch (evtType) {
        case Map_EventType.EV_onMosueMove:
            this.event_onMouseMove = func;
            break;
        case Map_EventType.EV_onScaleChange:
            this.event_onScaleChange = func;
            break;
        case Map_EventType.EV_onDrawEnd:
            this.event_onDrawEnd = func;
            break;
        case Map_EventType.EV_onPrintCompleted:
            this.event_onPrintCompleted = func;
            break;
        case Map_EventType.EV_onClick:
            this.event_onClick = func;
            break;
        case Map_EventType.EV_onUploadShpZipCompleted:
            this.event_onUploadShpZipCompleted = func;
            break;
        case Map_EventType.EV_onBufferCompleted:
            this.event_onBufferCompleted = func;
            break;
    }
}