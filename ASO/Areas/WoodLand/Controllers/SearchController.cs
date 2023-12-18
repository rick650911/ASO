using System.Collections.Generic;
using System.Web.Mvc;
using System.Linq;
using ASO.Models;
using ASO.Areas.WoodLand.Models;
using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Imaging;
using Newtonsoft.Json;

namespace ASO.Areas.WoodLand.Controllers
{
    public class SearchController : Controller
    {
        // GET: WoodLand/Search

        //像片對查詢

        public ActionResult Index()
        {
            return Redirect("IPCCQuery");
        }
        //public ActionResult Index (bool? isLoadList, int? IPCCID, int? IPCCsubID) {
        //    List<SelectListItem> crown6 = SysTool.GetSelectList(typeof(enFLCrown6));
        //    List<SelectListItem> crown7 = SysTool.GetSelectList(typeof(enFLCrown7));
        //    List<SelectListItem> crown8 = SysTool.GetSelectList(typeof(enFLCrown8));
        //    List<SelectListItem> crown9 = SysTool.GetSelectList(typeof(enFLCrown9));
        //    List<SelectListItem> texture = SysTool.GetSelectList(typeof(enTexture));
        //    List<SelectListItem> lightness = SysTool.GetSelectList(typeof(enLightness));
        //    List<SelectListItem> saturation = SysTool.GetSelectList(typeof(enSaturation));
        //    List<SelectListItem> pattern = SysTool.GetSelectList(typeof(enPattern));
        //    List<SelectListItem> crown2 = SysTool.GetSelectList(typeof(enFLCrown2));
        //    List<SelectListItem> crown3 = SysTool.GetSelectList(typeof(enFLCrown3));
        //    List<SelectListItem> crown4 = SysTool.GetSelectList(typeof(enFLCrown4));
        //    List<SelectListItem> crown5 = SysTool.GetSelectList(typeof(enFLCrown5));
        //    List<SelectListItem> crown1 = SysTool.GetSelectList(typeof(enFLCrown1));


        //    ViewBag.isLoadList = isLoadList;
        //    ViewBag.IPCC = new SelectList(SysApp.WLMgn.GetWL_IPCC(null).ReturnData, "IPCCID", "IPCC", IPCCID != null ? IPCCID.ToString() : "");
        //    if ( IPCCID.HasValue ) {
        //        ViewBag.IPCCsub = new SelectList(SysApp.WLMgn.GetWL_IPCCsub(IPCCID.Value, null).ReturnData, "IPCCsubID", "IPCCsub", IPCCsubID.ToString());
        //    } else {
        //        ViewBag.IPCCsub = null;
        //    }

        //    //色調
        //    ViewBag.HueSel = new SelectList(SysApp.WLMgn.GetWL_ToneColor().ReturnData);


        //    ViewBag.Crown6Sel = new SelectList(crown6, "Value", "Text");
        //    ViewBag.Crown7Sel = new SelectList(crown7, "Value", "Text");
        //    ViewBag.Crown8Sel = new SelectList(crown8, "Value", "Text");
        //    ViewBag.Crown9Sel = new SelectList(crown9, "Value", "Text");
        //    ViewBag.TextureSel = new SelectList(texture, "Value", "Text");
        //    ViewBag.LightnessSel = new SelectList(lightness, "Value", "Text");
        //    ViewBag.SaturationSel = new SelectList(saturation, "Value", "Text");
        //    ViewBag.PatternSel = new SelectList(pattern, "Value", "Text");
        //    ViewBag.Crown2Sel = new SelectList(crown2, "Value", "Text");
        //    ViewBag.Crown3Sel = new SelectList(crown3, "Value", "Text");
        //    ViewBag.Crown4Sel = new SelectList(crown4, "Value", "Text");
        //    ViewBag.Crown5Sel = new SelectList(crown5, "Value", "Text");
        //    ViewBag.Crown1Sel = new SelectList(crown1, "Value", "Text");
        //    return View();
        //}

