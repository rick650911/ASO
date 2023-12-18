using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ASO.Areas.SysAuth.Models
{
    public class clsDataSysUser
    {
        public int UserID { get; set; }
        public string UserNo { get; set; }
        public string AccountID { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string EMail { get; set; }
        public string BackupEmail { get; set; }
        public int DeptID { get; set; }
        public int TitID { get; set; }
        public string Comment { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime ModTime { get; set; }
        public byte Status { get; set; }
        public byte RowStatus { get; set; }
        public byte Gender { get; set; }
        public DateTime? RegTime { get; set; }
        public string RegIP { get; set; }
    }
    // 帳號維護→上課時數的 Model
    public class clsCourseTime
    {
        public int tableID { get; set; }
        public string AccountID { get; set; }
        public int CID { get; set; }
        public string Title { get; set; }
        public string LearnTime { get; set; }
        public DateTime? Stime { get; set; }
        public DateTime? EDate { get; set; }
        public int min { get; set; }
    }
    // 帳號維護→測驗結果的 Model
    public class clsCourseResult
    {
        public int NO { get; set; }
        public int MemberNo { get; set; }
        public int CID { get; set; }
        public string AccountID { get; set; }
        public string Title { get; set; }
        public decimal ExamTime { get; set; }
        public string SubmitTimeDetail { get; set; }
        public byte? Level { get; set; }
        public int ExamNum { get; set; }
        public int PassNum { get; set; }
        public string grade { get; set; }
    }
    public class clsCourseExamDet
    {
        public int ENO { get; set; }
        public int QNO { get; set; }
        public int? Answer { get; set; }
        public string personalResult { get; set; }
        public int? Sort { get; set; }
        public string QuestionDesc { get; set; }
        public int? RightAns { get; set; }
        public string AnswerDesc { get; set; }
        public byte? Level { get; set; }
        public string IsOn { get; set; }
        public int? UserOrder { get; set; }
    }

}