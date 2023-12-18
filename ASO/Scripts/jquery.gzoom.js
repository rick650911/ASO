/*!
 * jQuery gzoom 0.1
 * 2009 Giovanni Battista Lenoci <gianiaz@gianiaz.net>
 * 
 * Based on minizoomPan plugin of Gian Carlo Mingati Version: 1.0 (18-JUNE-2009) http://www.gcmingati.net/wordpress/wp-content/lab/jquery/minizoompan/
 * Inspiration from jquery lightbox plugin http://leandrovieira.com/projects/jquery/lightbox/
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Requires:
 * jQuery v1.3.2 or later
 * jQuery ui.core.js v.1.7.1
 * jQuery ui.slider.js v.1.7.1
 * 
 */
var _Stero = "";
var $lockState = "lock";
var $allLock = "";
jQuery.fn.gzoom = function (settings) {
    settings = jQuery.extend({
        sW: 10, // small image width
        sH: 10, // small image height
        lW: 20, // large image width
        lH: 20, // large image height
        step: 5,
        initialSize:0,
        frameColor: "#cecece",
        frameWidth: 1,
        re: /thumbs\//,
        replace: '',
        debug: false,
        overlayBgColor: '#000',
        overlayOpacity: 0.8,
        containerBorderSize: 10,
        containerResizeSpeed: 400,
        loaderContent: "loading...",  // plain text or an image tag eg.: "<img src='yoursite.com/spinner.gif' />"
        lightbox: false,
        zoomIcon: "" // icon url, if not empty shown on the right-top corner of the image
    }, settings);

    return this.each(function () {
        var swapped = false;

        var $div = jQuery(this).css({ width: settings.sW, height: settings.sH, border: settings.frameWidth + "px solid " + settings.frameColor, overflow: 'hidden' }).addClass("minizoompan");
        var $div_R = $('#div_right').css({ width: settings.sW, height: settings.sH, border: settings.frameWidth + "px solid " + settings.frameColor, overflow: 'hidden' }).addClass("minizoompan");
        $div.wrap('<div class="gzoomwrap"></div>').css({ width: settings.sW });
        $div_R.wrap('<div class="gzoomwrap"></div>').css({ width: settings.sW }); //右邊圖片DIV
        var ig = $div.children().css({ position: "relative" });
        var ig_r = $div_R.children().css({ position: "relative" });

        jQuery(window).bind("load", function () {
            ig.width(settings.sW);
            ig.height(settings.sH);

            //右邊DIV設定
            ig_r.width(settings.sW);
            ig_r.height(settings.sH);
        });

        jQuery("<span class='loader'>" + settings.loaderContent + "<\/span>").insertBefore(ig);
        if (settings.zoomIcon != '' && settings.lightbox) {
            var $zoom = jQuery('<img class="zoomIcon" src="' + settings.zoomIcon + '" alt="view larger" />').insertBefore(ig);
            $zoom.load(function () {
                $zoom.css({ 'left': (settings.sW - $zoom.width()) + 'px' }).show();
            });
            $zoom.click(function () {
                drawIface();
            });
        } else if (settings.lightbox) {
            //$div.click(function () {
            //    drawIface();
            //});
            $div.css({ 'cursor': 'crosshair' });
            $div_R.css({ 'cursor': 'crosshair' });
        }

        var _unlockvar = true;
        var $position = $("#btnPosition");
        var $rotate = $("#btnRotate");
        var $lock = $('#btn_lock');
        var $lockL = $('#btnLockL');
        var $lockR = $('#btnLockR');
        var $plus = $('#btn_zoomin'); //jQuery('<div class="ui-icon ui-icon-circle-plus gzoombutton">&nbsp;</div>').insertAfter($div);        
        var $minus = $('#btn_zoomout'); //jQuery('<div class="ui-icon ui-icon-circle-minus gzoombutton">&nbsp;</div>').insertAfter($div);
        var $plus2 = $('#btn_zoomin2');  
        var $minus2 = $('#btn_zoomout2');
        var $enlarge = $('#btn_enlarge');
        var $shrink = $('#btn_shrink');
        var $print = $('#btn_print');
        var $save = $('#btn_save');

        var $slider = jQuery('<div class="gzoomSlider"></div>').insertAfter($div).css({ width: (settings.sW - 42) + 'px' });

        $position.unbind();
        $position.click(function () {
            var $src_image1 = $("#img_l");
            var $src_image_r = $("#img_r");
            var $lb_image = $("#lb_image").text();

            var Limg = $src_image1.attr("src");
            var Rimg = $src_image_r.attr("src");
            $src_image1.attr("src", Rimg);
            $src_image_r.attr("src", Limg);

            // 列印 : 
            var $Print_image1 = $("#PimageL").find("img");
            var $Print_image_r = $("#PimageR").find("img");
            var $PL = $Print_image1.attr("src");
            var $PR = $Print_image_r.attr("src");
            $Print_image1.attr("src", $PR);
            $Print_image_r.attr("src", $PL);

            switch ($lb_image) {
                case "正立體":
                    $("#lb_image").text("反立體");
                    break;
                case "反立體":
                    $("#lb_image").text("正立體");
                    break;
            }
            $("#popChange").jqxPopover("close");
        });
        
        $rotate.unbind();
        $rotate.click(function () {
            var $src_image1 = $("#img_l");
            var $src_image_r = $("#img_r");
            var $lb_image = $("#lb_image").text();

            if (_Stero != "") {
                $src_image1.css("transform", "");
                $src_image_r.css("transform", "");
                _Stero = "";
            } else {
                $src_image1.css("transform", "rotate(180deg)");
                $src_image_r.css("transform", "rotate(180deg)");

                _Stero = "rotate(180deg)";
            }

            switch ($lb_image) {
                case "正立體":
                    $("#lb_image").text("反立體");
                    break;
                case "反立體":
                    $("#lb_image").text("正立體");
                    break;
            }
            $("#popChange").jqxPopover("close");
        });
        
        $lock.unbind();
        $lock.click(function () {
            var $this = $(this);
            //var $Hd_lockState = $("#Hd_lockState").val();
            var _pic_lock = "/ASO/Content/Images/unlock.png";

            if ($lockState != "lock") {
                $lockState = "lock";
                $mouseMoveData();
                $this.attr("src", _pic_lock);
                $('#js').jqxPopover('close'); // 為了不讓 popOver跑出來。
            }
        });

        $lockL.unbind();
        $lockL.click(function () {
            var _pic_unlock = "/ASO/Content/Images/lock.png";
            $lock.attr("src", _pic_unlock);
            //$("#Hd_lockState").val("lockL"); 
            $lockState = "lockL";
            $mouseMoveData();
            $('#popLock').jqxPopover('close'); 
        });

        $lockR.unbind();
        $lockR.click(function () {
            var _pic_unlock = "/ASO/Content/Images/lock.png";
            $lock.attr("src", _pic_unlock);
            //$("#Hd_lockState").val("lockR");
            $lockState = "lockR";
            $mouseMoveData();
            $('#popLock').jqxPopover('close'); 
        });

        var $igCre = null;
        var $ig_rCre = null;

        function $mouseMoveData() {
            ig.unbind();
            ig_r.unbind();

            ig.mousedown(function (evt1) {
                var $this = $(this);
                var $offset = $this.offset();
                var $CreX = evt1.pageX - $offset.left;
                var $CreY = evt1.pageY - $offset.top;

                var ini_X = evt1.pageX;
                var ini_Y = evt1.pageY;

                var divWidth = $div.width();
                var divHeight = $div.height();
                var igW = ig.width();
                var igH = ig.height();

                var divRWidth = $div_R.width();
                var divRHeight = $div_R.height();

                var ig_rW = ig_r.width();
                var ig_rH = ig_r.height();

                $this.mousemove(function (evt) {
                    var $this_move = $(this);

                    if (divWidth != igW) {
                        var $dOs = $div.offset();
                        var $dOsR = $div_R.offset();
                        var $igO = ig.offset();
                        var $ig_rO = ig_r.offset();

                        var $moveX = evt.pageX - $CreX;
                        var $moveY = evt.pageY - $CreY;

                        var delta_X = evt.pageX - ini_X;
                        var delta_Y = evt.pageY - ini_Y;

                        var $R_CreX = null;
                        var $R_CreY = null;

                        if ($ig_rCre != null) {
                            $R_CreX = delta_X + $ig_rCre.left;
                            $R_CreY = delta_Y + $ig_rCre.top;

                            if ($R_CreX >= $dOsR.left) {
                                $R_CreX = $dOsR.left;
                            }

                            if ($R_CreX <= ($dOsR.left + divRWidth - ig_rW)) {
                                $R_CreX = ($dOsR.left + divRWidth - ig_rW);
                            }

                            if ($R_CreY >= $dOsR.top) {
                                $R_CreY = $dOsR.top;
                            }

                            if ($R_CreY <= ($dOsR.top + divRHeight - ig_rH)) {
                                $R_CreY = ($dOsR.top + divRHeight - ig_rH);
                            }
                        }

                        if ($moveX >= $dOs.left) {
                            $moveX = $dOs.left;
                        }

                        if ($moveX <= ($dOs.left + divWidth - igW)) {
                            $moveX = ($dOs.left + divWidth - igW);
                        }

                        if ($moveY >= $dOs.top) {
                            $moveY = $dOs.top;
                        }

                        if ($moveY <= ($dOs.top + divHeight - igH)) {
                            $moveY = ($dOs.top + divHeight - igH);
                        }
                        var $extraLen = parseFloat($div_R.css("margin-left").replace("px", ""));
                        var $moveX_r = $moveX + divWidth + $extraLen;

                        $R_CreX = $R_CreX == null ? $moveX_r : $R_CreX;
                        $R_CreY = $R_CreY == null ? $moveY : $R_CreY;

                        if ($allLock == "") {
                            switch ($lockState) {
                                case "lock":

                                    // 向右滑 : 
                                    if (delta_X > 0) {

                                        if ($igO.left >= $dOs.left || $ig_rO.left >= $dOsR.left) {
                                            $moveX = $igO.left;
                                            $R_CreX = $ig_rO.left;
                                        }
                                    }

                                    if (delta_X < 0) {
                                        if (($igO.left + igW) <= ($dOs.left + divWidth) || ($ig_rO.left + ig_rW) <= ($dOsR.left + divRWidth)) {
                                            $moveX = $igO.left;
                                            $R_CreX = $ig_rO.left;
                                        }
                                    }

                                    $this_move.offset({ left: $moveX, top: $moveY });
                                    ig_r.offset({ left: $R_CreX, top: $R_CreY });
                                    break;
                                case "lockL":
                                    //ig_r.offset({ left: $moveX_r});
                                    break;
                                case "lockR":
                                    $this_move.offset({ left: $moveX });
                                    break;
                            }
                        }
                    }
                });
            });
            ig_r.mousedown(function (evt1) {
                var $this = $(this);
                var $offset = $this.offset();
                var $CreX = evt1.pageX - $offset.left;
                var $CreY = evt1.pageY - $offset.top;

                var ini_X = evt1.pageX;
                var ini_Y = evt1.pageY;

                var divWidth = $div_R.width();
                var divHeight = $div_R.height();
                var igW = ig_r.width();
                var igH = ig_r.height();

                var divLWidth = $div.width();
                var divLHeight = $div.height();

                var ig_LW = ig.width();
                var ig_LH = ig.height();

                $this.mousemove(function (evt) {
                    var $this_move = $(this);

                    if (divWidth != igW) {
                        var $dOs = $div_R.offset();
                        var $dOsL = $div.offset();
                        var $igO = ig.offset();
                        var $ig_rO = ig_r.offset();

                        var $L_CreX = null;
                        var $L_CreY = null;

                        var $moveX = evt.pageX - $CreX;
                        var $moveY = evt.pageY - $CreY;

                        var delta_X = evt.pageX - ini_X;
                        var delta_Y = evt.pageY - ini_Y;

                        if ($igCre != null) {
                            $L_CreX = delta_X + $igCre.left;
                            $L_CreY = delta_Y + $igCre.top;

                            if ($L_CreX >= $dOsL.left) {
                                $L_CreX = $dOsL.left;
                            }

                            if ($L_CreX <= ($dOsL.left + divLWidth - ig_LW)) {
                                $L_CreX = ($dOsL.left + divLWidth - ig_LW);
                            }

                            if ($L_CreY >= $dOsL.top) {
                                $L_CreY = $dOsL.top;
                            }

                            if ($L_CreY <= ($dOsL.top + divLHeight - ig_LH)) {
                                $L_CreY = ($dOsL.top + divLHeight - ig_LH);
                            }
                        }

                        if ($moveX >= $dOs.left) {
                            $moveX = $dOs.left;
                        }

                        if ($moveX <= ($dOs.left + divWidth - igW)) {
                            $moveX = ($dOs.left + divWidth - igW);
                        }

                        if ($moveY >= $dOs.top) {
                            $moveY = $dOs.top;
                        }

                        if ($moveY <= ($dOs.top + divHeight - igH)) {
                            $moveY = ($dOs.top + divHeight - igH);
                        }
                        var $extraLen = parseFloat($div_R.css("margin-left").replace("px", ""));
                        var $moveX_l = $moveX - divWidth - $extraLen;

                        $L_CreX = $L_CreX == null ? $moveX_l : $L_CreX;
                        $L_CreY = $L_CreY == null ? $moveY : $L_CreY;

                        if ($allLock == "") {
                            switch ($lockState) {
                                case "lock":

                                    if (delta_X > 0) {

                                        if ($igO.left >= $dOsL.left || $ig_rO.left >= $dOs.left) {
                                            $L_CreX = $igO.left;
                                            $moveX = $ig_rO.left;
                                        }
                                    }

                                    if (delta_X < 0) {

                                        if (($igO.left + ig_LW) <= ($dOsL.left + divLWidth) || ($ig_rO.left + igW) <= ($dOs.left + divWidth)) {
                                            $L_CreX = $igO.left;
                                            $moveX = $ig_rO.left
                                        }
                                    }

                                    ig.offset({ left: $L_CreX, top: $L_CreY });
                                    $this_move.offset({ left: $moveX, top: $moveY });
                                    break;
                                case "lockL":
                                    $this_move.offset({ left: $moveX });
                                    break;
                                case "lockR":
                                    //ig.offset({ left: $moveX_l });
                                    break;
                            }
                        }
                    }
                });
            });

            ig.mouseup(function () {
                var $this = $(this);
                $this.unbind("mousemove");
                $igCre = ig.offset();
                $ig_rCre = ig_r.offset();

            });
            ig.mouseleave(function () {
                var $this = $(this);
                $this.unbind("mousemove");
                $igCre = ig.offset();
                $ig_rCre = ig_r.offset();

            });

            ig_r.mouseup(function () {
                var $this = $(this);
                $this.unbind("mousemove");
                $igCre = ig.offset();
                $ig_rCre = ig_r.offset();
            });
            ig_r.mouseleave(function () {
                var $this = $(this);
                $this.unbind("mousemove");
                $igCre = ig.offset();
                $ig_rCre = ig_r.offset();
            });
        }

        $plus.click(function () {
            valore = parseInt($slider.slider('value')) + settings.step;
            $slider.slider('value', valore);
            settings.initialSize = valore < 100 ? valore:100;

            // 列印 : 
            var $igW = ig[0].style.width;
            var $igH = ig[0].style.height;
            var $ig_rW = ig_r[0].style.width;
            var $ig_rH = ig_r[0].style.height;

            $("#PimageL").find("img").css({ width: $igW, height: $igH });
            $("#PimageR").find("img").css({ width: $ig_rW, height: $ig_rH });
        });

        $minus.click(function () {
            valore = parseInt($slider.slider('value')) - settings.step;
            $slider.slider('value', valore);
            settings.initialSize = valore > 0 ? valore : 0;
            // 列印 : 
            var $igW = ig[0].style.width;
            var $igH = ig[0].style.height;
            var $ig_rW = ig_r[0].style.width;
            var $ig_rH = ig_r[0].style.height;

            $("#PimageL").find("img").css({ width: $igW, height: $igH });
            $("#PimageR").find("img").css({ width: $ig_rW, height: $ig_rH });
        });
        $plus2.click(function () {
            valore = parseInt($slider.slider('value')) + settings.step;
            $slider.slider('value', valore);
            settings.initialSize = valore < 100 ? valore : 100;

            // 列印 : 
            var $igW = ig[0].style.width;
            var $igH = ig[0].style.height;
            var $ig_rW = ig_r[0].style.width;
            var $ig_rH = ig_r[0].style.height;

            $("#PimageL").find("img").css({ width: $igW, height: $igH });
            $("#PimageR").find("img").css({ width: $ig_rW, height: $ig_rH });
        });

        $minus2.click(function () {
            valore = parseInt($slider.slider('value')) - settings.step;
            $slider.slider('value', valore);
            settings.initialSize = valore > 0 ? valore : 0;
            // 列印 : 
            var $igW = ig[0].style.width;
            var $igH = ig[0].style.height;
            var $ig_rW = ig_r[0].style.width;
            var $ig_rH = ig_r[0].style.height;

            $("#PimageL").find("img").css({ width: $igW, height: $igH });
            $("#PimageR").find("img").css({ width: $ig_rW, height: $ig_rH });
        });
        $enlarge.click(function () {
            var mleft = parseInt($div_R.css('margin-left').replace('px', ''));
            if (mleft < 55) {
                mleft += 1;
                $div_R.css({ 'margin-left': mleft + 'px' });

                var $tb_Lengtheye = parseFloat($("#tb_Lengtheye").val());
                $tb_Lengtheye += _pxToCm;
                $("#tb_Lengtheye").val($tb_Lengtheye);

                //列印的部分 : 
                var LPimageL = parseFloat($("#PimageL").css("margin-left"));
                var LPimageR = parseFloat($("#PimageR").css("margin-left"));
                LPimageL -= 0.5;
                LPimageR += 1;
                $("#PimageL").css("margin-left", LPimageL);
                $("#PimageR").css("margin-left", LPimageR);

                //$content.css({ 'padding-right': (mleft - 25) + 'px' });
            }
        });

        $shrink.click(function () {
            var mleft = parseInt($div_R.css('margin-left').replace('px', ''));
            if (mleft > 0) {
                mleft -= 1;
                $div_R.css({ 'margin-left': mleft + 'px' });

                var $tb_Lengtheye = parseFloat($("#tb_Lengtheye").val());
                $tb_Lengtheye -= _pxToCm;
                $("#tb_Lengtheye").val($tb_Lengtheye);

                //列印的部分 : 
                var LPimageL = parseFloat($("#PimageL").css("margin-left"));
                var LPimageR = parseFloat($("#PimageR").css("margin-left"));
                LPimageL += 0.5;
                LPimageR -= 1;
                $("#PimageL").css("margin-left", LPimageL);
                $("#PimageR").css("margin-left", LPimageR);

                //$content.css({ 'padding-right': (mleft - 25) + 'px' });
            }
        });

        // 預設眼距帶入 : 
        var _pxToCm = 0.02645833;
        var _cmToPx = 37.795276;
        var $wPx = parseFloat($div.width());
        var $w = $wPx * _pxToCm;

        $("#tb_Lengtheye").change(function () {
            var $this = $(this);
            var realeyeL = ($this.val() - 6.5) + "cm";
            //var $thisL = parseFloat($this.val()) * _cmToPx /*- $wPx*/;
            var $thisL = parseFloat(realeyeL) * _cmToPx /*- $wPx*/;
            var $Pwl = $("#PimageL").width();
            if ($thisL >= 55) {
                $div_R.css("margin-left", 55);
                $this.val((8));
                realeyeL = ($this.val() - 6.5) + "cm";
                $("#PimageL").css("margin-left", 123.5);
                $("#PimageR").css("margin-left", realeyeL);
                //$("#PimageR").css("margin-left", 55);
            } else if ($thisL < 0) {

                $div_R.css("margin-left", 0);
                //$this.val($w);
                $this.val(6.5);
                realeyeL = ($this.val() - 6.5) + "cm";
                $("#PimageL").css("margin-left", 151.181);
                $("#PimageR").css("margin-left", realeyeL);
                //$("#PimageR").css("margin-left", 0);
                
            }else {
                $div_R.css("margin-left", $thisL);

                $("#PimageL").css("margin-left", (151.181 - $thisL / 2));
                $("#PimageR").css("margin-left", realeyeL);
                //$("#PimageR").css("margin-left", $thisL);
            }
        });

        var newWindow;
        $print.unbind();
        $print.click(function () {
            var _s1 = ig.attr('style');
            var _s2 = ig_r.attr('style');

            $('#PimageL').find('img').attr('style', _s1);
            $('#PimageR').find('img').attr('style', _s2);



            var _tag = $('#lb_image').text()
            $('#extraTag').text(_tag);
            var _data = $("#_printDiv").html();
            newWindow = window.open("", "print_window");
            newWindow.document.open();
            newWindow.document.write("<html><body onload='window.print()' onafterprint='window.close();'>" + _data+"</body></html>");
            newWindow.document.close();
        });
        $save.unbind();
        $save.click(function () {
            var $this = $(this);
            var $authName = $this.data("auth");

            if ($authName == "") {
                //$('#LoginSection').jqxWindow("open");
                alert("請先登入/重新登入，才可儲存。");
                window.close();
            } else {
                var $url = $this.data("url");

                var $des = $("#lb_image").text();
                var $src_image1 = $("#img_l");

                var $rotate = $src_image1.css("transform") == "none" ? "" :"rotate(180deg)";
                var $trans = "沒對調";
                if ($des == "正立體" && $rotate != "") {
                    $trans = "對調";
                } else if ($des == "反立體" && $rotate == "") {
                    $trans = "對調";
                }

                var $igW = ig[0].style.width;
                var $igH = ig[0].style.height;
                var $ig_rW = ig_r[0].style.width;
                var $ig_rH = ig_r[0].style.height;

                var _top = ig[0].style.top;
                var _left = ig[0].style.left;
                var _topR = ig_r[0].style.top;
                var _leftR = ig_r[0].style.left;

                var $btn_zoom = '{"igW":"' + $igW + '",';
                $btn_zoom += '"igH":"' + $igH+'",';
                $btn_zoom += '"ig_rW":"' + $ig_rW+'",';
                $btn_zoom += '"ig_rH":"' + $ig_rH+'",';
                $btn_zoom += '"size":"' + settings.initialSize + '",';
                $btn_zoom += '"OffsetL_L": "' + _left + '",';
                $btn_zoom += '"OffsetL_T": "' + _top + '",';
                $btn_zoom += '"OffsetR_L": "' + _leftR + '",';
                $btn_zoom += '"OffsetR_T": "' + _topR + '"';
                $btn_zoom += '}';

                var $data = {
                    StereoscopicImage_ID: $("#btn_print").data("id"),
                    btn_exchange: $des,
                    rotate: $rotate,
                    transition: $trans,
                    btn_lock: $lockState,
                    btn_zoom: $btn_zoom,
                    tb_Lengtheye: $("#tb_Lengtheye").val()
                };

                $.post($url, $data, function (data) {
                    if (data) {
                        alert("新增/修改成功!");
                    }
                });
            }
        });

        $slider.slider({
            value: settings.initialSize,
            min: 0,
            max: 100,
            step: settings.step,
            change: function (event, ui) {

                if (!swapped) {//拿掉loader
                   // var hiSrc = ig.attr("src").replace(settings.re, settings.replace);
                   // swapImage(ig, hiSrc);
                   // $div.children("span.loader").fadeIn(250);
                   // swapped = true;
                }

                val = ui.value;

                newWidth = settings.sW + ((settings.lW - settings.sW) * val) / 100;
                newHeight = settings.sH + ((settings.lH - settings.sH) * val) / 100;
                ig_pos = ig.position();

                if (settings.debug && typeof (console) != 'undefined') {
                    console.log('new dimensions:' + newWidth + 'x' + newHeight);
                }

                deltaWidth = ig.width() - settings.sW;
                leftPos = Math.abs(ig_pos.left);
                leftFactor = leftPos / deltaWidth;
                newDeltaWidth = newWidth - settings.sW;
                newLeft = (leftFactor * newDeltaWidth) * -1;

                deltaHeight = ig.height() - settings.sH;
                topPos = Math.abs(ig_pos.top);
                topFactor = topPos / deltaHeight;
                newDeltaHeight = newHeight - settings.sH;
                newTop = (topFactor * newDeltaHeight) * -1;

                ig.css({ width: newWidth, height: newHeight, left: newLeft, top: newTop });

                //同步左邊圖片大小
                ig_r.css({ width: newWidth, height: newHeight, left: newLeft, top: newTop });
            }
        });
        //$('<br style="clear:both" />').insertAfter($plus);

        function swapImage(param, uri) {
            param.load(function () {
                $div.children("span.loader").fadeOut(250);
                $slider.slider('value', 0);
            }).error(function () {
                uri = "~/Content/Images/blank-img.jpg";
                alert("照片不存在或是路徑錯誤。");
            }).attr('src', uri);
        }

        //左邊圖片滑鼠移動事件

        ig.mousedown(function (evt1) {
            var $this = $(this);
            var $offset = $this.offset();
            var $CreX = evt1.pageX - $offset.left;
            var $CreY = evt1.pageY - $offset.top;

            var divWidth = $div.width();
            var divHeight = $div.height();
            var igW = ig.width();
            var igH = ig.height();

            $this.mousemove(function (evt) {
                var $this_move = $(this);

                if (divWidth != igW) {
                    var $dOs = $div.offset();
                    var $dOs_r = $div_R.offset();

                    var $moveX = evt.pageX - $CreX;
                    var $moveY = evt.pageY - $CreY;

                    if ($moveX >= $dOs.left) {
                        $moveX = $dOs.left;
                    }

                    if ($moveX <= ($dOs.left + divWidth - igW)) {
                        $moveX = ($dOs.left + divWidth - igW);
                    }

                    if ($moveY >= $dOs.top) {
                        $moveY = $dOs.top;
                    }

                    if ($moveY <= ($dOs.top + divHeight - igH)) {
                        $moveY = ($dOs.top + divHeight - igH);
                    }

                    var $extraLen = parseFloat($div_R.css("margin-left").replace("px", ""));
                    var $moveX_r = $moveX + divWidth + $extraLen;

                    $this_move.offset({ left: $moveX, top: $moveY });
                    ig_r.offset({ left: $moveX_r, top: $moveY });

                    // == 列印 ==

                    $("#PimageL").find('img').attr('style', ig.attr('style'));
                    $("#PimageR").find('img').attr('style', ig_r.attr('style'));

                    // ==========
                }
            });
        });

        ig_r.mousedown(function (evt1) {
            var $this = $(this);
            var $offset = $this.offset();
            var $CreX = evt1.pageX - $offset.left;
            var $CreY = evt1.pageY - $offset.top;

            var divWidth = $div_R.width();
            var divHeight = $div_R.height();
            var igW = ig_r.width();
            var igH = ig_r.height();

            $this.mousemove(function (evt) {
                var $this_move = $(this);

                if (divWidth != igW) {
                    var $dOs = $div_R.offset();

                    var $moveX = evt.pageX - $CreX;
                    var $moveY = evt.pageY - $CreY;

                    if ($moveX >= $dOs.left) {
                        $moveX = $dOs.left;
                    }

                    if ($moveX <= ($dOs.left + divWidth - igW)) {
                        $moveX = ($dOs.left + divWidth - igW);
                    }

                    if ($moveY >= $dOs.top) {
                        $moveY = $dOs.top;
                    }

                    if ($moveY <= ($dOs.top + divHeight - igH)) {
                        $moveY = ($dOs.top + divHeight - igH);
                    }

                    var $extraLen = parseFloat($div_R.css("margin-left").replace("px", ""));
                    var $moveX_l = $moveX - divWidth - $extraLen;

                    $("#PimageL").find('img').attr('style', ig.attr('style'));
                    $("#PimageR").find('img').attr('style', ig_r.attr('style'));

                    $this_move.offset({ left: $moveX, top: $moveY });
                    ig.offset({ left: $moveX_l, top: $moveY });
                }
            });
        });

        ig.mouseup(function () {
            var $this = $(this);
            $this.unbind("mousemove");
        });
        ig.mouseleave(function () {
            var $this = $(this);
            $this.unbind("mousemove");
        });

        ig_r.mouseup(function () {
            var $this = $(this);
            $this.unbind("mousemove");
        });
        ig_r.mouseleave(function () {
            var $this = $(this);
            $this.unbind("mousemove");
        });

        //$div.click(function (e) {
        //    window.open(e.target.src);
        //})

        //$div_R.click(function (e) {
        //    window.open(e.target.src);
        //});
        $div.dblclick(function (e) {
            window.open(e.target.src);
        })

        $div_R.dblclick(function (e) {
            window.open(e.target.src);
        });
        //if (typeof ($.event.special.mousewheel) != 'undefined') {
        //    ig.mousewheel(function (event, delta) {
        //        if (delta > 0) {
        //            valore = parseInt($slider.slider('value')) + settings.step;
        //            $slider.slider('value', valore);
        //        } else if (delta < 0) {
        //            valore = parseInt($slider.slider('value')) - settings.step;
        //            $slider.slider('value', valore);
        //        }
        //        return false; // prevent default
        //    });
        //}

        function resize_fx(intImageWidth, intImageHeight) {

            if (settings.debug && typeof (console) != 'undefined') {
                console.log('resize_fx(' + intImageWidth + ',' + intImageHeight + ')');
            }

            if (intImageWidth > ($(window).width() * 80 / 100)) {
                imgWidth = $(window).width() * 80 / 100;
                intImageHeight = (imgWidth / intImageWidth) * intImageHeight;
                $('#zoomedimage').css({ 'width': imgWidth + 'px', 'height': intImageHeight });
                if (settings.debug && typeof (console) != 'undefined') {
                    console.log('Img dimensions 80% horizontal:' + imgWidth + 'x' + intImageHeight);
                }
            } else {
                imgWidth = intImageWidth;
            }

            if (intImageHeight > $(window).height() * 80 / 100) {
                imgHeight = $(window).height() * 80 / 100;
                imgWidth = (imgHeight / intImageHeight) * imgWidth;
                $('#zoomedimage').css({ 'width': imgWidth + 'px', 'height': imgHeight });
                if (settings.debug && typeof (console) != 'undefined') {
                    console.log('Img dimensions 80% vertical:' + imgWidth + 'x' + imgHeight);
                }
            } else {
                imgHeight = intImageHeight;
            }

            if (settings.debug && typeof (console) != 'undefined') {
                console.log('Img dimensions:' + imgWidth + 'x' + imgHeight);
            }

            // Get current width and height
            var intCurrentWidth = $('#imagebox').width();
            var intCurrentHeight = $('#imagebox').height();
            // Get the width and height of the selected image plus the padding
            var intWidth = (imgWidth + (settings.containerBorderSize * 2)); // Plus the imageŽs width and the left and right padding value
            var intHeight = (imgHeight + (settings.containerBorderSize * 2)); // Plus the imageŽs height and the left and right padding value



            // Diferences
            var intDiffW = intCurrentWidth - intWidth;
            var intDiffH = intCurrentHeight - intHeight;
            // Perfomance the effect
            $('#imagebox').animate({ width: intWidth, height: intHeight }, settings.containerResizeSpeed, function () { _show_image(); });
            if ((intDiffW == 0) && (intDiffH == 0)) {
                if ($.browser.msie) {
                    ___pause(250);
                } else {
                    ___pause(100);
                }
            }
            $('#lboximgdatacontainer').css({ width: imgWidth });
        };

        function drawIface() {
            $('body').append('<div id="gzoomoverlay"></div><div id="gzoomlbox"><div id="imagebox"><div id="gzoom-cont-img"><img id="zoomedimage"><div id="gzoomloading"><a href="#" id="gzoomloadinglink"><img src="../css/loading.gif"></a></div></div></div><div id="gzoomlbox-con-imgdata"><div id="lboximgdatacontainer"><div id="gzoomlbox-image-details"><span id="gzoom-image-caption"></span></div></div></div></div>');
            debugger;
            $('#gzoomoverlay').css({
                backgroundColor: settings.overlayBgColor,
                opacity: settings.overlayOpacity,
                width: $(window).width(),
                height: $(document).height()
            }).fadeIn();

            // Calculate top and left offset for the gzoomlbox div object and show it
            $('#gzoomlbox').css({
                top: $(window).scrollTop() + ($(window).height() / 10),
                left: $(window).scrollLeft()
            }).show();

            $('#gzoomoverlay, #gzoomlbox').click(function () {
                close();
            });
            // If window was resized, calculate the new overlay dimensions
            $(window).resize(function () {
                $('#gzoomoverlay').css({
                    width: $(window).width(),
                    height: $(window).height()
                });
                // Calculate top and left offset for the jquery-lightbox div object and show it
                $('#gzoomlbox').css({
                    top: $(window).scrollTop() + ($(window).height() / 10),
                    left: $(window).scrollLeft()
                });
            });

          //  _set_image_to_view();
        }

        function _set_image_to_view() { // show the loading
            // Show the loading
            $('#gzoomlbox-con-imgdata').hide();
            $('#zoomedimage').hide();
            $('#gzoomloading').show();
            // Image preload process
            var objImagePreloader = new Image();
            if (!swapped) {
                var hiSrc = ig.attr("src").replace(settings.re, settings.replace);
            } else {
                var hiSrc = ig.attr("src").replace(settings.re, settings.replace);
            }
            objImagePreloader.onload = function () {
                $('#zoomedimage').attr('src', hiSrc);
                resize_fx(objImagePreloader.width, objImagePreloader.height);
            };
            objImagePreloader.src = hiSrc;
        };

        function _show_image() {
            $('#gzoomloading').hide();
            $('#zoomedimage').fadeIn(function () {
                _show_image_data();
            });
        };

        /**
		 * Show the image information
		 *
		 */
        function _show_image_data() {
            $('#lightbox-loading').hide();
            $('#gzoom-image-caption').html(ig.attr('title'));
            $('#gzoomlbox-con-imgdata').slideDown('fast');
        }

        function close() {
            $('#gzoomlbox').remove();
            $('#gzoomoverlay').fadeOut(function () { $('#gzoomoverlay').remove(); });
            $('embed, object, select').css({ 'visibility': 'visible' });
        }

        function ___pause(ms) {
            var date = new Date();
            curDate = null;
            do { var curDate = new Date(); }
            while (curDate - date < ms);
        };

    });

};