        //public ActionResult Index ( bool? isLoadList, int? IPCCID, int? IPCCsubID ) {
        //    List<SelectListItem> Crown6 = SysTool.GetSelectList(typeof(enFLCrown6));
        //    List<SelectListItem> Crown7 = SysTool.GetSelectList(typeof(enFLCrown7));
        //    List<SelectListItem> Crown8 = SysTool.GetSelectList(typeof(enFLCrown8));
        //    List<SelectListItem> Crown9 = SysTool.GetSelectList(typeof(enFLCrown9));
        //    List<SelectListItem> FLTexture = SysTool.GetSelectList(typeof(enFLTexture));
        //    List<SelectListItem> Lightness = SysTool.GetSelectList(typeof(enLightness));
        //    List<SelectListItem> Saturation = SysTool.GetSelectList(typeof(enSaturation));
        //    List<SelectListItem> Texture = SysTool.GetSelectList(typeof(enTexture));
        //    List<SelectListItem> Crown2 = SysTool.GetSelectList(typeof(enFLCrown2));
        //    List<SelectListItem> Crown3 = SysTool.GetSelectList(typeof(enFLCrown3));
        //    List<SelectListItem> Crown4 = SysTool.GetSelectList(typeof(enFLCrown4));
        //    List<SelectListItem> Crown5 = SysTool.GetSelectList(typeof(enFLCrown5));
        //    List<SelectListItem> Crown1 = SysTool.GetSelectList(typeof(enFLCrown1));


        //    ViewBag.isLoadList = isLoadList;
        //    ViewBag.IPCC = new SelectList(SysApp.WLMgn.GetWL_IPCC(null).ReturnData, "IPCCID", "IPCC", IPCCID != null ? IPCCID.ToString() : "");
        //    if (IPCCID.HasValue) {
        //        ViewBag.IPCCsub = new SelectList(SysApp.WLMgn.GetWL_IPCCsub(IPCCID.Value, null).ReturnData, "IPCCsubID", "IPCCsub", IPCCsubID.ToString());
        //    }
        //    else {
        //        ViewBag.IPCCsub = null;
        //    }

        //    //色調
        //    ViewBag.ToneColorSel = new SelectList(SysApp.WLMgn.GetWL_ToneColor().ReturnData);


        //    ViewBag.Crown6Sel = new SelectList(Crown6, "Value", "Text");
        //    ViewBag.Crown7Sel = new SelectList(Crown7, "Value", "Text");
        //    ViewBag.Crown8Sel = new SelectList(Crown8, "Value", "Text");
        //    ViewBag.Crown9Sel = new SelectList(Crown9, "Value", "Text");
        //    ViewBag.FLTextureSel = new SelectList(FLTexture, "Value", "Text");
        //    ViewBag.LightnessSel = new SelectList(Lightness, "Value", "Text");
        //    ViewBag.SaturationSel = new SelectList(Saturation, "Value", "Text");
        //    ViewBag.TextureSel = new SelectList(Texture, "Value", "Text");
        //    ViewBag.Crown2Sel = new SelectList(Crown2, "Value", "Text");
        //    ViewBag.Crown3Sel = new SelectList(Crown3, "Value", "Text");
        //    ViewBag.Crown4Sel = new SelectList(Crown4, "Value", "Text");
        //    ViewBag.Crown5Sel = new SelectList(Crown5, "Value", "Text");
        //    ViewBag.Crown1Sel = new SelectList(Crown1, "Value", "Text");
        //    SysTool.InsertUR(SysTool.GetUserData(Request), enFunc.像片對查詢, enFuncAct.瀏覽);
        //    return View();
        //}

        //像片對總覽

        public ActionResult IPCCQuery()
        {
            //IPCC
            SysTool.InsertUR(SysTool.GetUserData(Request), enFunc.像片對總攬, enFuncAct.瀏覽);
            return View(SysApp.WLMgn.GetWL_IPCC(null).ReturnData);
        }


        public ActionResult QueryList(Species species)
        {
            //List<WLTree> list = SysApp.WLMgn.WL_TreeQuery(tree, null).ReturnData;
            List<Species> list = null;
            if (int.TryParse(species.IPCCsubID.ToString(), out int i))
            {
                list = SysApp.WLMgn.GetSpecies(species).ReturnData;
            }

            return PartialView("QueryList", list);
        }

