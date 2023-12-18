require(['dojo/_base/declare', "esri/map", "dojo/parser", "dojo/Evented", "dojo/on",
    "esri/geometry/Extent", "esri/SpatialReference", "esri/config", "esri/toolbars/navigation", "esri/geometry/Point",
    "esri/tasks/GeometryService", "esri/dijit/LocateButton", "esri/dijit/Scalebar", "esri/tasks/ProjectParameters", "esri/tasks/PrintTask",
    "esri/tasks/PrintParameters", "esri/tasks/Geoprocessor", "esri/geometry/Polygon", "esri/toolbars/draw", "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol", "esri/Color", "esri/graphic", "esri/tasks/FeatureSet", "esri/symbols/PictureMarkerSymbol",
    "esri/geometry/Polyline", "esri/symbols/SimpleMarkerSymbol", "esri/Color", "dojo/_base/array", "extras/WeiYiRoadLayer",
    "esri/request", "dojo/dom", "dojo/_base/lang", "dojo/json", "esri/geometry/scaleUtils", "esri/InfoTemplate", "esri/layers/FeatureLayer", 
            "esri/tasks/BufferParameters", 
            "dijit/layout/TabContainer",
            "dijit/layout/ContentPane",
            "dijit/form/Select",
            "dijit/form/ComboBox",
            "dojo/store/Memory",
            "dijit/layout/BorderContainer"],
     function (declare, map, parser, Evented, on, Extent, SpatialReference, esriConfig, Navigation, Point, GeometryService,
         LocateButton, ScaleBar, ProjectParameters, PrintTask, PrintParameters, Geoprocessor, Polygon, Draw, SimpleFillSymbol, SimpleLineSymbol,
         Color, Graphic, FeatureSet, PictureMarkerSymbol, Polyline, SimpleMarkerSymbol, Color, arrayUtils, WeiYiRoadLayer, request,
         dom, lang, JSON, scaleUtils, InfoTemplate, FeatureLayer, BufferParameters) {
         var WeiMap = declare("WeiMap", [Evented], {
             arcMap: null,
             domDiv: "map",
             mapExtent: null,
             navToolbar: null,
             //--- Process/Service Objects
             printTask: null,
             geometryService: null,
             userLocateBtn: null,
             drawTool: null,
             drawCurGroupId: null,
             drawArrays: [],
             fenceToShpGP: null,
             fenceToShpDraw: null,
             fenceLayerName: null,
             fenceTmpGraphic: null,
             fenceSymbol: null,
             fenceQueryJob: null,
             fenceJobStatus: null,
             fenceJobFailed: null,
             //--- Default Symbol
             defPointSymbol: null,
             defLineSymbol: null,
             defPolygonSymbol: null,
             //drowPointSymbol: null,

             _ismovecenter: false,
             _currlocation:null,
             _islocation: false,
             _currentscale: 0,
             _tempGraphic: null,
             _isbufferclick: false,
             _bufferdistance :0,

             constructor: function (options) {
                 parser.parse();
                 this.domDiv = options.div || 'map';

                 var minx = options.minx || Number.MIN_VALUE;
                 var miny = options.miny || Number.MIN_VALUE;
                 var maxx = options.maxx || Number.MAX_VALUE;
                 var maxy = options.maxy || Number.MAX_VALUE;
                 var wkid = options.wkid || 102443;
                 this.mapExtent = new Extent(minx, miny, maxx, maxy, new SpatialReference(wkid));
                 this._initialBase();
             },
             _initialBase: function () {
                 esriConfig.defaults.io.proxyUrl = "/photo-interpretation/proxy.ashx";

                 // The length of time in milliseconds that the map will take to pan from one extent to another.
                 esriConfig.defaults.map.panDuration = 1; // default panDuration: 350
                 // The length of time in milliseconds that the map will refresh as it pans to the next extent.
                 esriConfig.defaults.map.panRate = 1; // default panRate: 25
                 // The length of time in milliseconds that the map will take to zoom from one extent to another.
                 esriConfig.defaults.map.zoomDuration = 100; // default zoomDuration: 500
                 // The length of time in milliseconds that the map will refresh as it zooms to the next extent.
                 esriConfig.defaults.map.zoomRate = 1; // default zoomRate: 25
                 //--- 建立ArcgisMap物件
                 //debugger;
                 //this.mapExtent = new Extent(e.minx, e.miny, 346755.2810787978, 2787368.3745819633, new SpatialReference(e.wkid));
                 this.arcMap = new map(this.domDiv, {
                     //center: [121.5840933, 24.996418],
                     zoom:3,
                     extent: this.mapExtent,
                     sliderStyle: 'large',
                     sliderPosition: 'top-right',
                     showLabels: true
                 });
                 this.scalebar = new esri.dijit.Scalebar({
                     map: this.arcMap,
                     // "dual" displays both miles and kilometers
                     // "english" is the default, which displays miles
                     // use "metric" for kilometers
                     scalebarUnit: "metric"
                 });

                 this.arcMap.enableMapNavigation();
                 this.navToolbar = new Navigation(this.arcMap);

                 //--- 建立Default Symbols
                 this.defPointSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 1), new Color([0, 0, 0, 1])),
                 this.defLineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 3),
                 this.defPolygonSymbol = new SimpleFillSymbol().setColor(new Color([184, 184, 184, 0.3])),
                 this.defPolygonSymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([67, 153, 185]), 3));
                 this.drawPointSymbol = this.defPointSymbol;

                 var root = this;

                 //--- 建立Default Draw Tool
                 this.drawTool = new Draw(this.arcMap);
                 //--- 連結drawTool onDrawEnd event --> Fire arcMapCtrl的Event: [DrawEnd](groupId)
                 dojo.connect(this.drawTool, "onDrawEnd", function (geometry) {
                     if (geometry instanceof Polygon) {
                         root.drawArrays.push(root.arcMap.graphics.add(new Graphic(geometry, root.defPolygonSymbol, { "id": root.drawCurGroupId })));
                     }
                     else if (geometry instanceof Polyline) {
                         root.drawArrays.push(root.arcMap.graphics.add(new Graphic(geometry, root.defLineSymbol, { "id": root.drawCurGroupId })));
                     }
                     else if (geometry instanceof Point) {
                         root.drawArrays.push(root.arcMap.graphics.add(new Graphic(geometry, root.defPointSymbol, { "id": root.drawCurGroupId })));
                     }
                     root.emit('DrawEnd', root.drawCurGroupId);
                 });

                 //--- 連結Map event並Fire arcMapCtrl的Events
                 //--- 連結Map onMouseMove evant --> Fire arcMapCtrl的Event: [MouseMove]({x,y})
                 dojo.connect(this.arcMap, 'onMouseMove', function (theMap) {
                     try {
                         var mpoint = root.arcMap.toMap(theMap.screenPoint);
                         root.emit('MouseMove', { x: mpoint.x.toFixed(2), y: mpoint.y.toFixed(2) });
                     }
                     catch (e) {
                     }
                 });

                 dojo.connect(this.arcMap, 'onClick', function (theMap) {
                     var mpoint = root.arcMap.toMap(theMap.screenPoint);
                     if (root._ismovecenter) {
                         theMap.mapPoint.setSpatialReference(root.arcMap.spatialReference);
                         root.arcMap.centerAt(theMap.mapPoint);
                         root._ismovecenter = false;
                     }
                     if (root._isbufferclick) {
                         root._isbufferclick = false;
                         if (root.geometryService == null) {
                             alert('需設定geomtryService ! ');
                             return;
                         }
                         debugger;
                         var params = new BufferParameters();
                         params.geometries = [mpoint];
                         params.distances = [root._bufferdistance];
                         params.unit = GeometryService.UNIT_METER;
                         params.outSpatialReference = root.arcMap.spatialReference;
                         root.geometryService.buffer(params, function (gs) {
                             root.emit('BufferCompleted', gs[0]);
                         });
                     }
                     root.emit('Click', { x: mpoint.x.toFixed(2), y: mpoint.y.toFixed(2) });
                 });

                 dojo.connect(this.arcMap, 'onExtentChange', function (e) {
                     if (!root._islocation) {
                         root._currentscale = root.arcMap.getScale();
                     }
                     else {
                         root._islocation = false;
                     }
                     root.emit('ScaleChange', root.arcMap.getScale());
                 });
             },
             //--- Enable Function Method
             enableProxy: function (proxy_url) {
                 esriConfig.defaults.io.proxyUrl = proxy_url;
                 esriConfig.defaults.io.alwaysUseProxy = true;
             },
             enableGeometryService: function (geo_service_url) {
                 this.geometryService = new GeometryService(geo_service_url);
                 esriConfig.defaults.geometryService = this.geometryService;
             },
             enablePrintTask: function (print_task_url) {
                 this.printTask = new PrintTask(print_task_url);
             },
             enableUserLocateBtn: function (dom_div) {
                 this.userLocateBtn = new LocateButton({
                     map: this.arcMap
                 }, dom_div);
                 //--- 連結userLocateBtn onlocate event and Handle
                 dojo.connect(this.userLocateBtn, 'onlocate', function (e) {
                     var ulocSR = new esri.SpatialReference({ "wkid": 4326 });  //WGS84
                     locPoint = new Point(e.position.coords.longitude, e.position.coords.latitude, ulocSR);
                     if (root.arcMap.spatialReference.wkid != 4326) {
                         var params = new ProjectParameters();
                         params.geometries = [locPoint];
                         params.outSR = root.arcMap.spatialReference;
                         root.geomtryService.project(params, function (projectedPoints) {
                             root._currlocation = projectedPoints[0];
                             root.arcMap.centerAt(projectedPoints[0]);
                             root.arcMap.setScale(root._currentscale);
                         }, function (e) {
                             //debugger;
                         });
                     }
                     else
                         root.arcMap.centerAt(locPoint);
                 });
             },
             enableFenceToShp: function (gp_service_url) {
                 this.fenceToShpGP = new Geoprocessor(gp_service_url);
                 this.fenceToShpDraw = new Draw(this.arcMap);
                 this.fenceSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]));
                 this.fenceQueryJob = function () {
                     var features = [];
                     features.push(this.fenceTmpGraphic);
                     var feaSet = new FeatureSet();
                     feaSet.features = features;
                     var clipLayers = [];
                     clipLayers.push(this.fenceLayerName);
                     var defQuery = {
                         'Layers_to_Clip': clipLayers,
                         'Area_of_Interest': feaSet
                     };
                     return defQuery;
                 };
                 this.fenceJobStatus = function (jobinfo) {
                 };
                 this.fenceJobFailed = function (error) {
                     //debugger;
                 };

                 var root = this;
                 dojo.connect(this.fenceToShpDraw, "onDrawEnd", function (geometry) {
                     if (root.fenceTmpGraphic != null) {
                         root.arcMap.graphics.remove(root.fenceTmpGraphic);
                     }
                     root.fenceToShpDraw.deactivate();
                     var graphic = new Graphic(geometry, root.fenceSymbol);
                     root.fenceTmpGraphic = root.arcMap.graphics.add(graphic);
                     root.fenceToShpGP.submitJob(root.fenceQueryJob(), function (jobinfo) {
                         root.fenceToShpGP.getResultData(jobinfo.jobId, "Output_Zip_File", function (result, messages) {
                             open(result.value.url);
                         }, function (e) {
                         });
                     }, root.fenceJobStatus, root.fenceJobFailed);
                 });
             },
             addLayer: function (layer) {
                 if (!layer instanceof WeiLayer) {
                     alert('物件錯誤');
                 }
                 layer.map = this.arcMap;
                 layer.arc = this;
                 layer.AddToMap();
             },
             moveCenter: function () {
                 this._ismovecenter = true;
             },
             toFullExtent: function () {  
                 this.mapExtent.setSpatialReference(this.arcMap.spatialReference);
                 this.arcMap.setExtent(this.mapExtent, true);
             },
             toPrevExtent: function () {
                 this.navToolbar.zoomToPrevExtent();
             },
             toNextExtent: function () {
                 this.navToolbar.zoomToNextExtent();
             },
             toZoomIn: function () {
                 this.navToolbar.activate(Navigation.ZOOM_IN);
             },
             toZoomOut: function () {
                 this.navToolbar.activate(Navigation.ZOOM_OUT);
             },
             toPan: function () {
                 this.navToolbar.activate(Navigation.PAN);
             },
             connectYiApi: function () {
                 init_yitown(); //鄉鎮市
                 init_yivillage(); //村里
                 init_yiroad(); //道路
                 init_yicrossroad(); //交叉路口
                 init_yipoi(); //重要地標
                 init_yiaddress(); //門牌
                 init_yicadaster(); //地籍
                 init_yilanduse(); //都市計畫區
                 yilandmap = this.arcMap;
             },
             toLocation: function () {
                 if (this._currlocation != null) {
                     this.arcMap.centerAt(this._currlocation);
                 }
                 else {
                     this._islocation = true;
                     this.userLocateBtn.locate();
                 }
             },
             LocationCoord: function (x, y, scale) {
                 //if (this._tempGraphic != null) {
                 //    this.arcMap.graphics.remove(this._tempGraphic);
                 //}
                 var m_scale = scale || 5000;
                 var symbol = null;
                 //debugger;
                 if (this.defPointSymbol != null) {
                     symbol = this.defPointSymbol;
                 }
                 else {
                     symbol = new PictureMarkerSymbol(Mappointimg, 28, 28);
                 }
                 var pt = new Point(x, y, this.arcMap.spatialReference);
                 this._tempGraphic = new Graphic(pt, symbol);
                 this.arcMap.graphics.add(this._tempGraphic);
                 this.arcMap.centerAt(pt);
                 var root = this;
                 setTimeout(function () {
                     root.arcMap.setScale(m_scale);
                 }, 1000);
             },
             clearTempGraphic:function(){
                 this.arcMap.graphics.clear();
             },
             Print: function () {
                 var params = new PrintParameters();
                 params.map = this.arcMap;

                 var root = this;
                 this.printTask.execute(params, function (result) {
                     root.emit('PrintCompleted', result.url);
                 });
             },
             fenceToShp: function (layername) {
                 this.fenceLayerName = layername;
                 this.fenceToShpDraw.activate(Draw.POLYGON);
             },
             startDrawGraphic: function(gType, groupId) {
                 var retgType = null;
                 switch (gType) {
                     case OpgType.Polygon:
                         retgType = Draw.POLYGON;
                         break;
                     case OpgType.Line:
                         retgType = Draw.LINE;
                         break;
                     case OpgType.Point:
                         retgType = Draw.POINT;
                         break;
                 }
                 this.drawTool.activate(retgType);
                 this.drawCurGroupId = groupId;

             },
             stopDrawGraphic:function(){
                 this.drawTool.deactivate();
             },
             stringtogeometry: function (str) {
                 //str = '{"rings":[[[326579.23248291015,2769415.123474121],[326784.28887939453,2769481.270690918],[326929.81268310546,2769203.452270508],[326030.2106933594,2768588.283508301],[325613.4832763672,2768561.824523926],[325606.8687133789,2768912.404724121],[326579.23248291015,2769415.123474121]],[[328715.787109375,2768780.1102905273],[328887.76971435546,2768806.569091797],[328881.15509033203,2768813.183898926],[330184.2548828125,2768151.7119140625],[330290.0902709961,2768032.646911621],[328715.787109375,2768780.1102905273]]]}';
                 //str = '{"paths": [[[298384.71,2775743.76],[298393.83,2775717.07]]]}';
                 var g = null;
                 if (str.indexOf("x") > 0) {
                     g = new Point(JSON.parse(str));
                     g.setSpatialReference(this.arcMap.spatialReference);
                 }
                 else if (str.indexOf("paths") > 0) {
                     g = new Polyline(JSON.parse(str));
                     g.setSpatialReference(this.arcMap.spatialReference);
                 }
                 else if (str.indexOf("rings") > 0) {
                     g = new Polygon(JSON.parse(str));
                     g.setSpatialReference(this.arcMap.spatialReference);
                 }
                 else if (str.indexOf("xmin") > 0) {
                     g = new Extent(JSON.parse(str));
                     g.setSpatialReference(this.arcMap.spatialReference);
                 }
                 return g;
             },
             getDrawGraphics: function (groupId) {
                 var graphics = dojo.filter(this.drawArrays, function (item) {
                     return item.attributes.id == groupId;
                 });
                 if (graphics.length > 0) {
                     var ret = [];
                     var gs = arrayUtils.map(graphics, function (g, index) {
                         return {
                             g: g.geometry
                         };
                     });
                     if (gs.length > 0) {
                         for (i = 0; i < gs.length ; i++) {
                             ret.push(gs[i].g);
                         }
                     }
                     return ret;
                 }
                 return null;
             },
             fitGeometry: function (geometrys) {
                 var root = this;
                 var et = null;
                 geometrys.forEach(function ShowResults(geometry, index, ar) {
                     if (geometry instanceof Polygon) {
                         et = et == null ? geometry.getExtent() : et.union(geometry.getExtent());
                     }
                     else if (geometry instanceof Polyline) {
                         et = et == null ? geometry.getExtent() : et.union(geometry.getExtent());
                     }
                     else if (geometry instanceof Point) {
                         et = et == null ? root._fun_point2Extent(geometry) : et.union(root._fun_point2Extent(geometry));
                     }
                 })
                 et.setSpatialReference(this.arcMap.spatialReference);
                 //this.arcMap.setExtent(this._bounds, true);
                 this.arcMap.setExtent(et, true);
             },
             fitGeometryXY:function(xys){
                 var geometrys = [];
                 for (i = 0; i < xys.length; i++) {
                     geometrys.push(new Point(xys[i][0], xys[i][1], this.arcMap.spatialReference));
                 }
                 this.fitGeometry(geometrys);
             },
             _fun_point2Extent:function(point){
                 var offset = 10;
                 var ex = new Extent(point.x - offset, point.y - offset, point.x + offset, point.y + offset, this.arcMap.spatialReference);

                 return ex;
             },
             loadDrawGraphic: function (geometrys, groupId) {
                 var root = this;
                 geometrys.forEach(function ShowResults(geometry, index, ar) {
                     geometry.setSpatialReference(root.arcMap.spatialReference);
                     if (geometry instanceof Polygon) {
                         root.drawArrays.push(root.arcMap.graphics.add(new Graphic(geometry, root.defPolygonSymbol, { "id": root.drawCurGroupId })));
                     }
                     else if (geometry instanceof Polyline) {
                         root.drawArrays.push(root.arcMap.graphics.add(new Graphic(geometry, root.defLineSymbol, { "id": root.drawCurGroupId })));
                     }
                     else if (geometry instanceof Point) {
                         root.drawArrays.push(root.arcMap.graphics.add(new Graphic(geometry, root.drawPointSymbol, { "id": root.drawCurGroupId })));
                     }
                 })     
             },
             removeDrawGraphic:function(groupId){
                 var graphics = dojo.filter(this.drawArrays, function (item) {
                     return item.attributes.id == groupId;
                 });
                 if (graphics.length > 0) {
                     for (i = 0; i < graphics.length; i++) {
                         this.arcMap.graphics.remove(graphics[i]);
                     }
                 }
                 this.drawArrays = [];
                 if (this.arcMap.graphics.graphics.length > 0) {
                     for (i = 0; i < this.arcMap.graphics.graphics.length; i++) {
                         if (this.arcMap.graphics.graphics[i].attributes !=null && this.arcMap.graphics.graphics[i].attributes.id != null) {
                             this.drawArrays.push(this.arcMap.graphics.graphics[i]);
                         }
                     }
                 }  
             },
             createWeiRoadLayer: function (caselist) {
                 //debugger;
                 var  weiroadlayer = new LayerCtrl({
                     id: 'Road'
                 });
                 weiroadlayer.layer.map = this.arcMap;
                 weiroadlayer.caselist = caselist;
                 //debugger;
                 weiroadlayer.layer.polygonSymbol = this.defPolygonSymbol;
                 weiroadlayer.layer.lineSymbol = this.defLineSymbol;
                 weiroadlayer.layer.pointSymbol = this.defPointSymbol;

                 return weiroadlayer;
             },
             setDrawPointIcon: function (path, w, h) {
                 this.defPointSymbol = new PictureMarkerSymbol(path, w, h);
             },
             loadSharpZip: function (path, id) {
                 //debugger;
                 var root = this;
                 var portalUrl = "https://www.arcgis.com";
                 var fileName = path.split(".")[0];
                 var params = {
                     'name': fileName,
                     'targetSR': this.arcMap.spatialReference,
                     'maxRecordCount': 1000,
                     'enforceInputFileSizeLimit': true,
                     'enforceOutputJsonSizeLimit': true
                 };
                 var extent = scaleUtils.getExtentForScale(this.arcMap, 40000);
                 var resolution = extent.getWidth() / this.arcMap.width;
                 params.generalize = true;
                 params.maxAllowableOffset = resolution;
                 params.reducePrecision = true;
                 params.numberOfDigitsAfterDecimal = 0;
                 var myContent = {
                     'filetype': 'shapefile',
                     'publishParameters': JSON.stringify(params),
                     'f': 'json',
                     'callback.html': 'textarea'
                 };
                 request({
                     url: portalUrl + '/sharing/rest/content/features/generate',
                     content: myContent,
                     form: dom.byId(id),
                     handleAs: 'json',
                     load: lang.hitch(this, function (response) {
                         if (response.error) {
                             root.emit('UploadShpZipCompleted', { Issuccess: false, Info: error.message, features: null });
                             return;
                         }
                         var layerName = response.featureCollection.layers[0].layerDefinition.name;
                         root.emit('UploadShpZipCompleted', { Issuccess: true, Info: layerName, features: response.featureCollection.layers[0].featureSet.features });

                         //debugger;
                         //var fullExtent;
                         //var layers = [];

                         //arrayUtils.forEach(response.featureCollection.layers, function (layer) {
                         //    var infoTemplate = new InfoTemplate("Details", "${*}");
                         //    var featureLayer = new FeatureLayer(layer, {
                         //        infoTemplate: infoTemplate
                         //    });
                         //    //associate the feature with the popup on click to enable highlight and zoom to
                         //    featureLayer.on('click', function (event) {
                         //        this.arcMap.infoWindow.setFeatures([event.graphic]);
                         //    });
                         //    //change default symbol if desired. Comment this out and the layer will draw with the default symbology
                         //    //changeRenderer(featureLayer);
                         //    fullExtent = fullExtent ?
                         //      fullExtent.union(featureLayer.fullExtent) : featureLayer.fullExtent;
                         //    layers.push(featureLayer);
                         //});
                         //debugger;
                         //fullExtent.setSpatialReference(this.arcMap.spatialReference);
                         //this.arcMap.addLayers(layers);
                         //this.arcMap.setExtent(fullExtent.expand(1.25), true);
                     }),
                     error: lang.hitch(this, function (error) {
                         root.emit('UploadShpZipCompleted', {Issuccess: false, Info: error.message, features:null});
                     })
                 });
             
             },
             bufferClick: function (m) {
                 this._isbufferclick = true;
                 this._bufferdistance = m;
             }
         });


         return WeiMap;
     });