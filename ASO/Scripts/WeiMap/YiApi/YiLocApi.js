var _YISEARCHDATAURL = "http://map.e-land.gov.tw/yigis/ws_dataC.ashx";
//var _YISEARCHDATAURL = "http:///192.168.1.164/yigis/ws_dataC.ashx";


var yilandmap = null;//parent.document.getElementById("ilanmap").contentWindow.IFGetMapobj();


//都市計畫
function init_yilanduse() {
    esri.request({
        url: _YISEARCHDATAURL,
        content: { CMD: 'GETLANDUSE' },
        callbackParamName: "callback",
        load: getyilandusename,
        error: function (error, io) {
            alert(error.message)
        }
    });
}
function getyilandusename(json) {
    var c = [];
    c.push("<table><tr><td>都市計畫區</td>");
    c.push("<td><select id=\"YI_LANDUSE_08\">");
    for (i = 0; i < json.length; i++) {
        c.push("<option value=\"" + json[i].OBJECTID + "\">" + json[i].PlanName + "</option>");
    }
    c.push("</select></td></tr>");
    c.push("<tr><td colspan=\"2\" align=\"center\"><button id=\"YI_btn08\"></button></td></tr></table>");
    dojo.byId("yilanduse").innerHTML = c.join('');
    new dijit.form.Select({
        id: 'YI_LANDUSE_08',
        style: 'width: 220px;',
        sortByLabel: false
    }, 'YI_LANDUSE_08');
    new dijit.form.Button({
        label: "定位",
        onClick: function () { zoomto('08'); }
    }, "YI_btn08");
}

