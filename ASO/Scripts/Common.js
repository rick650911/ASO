//region 地圖底圖預設
var mapInitconfig = {
    domDiv: 'map',
    defExtent: { minx: 275509.2695315677, miny: 2751645.1634475225, maxx: 346755.2810787978, maxy: 2787368.3745819633, wkid: 102443 },
    optionFuns: [
        //{ fun: "proxy", param: "http://210.242.163.56/proxy/proxy.ashx" },
        { fun: "geometryService", param: "http://210.242.163.58/ArcGIS/rest/services/Geometry/GeometryServer" },
        { fun: "printTask", param: "http://192.168.1.56/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task" },
        { fun: "userLocateBtn", param: null },
        { fun: "fenceToShp", param: "http://wa.e-land.gov.tw/arcgis/rest/services/HDST/ExtractZionData/GPServer/ExtractZionData" }
    ]
};
//endregion

//#region PartialViewLoad
function PartialViewLoad(divID, viewUrl, async) {
    $.ajax({
        type: 'POST', dataType: 'html', url: viewUrl, async: (async != null ? async : true),
        success: function (html) {
            $("#" + divID + "").html(html);
        }
    })
}

function PartialViewPopLoad(divID, viewUrl, async) {
    $.ajax({
        type: 'POST', dataType: 'html', url: viewUrl, async: (async != null ? async : true),
        success: function (html) {
            $("#" + divID + "").jqxWindow('setContent', html);
        }
    })
}
//#endregion


//#region 設施項目分類表設定
//顯示合計
var sum = function (aggregates) {
    var renderstring = "";
    if (aggregates.sum != null)
        renderstring = '<div style="position: relative; margin: 4px; overflow: hidden;"> ' + aggregates.sum + '</div>';
    return renderstring;
}

//計算個數
var count = [{
    'c': function (aggregatedValue, currentValue) {
        if (currentValue)
            return aggregatedValue + 1;
        return aggregatedValue;
    }
}]

//資料為0不顯示
var withoutzero = function (row, column, value) {
    if (value == 0)
        return '<div style="text-align: center; margin-top: 5px;"></div>';
    else
        return '<div style="text-align: center; margin-top: 5px;">' + value.toFixed(3) + '</div>';
}


//日期為負不顯示
var wrongdate = function (row, colum, value) {
    if (value.getFullYear() > 10)
        return '<div style="text-align: center; margin-top: 5px;">' + value.getFullYear() + '/' + (value.getMonth() + 1) + '/' + value.getDate() + '</div>';
    else
        return '<div style="text-align: center; margin-top: 5px;"></div>';
}

//顯示個數
var countrenderer = function (aggregates) {
    var renderstring = "";
    if (aggregates.c != null)
        renderstring = '<div style="position: relative; margin: 4px; overflow: hidden;"> ' + aggregates.c + '</div>';
    return renderstring;
}

//產生項次
var totaltitle = {
    text: '項次',
    width: 50,
    cellsalign: 'center',
    align: 'center',
    aggregates: [{ '合計': function () { return ""; } }],
    cellsrenderer:
        function (row) { return '<center>' + (row + 1) + '</center>'; }
}

//#region jqwidget initial setting
var JqxInputSetting = { height: '20px', theme: 'blueall' };
var JqxBtnSetting = { width: '100px', height: '30px', theme: 'blueall' };
var JqxDdlSetting = { width: 150, height: '20px', selectedIndex: 0, theme: 'blueall' };
var JqxRdSetting = { width: '100%', height: '100%', theme: 'blueall' };
var JqxCbSetting = { width: '100%', height: '100%', theme: 'blueall' };
var JqxDateSetting = { animationType: 'fade', width: '120px', height: '20px', formatString: 'yyyy/MM/dd' };
var JqxGvSetting = { width: '100%', height: 305 };
var JqxGvSetting600 = { width: '600px' };
var JqxWindowSetting = { width: "620px", height: "400px", theme: 'graywindow', autoOpen: false, resizable: false, isModal: true };
var jqxListBoxSetting = { width: '500px', height: '300px', theme: 'energyblue' };
var jqxSplitterSetting = { theme: 'blueall' };