        public ActionResult checkSolid_NewTab(int SID, int SortID = 0)
        {
            clsWLMth mth = new clsWLMth();
            List<Stereoscopic> _data = mth.StereoscopicViaSid(SID, SortID);

            var SP = Server.MapPath("~\\Photos");
            var Path1 = SP + "\\" + _data[0].StePairL;
            var Path2 = SP + "\\" + _data[0].StePairR;

            if (System.IO.File.Exists(Path1) && System.IO.File.Exists(Path2))
            {
                return Content("true");
            }
            else
            {
                return Content("false");
            }
        }
        public ActionResult SolidPhotoInfo(int SID, int SortID = 0)
        {
            clsWLMth mth = new clsWLMth();
            List<Stereoscopic> _data = mth.StereoscopicViaSid(SID, SortID);

            var SP = Server.MapPath("~\\Photos");
            Stereoscopic item = _data[0];

            string name = !string.IsNullOrEmpty(item.IntroName) ? item.IntroName : $"立體像對{item.SortID.ToString()}";
            ViewBag.TitleName = $"【{item.ComName}】{name}";

            var Path = SP + "\\" + item.StePairL;

            System.Drawing.Image image = System.Drawing.Image.FromFile(Path);
            item.ImgH = image.Height.ToString();
            item.ImgW = image.Width.ToString();

            if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath("~/Photos/" + item.StePairL)))
            {
                item.StePairL = Url.Content("~/Photos/" + item.StePairL);
            }
            else
            {
                item.StePairL = string.Empty;
            }