//地籍
function init_yicadaster() {
    esri.request({
        url: _YISEARCHDATAURL,
        content: { CMD: 'GETTOWN' },
        callbackParamName: "callback",
        load: getyicadastername,
        error: function (error, io) {
            alert(error.message)
        }
    });
}
function getyicadastername(json) {
    var c = [];
    c.push("<table><tr><td>鄉鎮市</td>");
    c.push("<td><select id=\"YI_TOWN_07\">");
    for (i = 0; i < json.length; i++) {
        c.push("<option value=\"" + json[i].TOWNID + "\">" + json[i].TOWNNAME + "</option>");
    }
    c.push("</select></td></tr>");
    esri.request({
        url: _YISEARCHDATAURL,
        content: { CMD: 'GETSECTOR', TOWN: json[0].TOWNNAME },
        callbackParamName: "callback",
        load: function (json, args) {
            c.push("<tr><td>地段</td>");
            c.push("<td><select id=\"YI_SECTOR_07\">");
            for (i = 0; i < json.length; i++) {
                c.push("<option value=\"" + json[i].id + "\">" + json[i].name + "</option>");
            }
            c.push("</select></td></tr>");
            c.push("<tr><td>母號</td>");
            c.push("<td><select id=\"YI_LANDNO1_07\">");
            esri.request({
                url: _YISEARCHDATAURL,
                content: { CMD: 'GETLANDNO1', VAL: json[0].id },
                callbackParamName: "callback",
                load: function (json, args) {
                    for (i = 0; i < json.length; i++) {
                        c.push("<option value=\"" + json[i].id + "\">" + json[i].name + "</option>");
                    }
                    c.push("</select></td></tr>");
                    c.push("<tr><td>子號</td>");
                    c.push("<td><select id=\"YI_LANDNO2_07\">");
                    c.push("</select></td></tr>");
                    c.push("<tr><td colspan=\"2\" align=\"center\"><button id=\"YI_btn07\">定位</button></td></tr></table>");
                    dojo.byId("yicadaster").innerHTML = c.join('');
                    new dijit.form.Select({
                        id: 'YI_TOWN_07',
                        style: 'width: 220px;',
                        sortByLabel: false,
                        onChange: function (val) {
                            esri.request({
                                url: _YISEARCHDATAURL,
                                content: { CMD: 'GETSECTOR', TOWN: dijit.byId('YI_TOWN_07').get("displayedValue") },
                                callbackParamName: "callback",
                                load: function (json, args) {
                                    var cb2 = dijit.byId('YI_SECTOR_07');
                                    var stateStore = new dojo.store.Memory({
                                        data: json
                                    });
                                    cb2.setStore(stateStore);

                                    esri.request({
                                        url: _YISEARCHDATAURL,
                                        content: { CMD: 'GETLANDNO1', VAL: json[0].id },
                                        callbackParamName: "callback",
                                        load: function (json, args) {
                                            var cb2 = dijit.byId('YI_LANDNO1_07');
                                            cb2.attr('value', "請輸入母號或下拉選擇");
                                            var stateStore = new dojo.store.Memory({
                                                data: json
                                            });
                                            cb2.attr('store', stateStore);
                                            var a = new dojo.store.Memory({
                                                data: [
				                                    { name: " ", id: "" }
                                                ]
                                            })
                                            var cb2 = dijit.byId('YI_LANDNO2_07');
                                            cb2.setStore(a);
                                        },
                                        error: function (error, io) {
                                            alert(error.message)
                                        }
                                    });
                                },
                                error: function (error, io) {
                                    alert(error.message)
                                }
                            });
                        }
                    }, 'YI_TOWN_07');
                    new dijit.form.Select({
                        id: 'YI_SECTOR_07',
                        style: 'width: 220px;',
                        labelAttr: "name",
                        sortByLabel: false,
                        onChange: function (val) {
                            esri.request({
                                url: _YISEARCHDATAURL,
                                content: { CMD: 'GETLANDNO1', VAL: val },
                                callbackParamName: "callback",
                                load: function (json, args) {
                                    var cb2 = dijit.byId('YI_LANDNO1_07');
                                    cb2.attr('value', "請輸入母號或下拉選擇");
                                    var stateStore = new dojo.store.Memory({
                                        data: json
                                    });
                                    cb2.attr('store', stateStore);
                                    var a = new dojo.store.Memory({
                                        data: [
				                    { name: " ", id: "" }
                                        ]
                                    })
                                    var cb2 = dijit.byId('YI_LANDNO2_07');
                                    cb2.setStore(a);
                                },
                                error: function (error, io) {
                                    alert(error.message)
                                }
                            });
                        }
                    }, 'YI_SECTOR_07');
                    new dijit.form.ComboBox({
                        id: 'YI_LANDNO1_07',
                        style: 'width: 220px;',
                        value: "請輸入名稱或下拉選擇",
                        labelAttr: "name",
                        sortByLabel: false,
                        onChange: function (val) {
                            esri.request({
                                url: _YISEARCHDATAURL,
                                content: { CMD: 'GETLANDNO2', VAL: dijit.byId('YI_SECTOR_07').value, LAND1: val },
                                callbackParamName: "callback",
                                load: function (json, args) {
                                    var cb2 = dijit.byId('YI_LANDNO2_07');
                                    var stateStore = new dojo.store.Memory({
                                        data: json
                                    });
                                    cb2.setStore(stateStore);
                                },
                                error: function (error, io) {
                                    alert(error.message)
                                }
                            });
                        }
                    }, 'YI_LANDNO1_07');
                    var select = new dijit.form.Select({
                        id: 'YI_LANDNO2_07',
                        labelAttr: "name",
                        style: 'width: 220px;',
                        sortByLabel: false
                    }, 'YI_LANDNO2_07');
                    new dijit.form.Button({
                        label: "定位",
                        onClick: function () { zoomto('07'); }
                    }, "YI_btn07");

                },
                error: function (error, io) {
                    alert(error.message)
                }
            });

        },
        error: function (error, io) {
            alert(error.message)
        }
    });
}

