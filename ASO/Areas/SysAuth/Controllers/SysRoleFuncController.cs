using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Wei.SysAuth;
using ASO.Models;
using Newtonsoft.Json;

namespace ASO.Areas.SysAuth.Controllers {
    [Authorize]
    public class SysRoleFuncController : Controller {
        //
        // GET: /SysAuth/SysRoleFunc/

        #region 群組權限
        public ActionResult Index() {
            if (SysTool.Identity(Request, enFunc.群組權限))
                return View();
            else
                return RedirectToAction("Index", "About", new { area = "WoodLand" });
        }

        public ActionResult EditSRF(string ID) {
            if (SysTool.Identity(Request, enFunc.群組權限)) {
                var SysRoleLis = SysApp.AuthMgn.GetAllSysRoleList();
                SysRole SysRole = SysRoleLis.FirstOrDefault(p => p.RoleID == Convert.ToInt32(ID));
                var DepList = SysApp.AuthMgn.GetAllDartmentList();
                ViewData["DeptList"] = DepList;

                var UserIDList = SysApp.AuthMgn.GetSysUserRoleListByRoleID(ID).ReturnData;
                List<SysUser> SysUserList = new List<SysUser>();
                if (UserIDList.Count > 0) {//角色資料列表
                    foreach (var obj in UserIDList) {
                        SysUser SysUser = SysApp.AuthMgn.GetSysUserBy(obj.UserID).ReturnData;
                        SysUser.UserExtraFunList = null;
                        SysUser.UserRoleList = null;
                        SysUserList.Add(SysUser);
                    }
                }
                ViewData["SysUserList"] = SysUserList;
                var FunList = SysApp.AuthMgn.GetAllSysFunList().Where(p => p.FunID < 9000);
                ViewData["FunList"] = FunList;
                return View(SysRole);
            }
            else
                return RedirectToAction("Index", "About", new { area = "WoodLand" });
        }
        #endregion

        #region 圖層權限
        public ActionResult RoleLayers() {
            if (SysTool.Identity(Request, enFunc.圖層權限))
                return View();
            else
                return RedirectToAction("Index", "About", new { area = "WoodLand" });
        }

        public ActionResult EditRoleLayers(string ID) {
            if (SysTool.Identity(Request, enFunc.圖層權限)) {
                var SysRoleLis = SysApp.AuthMgn.GetAllSysRoleList();
                SysRole SysRole = SysRoleLis.FirstOrDefault(p => p.RoleID == Convert.ToInt32(ID));
                var DepList = SysApp.AuthMgn.GetAllDartmentList();
                ViewData["DeptList"] = DepList;
                var UserIDList = SysApp.AuthMgn.GetSysUserRoleListByRoleID(ID).ReturnData;
                List<SysUser> SysUserList = new List<SysUser>();
                if (UserIDList.Count > 0) {
                    foreach (var obj in UserIDList) {
                        SysUser SysUser = SysApp.AuthMgn.GetSysUserBy(obj.UserID).ReturnData;
                        SysUser.UserExtraFunList = null;
                        SysUser.UserRoleList = null;
                        SysUserList.Add(SysUser);
                    }
                }
                ViewData["SysUserList"] = SysUserList;
                var FunList = SysApp.AuthMgn.GetAllSysFunList().Where(p => p.FunID >= 9000 && p.FunID < 10000);
                ViewData["FunList"] = FunList;
                return View(SysRole);
            }
            else
                return RedirectToAction("Index", "About", new { area = "WoodLand" });
        }
        #endregion

        #region 個人權限設定
        public ActionResult UserFunction() {
            if (SysTool.Identity(Request, enFunc.個人權限)) {
                var DepList = SysApp.AuthMgn.GetAllDartmentList();
                ViewData["DeptList"] = DepList;
                var UserTitleList = SysApp.AuthMgn.GetAllUserTitle();
                ViewData["UserTitleList"] = UserTitleList;
                return View();
            }
            else
                return RedirectToAction("Index", "About", new { area = "WoodLand" });
        }

        public ActionResult EditUserFunction(string ID) {
            if (SysTool.Identity(Request, enFunc.個人權限)) {
                var DepList = SysApp.AuthMgn.GetAllDartmentList();
                ViewData["DeptList"] = DepList;
                var UserTitleList = SysApp.AuthMgn.GetAllUserTitle();
                ViewData["UserTitleList"] = UserTitleList;
                SysUser SysUser = SysApp.AuthMgn.GetSysUserBy(Convert.ToInt32(ID)).ReturnData;
                var UserFuns = SysUser.UserExtraFunList.Select(p => p.FunID).ToList();
                ViewData["UserFuns"] = UserFuns;
                ViewBag.DeptName = SysUser.DeptID > 0 ? DepList.FirstOrDefault(p => p.DeptID == SysUser.DeptID).DeptName : "";
                var FunList = SysApp.AuthMgn.GetAllSysFunList().Where(p => p.FunID < 3000);
                ViewData["FunList"] = FunList;
                return View(SysUser);
            }
            else
                return RedirectToAction("Index", "About", new { area = "WoodLand" });
        }

