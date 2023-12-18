dojo.provide("extras.WeiYiRoadLayer");

dojo.require("esri.layers.graphics");
dojo.require("esri.dijit.InfoWindow");
dojo.require("esri.symbols.Font");

dojo.declare("extras.WeiYiRoadLayer", esri.layers.GraphicsLayer, {
    constructor: function (options) {
        // options:
        //   data:  Object[]
        //     Array of objects. Required. Object are required to have properties named x, y and attributes. The x and y coordinates have to be numbers that represent a points coordinates.
        //   distance:  Number?
        //     Optional. The max number of pixels between points to group points in the same cluster. Default value is 50.
        //   labelColor:  String?
        //     Optional. Hex string or array of rgba values used as the color for cluster labels. Default value is #fff (white).
        //   labelOffset:  String?
        //     Optional. Number of pixels to shift a cluster label vertically. Defaults to -5 to align labels with circle symbols. Does not work in IE.
        //   resolution:  Number
        //     Required. Width of a pixel in map coordinates. Example of how to calculate: 
        //     map.extent.getWidth() / map.width
        //   showSingles:  Boolean?
        //     Optional. Whether or graphics should be displayed when a cluster graphic is clicked. Default is true.
        //   singleSymbol:  MarkerSymbol?
        //     Marker Symbol (picture or simple). Optional. Symbol to use for graphics that represent single points. Default is a small gray SimpleMarkerSymbol.
        //   singleTemplate:  PopupTemplate?
        //     PopupTemplate</a>. Optional. Popup template used to format attributes for graphics that represent single points. Default shows all attributes as "attribute = value" (not recommended).
        //   maxSingles:  Number?
        //     Optional. Threshold for whether or not to show graphics for points in a cluster. Default is 1000.
        //   webmap:  Boolean?
        //     Optional. Whether or not the map is from an ArcGIS.com webmap. Default is false.
        //   spatialReference:  SpatialReference?
        //     Optional. Spatial reference for all graphics in the layer. This has to match the spatial reference of the map. Default is 102100. Omit this if the map uses basemaps in web mercator.

        //debugger;
        this._clusterTolerance = options.distance || 50;
        this._clusterData = options.data || [];
        this._clusters = [];
        this._clusterLabelColor = options.labelColor || "#000";
        // labelOffset can be zero so handle it differently
        this._clusterLabelOffset = (options.hasOwnProperty("labelOffset")) ? options.labelOffset : -5;
        // graphics that represent a single point
        this._singles = []; // populated when a graphic is clicked
        this._tempG = null;
        this._showSingles = options.hasOwnProperty("showSingles") ? options.showSingles : true;
        // symbol for single graphics
        var sms = esri.symbol.SimpleMarkerSymbol;
        this._singleSym = options.singleSymbol || new sms("circle", 6, null, new dojo.Color("#888"));
        this._singleTemplate = options.singleTemplate || new esri.dijit.PopupTemplate({ "title": "", "description": "{*}" });
        this._maxSingles = options.maxSingles || 100000;

        this._webmap = options.hasOwnProperty("webmap") ? options.webmap : false;

        this._sr = options.spatialReference || new esri.SpatialReference({ "wkid": 102443 });

        this._zoomEnd = null;

        this.fun = null;
        //debugger;
        this.PSymbol = options.PSymbol || null;

        this.PointSymbol = options.PointSymbol || null;

        this.LSymbol = options.LSymbol || null;
    },

    /*
      override esri.layers.GraphicsLayer methods
    */

    _setMap: function (map, surface) {
        // calculate and set the initial resolution
        this._clusterResolution = map.extent.getWidth() / map.width; // probably a bad default...
        this._clusterGraphics();

        // connect to onZoomEnd so data is re-clustered when zoom level changes
        this._zoomEnd = dojo.connect(map, "onZoomEnd", this, function () {
            //debugger;
            this._clusterTolerance = this._map.getScale() / 3500;
            // update resolution
            if (this.visible) {
                this._clusterResolution = this._map.extent.getWidth() / this._map.width;
                this.clear();
                this._clusterGraphics();
                if (this._tempG != null) {
                    this.add(this._tempG);
                }
            }
        });

        // GraphicsLayer will add its own listener here
        var div = this.inherited(arguments);
        return div;
    },

    _unsetMap: function () {
        this.inherited(arguments);
        dojo.disconnect(this._zoomEnd);
    },

    add: function (p) {
        // Summary:  The argument is a data point to be added to an existing cluster. If the data point falls within an existing cluster, it is added to that cluster and the cluster's label is updated. If the new point does not fall within an existing cluster, a new cluster is created.
        //
        // if passed a graphic, use the GraphicsLayer's add method
        if (p.declaredClass) {
            this.inherited(arguments);
            return;
        }

        // add the new data to _clusterData so that it's included in clusters
        // when the map level changes
        this._clusterData.push(p);
        var clustered = false;
        // look for an existing cluster for the new point
        for (var i = 0; i < this._clusters.length; i++) {
            var c = this._clusters[i];
            if (this._clusterTest(p, c)) {
                // add the point to an existing cluster
                this._clusterAddPoint(p, c);
                // update the cluster's geometry
                this._updateClusterGeometry(c);
                // update the label
                this._updateLabel(c);
                clustered = true;
                break;
            }
        }

        if (!clustered) {
            this._clusterCreate(p);
            p.attributes.clusterCount = 1;
            this._showCluster(p);
        }
    },

    clear: function () {
        // Summary:  Remove all clusters and data points.
        this.inherited(arguments);
        this._clusters.length = 0;
    },

    clearSingles: function (singles) {
        // Summary:  Remove graphics that represent individual data points.
        var s = singles || this._singles;
        dojo.forEach(s, function (g) {
            this.remove(g);
        }, this);
        this._singles.length = 0;
    },

    onClick: function (e) {
        if (e.graphic.attributes == null) {
            this.remove(e.graphic);
            return;
        }
        // remove any previously showing single features
        this.clearSingles(this._singles);

        // find single graphics that make up the cluster that was clicked
        // would be nice to use filter but performance tanks with large arrays in IE
        var singles = [];
        for (var i = 0, il = this._clusterData.length; i < il; i++) {
            if (e.graphic.attributes.clusterId == this._clusterData[i].attributes.clusterId) {
                singles.push(this._clusterData[i]);
            }
        }
        if (singles.length > this._maxSingles) {
            alert("Sorry, that cluster contains more than " + this._maxSingles + " points. Zoom in for more detail.");
            return;
        } else {
            // stop the click from bubbling to the map
            e.stopPropagation();
            //this._map.infoWindow.show(e.graphic.geometry);  fatal
            if (e.graphic.attributes.clusterCount > 1 && e.graphic.attributes.clusterCount < 999999) {
                this._addSingles(singles);
            }
            else {
                //debugger;
                var mpoint = new esri.geometry.Point(singles[0].x, singles[0].y, this._sr);
                var spoint = this._map.toScreen(mpoint);
                //if (spoint.y < 600) {
                spoint.y = (spoint.y - 200);
                spoint.x = (spoint.x + 250);
                //alert(spoint.x + ',' + spoint.y);
                //return;
                //}

                var ampoint = this._map.toMap(spoint);

                //debugger;
                if (this.fun != null) {
                    var o = this.fun(singles[0].attributes.CaseKey);
                    this._map.infoWindow.setTitle(o.title);
                    this._map.infoWindow.setContent(o.content);
                    this._map.infoWindow.resize(o.w, o.h);
                    //this._map.infoWindow.setFixedAnchor(esri.dijit.InfoWindow.ANCHOR_UPPERRIGHT);
                    this._map.infoWindow.show(mpoint);
                }
                //ShowAttributeData(singles[0].attributes.CaseKey);   //fatal
                if (this._tempG != null) {
                    this.remove(this._tempG);
                }

                if (singles[0].attributes.AreaType == "P") {      //面
                    var polygon = esri.geometry.Polygon(this._sr);
                    var currgroup = 0;
                    var currentring = [];
                    for (i = 0; i < singles[0].attributes.CaseArea.length; i++) {
                        if (currgroup != singles[0].attributes.CaseArea[i].Group) {
                            if (currentring.length > 0) {
                                polygon.addRing(currentring);
                            }
                            currgroup = singles[0].attributes.CaseArea[i].Group;
                            currentring = [];
                        }
                        currentring.push([singles[0].attributes.CaseArea[i].LocX, singles[0].attributes.CaseArea[i].LocY]);
                    }
                    if (currentring.length > 0) {
                        polygon.addRing(currentring);
                    }
                    //debugger;
                    //polygon.setSpatialReference(this._map.spatialReference);
                    this._tempG = new esri.Graphic(
                      polygon,
                      this.PSymbol
                    );
                    this.add(this._tempG);
                }
                else if (singles[0].attributes.AreaType == "T") { //點
                    var mpoints = esri.geometry.Multipoint(this._sr);
                    for (i = 0; i < singles[0].attributes.CaseArea.length; i++) {
                        mpoints.addPoint(new esri.geometry.Point(singles[0].attributes.CaseArea[i].LocX, singles[0].attributes.CaseArea[i].LocY, this._sr));
                    }
                    this._tempG = new esri.Graphic(
                      mpoints,
                      this.PointSymbol
                    );
                    this.add(this._tempG);
                }
                else if (singles[0].attributes.AreaType == "L") {
                    var polyline = esri.geometry.Polyline(this._sr);
                    var currgroup = 0;
                    var currentpath = [];
                    for (i = 0; i < singles[0].attributes.CaseArea.length; i++) {
                        if (currgroup != singles[0].attributes.CaseArea[i].Group) {
                            if (currentpath.length > 0) {
                                polyline.addPath(currentpath);
                            }
                            currgroup = singles[0].attributes.CaseArea[i].Group;
                            currentpath = [];
                        }
                        currentpath.push([singles[0].attributes.CaseArea[i].LocX, singles[0].attributes.CaseArea[i].LocY]);
                    }
                    if (currentpath.length > 0) {
                        polyline.addPath(currentpath);
                    }
                    this._tempG = new esri.Graphic(
                      polyline,
                      this.LSymbol
                    );
                    this.add(this._tempG);
                }

                //this._map.centerAt(ampoint);
            }
        }
    },

    getData: function (clusterId) {
        //debugger;
        for (var i = 0; i < this._clusterData.length; i++) {
            if (clusterId == this._clusterData[i].attributes.clusterId) {
                return this._clusterData[i].attributes.CaseKey;
            }
        }
        return "no data";
    },

    /*
      internal methods
    */

    _clusterGraphics: function () {
        // first time through, loop through the points
        for (var j = 0, jl = this._clusterData.length; j < jl; j++) {
            // see if the current feature should be added to a cluster
            var point = this._clusterData[j];
            var clustered = false;
            var numClusters = this._clusters.length;
            for (var i = 0; i < this._clusters.length; i++) {
                var c = this._clusters[i];
                if (this._clusterTest(point, c)) {
                    this._clusterAddPoint(point, c);
                    clustered = true;
                    break;
                }
            }

            if (!clustered) {
                this._clusterCreate(point);
            }
        }
        this._showAllClusters();
    },

    _clusterTest: function (p, cluster) {
        var distance = (
          Math.sqrt(
            Math.pow((cluster.x - p.x), 2) + Math.pow((cluster.y - p.y), 2)
          ) / this._clusterResolution
        );
        return (distance <= this._clusterTolerance);
    },

    // points passed to clusterAddPoint should be included 
    // in an existing cluster
    // also give the point an attribute called clusterId 
    // that corresponds to its cluster
    _clusterAddPoint: function (p, cluster) {
        // average in the new point to the cluster geometry
        var count, x, y;
        count = cluster.attributes.clusterCount;
        x = (p.x + (cluster.x * count)) / (count + 1);
        y = (p.y + (cluster.y * count)) / (count + 1);
        cluster.x = x;
        cluster.y = y;

        // build an extent that includes all points in a cluster
        // extents are for debug/testing only...not used by the layer
        if (p.x < cluster.attributes.extent[0]) {
            cluster.attributes.extent[0] = p.x;
        } else if (p.x > cluster.attributes.extent[2]) {
            cluster.attributes.extent[2] = p.x;
        }
        if (p.y < cluster.attributes.extent[1]) {
            cluster.attributes.extent[1] = p.y;
        } else if (p.y > cluster.attributes.extent[3]) {
            cluster.attributes.extent[3] = p.y;
        }

        // increment the count
        if (cluster.attributes.clusterCount > 10000) {
            cluster.attributes.clusterCount = 2;
        }
        else {
            cluster.attributes.clusterCount++;
        }
        // attributes might not exist
        if (!p.hasOwnProperty("attributes")) {
            p.attributes = {};
        }
        // give the graphic a cluster id
        p.attributes.clusterId = cluster.attributes.clusterId;
    },

    // point passed to clusterCreate isn't within the 
    // clustering distance specified for the layer so
    // create a new cluster for it
    _clusterCreate: function (p) {
        var clusterId = this._clusters.length + 1;
        // console.log("cluster create, id is: ", clusterId);
        // p.attributes might be undefined
        if (!p.attributes) {
            p.attributes = {};
        }
        p.attributes.clusterId = clusterId;

        var initialcount = 1;
        //debugger;
        var intstatus = parseInt(p.attributes.CaseType);
        initialcount = 1000000 + intstatus;
        
        // create the cluster
        var cluster = {
            "x": p.x,
            "y": p.y,
            "attributes": {
                "clusterCount": initialcount,
                "clusterId": clusterId,
                "extent": [p.x, p.y, p.x, p.y]
            }
        };
        this._clusters.push(cluster);
    },

    _showAllClusters: function () {
        for (var i = 0, il = this._clusters.length; i < il; i++) {
            var c = this._clusters[i];
            this._showCluster(c);
        }
    },

    _showCluster: function (c) {
        var point = new esri.geometry.Point(c.x, c.y, this._sr);
        this.add(
          new esri.Graphic(
            point,
            null,
            c.attributes
          )
        );
        // code below is used to not label clusters with a single point
        if (c.attributes.clusterCount == 1) {
            return;
        }
        if (c.attributes.clusterCount > 999999) {
            return;
        }

        // show number of points in the cluster
        var font = new esri.symbols.Font();
        if (c.attributes.clusterCount < 10) {
            font.setSize("18pt");
        }
        else if (c.attributes.clusterCount < 100) {
            font.setSize("20pt");
        }
        else if (c.attributes.clusterCount < 1000) {
            font.setSize("20pt");
        }
        font.setWeight(esri.symbols.Font.WEIGHT_BOLD);
        var label = new esri.symbol.TextSymbol(c.attributes.clusterCount)
          .setColor(new dojo.Color(this._clusterLabelColor))
          .setOffset(0, this._clusterLabelOffset)
          .setFont(font);
        this.add(
          new esri.Graphic(
            point,
            label,
            c.attributes
          )
        );
    },

    _addSingles: function (singles) {
        // add single graphics to the map
        dojo.forEach(singles, function (p) {
            var g = new esri.Graphic(
              new esri.geometry.Point(p.x, p.y, this._sr),
              this._singleSym,
              p.attributes//,
              // new esri.InfoTemplate("", "${*}")
              //this._singleTemplate   fatal
            );
            this._singles.push(g);
            if (this._showSingles) {
                this.add(g);
            }
        }, this);
        //this._map.infoWindow.setFeatures(this._singles);    //fatal
    },

    _updateClusterGeometry: function (c) {
        // find the cluster graphic
        var cg = dojo.filter(this.graphics, function (g) {
            return !g.symbol &&
                   g.attributes.clusterId == c.attributes.clusterId;
        });
        if (cg.length == 1) {
            cg[0].geometry.update(c.x, c.y);
        } else {
            console.log("didn't find exactly one CLUSTER GEOMETRY to update: ", cg);
        }
    },

    _updateLabel: function (c) {
        // find the existing label
        var label = dojo.filter(this.graphics, function (g) {
            return g.symbol &&
                   g.symbol.declaredClass == "esri.symbol.TextSymbol" &&
                   g.attributes.clusterId == c.attributes.clusterId;
        });
        if (label.length == 1) {
            // console.log("update label...found: ", label);
            this.remove(label[0]);
            var newLabel = new esri.symbol.TextSymbol(c.attributes.clusterCount)
              .setColor(new dojo.Color(this._clusterLabelColor))
              .setOffset(0, this._clusterLabelOffset);
            this.add(
              new esri.Graphic(
                new esri.geometry.Point(c.x, c.y, this._sr),
                newLabel,
                c.attributes
              )
            );
            // console.log("updated the label");
        } else {
            console.log("didn't find exactly one LABEL: ", label);
        }
    },

    // debug only...never called by the layer
    _clusterMeta: function () {
        // print total number of features
        console.log("Total:  ", this._clusterData.length);

        // add up counts and print it
        var count = 0;
        dojo.forEach(this._clusters, function (c) {
            count += c.attributes.clusterCount;
        });
        console.log("In clusters:  ", count);
    }

});