//門牌
function init_yiaddress() {
    esri.request({
        url: _YISEARCHDATAURL,
        content: { CMD: 'GETTOWN' },
        callbackParamName: "callback",
        load: getyiaddressname,
        error: function (error, io) {
            alert(error.message)
        }
    });
}
function getyiaddressname(json) {
    var c = [];
    c.push("<table><tr><td>鄉鎮市</td>");
    c.push("<td><select id=\"YI_TOWN_06\">");
    for (i = 0; i < json.length; i++) {
        c.push("<option value=\"" + json[i].TOWNID + "\">" + json[i].TOWNNAME + "</option>");
    }
    c.push("</select></td></tr>");
    c.push("<tr><td>門牌</td>");
    c.push("<td><input type=\"text\" id=\"YI_ADDRESS\" size=\"33\" value=\"凱旋里三鄰縣政北路一號\"/></td>");
    c.push("<tr><td colspan=\"2\" align=\"center\"><button id=\"YI_btn06\">定位</button></td></tr></table>");
    dojo.byId("yiaddress").innerHTML = c.join('');
    new dijit.form.Select({
        id: 'YI_TOWN_06',
        style: 'width: 220px;',
        sortByLabel: false,
        value: 'G01'
    }, 'YI_TOWN_06');

    new dijit.form.Button({
        label: "查詢",
        onClick: YI_searchaddress
    }, "YI_btn06");
}

function YI_searchaddress() {
    var m = dojo.byId('YI_ADDRESS');
    var t = dijit.byId('YI_TOWN_06');
    esri.request({
        url: _YISEARCHDATAURL,
        content: { CMD: 'GETADDRESS', VAL: m.value, TOWN: t.get("displayedValue") },
        callbackParamName: "callback",
        load: function (json) {
            if (json[0].ABOUT == "") {
                yilandmap.graphics.clear();
                var symbol = new esri.symbol.PictureMarkerSymbol(Yipointimg, 28, 28);
                var pt = new esri.geometry.Point(parseFloat(json[0].X), parseFloat(json[0].Y), yilandmap.spatialReference);
                var graphic = new esri.Graphic(pt, symbol);
                yilandmap.graphics.add(graphic);
                yilandmap.centerAndZoom(pt, 12);
            }
            else {
                alert(json[0].ABOUT);
            }
        },
        error: esriConfig.defaults.io.errorHandler
    });

}

