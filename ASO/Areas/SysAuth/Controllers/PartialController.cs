using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ASO.Areas.SysAuth.Controllers {
    public class PartialController : Controller {
        //
        // GET: /SysAuth/Partial/

        public ActionResult Index() {
            return View();
        }

        #region 加入員工
        /// <summary>
        /// 加入員工
        /// </summary>
        /// <returns></returns>
        public ActionResult AddEP() {
            return PartialView();
        }
        #endregion

        #region 加入部門
        /// <summary>
        /// 加入部門
        /// </summary>
        /// <returns></returns>
        public ActionResult AddDep() {
            return PartialView();
        }
        #endregion

        #region 加入其他
        /// <summary>
        /// 加入其他
        /// </summary>
        /// <returns></returns>
        public ActionResult AddElse() {
            return PartialView();
        }
        #endregion
    }
}