        public bool SaveUserFun(string selfunc, string delfunc, string userlist) {
            bool rpt = false;
            if (SysTool.Identity(Request, enFunc.個人權限)) {
                List<string> SelectFuns = JsonConvert.DeserializeObject<List<string>>(selfunc);
                List<string> DelFuns = JsonConvert.DeserializeObject<List<string>>(delfunc);
                List<string> SysUserList = JsonConvert.DeserializeObject<List<string>>(userlist);

                foreach (var UID in SysUserList) {
                    SysUser SysUser = SysApp.AuthMgn.GetSysUserBy(Convert.ToInt32(UID)).ReturnData;
                    List<EditInfo<SysUserExtraFun>> editList = new List<EditInfo<SysUserExtraFun>>();
                    if (DelFuns != null) {
                        if (DelFuns.Count > 0) {
                            foreach (var DID in DelFuns) {
                                EditInfo<SysUserExtraFun> EditInfo = new EditInfo<SysUserExtraFun>();
                                SysUserExtraFun SysUserExtraFun = new SysUserExtraFun();
                                SysUserExtraFun.UserID = SysUser.UserID;
                                SysUserExtraFun.FunID = Convert.ToInt32(DID);
                                EditInfo.EType = EditType.Delete;
                                EditInfo.EditObj = SysUserExtraFun;
                                editList.Add(EditInfo);
                            }
                        }
                    }
                    if (SelectFuns != null) {
                        if (SelectFuns.Count > 0) {
                            var list = SysUser.UserExtraFunList;
                            foreach (var SID in SelectFuns) {
                                if (list.FirstOrDefault(p => p.FunID == Convert.ToInt32(SID)) == null) {
                                    EditInfo<SysUserExtraFun> EditInfo = new EditInfo<SysUserExtraFun>();
                                    SysUserExtraFun SysUserExtraFun = new SysUserExtraFun();
                                    SysUserExtraFun.UserID = SysUser.UserID;
                                    SysUserExtraFun.FunID = Convert.ToInt32(SID);
                                    EditInfo.EType = EditType.Add;
                                    EditInfo.EditObj = SysUserExtraFun;
                                    editList.Add(EditInfo);
                                }
                            }
                        }
                    }
                    rpt = SysUser.EditExtraFun(editList).ReturnData;
                }
            }
            return rpt;
        }
        #endregion

        #region 共用
        public ActionResult GetFuns(string ID, string MinNum, string MaxNum) {
            if (SysTool.Identity(Request, enFunc.權限管理)) {
                int Min = Convert.ToInt32(MinNum);
                int Max = Convert.ToInt32(MaxNum);
                var list = SysApp.AuthMgn.GetRoleSysFunByRoleID(Convert.ToInt32(ID));
                list = list.Where(p => p.FunID >= Min && p.FunID < Max).ToList();
                List<int> Funlist = list.Select(p => p.FunID).ToList();
                return Json(Funlist);
            }
            return Json("");
        }

        public ActionResult GetUserList(string data) {
            if (SysTool.Identity(Request, enFunc.權限管理)) {
                SysUser usr = JsonConvert.DeserializeObject<SysUser>(data);
                List<SysUser> UserList = new List<SysUser>();
                UserList = SysApp.AuthMgn.GetSysUserList(usr.UserNo.Replace("'", ""), usr.Name.Replace("'","")).ReturnData;
                if (usr.DeptID != 0)
                    UserList = UserList.Where(p => p.DeptID == usr.DeptID).ToList();
                //if (usr.TitID > 0)
                //    UserList = UserList.Where(p => p.TitID == usr.TitID).ToList();
                return Json(UserList);
            }
            else 
                return Json("");
        }

        public bool SaveRoleFun(string selfunc, string delfunc, string roledata) {
            bool rpt = false;
            if (SysTool.Identity(Request, enFunc.權限管理)) {
                List<string> selfuns = JsonConvert.DeserializeObject<List<string>>(selfunc);
                List<string> delfuns = JsonConvert.DeserializeObject<List<string>>(delfunc);
                SysRole role = JsonConvert.DeserializeObject<SysRole>(roledata);
                var list = SysApp.AuthMgn.GetRoleSysFunByRoleID(Convert.ToInt32(role.RoleID));
                List<EditInfo<SysRoleFunction>> editList = new List<EditInfo<SysRoleFunction>>();
                if (delfuns != null) {
                    if (delfuns.Count > 0) {
                        foreach (var DID in delfuns) {
                            EditInfo<SysRoleFunction> EditInfo = new EditInfo<SysRoleFunction>();
                            SysRoleFunction SysRoleFunction = new SysRoleFunction();
                            SysRoleFunction.RoleID = role.RoleID;
                            SysRoleFunction.FunID = Convert.ToInt32(DID);
                            EditInfo.EType = EditType.Delete;
                            EditInfo.EditObj = SysRoleFunction;
                            editList.Add(EditInfo);
                        }
                    }
                }
                if (selfuns != null) {
                    if (selfuns.Count > 0) {
                        foreach (var SID in selfuns) {
                            if (list.FirstOrDefault(p => p.FunID == Convert.ToInt32(SID)) == null) {
                                EditInfo<SysRoleFunction> EditInfo = new EditInfo<SysRoleFunction>();
                                SysRoleFunction SysRoleFunction = new SysRoleFunction();
                                SysRoleFunction.RoleID = role.RoleID;
                                SysRoleFunction.FunID = Convert.ToInt32(SID);
                                EditInfo.EType = EditType.Add;
                                EditInfo.EditObj = SysRoleFunction;
                                editList.Add(EditInfo);
                            }
                        }
                    }
                }
                rpt = role.EditFunction(editList).ReturnData;
            }
            return rpt;
        }
        #endregion

    }
}