            if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath("~/Photos/" + item.StePairR)))
            {
                item.StePairR = Url.Content("~/Photos/" + item.StePairR);
            }
            else
            {
                item.StePairR = string.Empty;
            }

            if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath("~/Photos/" + item.StePair)))
            {
                item.StePair = Url.Content("~/Photos/" + item.StePair);
            }
            else
            {
                item.StePair = string.Empty;
            }
            ViewBag.ID = SID;
            ViewBag.SortID = SortID;
            return View(item);
        }
        public ActionResult SolidPhotoData(int SID, int SortID = 0)
        {
            clsWLMth mth = new clsWLMth();
            List<Stereoscopic> _data = mth.StereoscopicViaSid(SID, SortID);

            var SP = Server.MapPath("~\\Photos");
            Stereoscopic item = _data[0];

            string name = !string.IsNullOrEmpty(item.IntroName) ? item.IntroName : $"立體像對{item.SortID.ToString()}";
            ViewBag.TitleName = $"【{item.ComName}】{name}";

            var Path = SP + "\\" + item.StePairL;

            System.Drawing.Image image = System.Drawing.Image.FromFile(Path);
            item.ImgH = image.Height.ToString();
            item.ImgW = image.Width.ToString();

            if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath("~/Photos/" + item.StePairL)))
            {
                item.StePairL = Url.Content("~/Photos/" + item.StePairL);
            }
            else
            {
                item.StePairL = string.Empty;
            }

            if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath("~/Photos/" + item.StePairR)))
            {
                item.StePairR = Url.Content("~/Photos/" + item.StePairR);
            }
            else
            {
                item.StePairR = string.Empty;
            }

            if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath("~/Photos/" + item.StePair)))
            {
                item.StePair = Url.Content("~/Photos/" + item.StePair);
            }
            else
            {
                item.StePair = string.Empty;
            }
            ViewBag.ID = SID;
            ViewBag.SortID = SortID;
            return Content(JsonConvert.SerializeObject(item), "application/json");
        }

        public ActionResult SolidPhoto_NewTab(int SID, int SortID = 0)
        {
            clsWLMth mth = new clsWLMth();
            List<Stereoscopic> _data = mth.StereoscopicViaSid(SID, SortID);

            var SP = Server.MapPath("~\\Photos");
            Stereoscopic item = _data[0];

            string name = !string.IsNullOrEmpty(item.IntroName) ? item.IntroName : $"立體像對{item.SortID.ToString()}";
            ViewBag.TitleName = $"【{item.ComName}】{name}";

            var Path = SP + "\\" + item.StePairL;

            System.Drawing.Image image = System.Drawing.Image.FromFile(Path);
            item.ImgH = image.Height.ToString();
            item.ImgW = image.Width.ToString();

            if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath("~/Photos/" + item.StePairL)))
            {
                item.StePairL = Url.Content("~/Photos/" + item.StePairL);
            }
            else
            {
                item.StePairL = string.Empty;
            }

            if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath("~/Photos/" + item.StePairR)))
            {
                item.StePairR = Url.Content("~/Photos/" + item.StePairR);
            }
            else
            {
                item.StePairR = string.Empty;
            }

            if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath("~/Photos/" + item.StePair)))
            {
                item.StePair = Url.Content("~/Photos/" + item.StePair);
            }
            else
            {
                item.StePair = string.Empty;
            }
            ViewBag.ID = SID;
            ViewBag.SortID = SortID;
            return View(item);
        }
        //public ActionResult SolidPhoto_NewTab2(int SID, string locx, string locy, int SortID = 0)
        public ActionResult StereoPhoto_NewTab(int SID, int SortID = 0)
        {
            clsWLMth mth = new clsWLMth();
            List<Stereoscopic> _data = mth.StereoscopicViaSid(SID, SortID);

            var SP = Server.MapPath("~\\Photos");
            Stereoscopic item = _data[0];

            string name = !string.IsNullOrEmpty(item.IntroName) ? item.IntroName : $"立體像對{item.SortID.ToString()}";
            ViewBag.TitleName = $"【{item.ComName}】{name}";

            var Path = SP + "\\" + item.StePairL;

            System.Drawing.Image image = System.Drawing.Image.FromFile(Path);
            item.ImgH = image.Height.ToString();
            item.ImgW = image.Width.ToString();

            if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath("~/Photos/" + item.StePairL)))
            {
                item.StePairL = Url.Content("~/Photos/" + item.StePairL);
            }
            else
            {
                item.StePairL = string.Empty;
            }

            if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath("~/Photos/" + item.StePairR)))
            {
                item.StePairR = Url.Content("~/Photos/" + item.StePairR);
            }
            else
            {
                item.StePairR = string.Empty;
            }

            if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath("~/Photos/" + item.StePair)))
            {
                item.StePair = Url.Content("~/Photos/" + item.StePair);
            }
            else
            {
                item.StePair = string.Empty;
            }
            ViewBag.ID = SID;
            ViewBag.SortID = SortID;
            //ViewBag.locx = locx;
            //ViewBag.locy = locy;


            return View(item);
        }
        public ActionResult QueryListWithFuzzy(Species species, bool Nonfuzzy, string fuzzyData)
        {
            List<Species> list = null;

            if (int.TryParse(species.IPCCsubID.ToString(), out int i))
            {
                list = SysApp.WLMgn.GetSpecies(species, Nonfuzzy, fuzzyData).ReturnData;
            }

            return PartialView("QueryList", list);
        }
        public ActionResult QueryListWithFuzzyForSystem(Species species, bool Nonfuzzy, string fuzzyData)
        {
            List<Species> list = null;

            if (int.TryParse(species.IPCCsubID.ToString(), out int i))
            {
                list = SysApp.WLMgn.GetSpecies(species, Nonfuzzy, fuzzyData).ReturnData;
            }

            return PartialView("QueryListForSystem", list);
        }


        public ActionResult QueryListWithOrder(List<Species> list, string _col, bool _asc)
        {
            list = SysApp.WLMgn.GetSpeciesWithOrder(list, _col, _asc);
            return PartialView("QueryListData", list);
        }
        public ActionResult QueryListWithOrderForSystem(List<Species> list, string _col, bool _asc)
        {
            list = SysApp.WLMgn.GetSpeciesWithOrder(list, _col, _asc);
            return PartialView("QueryListDataForSystem", list);
        }
        public ActionResult QueryAllStereoscopicImage(int _SID)
        {
            clsWLMth mth = new clsWLMth();
            List<Stereoscopic> _data = mth.StereoscopicViaSid(_SID);

            var SP = Server.MapPath("~\\Photos");

            foreach (Stereoscopic item in _data)
            {
                var Path = SP + "\\" + item.StePairL;
                if (!System.IO.File.Exists(Path))
                {
                    continue;
                }

                System.Drawing.Image image = System.Drawing.Image.FromFile(Path);
                item.ImgH = image.Height.ToString();
                item.ImgW = image.Width.ToString();

                if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath("~/Photos/" + item.StePairL)))
                {
                    item.StePairL = Url.Content("~/Photos/" + item.StePairL);
                }
                else
                {
                    item.StePairL = string.Empty;
                }

                if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath("~/Photos/" + item.StePairR)))
                {
                    item.StePairR = Url.Content("~/Photos/" + item.StePairR);
                }
                else
                {
                    item.StePairR = string.Empty;
                }

                if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath("~/Photos/" + item.StePair)))
                {
                    item.StePair = Url.Content("~/Photos/" + item.StePair);
                }
                else
                {
                    item.StePair = string.Empty;
                }

                if (System.IO.File.Exists(System.Web.HttpContext.Current.Server.MapPath("~/Photos/" + item.ScePic)))
                {
                    item.ScePic = Url.Content("~/Photos/" + item.ScePic);
                }
                else
                {
                    item.ScePic = string.Empty;
                }
            }

            return Content(JsonConvert.SerializeObject(_data), "application/json");
        }

        public ActionResult OpenData(string ID, string title)
        {
            ViewBag.Title = title;
            ViewBag.ID = ID;
            return View();
        }

        //public ActionResult QueryList ( Features features, FLFeatures flfeatures ) {
        //    //List<WLTree> list = SysApp.WLMgn.WL_TreeQuery(tree, features).ReturnData;
        //    return PartialView("QueryList", null);
        //}

        #region 查詢結果
        //像片對查詢結果
        public ActionResult QueryResult(int? ID)
        {
            if (ID == null || ID == 0)
            {
                return RedirectToAction("IPCCQuery", "Search");
            }
            else
            {
                ViewBag.ID = ID;
                return View();
            }
        }
        //頁籤-基本資訊 
        public ActionResult TreeBaseData(int ID)
        {
            //WLTree data = SysApp.WLMgn.GetWL_Tree(ID).ReturnData;
            //return View(SysApp.WLMgn.GetSpecies(new Species() { ID = ID }).ReturnData.FirstOrDefault());
            Species data = new Species();
            data = SysApp.WLMgn.GetSpecies(new Species() { ID = ID }).ReturnData.FirstOrDefault();
            clsWLMth mth = new clsWLMth();
            List<Species> getCompare = new List<Species>();

            string IDCompare = string.Empty;
            if (string.IsNullOrEmpty(data.IDCompare))
            {
                getCompare = mth.getIDCompare(ID);

                foreach (var item in getCompare)
                {
                    IDCompare += item.ID + ",";
                }
                IDCompare = IDCompare.TrimEnd(',');
                data.IDCompare = IDCompare;
            }
            return View(data);
        }
        //頁籤-像片對及現場狀況
        public ActionResult StereoscopicImageData(int ID, int SortId = 0)
        {
            //List<WLStereoscopicImage> data = SysApp.WLMgn.GetWL_StereoscopicImage(ID).ReturnData;
            if (SortId == 0)
            {
                return View(SysApp.WLMgn.GetSpecies(new Species() { ID = ID }).ReturnData.FirstOrDefault());
            }
            else
            {
                return View(SysApp.WLMgn.GetSpecies(new Species() { ID = ID }, true, string.Empty, SortId).ReturnData.FirstOrDefault());
            }
        }
        //詳細資訊
        public ActionResult TreeDetail(int ID)
        {
            SysTool.InsertUR(SysTool.GetUserData(Request), enFunc.像片對詳細資料, enFuncAct.瀏覽);
            //WLTree data = SysApp.WLMgn.GetWL_Tree(ID).ReturnData;
            ViewBag.ID = ID;
            Species data = new Species();
            data = SysApp.WLMgn.GetSpecies(new Species() { ID = ID }).ReturnData.FirstOrDefault();
            clsWLMth mth = new clsWLMth();
            List<Species> getCompare = new List<Species>();

            string IDCompare = string.Empty;
            if (string.IsNullOrEmpty(data.IDCompare))
            {
                getCompare = mth.getIDCompare(ID);

                foreach (var item in getCompare)
                {
                    IDCompare += item.ID + ",";
                }
                IDCompare = IDCompare.TrimEnd(',');
                data.IDCompare = IDCompare;
            }
            return View(data);
            //return View(SysApp.WLMgn.GetSpecies(new Species() { ID = ID }).ReturnData.FirstOrDefault());

        }
        public JsonResult getIDCompName(string IDCluster)
        {
            string[] IDitems = IDCluster.Split(',');
            string ComNameCluster = string.Empty;

            foreach (string item in IDitems)
            {
                try
                {
                    Species _data = SysApp.WLMgn.GetSpecies(new Species() { ID = int.Parse(item) }).ReturnData.FirstOrDefault();
                    ComNameCluster += $"{{\"ID\":{item},\"ComName\":\"{_data.ComName}\"}},";
                }
                catch (System.Exception)
                {

                }
            }
            ComNameCluster = $"[{ComNameCluster.TrimEnd(',')}]";
            return Json(ComNameCluster);
        }

        #endregion
        #region 功能紐
        // 列印功能 - 
        public ActionResult QueryPrint(int SID, int SortID)
        {
            clsWLMth mth = new clsWLMth();
            Stereoscopic _data = mth.getPrintImage(SID, SortID);

            return PartialView("QueryPrint", _data);
        }

        // 儲存功能 : 
        public ActionResult ImageSettingSave(int StereoscopicImage_ID, string btn_exchange, string rotate, string transition, string btn_lock, string btn_zoom, double tb_Lengtheye)
        {
            string _res = string.Empty;
            string _name = SysTool.GetUserName().Trim();
            if (_name != string.Empty)
            {
                StereoscopicImageSavePersonel _data = new StereoscopicImageSavePersonel();
                _data.AccountID = _name;
                _data.StereoscopicImage_ID = StereoscopicImage_ID;
                _data.btn_exchange = btn_exchange;
                _data.rotate = rotate;
                _data.transition = transition;
                _data.btn_lock = btn_lock;
                _data.btn_zoom = btn_zoom;
                _data.tb_Lengtheye = tb_Lengtheye;

                clsWLMth mth = new clsWLMth();
                _res = mth.insStereoscopicImage(_data).ToString();
            }
            return Content(_res);
        }

        public JsonResult ImageSettingGet(string AccountID, int StereoscopicImage_ID)
        {
            StereoscopicImageSavePersonel _data = null;
            clsWLMth mth = new clsWLMth();
            _data = mth.GetUserImageSetting(AccountID, StereoscopicImage_ID);
            return Json(_data);
        }

        #endregion

        //public ActionResult IPCCsubList (int? IPCCID) {
        //    List<WLIPCCsub> list = new List<WLIPCCsub>();
        //    if ( IPCCID != null ) {
        //        list = SysApp.WLMgn.GetWL_IPCCsub(IPCCID, null).ReturnData;
        //    }
        //    return Json(list);
        //}

        public ActionResult SolidPhoto()
        {
            return PartialView();
        }

        public ActionResult SolidPhoto2()
        {
            return PartialView();
        }
        public ActionResult Stereophoto()
        {
            return PartialView();
        }

        public ActionResult IpccContentHtml(string Title)
        {
            clsWLMth mth = new clsWLMth();
            string _data = mth.getSpeciesIntroWithTitle(Title);
            return Content(_data);
        }
        public ActionResult StereoAnaglyph(string LeftImage, string RightImage)
        {
            StereoAnaglyph filter = new StereoAnaglyph();
            //string absPath_Left = Server.MapPath("~/Photos/StereoscopicImage/32_500_L.jpg");
            //string absPath_Right = Server.MapPath("~/Photos/StereoscopicImage/32_500_R.jpg");
            Bitmap bmp_L = new Bitmap(Server.MapPath(LeftImage));
            Bitmap bmp_R = new Bitmap(Server.MapPath(RightImage));

            /*
            Image absPath_Left = Image.FromFile(Server.MapPath(LeftImage));
            Image absPath_Right = Image.FromFile(Server.MapPath(RightImage));
            Bitmap bmp_L = AForge.Imaging.Image.Clone(new Bitmap(absPath_Left, 212, 313), PixelFormat.Format24bppRgb);
            
            Bitmap bmp_R = AForge.Imaging.Image.Clone(new Bitmap(absPath_Right, 212, 313), PixelFormat.Format24bppRgb);*/ //這裡是舊版紅藍

            Bitmap result = filter.Calc(bmp_L, bmp_R);
            string strbase64 = filter.bmpTostrbase64(result);
            //bmp_L.Save(Server.MapPath("~/Photos/32_500_L.jpg"));
            //bmp_R.Save(Server.MapPath("~/Photos/32_500_R.jpg"));

            //Image absPath_ALeft = Image.FromFile(Server.MapPath("~/Photos/32_500_L.jpg"));
            //Image absPath_ARight = Image.FromFile(Server.MapPath("~/Photos/32_500_R.jpg"));

            //Bitmap bmp_AL =  AForge.Imaging.Image.Clone(new Bitmap(absPath_ALeft), PixelFormat.Format24bppRgb);
            //Bitmap bmp_AR = AForge.Imaging.Image.Clone(new Bitmap(absPath_ARight), PixelFormat.Format24bppRgb);
            //AForge.Imaging.Image.SetGrayscalePalette(bmp_AL);
            //AForge.Imaging.Image.SetGrayscalePalette(bmp_AR);


            //filter.OverlayImage = bmp_R;
            //Bitmap _result = filter.Apply(bmp_L);
            //string strbase64 = filter.bmpTostrbase64(_result);
            ViewBag.image = strbase64;

            return Content(strbase64);
        }
        public ActionResult BaseDataForStereo(int ID)
        {
            Species data = new Species();
            data = SysApp.WLMgn.GetSpecies(new Species() { ID = ID }).ReturnData.FirstOrDefault();
            clsWLMth mth = new clsWLMth();
            List<Species> getCompare = new List<Species>();

            string IDCompare = string.Empty;
            if (string.IsNullOrEmpty(data.IDCompare))
            {
                getCompare = mth.getIDCompare(ID);

                foreach (var item in getCompare)
                {
                    IDCompare += item.ID + ",";
                }
                IDCompare = IDCompare.TrimEnd(',');
                data.IDCompare = IDCompare;
            }
            return View(data);
            //WLTree data = SysApp.WLMgn.GetWL_Tree(ID).ReturnData;
            //return View(SysApp.WLMgn.GetSpecies(new Species() { ID = ID }).ReturnData.FirstOrDefault());
        }
        public ActionResult StereoscopicImageinfo(int ID, int SortId = 0)
        {
            //List<WLStereoscopicImage> data = SysApp.WLMgn.GetWL_StereoscopicImage(ID).ReturnData;
            if (SortId == 0)
            {
                return View(SysApp.WLMgn.GetSpecies(new Species() { ID = ID }).ReturnData.FirstOrDefault());
            }
            else
            {
                return View(SysApp.WLMgn.GetSpecies(new Species() { ID = ID }, true, string.Empty, SortId).ReturnData.FirstOrDefault());
            }
        }
        public ActionResult GetPrint(int SID, string img1, string img2, string margin,string width,string height, int SortId = 0)
        {
            Species data = new Species();
            if (SortId == 0)
            {
                data = SysApp.WLMgn.GetSpecies(new Species() { ID = SID }).ReturnData.FirstOrDefault();
            }
            else
            {
                data = SysApp.WLMgn.GetSpecies(new Species() { ID = SID }, true, string.Empty, SortId).ReturnData.FirstOrDefault();
            }
            ViewBag.img1 = img1;
            ViewBag.img2 = img2;
            ViewBag.margin = margin;
            double NewWidth = double.Parse(width.Trim('x').Trim('p'))/1.5;
            double NewHeight = double.Parse(height.Trim('x').Trim('p'))/1.5;
            ViewBag.width = NewWidth+"px";
            ViewBag.height = NewHeight+"px";
            return View("PrintView",data);

        }
    }
}