//重要地標
function init_yipoi() {
    esri.request({
        url: _YISEARCHDATAURL,
        content: { CMD: 'GETTOWN' },
        callbackParamName: "callback",
        load: getyipoiname,
        error: function (error, io) {
            alert(error.message)
        }
    });
}
function getyipoiname(json) {
    var c = [];
    c.push("<table><tr><td >鄉鎮市</td>");
    c.push("<td><select id=\"YI_TOWN_05\">");
    for (i = 0; i < json.length; i++) {
        c.push("<option value=\"" + json[i].NGISID + "\">" + json[i].TOWNNAME + "</option>");
    }
    c.push("</select></td></tr>");
    c.push("<tr><td>關鍵字</td>");
    c.push("<td><input type=\"text\" id=\"YI_POINTOFINTERSEST\" />&nbsp;&nbsp;<button id=\"YI_btn05\"></button>");
    c.push("</td></tr></table>");
    c.push("<div id=\"yi_resultContentAddress_05\" />");
    dojo.byId("yipoi").innerHTML = c.join('');
    new dijit.form.Select({
        id: 'YI_TOWN_05',
        style: 'width: 220px;',
        sortByLabel: false
    }, 'YI_TOWN_05');
    new dijit.form.Button({
        label: "查詢",
        onClick: YI_searchpointofintersest
    }, "YI_btn05");
}
function YI_searchpointofintersest() {
    esri.request({
        url: _YISEARCHDATAURL,
        content: { CMD: 'GETPOINTOFINTERSEST', VAL: dojo.byId("YI_POINTOFINTERSEST").value, TOWN: dijit.byId('YI_TOWN_05').value },
        callbackParamName: "callback",
        load: function (json) {
            if (json.length == 0) {
                alert('查無符合條件地標資料');
                return;
            }
            var c = [];
            var tmp;
            c.push("<hr />");
            c.push("<select id=\"YI_POI\" size=\"10\" style=\"width:100%\">");
            for (i = 0; i < json.length; i++) {
                tmp = json[i].TmX + "," + json[i].TmY + "," + json[i].POI + "," + json[i].POI_S + "," + json[i].SName + "," + json[i].ADDR + "," + json[i].UpdateDate;
                c.push("<option value=\"" + tmp + "\">" + json[i].POI_S + "</option>");
            };
            c.push("</select>");
            c.push("<div id=\"Yi_resultPOI\" />");
            dojo.byId("yi_resultContentAddress_05").innerHTML = c.join('');
            dojo.connect(dojo.byId("YI_POI"), "onchange", function (val) {
                yilandmap.graphics.clear();
                var tmp1 = dojo.byId("YI_POI").value.split(',');
                var c1 = [];
                c1.push("<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" bgcolor=\"#ffffff\" style=\"padding-top:10px;\">");
                c1.push("<tr bgcolor=\"#cccccc\"><td nowrap=\"\" align=\"center\">地標名稱</td><td nowrap=\"\" align=\"left\">" + tmp1[2] + "</td></tr>");
                c1.push("<tr><td nowrap=\"\" align=\"center\">地標簡稱</td><td nowrap=\"\" align=\"left\">" + tmp1[3] + "</td></tr>");
                c1.push("<tr bgcolor=\"#cccccc\"><td nowrap=\"\" align=\"center\">地標分類</td><td nowrap=\"\" align=\"left\">" + ((tmp1[4] == 'null') ? '' : tmp1[4]) + "</td></tr>");
                c1.push("<tr><td nowrap=\"\" align=\"center\">地址</td><td nowrap=\"\" align=\"left\">" + ((tmp1[5] == 'null') ? '' : tmp1[5]) + "</td></tr>");
                c1.push("<tr bgcolor=\"#cccccc\"><td nowrap=\"\" align=\"center\">更新日期</td><td nowrap=\"\" align=\"left\">" + ((tmp1[6] == 'null') ? '' : tmp1[6]) + "</td></tr>");
                c1.push("</table>");
                dojo.byId("Yi_resultPOI").innerHTML = c1.join('');
                if (parseFloat(tmp1[0]) == 0) {
                    alert("此地標尚無空間位置");
                }
                else {
                    var symbol = new esri.symbol.PictureMarkerSymbol(Yipointimg, 28, 28);
                    var pt = new esri.geometry.Point(parseFloat(tmp1[0]), parseFloat(tmp1[1]), yilandmap.spatialReference);
                    var graphic = new esri.Graphic(pt, symbol);
                    yilandmap.graphics.add(graphic);
                    yilandmap.centerAndZoom(pt, 12);
                }
            });
        },
        error: function (error, io) {
            alert(error.message)
        }
    });
}

//村里
function init_yivillage() {
    esri.request({
        url: _YISEARCHDATAURL,
        content: { CMD: 'GETTOWN' },
        callbackParamName: "callback",
        load: getyivillagename,
        error: function (error, io) {
            alert(error.message)
        }
    });
}
function getyivillagename(json) {
    var c = [];
    c.push("<table><tr><td>鄉鎮市</td>");
    c.push("<td><select id=\"YI_TOWN_02\">");
    for (i = 0; i < json.length; i++) {
        c.push("<option value=\"" + json[i].TOWNID + "\">" + json[i].TOWNNAME + "</option>");
    }
    c.push("</select></td></tr>");
    esri.request({
        url: _YISEARCHDATAURL,
        content: { CMD: 'GETVILLAGE', VAL: json[0].TOWNID },
        callbackParamName: "callback",
        load: function (json, args) {
            c.push("<tr><td>村里界</td>");
            c.push("<td><select id=\"YI_VILLAGE_02\">");
            for (i = 0; i < json.length; i++) {
                c.push("<option value=\"" + json[i].id + "\">" + json[i].name + "</option>");
            }
            c.push("</select></td></tr>");

            c.push("<tr><td colspan=\"2\" align=\"center\"><button id=\"YI_btn02\">定位</button></td></tr></table>");
            dojo.byId("yivillage").innerHTML = c.join('');
            new dijit.form.Select({
                id: 'YI_TOWN_02',
                style: 'width: 220px;',
                sortByLabel: false,
                onChange: function (val) {
                    esri.request({
                        url: _YISEARCHDATAURL,
                        content: { CMD: 'GETVILLAGE', VAL: val },
                        callbackParamName: "callback",
                        load: function (json, args) {
                            var cb2 = dijit.byId('YI_VILLAGE_02');
                            var stateStore = new dojo.store.Memory({
                                data: json
                            });
                            cb2.setStore(stateStore);
                        },
                        error: function (error, io) {
                            alert(error.message)
                        }
                    });
                }
            }, 'YI_TOWN_02');
            new dijit.form.Select({
                id: 'YI_VILLAGE_02',
                style: 'width: 220px;',
                labelAttr: "name",
                sortByLabel: false
            }, 'YI_VILLAGE_02');
            new dijit.form.Button({
                label: "定位",
                onClick: function () { zoomto('02'); }
            }, "YI_btn02");
        },
        error: function (error, io) {
            alert(error.message)
        }
    });
}

