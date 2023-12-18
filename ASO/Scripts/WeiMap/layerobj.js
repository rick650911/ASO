require(['dojo/_base/declare', "dojo/Evented", "esri/layers/WMTSLayer", "esri/layers/WMTSLayerInfo", "esri/layers/TileInfo", "esri/geometry/Extent",
    "esri/SpatialReference", "esri/layers/WMSLayer", "esri/layers/WMSLayerInfo", "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/FeatureLayer", "esri/layers/GraphicsLayer" ,  "esri/InfoTemplate", "esri/symbols/SimpleFillSymbol",
    "esri/graphic", "dojo/_base/lang", "dojo/_base/array", "esri/layers/LabelLayer", "esri/symbols/TextSymbol",
    "esri/renderers/SimpleRenderer", "esri/tasks/query", "esri/renderers/ClassBreaksRenderer", "extras/WeiYiRoadLayer",
    "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/PictureMarkerSymbol", "esri/tasks/QueryTask",
    "esri/geometry/Polygon", "esri/renderers/UniqueValueRenderer", "esri/symbols/SimpleLineSymbol", "esri/Color",
    "esri/renderers/HeatmapRenderer"],
    function (declare, Evented, WMTSLayer, WMTSLayerInfo, TileInfo, Extent, SpatialReference, WMSLayer, WMSLayerInfo,
        ArcGISTiledMapServiceLayer, ArcGISDynamicMapServiceLayer, FeatureLayer, GraphicsLayer, InfoTemplate, SimpleFillSymbol,
        Graphic, lang, arrayUtils, LabelLayer, TextSymbol, SimpleRenderer, Query, ClassBreaksRenderer, WeiYiRoadLayer,
        Point, SimpleMarkerSymbol, PictureMarkerSymbol, QueryTask, Polygon, UniqueValueRenderer, SimpleLineSymbol,
        Color, HeatmapRenderer) {
        var WeiLayer = declare("WeiLayer", [Evented], {
            url: '',
            layer: null,
            layertype: '',
            map: null,
            arc: null,
            id: '',
            visible: false,
            pointSymbol: null,
            lineSymbol: null,
            polygonSymbol: null,
            strwhere:'',

            _tempGraphic: null,
            _isShowFeatureData: true,
            _labelLayer: null,
            _render: null,
            _weiroadlayerbreaks: {},
            _getinfo: null,


            constructor: function (options) {
                this.url = options.url;
                this.layer = null;
                this.layertype = options.layertype || OpLayerType.nlsc97;
                this.map = null;
                this.id = options.id;
                this.visible = options.visible || false;
                this.strwhere = options.strwhere;
            },
            show: function () {
                if (this._check()) {
                    this.layer.show();
                }
            },
            hide: function () {
                if (this._check()) {
                    this.layer.hide();
                }
            },
            AddToMap: function () {
                switch (this.layertype) {
                    case OpLayerType.nlsc97:
                        this._addwmtsnlsc(this.map.extent);
                        break;
                    case EMAP3826_OPENDATA:
                        this._addnlscEMAP3826(this.map.extent);
                        break;
                    case PHOTO3826:
                        this._addnlscPHOTO3826(this.map.extent);
                        break;
                    case OpLayerType.nlscwms:
                        this._addwmsnlsc(this.map.extent);
                        break;
                    case OpLayerType.tgos97:
                        this._addtgos();
                        break;
                    case OpLayerType.ntpctiled:
                        this._addntpctiled();
                        break;
                    case OpLayerType.ntpcdynamic:
                        this._addntpcdynamic();
                        break;
                    case OpLayerType.mapserviceLayer:
                        this._addmapserviceLayer();
                        break;
                    case OpLayerType.featureLayer:
                        this._addfeatureserviceLayer();
                        break;
                    case OpLayerType.aso97:
                        this._addAsoLayer(this.map.extent);
                        break;
                    case QueryLayer:
                        this._addQueryLayer();
                        break;
                    case testASO4:
                        this._addWMSLayer();
                        break;
                }
            },
            getLegend: function () {
                var root = this;
                var end = this.layer.url.toLowerCase().indexOf('/mapserver');
                var mapservicesurl = this.layer.url.substring(0, end + 10);
                var index = -1;
                if (this.layer instanceof FeatureLayer) {
                    index = this.layer.url.substring(end + 11, this.layer.url.length);
                }
                var handle = esri.request({
                    url: mapservicesurl + '/legend',
                    content: {
                        f: "json"
                    },
                    callbackParamName: 'callback',
                    handleAs: 'json',
                    load: lang.hitch(this, function (data) {
                        var layerLookup = {};
                        if (index > -1) {
                            var alayer = dojo.filter(data.layers, function (item) {
                                return item.layerId == index;
                            })[0];
                            var layerInfo = arrayUtils.map(alayer.legend, function (layer, index) {
                                return {
                                    label: layer.label,
                                    url: "data:image/png;base64," + layer.imageData
                                };
                            });
                            layerLookup['' + index] = layerInfo;
                        }
                        else {
                            for (i = 0; i < data.layers.length; i++) {
                                var alayer = dojo.filter(data.layers, function (item) {
                                    return item.layerId == data.layers[i].layerId;
                                })[0];

                                var layerInfo = arrayUtils.map(alayer.legend, function (layer, index) {
                                    return {
                                        label: layer.label,
                                        url: "data:image/png;base64," + layer.imageData
                                    };
                                });
                                layerLookup['' + data.layers[i].layerId] = layerInfo;
                            }
                        }
                        root.emit('LegendReturn', layerLookup);
                    }),
                    error: lang.hitch(this, function (err) {
                        alert(err);
                    })
                });


            },
            setOpacity: function (opacity) {
                if (this.layertype == OpLayerType.mapserviceLayer || this.layertype == OpLayerType.featureLayer) {
                    this.layer.setOpacity(opacity);
                }
                else {
                    alert('this layer can not set opacity!');
                }
            },
            setFeatureInfo: function (getinfo) {
                this._getinfo = getinfo;
                var root = this;
                if (this.layertype == OpLayerType.featureLayer) {
                    this.layer.on("click", function (evt) {
                        if (root._tempGraphic != null) {
                            root.map.graphics.remove(root._tempGraphic);
                        }
                        if (root._isShowFeatureData) {
                            var o = getinfo(evt.graphic.attributes);
                            root.map.infoWindow.setTitle(o.title);
                            root.map.infoWindow.setContent(o.content);
                            root.map.infoWindow.resize(o.w, o.h);
                            root.map.infoWindow.show(evt.mapPoint);
                        }
                        root._tempGraphic = new Graphic(evt.graphic.geometry, new SimpleFillSymbol());
                        root.map.graphics.add(root._tempGraphic);
                    });
                }
                else if (this.layer instanceof WeiYiRoadLayer) {
                    //debugger;
                    this.layer.fun = getinfo;
                }
                else {
                    alert('this layer can not set FeatureInfo!');
                }

            },
            setFeatureCickable: function (clickable) {
                this._isShowFeatureData = clickable;
            },
            getfeatures: function (strwhere) {
                if (!this.layer instanceof FeatureLayer) {
                    alert('this layer not support!');
                    return;
                }
                var root = this;
                var query = new Query();
                query.outFields = ["OBJECTID"];
                query.where = strwhere;
                query.returnGeometry = true;
                this.layer.setSelectionSymbol(this.arc.defPolygonSymbol);
                this.layer.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (result) {
                    var gs = arrayUtils.map(result, function (g, index) {
                        return {
                            objid: g.attributes.OBJECTID,
                            g: g.geometry
                        };
                    });

                    root.arc.fitGeometry([gs[0].g]);

                    if (root._getinfo != null) {
                        var o = root._getinfo(gs[0].objid);
                        root.map.infoWindow.setTitle(o.title);
                        root.map.infoWindow.setContent(o.content);
                        root.map.infoWindow.resize(o.w, o.h);
                        root.arc.loadDrawGraphic([gs[0].g], 1);
                        if (gs[0].g instanceof Polygon) {
                            root.map.infoWindow.show(gs[0].g.getPoint(0, 0));
                        }
                    }
                    root.emit('QueryCompleted', gs);
                });

            },
            getSpatialFeatures: function (geometry) {
                if (!this.layer instanceof FeatureLayer) {
                    alert('this layer not support!');
                    return;
                }
                var root = this;
                geometry.spatialReference = this.map.spatialReference;
                var g = new Polygon(this.map.spatialReference);
                g.addRing(geometry.rings[0]);
                var queryTask = new QueryTask(this.layer.url);
                var query = new Query();
                query.returnGeometry = true;
                query.outFields = ["OBJECTID"];
                query.geometry = g;
                query.spatialRelationship = Query.SPATIAL_REL_CONTAINS;
                queryTask.execute(query, function (result) {
                    var gs = arrayUtils.map(result.features, function (g, index) {
                        return {
                            objid: g.attributes.OBJECTID,
                            g: g.geometry
                        };
                    });
                    root.emit('QueryCompleted', gs);
                }, function (error) {
                    //debugger;
                });

            },
            showText: function (field) {
                if (!this.layer instanceof FeatureLayer) {
                    alert('this layer not support!');
                    return;
                }
                if (this._labelLayer != null) {
                    return;
                }
                this._labelLayer = new LabelLayer({ id: this.id + 'lab', mode: "DYNAMIC" });
                var symbol = new TextSymbol();
                symbol.font.setSize("8pt");
                symbol.font.setFamily("arial");
                var renderer = new SimpleRenderer(symbol);
                this._labelLayer.addFeatureLayer(this.layer, renderer, "{" + field + "}");
                this.map.addLayer(this._labelLayer);
            },
            setBreakPolygonRenderer: function (arg) {
                var symbol = new SimpleFillSymbol();
                symbol.setColor(new Color([150, 150, 150, 0.5]));
                var renderer = new ClassBreaksRenderer(symbol, arg.field);
                for (i = 0; i < arg.range.length; i++) {
                    var redColor = Color.fromHex(arg.range[i].color);
                    renderer.addBreak(arg.range[i].Min, arg.range[i].Max, new SimpleFillSymbol().setColor(redColor));
                }
                this.layer.setRenderer(renderer);

                this.layer.refresh();
                if (this._labelLayer != nul) {
                    this._labelLayer.refresh();
                }
            },
            addWeiRoadLayerIcon: function (casetype, iconpath, w, h) {
                var intstatus = parseInt(casetype);
                intstatus = 1000000 + intstatus;
                var iconinfo = {};
                iconinfo.path = iconpath;
                iconinfo.h = h;
                iconinfo.w = w;
                this._weiroadlayerbreaks[intstatus] = iconinfo;
            },
            loadWeiRoadLayerData: function (caselist) {
                var root = this;
                var distance = root.map.getScale() / 3500;
                if (root.layer != null) {
                    root.map.removeLayer(root.layer);
                }
                var caseInfo = {};
                caseInfo.data = arrayUtils.map(caselist, function (p) {
                    var latlng = new Point(parseFloat(p.LocX), parseFloat(p.LocY), root.map.spatialReference);
                    var attributes = {
                        "CaseKey": p.CaseKey,
                        "CaseType": p.CaseType,
                        "AreaType": p.AreaType,
                        "CaseArea": p.CaseArea
                    };
                    return {
                        "x": latlng.x,
                        "y": latlng.y,
                        "attributes": attributes
                    };
                });
                //debugger;
                this.layer = new WeiYiRoadLayer({
                    "data": caseInfo.data,
                    "distance": distance,
                    "id": "clusters",
                    "labelColor": "#fff",
                    "labelOffset": 5,
                    "resolution": root.map.extent.getWidth() / root.map.width,
                    "singleColor": "#888",
                    "showSingles": true,
                    "PSymbol": root.polygonSymbol,
                    "LSymbol": root.lineSymbol,
                    "PointSymbol": root.pointSymbol
                });

                var defaultSym = new SimpleMarkerSymbol();
                root._renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");

                var blue = new PictureMarkerSymbol(mapimgroot + "regionalicon-blue.png", 42, 42).setOffset(0, 15);
                var green = new PictureMarkerSymbol(mapimgroot + "regionalicon-blue.png", 52, 52).setOffset(0, 15);
                var red = new PictureMarkerSymbol(mapimgroot + "regionalicon-blue.png", 60, 60).setOffset(0, 15);
                root._renderer.addBreak(2, 9, blue);
                root._renderer.addBreak(10, 99, green);
                root._renderer.addBreak(100, 100001, red);
                for (var key in root._weiroadlayerbreaks) {
                    root._renderer.addBreak(key, key, new PictureMarkerSymbol(root._weiroadlayerbreaks[key].path, root._weiroadlayerbreaks[key].w, root._weiroadlayerbreaks[key].h));  //A1
                }
                this.layer.setRenderer(root._renderer);
                root.map.addLayer(this.layer);


            },
            markFeature: function (key, values) {
                if (!this.layer instanceof FeatureLayer) {
                    alert('此圖層不支援!only for FeatureLayer');
                    return;
                }
                switch (this.layer.geometryType) {
                    case "esriGeometryPolygon":
                        var defaultSymbol = new SimpleFillSymbol().setStyle(SimpleFillSymbol.STYLE_NULL);
                        defaultSymbol.outline.setStyle(SimpleLineSymbol.STYLE_NULL);
                        var renderer = new UniqueValueRenderer(defaultSymbol, key);
                        for (i = 0; i < values.length; i++) {
                            renderer.addValue(values[i], new SimpleFillSymbol().setColor(new Color([255, 0, 0, 0.5])));
                            break;
                        }
                        this.layer.setRenderer(renderer);
                        this.layer.refresh();
                        break;
                    case "esriGeometryPolyline":
                        break;
                    case "esriGeometryPoint":
                        break;
                }
            },
            toHeatmap: function (keyfield, funtitle, funcontent) {
                if (!this.layer instanceof FeatureLayer) {
                    alert('此圖層不支援!only for FeatureLayer');
                    return;
                }
                var template = new InfoTemplate();
                var ftitle = "${" + keyfield + ":" + funtitle + "}";
                var fcontent = "${" + keyfield + ":" + funcontent + "}";
                template.setTitle(ftitle);
                template.setContent(fcontent);
                this.layer.setInfoTemplate(template);

                var heatmapRenderer = new HeatmapRenderer({
                    blurRadius: 20,
                    colors: ["rgba(0, 0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 0, 255)", "rgb(255, 0, 0)"],
                    //maxPixelIntensity: 150,
                    //minPixelIntensity: 10
                });
                this.layer.setRenderer(heatmapRenderer);
            },
            setDefinition: function (expression) {
                if (!this.layer instanceof FeatureLayer) {
                    alert('此圖層不支援!only for FeatureLayer');
                    return;
                }
                this.layer.setDefinitionExpression(expression);
            },
            showSubLayer: function (id) {
                if (!this.layer instanceof ArcGISDynamicMapServiceLayer) {
                    alert('this layer not support!');
                    return;
                }
                var ids = this.layer.visibleLayers;
                if (ids.indexOf(id) < 0) {
                    var vids = [];
                    for (var k = 0; k < ids.length; k++) {
                        var alayer = dojo.filter(this.layer.layerInfos, function (item) {
                            return item.id == ids[k];
                        })[0];
                        if (alayer.parentLayerId > 0) {
                            vids.push(ids[k]);
                        }
                    }
                    vids.push(id);
                    this.layer.setVisibleLayers(vids);
                }
            },
            hideSubLayer: function (id) {
                if (!this.layer instanceof ArcGISDynamicMapServiceLayer) {
                    alert('this layer not support!');
                    return;
                }
                var ids = this.layer.visibleLayers;
                var idindex = ids.indexOf(id);
                if (idindex > -1) {
                    var vids = [];
                    for (var k = 0; k < ids.length; k++) {
                        var alayer = dojo.filter(this.layer.layerInfos, function (item) {
                            return item.id == ids[k];
                        })[0];
                        if (alayer.parentLayerId > 0) {
                            if (ids[k] != id) {
                                vids.push(ids[k]);
                            }
                        }
                    }
                    this.layer.setVisibleLayers(vids);
                }
            },
            getSubVisableLayer: function () {
                if (!this.layer instanceof ArcGISDynamicMapServiceLayer) {
                    alert('this layer not support!');
                    return;
                }
                var ids = this.layer.visibleLayers;
                var vids = [];
                for (var k = 0; k < ids.length; k++) {
                    var alayer = dojo.filter(this.layer.layerInfos, function (item) {
                        return item.id == ids[k];
                    })[0];
                    if (alayer.parentLayerId > 0) {
                        vids.push(ids[k]);
                    }
                }
                return vids;
            },
            _check: function () {
                if (this.map == null) {
                    alert('this layer not add to map');
                    return false;
                }
                else {
                    return true;
                }
            },
            _addtgos: function () {
                this.url = this.url == '' ? 'http://210.242.163.56/TgosProxy/proxy.ashx?http://api.tgos.nat.gov.tw/TileAgent/TGOSMAP.aspx' : this.url;

                this.layer = new SGSTileLayer(this.url, "", 0);
                this.layer.id = this.id;
                this.layer.visible = this.visible;
                //debugger;
                this.map.addLayer(this.layer);
            },
            _addwmtsnlsc: function (aExtent) {
                var tileInfo2 = new TileInfo({
                    "dpi": 90.714,
                    "format": "image/png",
                    "compressionQuality": 0,
                    "spatialReference": { wkid: 102443 },//"wkid": "102443"
                    "rows": 256,
                    "cols": 256,
                    "origin": {
                        "x": 50000,
                        "y": 3000000
                    },
                    "lods": [
                        {
                            "level": "0",
                            "scale": 11811780,
                            "resolution": 3307.2984
                        }
                        , {
                            "level": "1",
                            "scale": 9449424,
                            "resolution": 2645.83872
                        }
                        , {
                            "level": "2",
                            "scale": 4724712,
                            "resolution": 1322.91936
                        }
                        , {
                            "level": "3",
                            "scale": 2362356,
                            "resolution": 661.45968
                        }
                        , {
                            "level": "4",
                            "scale": 944942,
                            "resolution": 264.58376
                        }
                        , {
                            "level": "5",
                            "scale": 472471,
                            "resolution": 132.29188
                        }
                        , {
                            "level": "6",
                            "scale": 236236,
                            "resolution": 66.14608
                        }
                        , {
                            "level": "7",
                            "scale": 94494,
                            "resolution": 26.45832
                        }
                        , {
                            "level": "8",
                            "scale": 47247,
                            "resolution": 13.22916
                        }
                        , {
                            "level": "9",
                            "scale": 23624,
                            "resolution": 6.61472
                        }
                        , {
                            "level": "10",
                            "scale": 9449,
                            "resolution": 2.64572
                        }
                        , {
                            "level": "11",
                            "scale": 4725,
                            "resolution": 1.323
                        }
                        , {
                            "level": "12",
                            "scale": 2362,
                            "resolution": 0.66136
                        }
                        , {
                            "level": "13",
                            "scale": 994,
                            "resolution": 0.27832
                        }
                    ]
                });
                var tileExtent2 = new Extent(50000, 2397000, 641000, 3000000, new SpatialReference({ wkid: 102443 }));
                var layerInfo2 = new WMTSLayerInfo({
                    tileInfo: tileInfo2,
                    fullExtent: tileExtent2,
                    initialExtent: aExtent,
                    identifier: "EMAP3826",
                    tileMatrixSet: "EPSG:3826",
                    format: "png",
                    style: "_null"
                });

                var resourceInfo = {
                    version: "1.0.0",
                    layerInfos: [layerInfo2], //layerInfo1, 
                    copyright: "open layer"
                };

                var options = {
                    serviceMode: "KVP",
                    resourceInfo: resourceInfo,
                    layerInfo: layerInfo2
                };

                this.url = this.url == '' ? 'http://landmaps.nlsc.gov.tw/Maps97/wmts' : this.url;
                this.layer = new WMTSLayer(this.url, options);

                this.map.addLayer(this.layer);
            },
            //_addnlscEMAP3826: function (aExtent) {
            //    var tileInfo2 = new TileInfo({
            //        "dpi": 90.714,
            //        "format": "image/png",
            //        "compressionQuality": 0,
            //        "spatialReference": { wkid: 102443 },//"wkid": "102443"
            //        "rows": 256,
            //        "cols": 256,
            //        "origin": {
            //            "x": 50000,
            //            "y": 3000000
            //        },
            //        "lods": [
            //            {
            //                "level": "0",
            //                "scale": 11811780,
            //                "resolution": 3307.2984
            //            }
            //            , {
            //                "level": "1",
            //                "scale": 9449424,
            //                "resolution": 2645.83872
            //            }
            //            , {
            //                "level": "2",
            //                "scale": 4724712,
            //                "resolution": 1322.91936
            //            }
            //            , {
            //                "level": "3",
            //                "scale": 2362356,
            //                "resolution": 661.45968
            //            }
            //            , {
            //                "level": "4",
            //                "scale": 944942,
            //                "resolution": 264.58376
            //            }
            //            , {
            //                "level": "5",
            //                "scale": 472471,
            //                "resolution": 132.29188
            //            }
            //            , {
            //                "level": "6",
            //                "scale": 236236,
            //                "resolution": 66.14608
            //            }
            //            , {
            //                "level": "7",
            //                "scale": 94494,
            //                "resolution": 26.45832
            //            }
            //            , {
            //                "level": "8",
            //                "scale": 47247,
            //                "resolution": 13.22916
            //            }
            //            , {
            //                "level": "9",
            //                "scale": 23624,
            //                "resolution": 6.61472
            //            }
            //            , {
            //                "level": "10",
            //                "scale": 9449,
            //                "resolution": 2.64572
            //            }
            //            , {
            //                "level": "11",
            //                "scale": 4725,
            //                "resolution": 1.323
            //            }
            //            , {
            //                "level": "12",
            //                "scale": 2362,
            //                "resolution": 0.66136
            //            }
            //            , {
            //                "level": "13",
            //                "scale": 994,
            //                "resolution": 0.27832
            //            }
            //        ]
            //    });
            //    var tileExtent2 = new Extent(50000, 2397000, 641000, 3000000, new SpatialReference({ wkid: 102443 }));
            //    var layerInfo2 = new WMTSLayerInfo({
            //        tileInfo: tileInfo2,
            //        fullExtent: tileExtent2,
            //        initialExtent: aExtent,
            //        identifier: "EMAP3826",
            //        tileMatrixSet: "default028mm",
            //        format: "jpeg",
            //        style: "_null"
            //    });

            //    var resourceInfo = {
            //        version: "1.0.0",
            //        layerInfos: [layerInfo2], //layerInfo1, 
            //        copyright: "open layer"
            //    };

            //    var options = {
            //        serviceMode: "KVP",
            //        resourceInfo: resourceInfo,
            //        layerInfo: layerInfo2
            //    };

            //    this.url = "https://wmts.nlsc.gov.tw/97/wmts";
            //    this.layer = new WMTSLayer(this.url, options);
            //    this.layer.id = this.id;
            //    this.layer.visible = this.visible;

            //    this.map.addLayer(this.layer);
            //},
            _addnlscEMAP3826: function (aExtent) {
                var tileInfo2 = new TileInfo({
                    "dpi": 90.714,
                    "format": "image/png",
                    "compressionQuality": 0,
                    "spatialReference": { wkid: 102443 },//"wkid": "102443"
                    "rows": 256,
                    "cols": 256,
                    "origin": {
                        "x": 50000,
                        "y": 3000000
                    },
                    "lods": [
                        {
                            "level": "0",
                            "scale": 11811780,
                            "resolution": 3307.2984
                        }
                        , {
                            "level": "1",
                            "scale": 9449424,
                            "resolution": 2645.83872
                        }
                        , {
                            "level": "2",
                            "scale": 4724712,
                            "resolution": 1322.91936
                        }
                        , {
                            "level": "3",
                            "scale": 2362356,
                            "resolution": 661.45968
                        }
                        , {
                            "level": "4",
                            "scale": 944942,
                            "resolution": 264.58376
                        }
                        , {
                            "level": "5",
                            "scale": 472471,
                            "resolution": 132.29188
                        }
                        , {
                            "level": "6",
                            "scale": 236236,
                            "resolution": 66.14608
                        }
                        , {
                            "level": "7",
                            "scale": 94494,
                            "resolution": 26.45832
                        }
                        , {
                            "level": "8",
                            "scale": 47247,
                            "resolution": 13.22916
                        }
                        , {
                            "level": "9",
                            "scale": 23624,
                            "resolution": 6.61472
                        }
                        , {
                            "level": "10",
                            "scale": 9449,
                            "resolution": 2.64572
                        }
                        , {
                            "level": "11",
                            "scale": 4725,
                            "resolution": 1.323
                        }
                        , {
                            "level": "12",
                            "scale": 2362,
                            "resolution": 0.66136
                        }
                        , {
                            "level": "13",
                            "scale": 994,
                            "resolution": 0.27832
                        }
                    ]
                });
                var tileExtent2 = new Extent(50000, 2397000, 641000, 3000000, new SpatialReference({ wkid: 102443 }));

                this.layer = new WMTSLayer("/photo-interpretation/wmts97.xml", {
                    id: this.id,
                    serviceMode: "KVP",
                    layerInfo: new WMTSLayerInfo({
                        tileInfo: tileInfo2,
                        identifier: "EMAP3826",
                        tileMatrixSet: "default028mm",
                        format: "jpeg",
                        initialExtent: aExtent,
                        fullExtent: tileExtent2
                    })
                });

                this.layer.visible = this.visible;

                this.map.addLayer(this.layer);
            },

            //_addnlscPHOTO3826: function (aExtent) {
            //    var tileInfo2 = new TileInfo({
            //        "dpi": 90.714,
            //        "format": "image/png",
            //        "compressionQuality": 0,
            //        "spatialReference": { wkid: 102443 },//"wkid": "102443"
            //        "rows": 256,
            //        "cols": 256,
            //        "origin": {
            //            "x": 50000,
            //            "y": 3000000
            //        },
            //        "lods": [
            //            {
            //                "level": "0",
            //                "scale": 11811780,
            //                "resolution": 3307.2984
            //            }
            //            , {
            //                "level": "1",
            //                "scale": 9449424,
            //                "resolution": 2645.83872
            //            }
            //            , {
            //                "level": "2",
            //                "scale": 4724712,
            //                "resolution": 1322.91936
            //            }
            //            , {
            //                "level": "3",
            //                "scale": 2362356,
            //                "resolution": 661.45968
            //            }
            //            , {
            //                "level": "4",
            //                "scale": 944942,
            //                "resolution": 264.58376
            //            }
            //            , {
            //                "level": "5",
            //                "scale": 472471,
            //                "resolution": 132.29188
            //            }
            //            , {
            //                "level": "6",
            //                "scale": 236236,
            //                "resolution": 66.14608
            //            }
            //            , {
            //                "level": "7",
            //                "scale": 94494,
            //                "resolution": 26.45832
            //            }
            //            , {
            //                "level": "8",
            //                "scale": 47247,
            //                "resolution": 13.22916
            //            }
            //            , {
            //                "level": "9",
            //                "scale": 23624,
            //                "resolution": 6.61472
            //            }
            //            , {
            //                "level": "10",
            //                "scale": 9449,
            //                "resolution": 2.64572
            //            }
            //            , {
            //                "level": "11",
            //                "scale": 4725,
            //                "resolution": 1.323
            //            }
            //            , {
            //                "level": "12",
            //                "scale": 2362,
            //                "resolution": 0.66136
            //            }
            //            , {
            //                "level": "13",
            //                "scale": 994,
            //                "resolution": 0.27832
            //            }
            //        ]
            //    });
            //    var tileExtent2 = new Extent(50000, 2397000, 641000, 3000000, new SpatialReference({ wkid: 102443 }));
            //    var layerInfo2 = new WMTSLayerInfo({
            //        tileInfo: tileInfo2,
            //        fullExtent: tileExtent2,
            //        initialExtent: aExtent,
            //        identifier: "PHOTO3826",
            //        tileMatrixSet: "default028mm",
            //        format: "jpeg",
            //        style: "_null"
            //    });

            //    var resourceInfo = {
            //        version: "1.0.0",
            //        layerInfos: [layerInfo2], //layerInfo1, 
            //        copyright: "open layer"
            //    };

            //    var options = {
            //        serviceMode: "KVP",
            //        resourceInfo: resourceInfo,
            //        layerInfo: layerInfo2
            //    };

            //    this.url = "https://wmts.nlsc.gov.tw/97/wmts";
            //    this.layer = new WMTSLayer(this.url, options);
            //    this.layer.id = this.id;
            //    this.layer.visible = this.visible;

            //    this.map.addLayer(this.layer);
            //},
            _addnlscPHOTO3826: function (aExtent) {
                var tileInfo2 = new TileInfo({
                    "dpi": 90.714,
                    "format": "image/png",
                    "compressionQuality": 0,
                    "spatialReference": { wkid: 102443 },//"wkid": "102443"
                    "rows": 256,
                    "cols": 256,
                    "origin": {
                        "x": 50000,
                        "y": 3000000
                    },
                    "lods": [
                        {
                            "level": "0",
                            "scale": 11811780,
                            "resolution": 3307.2984
                        }
                        , {
                            "level": "1",
                            "scale": 9449424,
                            "resolution": 2645.83872
                        }
                        , {
                            "level": "2",
                            "scale": 4724712,
                            "resolution": 1322.91936
                        }
                        , {
                            "level": "3",
                            "scale": 2362356,
                            "resolution": 661.45968
                        }
                        , {
                            "level": "4",
                            "scale": 944942,
                            "resolution": 264.58376
                        }
                        , {
                            "level": "5",
                            "scale": 472471,
                            "resolution": 132.29188
                        }
                        , {
                            "level": "6",
                            "scale": 236236,
                            "resolution": 66.14608
                        }
                        , {
                            "level": "7",
                            "scale": 94494,
                            "resolution": 26.45832
                        }
                        , {
                            "level": "8",
                            "scale": 47247,
                            "resolution": 13.22916
                        }
                        , {
                            "level": "9",
                            "scale": 23624,
                            "resolution": 6.61472
                        }
                        , {
                            "level": "10",
                            "scale": 9449,
                            "resolution": 2.64572
                        }
                        , {
                            "level": "11",
                            "scale": 4725,
                            "resolution": 1.323
                        }
                        , {
                            "level": "12",
                            "scale": 2362,
                            "resolution": 0.66136
                        }
                        , {
                            "level": "13",
                            "scale": 994,
                            "resolution": 0.27832
                        }
                    ]
                });
                var tileExtent2 = new Extent(50000, 2397000, 641000, 3000000, new SpatialReference({ wkid: 102443 }));

                this.layer = new WMTSLayer("/photo-interpretation/wmts97.xml", {
                    id: this.id,
                    serviceMode: "KVP",
                    layerInfo: new WMTSLayerInfo({
                        tileInfo: tileInfo2,
                        identifier: "PHOTO3826",
                        tileMatrixSet: "default028mm",
                        format: "jpeg",
                        initialExtent: aExtent,
                        fullExtent: tileExtent2
                    })
                });

                this.layer.visible = this.visible;

                this.map.addLayer(this.layer);
            },
            _addtestASO4: function (aExtent) {
                var tileInfo2 = new TileInfo({
                    "dpi": 96,
                    "format": "image/png",
                    "compressionQuality": 0,
                    "spatialReference": { wkid: 102100   },//"wkid": "102443"
                    "rows": 256,
                    "cols": 256,
                    "origin": {
                        "x": -2.0037508342787E7,
                        "y": 2.0037508342787E7
                    },
                    "lods": [
                        {
                            "level": "0",
                            "scale": 5.91657527591555E8,
                            "resolution": 156543.033928
                        }
                        , {
                            "level": "1",
                            "scale": 2.95828763795777E8,
                            "resolution": 78271.5169639999
                        }
                        , {
                            "level": "2",
                            "scale": 1.47914381897889E8,
                            "resolution": 39135.7584820001
                        }
                        , {
                            "level": "3",
                            "scale": 7.3957190948944E7,
                            "resolution": 19567.8792409999
                        }
                        , {
                            "level": "4",
                            "scale": 3.6978595474472E7,
                            "resolution": 9783.93962049996
                        }
                        , {
                            "level": "5",
                            "scale": 1.8489297737236E7,
                            "resolution": 4891.96981024998
                        }
                        , {
                            "level": "6",
                            "scale": 9244648.868618,
                            "resolution": 2445.98490512499
                        }
                        , {
                            "level": "7",
                            "scale": 4622324.434309,
                            "resolution": 1222.99245256249
                        }
                        , {
                            "level": "8",
                            "scale": 2311162.217155,
                            "resolution": 611.49622628138
                        }
                        , {
                            "level": "9",
                            "scale": 1155581.108577,
                            "resolution": 305.748113140558
                        }
                        , {
                            "level": "10",
                            "scale": 577790.554289,
                            "resolution": 152.874056570411
                        }
                        , {
                            "level": "11",
                            "scale": 288895.277144,
                            "resolution": 76.4370282850732
                        }
                        , {
                            "level": "12",
                            "scale": 144447.638572,
                            "resolution": 38.2185141425366
                        }
                        , {
                            "level": "13",
                            "scale": 72223.819286,
                            "resolution": 19.1092570712683
                        }
                    ]
                });
                //var tileExtent2 = new Extent(50000, 2397000, 641000, 3000000, new SpatialReference({ wkid: 102100 }));
                var tileExtent2 = new Extent(1.3250196341426963E7, 2688321.0339338086, 1.3726218713157611E7, 2896092.933008538, new SpatialReference({ wkid: 102100 }));

                var layerInfo2 = new WMTSLayerInfo({
                    tileInfo: tileInfo2,
                    fullExtent: tileExtent2,
                    initialExtent: aExtent,
                    identifier: "ASO4",
                    tileMatrixSet: "default028mm",
                    format: "png",
                    style: "_null"
                });

                var resourceInfo = {
                    version: "1.0.0",
                    layerInfos: [layerInfo2], //layerInfo1, 
                    copyright: "open layer"
                };

                var options = {
                    serviceMode: "KVP",
                    resourceInfo: resourceInfo,
                    layerInfo: layerInfo2
                };

                this.url = "http://118.163.96.187/arcgis/rest/services/ASO4/MapServer/WMTS/";
                this.layer = new WMTSLayer(this.url, options);
                this.layer.id = this.id;
                this.layer.visible = this.visible;

                this.map.addLayer(this.layer);
            },
            _addWMSLayer: function (aExtent) {
                var layer1 = new WMSLayerInfo({
                    name: "全島森林林型分布圖",
                    title: "全島森林林型分布圖"

                });
                var resourceInfo = {
                    extent: aExtent,
                    layerInfos: [layer1]
                };
                this.url = this.url == '' ? 'http://118.163.96.187/arcgis/services/ASO5/MapServer/WMSServer' : this.url;
                this.layer = new WMSLayer(this.url, {
                    resourceInfo: resourceInfo,
                    visibleLayers: ['全島森林林型分布圖'],
                    format: 'image/png'
                });
                this.layer.version = "1.1.1";
                this.layer.imageFormat = 'image/png';

                this.map.addLayer(this.layer);
            },
            _addAsoLayer: function (aExtent) {
                var layer1 = new WMSLayerInfo({
                    name: this.id,
                    title: this.id

                });
                var resourceInfo = {
                    extent: aExtent,
                    layerInfos: [layer1]
                };
                this.url = this.url == '' ? 'http://210.242.163.56/ProxyN/proxy.ashx?http://wms.afasi.gov.tw/asofb/wms' : this.url;
                this.layer = new WMSLayer(this.url, {
                    resourceInfo: resourceInfo,
                    visibleLayers: ['ATIS_MNC'],
                    format: 'image/jpeg'
                });
                this.layer.version = "1.1.1";
                this.layer.imageFormat = 'image/jpeg';

                this.map.addLayer(this.layer);
            },
            _addwmsnlsc: function (aExtent) {
                var layer1 = new WMSLayerInfo({
                    name: this.id,
                    title: this.id
                });
                var resourceInfo = {
                    extent: aExtent,
                    layerInfos: [layer1]
                };

                this.url = this.url == '' ? 'http://maps.nlsc.gov.tw/S_Maps/wms' : this.url;
                this.layer = new WMSLayer(this.url, {
                    resourceInfo: resourceInfo,
                    visibleLayers: ['EMAP'],
                });
                this.layer.version = '1.1.1';

                this.map.addLayer(this.layer);
            },
            _addntpctiled: function () {
                this.url = this.url == '' ? 'http://gis1.ntpc.gov.tw/gis/rest/services/map/MapServer' : this.url;
                this.layer = new ArcGISTiledMapServiceLayer(this.url, {
                    id: this.id,
                    visible: this.visible
                });
                this.map.addLayer(this.layer);
            },
            _addntpcdynamic: function () {
                this.url = this.url == '' ? 'https://10.51.231.56/arcgis/rest/services/%E7%AC%AC%E5%9B%9B%E6%AC%A1%E6%A3%AE%E6%9E%97%E8%B3%87%E6%BA%90%E8%AA%BF%E6%9F%A5/MapServer' : this.url;
                this.layer = new ArcGISDynamicMapServiceLayer(this.url, {
                    id: this.id,
                    visible: this.visible
                })
                this.map.addLayer(this.layer);
            },
            _addmapserviceLayer: function () {
                this.layer = new ArcGISDynamicMapServiceLayer(this.url, {
                    id: this.id,
                    visible: this.visible
                })
                //this.layer.setDisableClientCaching(true);
                this.map.addLayer(this.layer);
            },
            _addfeatureserviceLayer: function () {
                this.layer = new FeatureLayer(this.url, {
                    id: this.id,
                    visible: this.visible,
                    outFields: ["*"]
                })
                this.map.addLayer(this.layer);
            },
            _addQueryLayer: function () {
                var layer = this.layer;
                var map = this.map;
                layer = new GraphicsLayer({
                    id: this.id,
                    visible: this.visible
                });
                var queryTask = new QueryTask(this.url);
                var query = new Query();
                query.outSpatialReference = { wkid: 3826 };
                query.returnGeometry = true;
                query.outFields = ["*"];
                query.where = this.strwhere;
                queryTask.execute(query, function (result) {
                    for (i in result.features) {
                        var data = result.features[i].attributes;
                        var point = result.features[i].geometry;
                        var marker = new PictureMarkerSymbol();
                        marker.setUrl("/Content/Images/shrink.png"); //local
                        //marker.setUrl("/ASO/Content/Images/shrink.png"); //server
                        var attr = {
                            "SID": data.SID,
                            "SortID": data.SortID,
                            "Locate": data.Locate,
                            "IPCC": data.IPCC,
                            "IPCCsub": data.IPCCsub,
                            "Family": data.Family,
                            "ComName": data.ComName,
                        };
                        var info = new InfoTemplate("屬性",
                            "<table><tr><td>資源調查種類：${IPCC}</td></tr>"
                            + "<tr><td>IPCC分類類型：${IPCCsub}</td></tr>"
                            + "<tr><td>科名：${Family}</td></tr>"
                            + "<tr><td>地物種類：${ComName}</td></tr>"
                            + "<tr><td><a href='/Search/SolidPhotoInfo?SID=${SID}&SortID=${SortID}' target='_blank'>前往立體像對</a></td></tr></table>");
                        layer.add(new Graphic(point,marker,attr,info));
                    }
                    //layer.setInfoTemplate(info);
                    map.addLayer(layer);
                });
            }
        });
        return WeiLayer;
    });