function GetJqxInputSetting(setting) {
    return $.extend({}, JqxInputSetting, setting);
}
function GetJqxBtnSetting(setting) {
    return $.extend({}, JqxBtnSetting, setting);
}
function GetJqxRdSetting(setting) {
    return $.extend({}, JqxRdSetting, setting);
}
function GetJqxCbSetting(setting) {
    return $.extend({}, JqxCbSetting, setting);
}
function GetJqxDateSetting(setting) {
    return $.extend({}, JqxDateSetting, setting);
}
function GetJqxGvSetting(setting) {
    return $.extend({}, JqxGvSetting, setting);
}
function GetJJqxListBoxSetting(setting) {
    return $.extend({}, jqxListBoxSetting, setting);
}

function GetJqxDdlSetting(source, valueField, textField) {
    if (valueField == null) valueField = "Code";
    if (textField == null) textField = "Name";
    return $.extend(JqxDdlSetting, { source: source, displayMember: textField, valueMember: valueField });
}
//#endregion

//#region GetTheme
function getStrinputTheme() {
    return "darkblue";
}
function getCheckBoxTheme() {
    return "blueall";
}
function getTooltipTheme() {
    return "metrodark";
}
function getButtonTheme() {
    return "darkblue";
}
function getWindowTheme() {
    return "graywindow";
}
//#endregion

//Grid中文化
var getLocalization = function () {
    var localizationobj = {
        sortascendingstring: "升冪排序",
        sortdescendingstring: "降冪排序",
        sortremovestring: "移除排序",
        filterclearstring: "清除",
        filterstring: "搜尋",
        filterchoosestring: "請選擇:",
        filtershowrowstring: "過濾資料:",
        filtershowrowdatestring: "過濾日期:",
        filterorconditionstring: "或",
        filterandconditionstring: "與",
        filterstringcomparisonoperators: ['等於空值', '不等於空值', '包含', '包含(區分大小寫)',
            '不包含', '不包含(區分大小寫)', '開頭為', '開頭為(區分大小寫)',
            '結尾為', '結尾為(區分大小寫)', '等於', '等於(區分大小寫)', '等於空值', '不等於空值'],
        filternumericcomparisonoperators: ['等於', '不等於', '小於', '小於等於', '大於', '大於等於', '等於空值', '不等於空值'],
        filterdatecomparisonoperators: ['等於', '不等於', '小於', '小於等於', '大於', '大於等於', '等於空值', '不等於空值'],
        filterbooleancomparisonoperators: ['等於', '不等於'],
        filterselectstring: "選擇過濾條件",
        emptydatastring: "查無資料",
        loadtext: "讀取中...",
        clearstring: "清除",
        todaystring: "今日",
        pagergotopagestring: "前往:",
        pagershowrowsstring: "頁，每頁顯示:"
    };
    return localizationobj;
};
//#endregion

//#region Convert JsonDate To JSDate(return string)
function ConvertJsonDate(str, type) {
    var d, t, year, month, day, hour, minute, finalDate;
    str = str.replace(/[A-Za-z\/()]/g, "");
    t = parseInt(str);

    if (t > 0) {
        d = new Date(parseInt(str));
        year = d.getFullYear();
        month = padLeft((d.getMonth() + 1).toString(), "0", 2);
        day = padLeft(d.getDate().toString(), "0", 2);
        finalDate = year + '/' + month + '/' + day;

        if (type == "m") {
            hour = padLeft(d.getHours().toString(), "0", 2);
            minute = padLeft(d.getMinutes().toString(), "0", 2);
            finalDate = finalDate + " " + hour + ":" + minute;
        }
    }
    return finalDate;
}


function DateTojqxDateTimeInput(date) {
    var num = date.split('/');
    var Y = num[0].toString();
    var M = padLeft(num[1].toString(), "0", 2);
    var D = padLeft(num[2].toString(), "0", 2);
    var NewDate = Y + "/" + M + "/" + D;
    return NewDate;
}
//#endregion

//#region PadLeft(return string)
function padLeft(str, sym, totallen) {
    var symbol = "", len;
    if (totallen > str.length) {
        len = totallen - str.length;
        for (i = 0; i < len; i++) {
            symbol += sym;
        }
        return symbol + str;
    }
    else
        return str;
}
//#endregion

//取得目前日期及時間  yyyy/mm/dd 上午hh:mm:ss
function ShowDate() {
    var yyyy, mm, dd, time;
    today = new Date();
    if (today.getHours() > 12) {
        time = "下午 " + (today.getHours() - 12);
    } else {
        time = "上午 " + today.getHours();
    }
    time += ':' + padLeft(today.getMinutes(), '0', 2);
    time += ':' + padLeft(today.getSeconds(), '0', 2);
    yyyy = today.getFullYear();
    mm = (today.getMonth() + 1);
    dd = today.getDate();
    return yyyy + '/' + mm + '/' + dd + ' ' + time;
}

