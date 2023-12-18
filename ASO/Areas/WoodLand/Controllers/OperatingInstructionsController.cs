using System.Collections.Generic;
using System.Web.Mvc;
using System.Linq;
using System.IO;
using ASO.Models;
using Ionic.Zip;
using ASO.Areas.SysAuth.Models;
using System.Web.Security;
using Newtonsoft.Json;
using Wei.SysAuth;

namespace ASO.Areas.WoodLand.Controllers {
    public class OperatingInstructionsController : Controller {

        public ActionResult Index ()
        {
            return View();
        }
    }
}