//道路
function init_yiroad() {
    esri.request({
        url: _YISEARCHDATAURL,
        content: { CMD: 'GETTOWN' },
        callbackParamName: "callback",
        load: getyiroadname,
        error: function (error, io) {
            alert(error.message)
        }
    });
}
function getyiroadname(json) {
    var c = [];
    c.push("<table><tr><td>鄉鎮市</td>");
    c.push("<td><select id=\"YI_TOWN_03\">");
    for (i = 0; i < json.length; i++) {
        c.push("<option value=\"" + json[i].TOWNID + "\">" + json[i].TOWNNAME + "</option>");
    }
    c.push("</select></td></tr>");
    esri.request({
        url: _YISEARCHDATAURL,
        content: { CMD: 'GETSTREET', VAL: json[0].TOWNID },
        callbackParamName: "callback",
        load: function (json, args) {
            c.push("<tr><td>道路</td>");
            c.push("<td><select id=\"YI_ROAD_03\">");
            for (i = 0; i < json.length; i++) {
                c.push("<option value=\"" + json[i].id + "\">" + json[i].name + "</option>");
            }
            c.push("</select></td></tr>");

            c.push("<tr><td colspan=\"2\" align=\"center\"><button id=\"YI_btn03\">定位</button></td></tr></table>");
            dojo.byId("yiroad").innerHTML = c.join('');
            new dijit.form.Select({
                id: 'YI_TOWN_03',
                style: 'width: 220px;',
                sortByLabel: false,
                onChange: function (val) {
                    esri.request({
                        url: _YISEARCHDATAURL,
                        content: { CMD: 'GETSTREET', VAL: val },
                        callbackParamName: "callback",
                        load: function (json, args) {
                            var cb2 = dijit.byId('YI_ROAD_03');
                            var stateStore = new dojo.store.Memory({
                                data: json
                            });
                            cb2.attr("value", "請輸入名稱或下拉選擇");
                            cb2.attr('store', stateStore);
                        },
                        error: function (error, io) {
                            alert(error.message)
                        }
                    });
                }
            }, 'YI_TOWN_03');
            new dijit.form.ComboBox({
                id: 'YI_ROAD_03',
                style: 'width: 220px;',
                value: "請輸入名稱或下拉選擇",
                labelAttr: "name",
                sortByLabel: false
            }, 'YI_ROAD_03');
            new dijit.form.Button({
                label: "定位",
                onClick: function () { zoomto('03'); }
            }, "YI_btn03");
        },
        error: function (error, io) {
            alert(error.message)
        }
    });
}

