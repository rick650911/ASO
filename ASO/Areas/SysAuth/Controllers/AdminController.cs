using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WeiCommon;
using Wei.SysAuth;
using ASO.Models;
using Newtonsoft.Json;

namespace ASO.Areas.SysAuth.Controllers {
    [Authorize]
    public class AdminController : Controller {
        //
        // GET: /SysAuth/Admin/

        public ActionResult GetRoleGroupMng() {
            if (SysTool.Identity(Request, enFunc.權限管理)) {
                List<SysRole> RoleList = SysApp.AuthMgn.GetAllSysRoleList();
                return Json(RoleList);
            }
            else
                return Json("");
        }

        #region 角色群組維護

        public ActionResult Index() {
            if (SysTool.Identity(Request, enFunc.群組管理))
                return View();
            else
                return RedirectToAction("Index", "About", new { area = "WoodLand" });
        }

        public ActionResult RoleGroupMng() {
            return View();
        }

        public ActionResult GroupEdit(string ID) {
            if (SysTool.Identity(Request, enFunc.群組管理)) {
                var DepList = SysApp.AuthMgn.GetAllDartmentList();
                ViewData["DeptList"] = DepList;
                var UserTitleList = SysApp.AuthMgn.GetAllUserTitle();
                ViewData["UserTitleList"] = UserTitleList;

                if (ID != "0") {
                    var SysRoleLis = SysApp.AuthMgn.GetAllSysRoleList();
                    SysRole SysRole = SysRoleLis.FirstOrDefault(p => p.RoleID == Convert.ToInt32(ID));
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
                    var Plist = SysRoleLis.Where(p => p.RolePID == Convert.ToInt32(ID)).ToList();
                    int ParentNum = Plist.Count;
                    ViewBag.ParentNum = ParentNum;//如果大於0 則要刪除時 要提醒先移除子角色
                    return View(SysRole);
                }
                else
                    return View(new SysRole());
            }
            else
                return RedirectToAction("Index", "About", new { area = "WoodLand" });
        }

        public bool SaveGroupAdd(string iddata, string roledata) {
            bool rpt = false;
            if (SysTool.Identity(Request, enFunc.群組管理)) {
                List<string> IDList = JsonConvert.DeserializeObject<List<string>>(iddata);
                SysRole SysRole = JsonConvert.DeserializeObject<SysRole>(roledata);
                if (SysRole.DbCreate().ReturnData) {
                    var SRID = SysRole.RoleID;
                    SysUser SysUser = new SysUser();
                    List<EditInfo<SysUserRole>> editList = new List<EditInfo<SysUserRole>>();
                    if (IDList != null && IDList.Count > 0) {
                        foreach (var UID in IDList) {
                            EditInfo<SysUserRole> EditInfo = new EditInfo<SysUserRole>();
                            SysUserRole SysUserRole = new SysUserRole();
                            SysUserRole.RoleID = SRID;
                            SysUserRole.UserID = Convert.ToInt32(UID);
                            EditInfo.EType = EditType.Add;
                            EditInfo.EditObj = SysUserRole;
                            editList.Add(EditInfo);
                        }
                    }
                    SysUser.UserRoleList = new List<SysUserRole>();
                    rpt = SysUser.EditRole(editList).ReturnData;
                }
            }
            return rpt;
        }

        public bool SaveGroupEdit(string iddata, string roledata, string deliddata) {
            bool rpt = false;
            if (SysTool.Identity(Request, enFunc.群組管理)) {
                List<string> IDList = JsonConvert.DeserializeObject<List<string>>(iddata);
                SysRole SysRole = JsonConvert.DeserializeObject<SysRole>(roledata);
                List<string> DelIDList = JsonConvert.DeserializeObject<List<string>>(deliddata);
                if (SysRole.DbModify().ReturnData) {
                    var SRID = SysRole.RoleID;
                    var UserIDList = SysApp.AuthMgn.GetSysUserRoleListByRoleID(SRID.ToString()).ReturnData;
                    SysUser SysUser = new SysUser();
                    List<EditInfo<SysUserRole>> editList = new List<EditInfo<SysUserRole>>();
                    if (DelIDList != null) {
                        if (DelIDList.Count > 0) {
                            foreach (var DID in DelIDList) {
                                EditInfo<SysUserRole> EditInfo = new EditInfo<SysUserRole>();
                                SysUserRole SysUserRole = new SysUserRole();
                                SysUserRole.RoleID = SRID;
                                SysUserRole.UserID = Convert.ToInt32(DID);
                                EditInfo.EType = EditType.Delete;
                                EditInfo.EditObj = SysUserRole;
                                editList.Add(EditInfo);
                            }
                        }
                    }
                    if (IDList != null) {
                        if (IDList.Count > 0) {
                            foreach (var UID in IDList) {
                                if (UserIDList.FirstOrDefault(p => p.UserID == Convert.ToInt32(UID)) == null)//表示沒有資料
                            {
                                    EditInfo<SysUserRole> EditInfo = new EditInfo<SysUserRole>();
                                    SysUserRole SysUserRole = new SysUserRole();
                                    SysUserRole.RoleID = SRID;
                                    SysUserRole.UserID = Convert.ToInt32(UID);
                                    EditInfo.EType = EditType.Add;
                                    EditInfo.EditObj = SysUserRole;
                                    editList.Add(EditInfo);
                                }
                            }
                        }
                    }
                    List<SysUserRole> UserRoleList = new List<SysUserRole>();
                    SysUser.UserRoleList = UserRoleList;
                    rpt = SysUser.EditRole(editList).ReturnData;
                }
            }
            return rpt;
        }

        public bool DelGroup(SysRole SysRole) {
            bool rpt = false;
            if (SysTool.Identity(Request, enFunc.群組管理))
                rpt = SysRole.DbDelete().ReturnData;
            return rpt;
        }
        #endregion
    }
}
