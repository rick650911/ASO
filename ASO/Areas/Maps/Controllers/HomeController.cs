using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ASO.Areas.Maps.Controllers {
    public class HomeController : Controller {
        // GET: Maps/Home
        public ActionResult Index() {
            return View();
        }

        public ActionResult Map() {
            return View();
        }
    }
}