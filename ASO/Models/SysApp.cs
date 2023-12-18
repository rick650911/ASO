using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Wei.SysAuth;

namespace ASO.Models {
    public class SysApp {
        public static DbWoodLandData WLMgn = new DbWoodLandData();
        public static SysAuthMgn AuthMgn = new SysAuthMgn();
        public static DbSdeData SdeMgn = new DbSdeData();
    }
}