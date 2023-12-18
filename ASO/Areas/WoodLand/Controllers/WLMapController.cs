using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ASO.Models;
using Newtonsoft.Json;
using ASO.Areas.WoodLand.Models;

namespace ASO.Areas.WoodLand.Controllers {
    public class WLMapController : Controller {
        // GET: WoodLand/WLMap
        public ActionResult Index () {
            List<object> result = new List<object>();
            result.Add(SysApp.WLMgn.GetCounties().ReturnData);
            result.Add(SysApp.SdeMgn.GetDists().ReturnData);
            //result.Add(SysApp.WLMgn.GetIPCC().ReturnData);
            result.Add(SysApp.WLMgn.GetIPCCCities().ReturnData);        
            SysTool.InsertUR(SysTool.GetUserData(Request), enFunc.地圖瀏覽, enFuncAct.瀏覽);
            return View(result);
        }

        public ActionResult extentMap ( double? minx, double? miny, double? maxx, double? maxy ) {
            if (minx == null) {
                minx = 275509.2695315677;
                miny = 2751645.1634475225;
                maxx = 346755.2810787978;
                maxy = 2787368.3745819633;
            }
            var extent = new Extent();
            extent.maxx = maxx;
            extent.miny = miny;
            extent.maxy = maxy;
            extent.minx = minx;

            return View(extent);
        }

        public ActionResult LocationCoordMap ( double locx, double locy ) {
            var point = new Point();
            point.x = locx;
            point.y = locy;
            return View(point);
        }

        public ActionResult GetTowns ( string name ) {
            return Json(SysApp.WLMgn.GetTowns(name).ReturnData);
        }

        public ActionResult GetWkngs ( string name ) {
            return Json(SysApp.SdeMgn.GetWkngs(name).ReturnData);
        }

        public ActionResult GetCmpts ( string dname, string wname ) {
            return Json(SysApp.SdeMgn.GetCmpts(dname, wname).ReturnData);
        }

        public ActionResult GetCenterPoint ( string type, string names ) {
            List<string> name = JsonConvert.DeserializeObject<List<string>>(names);
            if (type == "0") {
                return Json(SysApp.WLMgn.GetCTCenterPoint(name[0], name[1]).ReturnData);
            }
            else {
                return Json(SysApp.SdeMgn.GetFCenterPoint(name[0], name[1], name[2]).ReturnData);
            }
        }
        public ActionResult GetIPCCByCities(string name)
        {
            return Json(SysApp.WLMgn.GetIPCCByCities(name).ReturnData);
        }
        public ActionResult GetIPCCSub(string city,string IPCC)
        {
            return Json(SysApp.WLMgn.GetIPCCSub(city, IPCC).ReturnData);
        }
        public ActionResult GetFamily(string city,string IPCC,string IPCCSub)
        {
            return Json(SysApp.WLMgn.GetFamily(city,IPCC,IPCCSub).ReturnData);
        }
        public ActionResult GetSpeciesList(string city, string IPCC, string IPCCSub, string Family)
        {
            clsWLMth mth = new clsWLMth();
            List<vw_Species> data = new List<vw_Species>();
            data = mth.GetSpecies(city, IPCC, IPCCSub, Family);
            return Json(data);

        }
    }
}