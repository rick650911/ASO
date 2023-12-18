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
using System;

namespace ASO.Areas.WoodLand.Controllers {
    public class CaseReferenceController : Controller {

        public ActionResult Index ()
        {
            return View(SysApp.WLMgn.GetCourse(null).ReturnData);
        }

        public ActionResult GetCaseReference()
        {
            List<object> result = new List<object>();
            result.Add(SysApp.WLMgn.GetCaseReference().ReturnData);
            result.Add(Enum.GetNames(typeof(enCRType)));
            result.Add(Enum.GetNames(typeof(enCRAppearance)));
            return Content(JsonConvert.SerializeObject(result), "application/json");
        }

        public ActionResult IndexView(string ID)
        {
            var crTypeValues = Enum.GetValues(typeof(enCRType));
            var crAppearanceValues = Enum.GetValues(typeof(enCRAppearance));

            var crTypeList = new List<EnumValue>();
            var crAppearanceList = new List<EnumValue>();

            foreach (var value in crTypeValues)
            {
                crTypeList.Add(new EnumValue { text = value.ToString(), value = (int)value });
            }

            foreach (var value in crAppearanceValues)
            {
                crAppearanceList.Add(new EnumValue { text = value.ToString(), value = (int)value });
            }
            ViewData["TypeList"] = crTypeList;
            ViewData["AppearanceList"] = crAppearanceList;

            if (ID != null && ID != "0")
            {
                var CaseReference = SysApp.WLMgn.GetCaseReference(Convert.ToInt32(ID)).ReturnData.FirstOrDefault();
                return View(CaseReference);
            }
            else
                return RedirectToAction("Index", "CaseReference", new { area = "WoodLand" });
        }
    }
}