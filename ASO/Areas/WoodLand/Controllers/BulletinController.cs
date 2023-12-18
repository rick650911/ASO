using System.Linq;
using System.Web.Mvc;
using ASO.Models;

namespace ASO.Areas.WoodLand.Controllers {
    public class BulletinController : Controller {
        //
        // GET: /WoodLand/Bulletin/

        public ActionResult Index () {
            SysTool.InsertUR(SysTool.GetUserData(Request), enFunc.網路資源, enFuncAct.瀏覽);
            return View(SysApp.WLMgn.GetWL_BulletinBoard(null).ReturnData);
        }

        public ActionResult BulletinContent ( int ID ) {
            WLBulletinBoard result = SysApp.WLMgn.GetWL_BulletinBoard(ID).ReturnData.FirstOrDefault();
            SysTool.InsertUR(SysTool.GetUserData(Request), enFunc.網路資源, enFuncAct.瀏覽);
            if (result != null)
                return View(result);
            else
                return RedirectToAction("Index");
        }
    }
}