//Email格式確認 
function emailconfirm(emailStr) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(emailStr);
}

//密碼強度確認
function pwdconfirm(pwdStr) {
    var regex = /(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,30}/;
    return regex.test(pwdStr);
}

//jqxGrid輔助資料更新
function updateJqxGrid(objName, data) {
    source.localdata = data;
    var dataAdapter = new $.jqx.dataAdapter(source);
    $("#" + objName).jqxGrid({ source: dataAdapter });
}

function solidInit() {
    $("#div_left").gzoom({
        sW: 300,
        sH: 250,
        lW: 1600,
        lH: 1067,
        lightbox: true
    });
    $('.gzoomSlider').hide();
    $('.gzoombutton').remove();
    $('#btn_zoomout').click();

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 107) {
            $('#btn_zoomin').click();
        }
        else if (event.keyCode == 109) {
            $('#btn_zoomout').click();
        }
    });
}

function photoclick(imageL, imageR) {
    debugger;
    if (!solidinited) {
        solidInit();
        solidinited = true;
    }
    $('#img_l')[0].src = imageL;
    $('#img_r')[0].src = imageR;
    $('#jqxwin_solid').jqxWindow('open');
}


function solidInit() {
    $("#div_left").gzoom({
        sW: 300,
        sH: 250,
        lW: 1600,
        lH: 1067,
        lightbox: true
    });
    $('.gzoomSlider').hide();
    $('.gzoombutton').remove();
    $('#btn_zoomout').click();

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 107) {
            $('#btn_zoomin').click();
        }
        else if (event.keyCode == 109) {
            $('#btn_zoomout').click();
        }
    });
}