//交叉路口
function init_yicrossroad() {
    esri.request({
        url: _YISEARCHDATAURL,
        content: { CMD: 'GETTOWN' },
        callbackParamName: "callback",
        load: getyicrossroadname,
        error: function (error, io) {
            alert(error.message)
        }
    });
}
function getyicrossroadname(json) {
    var c = [];
    c.push("<table><tr><td>鄉鎮市</td>");
    c.push("<td><select id=\"YI_TOWN_04\">");
    for (i = 0; i < json.length; i++) {
        c.push("<option value=\"" + json[i].TOWNID + "\">" + json[i].TOWNNAME + "</option>");
    }
    c.push("</select></td></tr>");
    esri.request({
        url: _YISEARCHDATAURL,
        content: { CMD: 'GETCROSSROAD', VAL: json[0].TOWNNAME },
        callbackParamName: "callback",
        load: function (json, args) {
            c.push("<tr><td>道路</td>");
            c.push("<td><select id=\"YI_CROSSROAD_04\">");
            for (i = 0; i < json.length; i++) {
                c.push("<option value=\"" + json[i].id + "\">" + json[i].name + "</option>");
            }
            c.push("</select></td></tr>");
            c.push("<tr><td>交叉路口</td>");
            c.push("<td><select id=\"YI_CROSSROAD2_04\">");
            c.push("</select></td></tr>");
            c.push("<tr><td colspan=\"2\" align=\"center\"><button id=\"YI_btn04\">定位</button></td></tr></table>");
            dojo.byId("yicrossroad").innerHTML = c.join('');
            new dijit.form.Select({
                id: 'YI_TOWN_04',
                style: 'width: 220px;',
                sortByLabel: false,
                onChange: function (val) {
                    esri.request({
                        url: _YISEARCHDATAURL,
                        content: { CMD: 'GETCROSSROAD', VAL: dijit.byId('YI_TOWN_04').get("displayedValue") },
                        callbackParamName: "callback",
                        load: function (json, args) {
                            var cb2 = dijit.byId('YI_CROSSROAD_04');
                            var stateStore = new dojo.store.Memory({
                                data: json
                            });
                            cb2.attr("value", "請輸入名稱或下拉選擇");
                            cb2.attr('store', stateStore);
                            var a = new dojo.store.Memory({
                                data: [
				                    { name: " ", id: "" }
                                ]
                            })
                            var cb2 = dijit.byId('YI_CROSSROAD2_04');
                            cb2.setStore(a);
                        },
                        error: function (error, io) {
                            alert(error.message)
                        }
                    });
                }
            }, 'YI_TOWN_04');
            new dijit.form.ComboBox({
                id: 'YI_CROSSROAD_04',
                style: 'width: 220px;',
                value: "請輸入名稱或下拉選擇",
                labelAttr: "name",
                sortByLabel: false,
                onChange: function (val) {
                    esri.request({
                        url: _YISEARCHDATAURL,
                        content: { CMD: 'GETCROSSROAD2', VAL: dijit.byId('YI_CROSSROAD_04').get("displayedValue"), TOWN: dijit.byId('YI_TOWN_04').get("displayedValue") },
                        callbackParamName: "callback",
                        load: function (json, args) {
                            var cb2 = dijit.byId('YI_CROSSROAD2_04');
                            var stateStore = new dojo.store.Memory({
                                data: json
                            });
                            cb2.setStore(stateStore);
                        },
                        error: function (error, io) {
                            alert(error.message)
                        }
                    });
                }
            }, 'YI_CROSSROAD_04');
            var select = new dijit.form.Select({
                id: 'YI_CROSSROAD2_04',
                labelAttr: "name",
                style: 'width: 220px;',
                sortByLabel: false
            }, 'YI_CROSSROAD2_04');
            new dijit.form.Button({
                label: "定位",
                onClick: function () { zoomto('04'); }
            }, "YI_btn04");
        },
        error: function (error, io) {
            alert(error.message)
        }
    });
}


//鄉鎮市
function init_yitown() {
    esri.request({
        url: _YISEARCHDATAURL,
        content: { CMD: 'GETTOWN' },
        callbackParamName: "callback",
        load: getyitownname,
        error: function (error, io) {
            alert(error.message)
        }
    });
}
function getyitownname(json) {
    var c = [];
    c.push("<table><tr><td style='width:100px;'>鄉鎮市</td>");
    c.push("<td><select id=\"YI_TOWN_01\">");
    for (i = 0; i < json.length; i++) {
        c.push("<option value=\"" + json[i].TOWNID + "\">" + json[i].TOWNNAME + "</option>");
    }
    c.push("</select></td></tr>");
    c.push("<tr><td colspan=\"2\" align=\"center\"><button id=\"YI_btn01\"></button></td></tr></table>");
    //debugger;
    dojo.byId("yitown").innerHTML = c.join('');
    new dijit.form.Select({
        id: 'YI_TOWN_01',
        style: 'width: 220px;',
        sortByLabel: false
    }, 'YI_TOWN_01');
    new dijit.form.Button({
        label: "定位",
        onClick: function () { zoomto('01'); }
    }, "YI_btn01");
}

