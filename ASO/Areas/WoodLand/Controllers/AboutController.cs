using ASO.Areas.WoodLand.Models;
using ASO.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace ASO.Areas.WoodLand.Controllers {
    public class AboutController : Controller {


        //此頁移除,首頁改連到平台介紹(20161107 shuju)
        public ActionResult Index () {
            return View();
        }

        public ActionResult Platform ( enAboutItem Item = enAboutItem.平台介紹 ) {            
            if( (int)Item > 7 ) {
                return RedirectToAction("Platform");
            } else {
                ViewBag.Item = Item.ToString();
                ViewBag.Content = SysApp.WLMgn.GetWL_About(Item).ReturnData.FirstOrDefault().Content;

                enFunc func = enFunc.平台介紹;
                switch ( Item ) {
                    case enAboutItem.航照特性:
                        func = enFunc.航照特性;
                        break;
                    case enAboutItem.立體觀測原理:
                        func = enFunc.立體觀測原理;
                        break;
                    case enAboutItem.航照判釋:
                        func = enFunc.航照判釋;
                        break;
                    case enAboutItem.立體判釋特徵:
                        func = enFunc.立體判釋特徵;
                        break;
                    case enAboutItem.平台地物分類簡介:
                        func = enFunc.平台地物分類簡介;
                        break;
                    case enAboutItem.紅藍濾片3D技術:
                        func = enFunc.紅藍濾片3D技術;
                        break;
                }
                SysTool.InsertUR(SysTool.GetUserData(Request), func, enFuncAct.瀏覽);
                ViewBag.intro = SysApp.WLMgn.GetWL_BulletinBoard(null).ReturnData;
                return View();
            }
        }
        public ActionResult NewsIndexChange(int _datacount,int pageSize,int _state = 0)
        {
            ViewBag.datacount = _datacount;
            ViewBag.pageSize = pageSize;
            ViewBag.state = _state;
            return PartialView("PlatformNewsIndex");
        }

        public ActionResult ShowNews(int pageSize,int page = 1)
        {
            //List<WLBulletinBoard> _data = SysApp.WLMgn.GetWL_BulletinBoard(null).ReturnData;
            List<WLBulletinBoard> _data = SysApp.WLMgn.GetWL_BulletinBoard(null).ReturnData.OrderByDescending(a =>a.ID)
                .Skip((page-1)* pageSize)
                .Take(pageSize)
                .ToList();


            return PartialView("_PlatformNews", _data);
        }

        public ActionResult NewsContent(int ID)
        {
            clsWLMth mth = new clsWLMth();
            NewSBulletin _data =  mth.getNewsContent(ID);
            return View(_data);
        }

        public ActionResult Alertcancel()
        {
            string _res = string.Empty;
            if (Session["Alert"] == null)
            {
                _res = "alert('Google Chrome(建議使用最新版)、Mozilla Firefox(建議使用最新版)、Microsoft Edge、Internet Explorer 10.0以上');";
                Session["Alert"] = "OK";
            }
            
            return Content(_res);
        }
    }
}