function photoclickBySize(imageL, imageR, W, H, ID) {

    //var X = 300 / (W - 0);
    var X = 245.669294 / (W - 0);
    var IH = (H - 0) * X;
    var $authdata = $("#btn_save").data("auth");
    var SettingUrl = $("#imageSettingActionHd").val();

    solidInitBySize3(IH, SettingUrl, $authdata, ID);
    $('#img_l')[0].src = imageL;
    $('#img_r')[0].src = imageR;

    $("#btnPosition").jqxButton({ width: 80, height: 30 });
    $("#btnRotate").jqxButton({ width: 80, height: 30 });
    $("#btnLockL").jqxButton({ width: 80, height: 30 });
    $("#btnLockR").jqxButton({ width: 80, height: 30 });

    $("#popChange").jqxPopover({
        offset: { left: 0, top: 20 },
        arrowOffsetValue: -40,
        position: "right",
        title: "請選擇",
        showCloseButton: true,
        selector: $("#btn_exchange"),
        isModal: false
    });

    $("#popLock").jqxPopover({
        offset: { left: 0, top: 20 },
        arrowOffsetValue: -40,
        position: "right",
        title: "請選擇",
        showCloseButton: true,
        selector: $("#btn_lock"),
        isModal: false
    });

    $("#btn_print").data("id", ID);
    $('#jqxwin_solid').jqxWindow('open');

    // 把列印功能帶入 : 

    var $btn_print = $("#btn_print");
    var $url = $btn_print.data("url");
    var $id = $btn_print.data("id");

    var CurUrl = window.location.href;

    var url = new URL(CurUrl);
    var $CurSID = url.searchParams.get("SID");
    var $CurSort = url.searchParams.get("SortID");


    var $data = {
        SID: $CurSID,
        SortID: $CurSort,
    };

    $.post($url, $data, function (data) {
        $("#_printDiv").html(data);

        $("#PimageL").css({ width: 245.669294, height: IH });
        $("#PimageR").css({ width: 245.669294, height: IH });
    });

    if ($authdata != "" && $authdata != undefined) {
        getSaveInit(SettingUrl, $authdata, ID);
    }
}
function photoclickBySize3(imageL, imageR, W, H, ID) {

    //var X = 300 / (W - 0);
    var X = $(window).width() * 0.2 / (W - 0);
    var IH = (H - 0) * X;
    var $authdata = $("#btn_save").data("auth");
    var SettingUrl = $("#imageSettingActionHd").val();

    solidInitBySize3(IH, SettingUrl, $authdata, ID);
    $('#img_l')[0].src = imageL;
    $('#img_r')[0].src = imageR;

    $("#btnPosition").jqxButton({ width: 80, height: 30 });
    $("#btnRotate").jqxButton({ width: 80, height: 30 });
    $("#btnLockL").jqxButton({ width: 80, height: 30 });
    $("#btnLockR").jqxButton({ width: 80, height: 30 });

    $("#popChange").jqxPopover({
        offset: { left: 0, top: 20 },
        arrowOffsetValue: -40,
        position: "right",
        title: "請選擇",
        showCloseButton: true,
        selector: $("#btn_exchange"),
        isModal: false
    });

    $("#popLock").jqxPopover({
        offset: { left: 0, top: 20 },
        arrowOffsetValue: -40,
        position: "right",
        title: "請選擇",
        showCloseButton: true,
        selector: $("#btn_lock"),
        isModal: false
    });

    $("#btn_print").data("id", ID);
    $('#jqxwin_solid').jqxWindow('open');

    // 把列印功能帶入 : 

    var $btn_print = $("#btn_print");
    var $url = $btn_print.data("url");
    var $id = $btn_print.data("id");

    var CurUrl = window.location.href;

    var url = new URL(CurUrl);
    var $CurSID = url.searchParams.get("SID");
    var $CurSort = url.searchParams.get("SortID");


    var $data = {
        SID: $CurSID,
        SortID: $CurSort,
    };

    $.post($url, $data, function (data) {
        $("#_printDiv").html(data);

        $("#PimageL").css({ width: 245.669294, height: IH });
        $("#PimageR").css({ width: 245.669294, height: IH });
    });

    if ($authdata != "" && $authdata != undefined) {
        getSaveInit(SettingUrl, $authdata, ID);
    }
}
function StereophotoclickBySize(imageL, imageR, W, H, ID) {

    //var X = 300 / (W - 0);
    var X = $(window).width() * 0.23 / (W - 0);
    var IH = (H - 0) * X;
    var $authdata = $("#btn_save").data("auth");
    var SettingUrl = $("#imageSettingActionHd").val();

    //solidInitBySize2(IH, SettingUrl, $authdata, ID);
    StereoInitBySize(IH, SettingUrl, $authdata, ID);

    //$('#img_l')[0].src = imageL;
    //$('#img_r')[0].src = imageR;

    //$("#btnPosition").jqxButton({ width: 80, height: 30 });
    //$("#btnRotate").jqxButton({ width: 80, height: 30 });
    //$("#btnLockL").jqxButton({ width: 80, height: 30 });
    //$("#btnLockR").jqxButton({ width: 80, height: 30 });

    //$("#popChange").jqxPopover({
    //    offset: { left: 0, top: 20 },
    //    arrowOffsetValue: -40,
    //    position: "right",
    //    title: "請選擇",
    //    showCloseButton: true,
    //    selector: $("#btn_exchange"),
    //    isModal: false
    //});

    //$("#popLock").jqxPopover({
    //    offset: { left: 0, top: 20 },
    //    arrowOffsetValue: -40,
    //    position: "right",
    //    title: "請選擇",
    //    showCloseButton: true,
    //    selector: $("#btn_lock"),
    //    isModal: false
    //});

    //$("#btn_print").data("id", ID);
    $('#jqxwin_solid').jqxWindow('open');

    // 把列印功能帶入 : 

    //var $btn_print = $("#btn_print");
    //var $url = $btn_print.data("url");
    //var $id = $btn_print.data("id");

    //var CurUrl = window.location.href;

    //var url = new URL(CurUrl);
    //var $CurSID = url.searchParams.get("SID");
    //var $CurSort = url.searchParams.get("SortID");


    //var $data = {
    //    SID: $CurSID,
    //    SortID: $CurSort,
    //};

    //$.post($url, $data, function (data) {
    //    $("#_printDiv").html(data);

    //    $("#PimageL").css({ width: 245.669294, height: IH });
    //    $("#PimageR").css({ width: 245.669294, height: IH });
    //});

    //if ($authdata != "" && $authdata != undefined) {
    //    getSaveInit(SettingUrl, $authdata, ID);
    //}
}