function zoomto(t) {
    //debugger;
    switch (t) {
        case '01':
            var cb2 = dijit.byId('YI_TOWN_01');
            esri.request({
                url: _YISEARCHDATAURL,
                content: { CMD: 'ZOOMTO01', TOWNID: cb2.value },
                callbackParamName: "callback",
                load: showResults,
                error: function (error, io) {
                    alert(error.message)
                }
            });

            break;
        case '02':
            var cb2 = dijit.byId('YI_VILLAGE_02');
            esri.request({
                url: _YISEARCHDATAURL,
                content: { CMD: 'ZOOMTO02', NGISID: cb2.value },
                callbackParamName: "callback",
                load: showResults,
                error: function (error, io) {
                    alert(error.message)
                }
            });
            break;
        case '03':
            var cb2 = dijit.byId('YI_TOWN_03');
            var m = dijit.byId('YI_ROAD_03');
            esri.request({
                url: _YISEARCHDATAURL,
                content: { CMD: 'ZOOMTO03', LABELSTRING: m.get("displayedValue"), TOWNID: cb2.value },
                callbackParamName: "callback",
                load: showResults,
                error: function (error, io) {
                    alert(error.message)
                }
            });
            break;
        case "04":
            var cb2 = dijit.byId('YI_TOWN_04');
            var m1 = dijit.byId('YI_CROSSROAD_04');
            var m2 = dijit.byId('YI_CROSSROAD2_04');
            esri.request({
                url: _YISEARCHDATAURL,
                content: { CMD: 'ZOOMTO04', FULLN1: m1.get("displayedValue"), FULLN2: m2.get("displayedValue"), TOWN: cb2.get("displayedValue") },
                callbackParamName: "callback",
                load: showResults,
                error: function (error, io) {
                    alert(error.message)
                }
            });
            break;
        case "07":
            var t = dijit.byId('YI_SECTOR_07');
            var m = dijit.byId('YI_LANDNO2_07');
            esri.request({
                url: _YISEARCHDATAURL,
                content: { CMD: 'ZOOMTO07', SECTOR: t.value, SEC_LANDNO: m.value },
                callbackParamName: "callback",
                load: showResults,
                error: function (error, io) {
                    alert(error.message)
                }
            });
            break;
        case "08":
            var m = dijit.byId('YI_LANDUSE_08');
            esri.request({
                url: _YISEARCHDATAURL,
                content: { CMD: 'ZOOMTO08', PLANNAME: m.get("displayedValue") },
                callbackParamName: "callback",
                load: showResults,
                error: function (error, io) {
                    alert(error.message)
                }
            });
            break;
    }

}

