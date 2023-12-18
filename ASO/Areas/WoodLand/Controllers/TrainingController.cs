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
    public class TrainingController : Controller {

        public ActionResult Index ()
        {
            return View(SysApp.WLMgn.GetCourse(null).ReturnData);
        }

        public ActionResult Exam (int id, string title,int? UID) {
            if ( id > 0 ) {
                ViewBag.CID = id;
                List<WLQuestion> list = SysApp.WLMgn.GetWL_ExamQuestion(id,title, UID);
                SysTool.InsertUR(SysTool.GetUserData(Request), enFunc.訓練教室, enFuncAct.測驗);
                if (list == null)
                {
                    return RedirectToAction("CourseView", new { id = id});
                }

                
                    return View(list);
                
            }
            return RedirectToAction("Index", "Training");
        }

        public ActionResult SaveExam (WLExam wb)
        {
            // 權限移除不再紀錄使用者
            wb.MemberNo = 0;
            //wb.MemberNo = SysTool.GetUserData(Request).UserID;
            return Json(wb.DbInsert());
        }

        public ActionResult ExamResult (int id) {
            if ( id > 0 ) {
                List<WLQuestion> list = SysApp.WLMgn.GetWL_ExamResult(id).ReturnData;
                WLExam exam = SysApp.WLMgn.GetWL_Exam(id).ReturnData;
                ViewBag.CID = exam.CID;
                ViewBag.ExamNum = exam.ExamNum;
                ViewBag.PassNum = exam.PassNum;
                float ExamNum, PassNum;
                ExamNum = (float)exam.ExamNum;
                PassNum = (float)exam.PassNum;
                ViewBag.Score = System.Math.Round(PassNum / ExamNum * 100);
                return View(list);
            }
            return RedirectToAction("Index", "Training");
        }
        
        public ActionResult CourseView (int id) {
            if ( id <= 0 ) {
                return RedirectToAction("Index");
            } else {
                // 權限移除不再紀錄時間
                //// 抓使用者
                //FormsAuthenticationTicket ticket = ((FormsIdentity)User.Identity).Ticket;
                //string userdata = JsonConvert.DeserializeObject<List<object>>(ticket.UserData)[0].ToString();
                //SysUser user = JsonConvert.DeserializeObject<SysUser>(userdata);
                //string _Ac = user.AccountID;

                //clsCourserelatedMethod mth = new clsCourserelatedMethod();
                //int TableID = mth.calcCourseTime(id, true, _Ac); // 進頁面開始計算時間。
                //Session["tableID"] = TableID;
                return View(SysApp.WLMgn.GetCourse(id).ReturnData.FirstOrDefault());
            }
        }

        public void StopclacCourseTime()
        {
            // 權限移除不再紀錄時間
            //if (Session["tableID"] != null)
            //{
            //    clsCourserelatedMethod mth = new clsCourserelatedMethod();
            //    int CourseID = int.Parse(Session["tableID"].ToString());
            //    mth.calcCourseTime(0, false, null, CourseID);

            //    Session["tableID"] = null;
            //}
        }

        public ActionResult DocViewer () {
            return View();
        }
    }
}