function getSaveInit(SettingUrl, $authdata, ID) {
    var _pxToCm = 0.02645833;
    var _cmToPx = 37.795276;

    var $data = {
        AccountID: $authdata,
        StereoscopicImage_ID: ID,
    };
    $.post(SettingUrl, $data, function (data) {
        var $div = $("#div_left");
        var $div_R = $("#div_right");
        var $srcImg = $("#img_l");
        var $srcImage_r = $("#img_r");
        // 正反立體
        var $exc = data.btn_exchange;
        var $rotate = data.rotate;
        var $transition = data.transition;

        _Stero = $rotate;
        $("#lb_image").text($exc);
        var $src1 = $srcImg[0].src;
        var $src2 = $srcImage_r[0].src;
        var $Pimg1 = $("#PimageL").find("img")[0].src;
        var $Pimg2 = $("#PimageR").find("img")[0].src;

        if ($transition == "對調") {
            $srcImg[0].src = $src2;
            $srcImage_r[0].src = $src1;
            $("#PimageL").find("img")[0].src = $Pimg2;
            $("#PimageR").find("img")[0].src = $Pimg1;
        }

        var _translate = JSON.parse(data.btn_zoom);
        var _S1 = $srcImg[0].style;
        var _S2 = $srcImage_r[0].style;

        _S1.top = _translate.OffsetL_T;
        _S1.left = _translate.OffsetL_L;
        _S1.width = _translate.igW;
        _S1.height = _translate.igH;
        _S2.top = _translate.OffsetR_T;
        _S2.left = _translate.OffsetR_L;
        _S2.width = _translate.ig_rW;
        _S2.height = _translate.ig_rH;

        $("#PimageL").find('img').attr('style', $srcImg.attr('style'));
        $("#PimageR").find('img').attr('style', $srcImage_r.attr('style'));

        // 眼距
        var $dist = data.tb_Lengtheye;
        var $lentwoPic = parseFloat($dist) * _cmToPx - parseFloat($div.width());
        if ($lentwoPic < 0) {
            $lentwoPic = 0;
        } else if ($lentwoPic > 55) {
            $lentwoPic = 55;
        }
        var realeyeL = ($dist - 6.5) + "cm";

        $("#tb_Lengtheye").val($dist);
        $div_R.css("margin-left", $lentwoPic);
        $("#PimageL").css("margin-left", (151.181 - $lentwoPic / 2));
        $("#PimageR").css("margin-left", realeyeL);

    });
}