function showResults(featureSet) {
    yilandmap.graphics.clear();
    if (featureSet.features.length == 0) {
        alert("找不到符合條件資料");
        return;
    }
    else {
        var xmin, ymin, xmax, ymax;
        if (featureSet.geometryType == "esriGeometryPoint") {
            var symbol = new esri.symbol.PictureMarkerSymbol(Yipointimg, 28, 28);
            for (var j = 0, jl = featureSet.features.length; j < jl; j++) {
                //var graphic = featureSet.features[j];
                //debugger;
                var graphic = new esri.Graphic(featureSet.features[j]);
                graphic.setSymbol(symbol);
                yilandmap.graphics.add(graphic);
                if (j == 0) {
                    xmin = graphic.geometry.x; xmax = graphic.geometry.x; ymin = graphic.geometry.y; ymax = graphic.geometry.y;
                }
                else {
                    if (xmin > graphic.geometry.x) xmin = graphic.geometry.x;
                    if (xmax < graphic.geometry.x) xmax = graphic.geometry.x;
                    if (ymin > graphic.geometry.y) ymin = graphic.geometry.y;
                    if (ymax < graphic.geometry.y) ymax = graphic.geometry.y;
                }
            }

            if (featureSet.features.length > 1) {
                var extent = new esri.geometry.Extent(xmin, ymin, xmax, ymax, yilandmap.spatialReference);
                yilandmap.setExtent(extent.expand(2));
            }
            else {
                var pt = new esri.geometry.Point(xmin, ymin, yilandmap.spatialReference);
                yilandmap.centerAndZoom(pt, 12);
            }
        }
        else {
            var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new dojo.Color([0, 0, 255, 0.35]), 5), new dojo.Color([255, 0, 0, 0]));
            for (var j = 0, jl = featureSet.features.length; j < jl; j++) {
                //var graphic = featureSet.features[j];
                var graphic = new esri.Graphic(featureSet.features[j]);
                graphic.setSymbol(symbol);
                graphic.setAttributes({ "fun": "loc" });
                yilandmap.graphics.add(graphic);
                var taxLotExtent = graphic.geometry.getExtent();
                if (j == 0) {
                    xmin = taxLotExtent.xmin; xmax = taxLotExtent.xmax; ymin = taxLotExtent.ymin; ymax = taxLotExtent.ymax;
                }
                else {
                    if (xmin > taxLotExtent.xmin) xmin = taxLotExtent.xmin;
                    if (xmax < taxLotExtent.xmax) xmax = taxLotExtent.xmax;
                    if (ymin > taxLotExtent.ymin) ymin = taxLotExtent.ymin;
                    if (ymax < taxLotExtent.ymax) ymax = taxLotExtent.ymax;
                }
            }
            if (featureSet.features.length > 0) {
                var extent = new esri.geometry.Extent(xmin, ymin, xmax, ymax, yilandmap.spatialReference);
                yilandmap.setExtent(extent.expand(2));
            }
        }
    }
}

//地籍查詢圖面點擊後執行
function YiSearchMAP(geo) {
    parent.document.getElementById("ilanmap").contentWindow.toolbarSearch.deactivate(); //停止點擊動作
    //於伺服器查詢該點地籍屬性並回傳資料
    esri.request({
        url: _YISEARCHDATAURL,
        content: { CMD: parent.document.getElementById("ilanmap").contentWindow._SearchKind, PX: geo.x, PY: geo.y },
        callbackParamName: "callback",
        load: YiSearchMAP_RESULT,
        error: function (error, io) {
            alert(error.message)
        }
    });
}
//地籍屬性回傳資料後執行
function YiSearchMAP_RESULT(res) {
    yilandmap.graphics.clear(); //清除現有graphic
    if (parent.document.getElementById("ilanmap").contentWindow._SearchKind == "SEARCHCADA") {
        if (res.features.length > 0) {
            tmp = "<table border='1'>";
            tmp += "<tr><td>縣市</td><td>" + res.features[0].attributes["COUNTY"] + "</td></tr>";
            tmp += "<tr><td>鄉鎮市</td><td>" + res.features[0].attributes["TOWN"] + "</td></tr>";
            tmp += "<tr><td>段號</td><td>" + res.features[0].attributes["SECTOR"] + "</td></tr>";
            tmp += "<tr><td>段名</td><td>" + res.features[0].attributes["SEC_NAME"] + "</td></tr>";
            tmp += "<tr><td>地號</td><td>" + res.features[0].attributes["LANDNO"] + "</td></tr>";
            tmp += "</table>";
            dojo.byId("Search_result").innerHTML = tmp;
            var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new dojo.Color([0, 0, 255, 0.35]), 5), new dojo.Color([255, 0, 0, 0]));
            var graphic = new esri.Graphic(res.features[0]);
            graphic.setSymbol(symbol);
            yilandmap.graphics.add(graphic);
        }
        else {
            dojo.byId("Search_result").innerHTML = "查無地籍資料";
        }
    }
}
