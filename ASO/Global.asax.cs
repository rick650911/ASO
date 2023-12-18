using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Wei.SysAuth;
using ASO.Models;

namespace ASO {
    // 注意: 如需啟用 IIS6 或 IIS7 傳統模式的說明，
    // 請造訪 http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication {
        protected void Application_Start() {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            string WLDbConnStr = ConfigurationManager.ConnectionStrings["WLDbConn"].ConnectionString;
            DbWoodLand.SetDBInfo(WLDbConnStr);

            string AuthDbConnStr = ConfigurationManager.ConnectionStrings["AuthDbConn"].ConnectionString;
            AuthDbRoot.SetDBInfo(AuthDbConnStr);

            string SdeDbConnStr = ConfigurationManager.ConnectionStrings["SdeDbConn"].ConnectionString;
            DbSde.SetDBInfo(SdeDbConnStr);

            SysApp.WLMgn = new DbWoodLandData();
            SysApp.AuthMgn = new SysAuthMgn();
            SysApp.SdeMgn = new DbSdeData();
        }
    }
}