function solidInitBySize(H, url, auth, ID) {

    //var X = 1600 / 300;
    var X = 1600 / 245.669294;

    if (auth != "" && auth != undefined) {
        var $data = {
            AccountID: auth,
            StereoscopicImage_ID: ID,
        };

        var _obj = null;
        $.ajax({
            url: url,
            type: "POST",
            data: $data,
            async: false,
            success: function (data) {
                _obj = data;
            }
        });

        if (_obj != null) {
            var $zoom = _obj.btn_zoom;
            $zoom = JSON.parse($zoom);

            $("#div_left").gzoom({
                //sW: 300,
                sW: 245.669294,
                sH: H,
                lW: 1600,
                lH: H * X,
                initialSize: $zoom.size,
                lightbox: true
            });

        } else {
            $("#div_left").gzoom({
                //sW: 300,
                sW: 245.669294,
                sH: H,
                lW: 1600,
                lH: H * X,
                initialSize: 0,
                lightbox: true
            });
        }

    } else {
        $("#div_left").gzoom({
            //sW: 300,
            sW: 245.669294,
            sH: H,
            lW: 1600,
            lH: H * X,
            initialSize: 0,
            lightbox: true
        });
    }

    $('.gzoomSlider').hide();
    $('.gzoombutton').remove();
    $('#btn_zoomout').click();
    $("#btn_lock").attr("src", "/photo-interpretation/Content/Images/unlock.png");
    $("#div_right").css("margin-left", "0px");
    $("#tb_Lengtheye").val("6.5");

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 107) {
            $('#btn_zoomin').click();
        }
        else if (event.keyCode == 109) {
            $('#btn_zoomout').click();
        }
    });
}
function solidInitBySize2(H, url, auth, ID) {

    //var X = 1600 / 300;
    var X = 1600 / 245.669294;

    if (auth != "" && auth != undefined) {
        var $data = {
            AccountID: auth,
            StereoscopicImage_ID: ID,
        };

        var _obj = null;
        $.ajax({
            url: url,
            type: "POST",
            data: $data,
            async: false,
            success: function (data) {
                _obj = data;
            }
        });

        if (_obj != null) {
            var $zoom = _obj.btn_zoom;
            $zoom = JSON.parse($zoom);

            $("#div_left").gzoom({
                //sW: 300,
                sW: 245.669294,
                sH: H,
                lW: 1600,
                lH: H * X,
                initialSize: $zoom.size,
                lightbox: true
            });

        } else {
            $("#div_left").gzoom({
                //sW: 300,
                sW: 245.669294,
                sH: H,
                lW: 1600,
                lH: H * X,
                initialSize: 0,
                lightbox: true
            });
        }

    } else {
        $("#div_left").gzoom({
            //sW: 300,
            sW: 245.669294 * 2,
            sH: H * 2,
            lW: 1600,
            lH: H * X,
            initialSize: 0,
            lightbox: true
        });
    }

    $('.gzoomSlider').hide();
    $('.gzoombutton').remove();
    $('#btn_zoomout').click();
    $('#div_right').remove();
    $("#btn_lock").attr("src", "/photo-interpretation/Content/Images/unlock.png");
    //$("#div_right").css("margin-left", "0px");
    $("#tb_Lengtheye").val("6.5");

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 107) {
            $('#btn_zoomin').click();
        }
        else if (event.keyCode == 109) {
            $('#btn_zoomout').click();
        }
    });
}
function solidInitBySize3(H, url, auth, ID) {

    //var X = 1600 / 300;
    var X = 1600 / 245.669294;

    if (auth != "" && auth != undefined) {
        var $data = {
            AccountID: auth,
            StereoscopicImage_ID: ID,
        };

        var _obj = null;
        $.ajax({
            url: url,
            type: "POST",
            data: $data,
            async: false,
            success: function (data) {
                _obj = data;
            }
        });

        if (_obj != null) {
            var $zoom = _obj.btn_zoom;
            $zoom = JSON.parse($zoom);

            $("#div_left").gzoom({
                //sW: 300,
                sW: $(window).width() * 0.2,
                sH: H,
                lW: 1600,
                lH: H * X,
                //initialSize: $zoom.size,
                initialSize: 0,
                lightbox: true
            });

        } else {
            $("#div_left").gzoom({
                //sW: 300,
                sW: $(window).width() * 0.2,
                sH: H,
                lW: 1600,
                lH: H * X,
                initialSize: 0,
                lightbox: true
            });
        }

    } else {
        $("#div_left").gzoom({
            //sW: 300,
            sW: $(window).width() * 0.2,
            sH: H,
            lW: 1600,
            lH: H * X,
            initialSize: 0,
            lightbox: true
        });
    }

    $('.gzoomSlider').hide();
    $('.gzoombutton').remove();
    $('#btn_zoomout').click();
    $("#btn_lock").attr("src", "/photo-interpretation/Content/Images/unlock.png");
    $("#div_right").css("margin-left", "0px");
    $("#tb_Lengtheye").val("6.5");

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 107) {
            $('#btn_zoomin').click();
        }
        else if (event.keyCode == 109) {
            $('#btn_zoomout').click();
        }
    });
}
function StereoInitBySize(H, url, auth, ID) {

    //var X = 1600 / 300;
    var X = 1600 / 245.669294;

    if (auth != "" && auth != undefined) {
        var $data = {
            AccountID: auth,
            StereoscopicImage_ID: ID,
        };

        var _obj = null;
        $.ajax({
            url: url,
            type: "POST",
            data: $data,
            async: false,
            success: function (data) {
                _obj = data;
            }
        });

        if (_obj != null) {
            var $zoom = _obj.btn_zoom;
            $zoom = JSON.parse($zoom);

            $("#div_left2").gzoom({
                //sW: 300,
                sW: $(window).width() * 0.23,
                sH: H,
                lW: 1600,
                lH: H * X,
                initialSize: $zoom.size,
                lightbox: true
            });

        } else {
            $("#div_left2").gzoom({
                //sW: 300,
                sW: $(window).width() * 0.23,
                sH: H,
                lW: 1600,
                lH: H * X,
                initialSize: 0,
                lightbox: true
            });
        }

    } else {
        $("#div_left2").gzoom({
            //sW: 300,
            sW: $(window).width() * 0.23,
            sH: H,
            lW: 1600,
            lH: H * X,
            initialSize: 0,
            lightbox: true
        });
    }

    $('.gzoomSlider').hide();
    $('.gzoombutton').remove();
    $('#btn_zoomout2').click();
    $('#div_right2').remove();
    $("#btn_lock").attr("src", "/photo-interpretation/Content/Images/unlock.png");
    //$("#div_right").css("margin-left", "0px");
    $("#tb_Lengtheye").val("6.5");

    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 107) {
            $('#btn_zoomin2').click();
        }
        else if (event.keyCode == 109) {
            $('#btn_zoomout2').click();
        }
    });
}

