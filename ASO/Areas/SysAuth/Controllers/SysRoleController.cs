using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ASO.Models;

namespace ASO.Areas.SysAuth.Controllers {
    public class SysRoleController : Controller {
        //
        // GET: /SysAuth/SysRole/

        public ActionResult SysRoleList() {
            var SysRoleList = SysApp.AuthMgn.GetAllSysRoleList();
            ViewData["SysRoleList"] = SysRoleList;
            return View();
        }
    }
}
