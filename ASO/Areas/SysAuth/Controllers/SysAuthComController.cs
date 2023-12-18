using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ASO.Models;

namespace ASO.Areas.SysAuth.Controllers {
    public class SysAuthComController : Controller {
        //
        // GET: /SysAuth/SysAuthCom/

        public ActionResult Index() {
            return View();
        }

        public ActionResult GetUserList() {
            var list = SysApp.AuthMgn.GetSysUserList(null, null);
            return Json(list.ReturnData);
        }
    }
}
