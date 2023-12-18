using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using ASO.Models;

namespace ASO.Areas.WoodLand.Models
{
    public class clsWLMth
    {
        public NewSBulletin getNewsContent(int ID)
        {
            List<NewSBulletin> _data = new List<NewSBulletin>();

            string table = "[BulletinBoard]";
            string _sql = $" select * from {table} ";
            _sql += " where [ID]=@ID ";

            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                List<SqlParameter> _par = new List<SqlParameter>();
                _par.Add(new SqlParameter("@ID", ID));

                DataTable dt = db.ToDataTable(_sql, _par.ToArray());
                _data = DataTableExtensions.ToList<NewSBulletin>(dt).ToList();
            }

            return _data[0];
        }

        public string ValidateAcFix(string acc)
        {
            string _res = string.Empty;

            using (clsDB db = new clsDB())
            {
                string table = "[SysUser]";
                string _exists = $" select 1 from {table} where [AccountID]=@AccountID ";
                string _sql = $" if exists ({_exists}) select [AccountID] from {table} where [AccountID]=@AccountID else select '' ";

                List<SqlParameter> _par = new List<SqlParameter>();
                _par.Add(new SqlParameter("@AccountID ", acc));
                _res = db.getResult(_sql, _par.ToArray());
            }

            return _res;
        }

        public bool insStereoscopicImage(StereoscopicImageSavePersonel items)
        {
            bool _sucess = false;

            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                string table = "[StereoscopicImageSavePersonel]";
                string _val = "[AccountID],[StereoscopicImage_ID],[btn_exchange],[rotate],[transition],[btn_lock],[btn_zoom],[tb_Lengtheye]";
                string _parm = _val.Replace("[", "@").Replace("]", string.Empty);
                string _ins = $" insert into {table} ({_val}) values ({_parm}) ";

                string _filter = " where [AccountID]=@AccountID and [StereoscopicImage_ID]=@StereoscopicImage_ID ";

                string _setParm = _val.Replace("[", string.Empty).Replace("]", string.Empty);
                string[] _setItems = _setParm.Split(',');

                string _set = string.Empty;
                foreach (string item in _setItems)
                {
                    _set += $"{item}=@{item},";
                }
                _set = _set.TrimEnd(',');

                string _ups = $" update {table} set {_set} {_filter} ";
                string _exist = $" select 1 from {table} {_filter}";
                string _sql = $" if exists ({_exist}) {_ups} else {_ins} ";

                List<SqlParameter> _par = new List<SqlParameter>();
                _par.Add(new SqlParameter("@AccountID", items.AccountID));
                _par.Add(new SqlParameter("@StereoscopicImage_ID", items.StereoscopicImage_ID));
                _par.Add(new SqlParameter("@btn_exchange", items.btn_exchange));
                _par.Add(new SqlParameter("@rotate", items.rotate));
                _par.Add(new SqlParameter("@transition", items.transition));
                _par.Add(new SqlParameter("@btn_lock", items.btn_lock));
                _par.Add(new SqlParameter("@btn_zoom", items.btn_zoom));
                _par.Add(new SqlParameter("@tb_Lengtheye", items.tb_Lengtheye));
                _sucess = db.ToExecute(_sql, _par.ToArray());
            }

            return _sucess;
        }
        public StereoscopicImageSavePersonel GetUserImageSetting(string AccountID, int StereoscopicImage_ID)
        {
            List<StereoscopicImageSavePersonel> _data = new List<StereoscopicImageSavePersonel>();

            string table = "[StereoscopicImageSavePersonel]";
            string _filter = " where [AccountID]=@AccountID ";
            _filter += " and [StereoscopicImage_ID]=@StereoscopicImage_ID ";

            string _sql = $" select * from {table} {_filter}";
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                List<SqlParameter> _par = new List<SqlParameter>();
                _par.Add(new SqlParameter("@AccountID", AccountID));
                _par.Add(new SqlParameter("@StereoscopicImage_ID", StereoscopicImage_ID));

                DataTable dt = db.ToDataTable(_sql, _par.ToArray());
                _data = DataTableExtensions.ToList<StereoscopicImageSavePersonel>(dt).ToList();
            }

            StereoscopicImageSavePersonel _res = _data.Count > 0 ? _data[0] : null;
            return _res;
        }
        public List<Stereoscopic> StereoscopicViaSid(int _sid, int _SortID = 0)
        {
            List<Stereoscopic> _data = new List<Stereoscopic>();
            List<SqlParameter> _par = new List<SqlParameter>();
            _par.Add(new SqlParameter("@SID", _sid));

            string table = "[StereoscopicImage]";

            string _filter = " where [Del]=0 ";
            _filter += " and [SID]=@SID ";

            if (_SortID != 0)
            {
                _filter += " and [SortID]=@SortID ";
                _par.Add(new SqlParameter("@SortID", _SortID));
            }
            string _sql = $" select (select ISNULL(MAX([SortID]),0)+1 from {table} {_filter} ) AS [MaxSort],* from {table} {_filter}";
            _sql += " order by [ID],[SortID] ";

            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                DataTable dt = db.ToDataTable(_sql, _par.ToArray());
                _data = DataTableExtensions.ToList<Stereoscopic>(dt).ToList();
            }

            string _result = string.Empty;
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                string _sqlA = " select [ComName] from [Species] ";
                _sqlA += " where [ID] =@ID ";

                List<SqlParameter> _parA = new List<SqlParameter>();
                _parA.Add(new SqlParameter("@ID ", _sid));
                _result = db.getResult(_sqlA, _parA.ToArray());
            }

            foreach (Stereoscopic item in _data)
            {
                item.ComName = _result;
            }

            return _data;
        }
        public Stereoscopic getPrintImage(int SID, int SortID)
        {
            SortID = SortID == 0 ? 1 : SortID;
            List<Stereoscopic> _data = new List<Stereoscopic>();
            string table = "[Species]";
            string table2 = "[StereoscopicImage]";
            string jtable = $" {table} AS [A] JOIN {table2} AS [B] ON [A].ID = [B].[SID] ";

            string _filter = " where [B].[SID]=@SID and [SortID]=@SortID ";
            string _val = " ISNULL([B].[ScePic],'') AS [ScePic],ISNULL([B].[StePair],'') AS [StePair],[PhotoA],[PhotoB],[ComName],[Locate],[PicNumber],ISNULL([ShTime],'') AS [ShTime],[LocX1],[LocY1],[AltMin],[FilmNumber],[StePairL],[StePairR]";
            string _sql = $" select {_val} from {jtable} {_filter}";

            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                List<SqlParameter> _par = new List<SqlParameter>();
                _par.Add(new SqlParameter("@SID", SID));
                _par.Add(new SqlParameter("@SortID", SortID));

                DataTable dt = db.ToDataTable(_sql, _par.ToArray());
                _data = DataTableExtensions.ToList<Stereoscopic>(dt).ToList();
            }

            return _data[0];
        }
        public bool CourseAdminSaveFile(CourseHandouts course)
        {
            List<SqlParameter> _par = new List<SqlParameter>();
            string _sql = string.Empty;
            if (course.CID != 0)
            {
                string table = "[CourseHandouts]";
                _sql = $" insert into {table} (CID, Title, FilePath, FileName, ContentType, FileSize, AddMemberNo) ";
                _sql += " values (@CID, @Title, @FilePath, @FileName, @ContentType, @FileSize, @AddMemberNo) ";
                _par.Add(new SqlParameter("@CID", course.CID));
                _par.Add(new SqlParameter("@Title", course.Title));
                _par.Add(new SqlParameter("@FilePath", course.FilePath));
                _par.Add(new SqlParameter("@FileName", course.FileName));
                _par.Add(new SqlParameter("@ContentType", course.ContentType));
                _par.Add(new SqlParameter("@FileSize", course.FileSize));
                _par.Add(new SqlParameter("@AddMemberNo", course.AddMemberNo));
            }

            bool _sucess = false;
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                _sucess = db.ToExecute(_sql, _par.ToArray());
            }
            return _sucess;
        }
        // 課程新增使用 - 取得最大課程ID / 編輯時取得課程該ID
        public int getMaxCourseID()
        {
            int _result = 0;
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                string table = "[Course]";
                string _sql = $" select MAX(ISNULL([ID],0)) from {table} ";

                _result = int.Parse(db.getResult(_sql));
            }
            return _result;
        }

        // 立體像片對查詢種類敘述 : 

        public List<SpeciesIntro> getSpeciesIntro(int? ID = null)
        {
            List<SpeciesIntro> _data = new List<SpeciesIntro>();

            string _sql = string.Empty;

            _sql += " select ";
            _sql += " [SpeciesIntro].[ID], ";
            _sql += " [SpeciesIntro].[IPCCID], ";
            _sql += " case when ISNULL([IPCC].[IPCC],'') <> '' then [IPCC].[IPCC] else ISNULL([SpeciesIntro].[Title],'') end AS [Title], ";
            _sql += " ISNULL([SpeciesIntro].[Content],'') AS [Content], ";
            _sql += " [SpeciesIntro].[AddTime], ";
            _sql += " [SpeciesIntro].[Del] ";
            _sql += " from [SpeciesIntro] ";
            _sql += " left join [IPCC] ";
            _sql += " ON [SpeciesIntro].[IPCCID] = [IPCC].[IPCCID] ";
            _sql += " where [SpeciesIntro].[Del] = 0 ";

            List<SqlParameter> _par = new List<SqlParameter>();

            if (ID != null)
            {
                int _ID = ID ?? -1;
                _sql += " and [ID]=@ID ";
                _par.Add(new SqlParameter("@ID", _ID));
            }

            _sql += " order by [IPCCID] ";

            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                DataTable dt = _par.Count == 0 ? db.ToDataTable(_sql) : db.ToDataTable(_sql, _par.ToArray());
                _data = DataTableExtensions.ToList<SpeciesIntro>(dt).ToList();
            }
            return _data;
        }

        public string getSpeciesIntroWithTitle(string Title)
        {
            string _data = string.Empty;

            string _sql = string.Empty;

            _sql += " select ";
            _sql += " [SpeciesIntro].[ID], ";
            _sql += " [SpeciesIntro].[IPCCID], ";
            _sql += " case when ISNULL([IPCC].[IPCC],'') <> '' then [IPCC].[IPCC] else ISNULL([SpeciesIntro].[Title],'') end AS [Title], ";
            _sql += " ISNULL([SpeciesIntro].[Content],'') AS [Content], ";
            _sql += " [SpeciesIntro].[AddTime], ";
            _sql += " [SpeciesIntro].[Del] ";
            _sql += " from [SpeciesIntro] ";
            _sql += " left join [IPCC] ";
            _sql += " ON [SpeciesIntro].[IPCCID] = [IPCC].[IPCCID] ";
            _sql += " where case when ISNULL([IPCC].[IPCC],'') <> '' then [IPCC].[IPCC] else ISNULL([SpeciesIntro].[Title],'') end  = @Title and [SpeciesIntro].[Del] = 0 ";

            List<SqlParameter> _par = new List<SqlParameter>();
            _par.Add(new SqlParameter("@Title", Title));
            _sql += " order by [IPCCID] ";

            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                DataTable dt = db.ToDataTable(_sql, _par.ToArray());
                _data = dt.Rows[0]["Content"].ToString();
            }
            return _data;
        }

        public bool IPCCupdate(int ID, string Content)
        {
            bool _sucess = false;
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                string table = "[SpeciesIntro]";

                string _sql = $" update {table} set [Content]=@Content ";
                _sql += " where [ID]=@ID ";

                List<SqlParameter> _par = new List<SqlParameter>();
                _par.Add(new SqlParameter("@ID", ID));
                _par.Add(new SqlParameter("@Content", Content));

                _sucess = db.ToExecute(_sql, _par.ToArray());
            }
            return _sucess;
        }
        public bool UnitExist(int CID, string unit)
        {
            string table = "[Unit]";

            string _sql = string.Format("select * from {0} where CID = {1} AND Name = '{2}'", table, CID, unit);
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                DataTable dt = db.ToDataTable(_sql);
                int Num = dt.Rows.Count;

                if (Num == 0)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }
        public int getMaxUnitID(int CID)
        {


            int _result = 0;
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                string table = "[Unit]";
                string _sql = $"select ISNULL(MAX(ID),0) from {table} where CID = {CID} ";

                _result = int.Parse(db.getResult(_sql));
            }
            return _result;

        }
        public bool UnitInsert(int CID, int UID, string Name)
        {
            bool _sucess = false;
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                string table = "[Unit]";
                string _sql = $"insert into {table} (CID,ID,Name) values (@CID,@UID,@Name)";

                List<SqlParameter> _par = new List<SqlParameter>();
                _par.Add(new SqlParameter("@CID", CID));
                _par.Add(new SqlParameter("@UID", UID));
                _par.Add(new SqlParameter("@Name", Name));


                _sucess = db.ToExecute(_sql, _par.ToArray());
            }
            return _sucess;
        }
        public int CurrentUnitID(int CID, string Name)
        {
            int _result = 0;
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                string table = "[Unit]";
                string _sql = $" select ID from {table} where CID = {CID} AND Name = '{Name}' ";

                _result = int.Parse(db.getResult(_sql));
            }
            return _result;
        }
        public List<Unit> getUnits(int CID)
        {
            List<Unit> _data = new List<Unit>();

            string _sql = string.Empty;

            _sql += " select *";
            _sql += " from [Unit] ";       
            _sql += $" where CID = {CID} ";


            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                DataTable dt = db.ToDataTable(_sql);
                _data = DataTableExtensions.ToList<Unit>(dt).ToList();
            }
            return _data;
        }
        public List<Species> getIDCompare(int ID)
        {
            List<Species> _data = new List<Species>();


            string _sql = string.Empty;
            _sql += "SELECT ID FROM Species WHERE ID IN";
            _sql += "(SELECT A.ID FROM(SELECT ID,ComName,IDCompare = CONVERT(xml,'<root><v>' + REPLACE(IDCompare, ',', '</v><v>') + '</v></root>') FROM Species) A OUTER APPLY(";
            _sql += $"SELECT IDCompare = N.v.value('.', 'varchar(100)') FROM A.IDCompare.nodes('/root/v') N(v)) B where b.IDCompare = '{ID}')";

            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                DataTable dt = db.ToDataTable(_sql);
                _data = DataTableExtensions.ToList<Species>(dt).ToList();
            }
            return _data;

        }
        public bool UploadImage(string UploadBy, string FileName,string FilePath)
        {
            bool _sucess = false;
            string today = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            int del = 0;
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                string table = "[UploadImageRecord]";
                string _sql = $"insert into {table} (Seq_No,FilePath,FileName,UploadBy,UploadDate,Del) values ((select isNull(MAX(Seq_No),0)+1 from {table}),@FilePath,@FileName,@UploadBy,@UploadDate,@Del)";

                List<SqlParameter> _par = new List<SqlParameter>();
                _par.Add(new SqlParameter("@FilePath", FilePath));
                _par.Add(new SqlParameter("@FileName", FileName));
                _par.Add(new SqlParameter("@UploadBy", UploadBy));
                _par.Add(new SqlParameter("@UploadDate", today));
                _par.Add(new SqlParameter("@Del", del));



                _sucess = db.ToExecute(_sql, _par.ToArray());
            }
            return _sucess;
        }
        public bool DeleteImage(int Seq_No)
        {
            bool _sucess = false;
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                string table = "[UploadImageRecord]";
                string _sql = $"Update {table} set Del = 1 where Seq_No = {Seq_No}";


                _sucess = db.ToExecute(_sql);
            }
            return _sucess;
        }
        public List<UploadImageRecord> getUploadImageRecord()
        {
            List<UploadImageRecord> _data = new List<UploadImageRecord>();


            string _sql = string.Empty;
            _sql = $"Select * from [UploadImageRecord] where Del <> 1";

            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                DataTable dt = db.ToDataTable(_sql);
                _data = DataTableExtensions.ToList<UploadImageRecord>(dt).ToList();
            }
            return _data;

        }
        //帳號重複驗證
        public bool AccountExisted(string AccountID)
        {
            bool _existed = false;
            int _result = 0;
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.AuthConnect))
            {
                string table = "[SysUser]";
                string _sql = $" select * from {table} where AccountID = '{AccountID}'";

                DataTable dt = db.ToDataTable(_sql);


                _result = dt.Rows.Count;
                if (_result >= 1)
                {
                    _existed = true;
                }
                
            }
            return _existed;
        }
        //取得登入錯誤紀錄
        public string[] GetLoginError(string AccountID) {
            string[] _data = new string[2];

            string _sql = string.Empty;

            _sql += $" select [ErrorCount],[UnLockTime] from [SysUser] Where AccountID = '{AccountID}'";
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.AuthConnect))
            {
                DataTable dt = db.ToDataTable(_sql);
                _data[0] = dt.Rows[0]["ErrorCount"].ToString();
                _data[1] = dt.Rows[0]["UnLockTime"].ToString();
            }
            return _data;
        }
        //取得登入錯誤紀錄
        public bool LoginErrorReset(string AccountID)
        {
            bool _result = false;
            
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.AuthConnect))
            {
                string table = "[SysUser]";
                string _sql = $" Update {table} set [ErrorCount] =0,[UnLockTime] = null Where AccountID = '{AccountID}'";

                _result = db.ToExecute(_sql);
            }
            return _result;
        }
        //增加登入錯誤次數
        public bool PlusLoginErrors(string AccountID)
        {
            bool _result = false;

            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.AuthConnect))
            {
                string table = "[SysUser]";
                string _sql = $" Update {table} set [ErrorCount] = [ErrorCount] + 1 Where AccountID = '{AccountID}'";

                _result = db.ToExecute(_sql);
            }
            return _result;
        }
        //登入錯誤次數達三次，鎖定15分鐘
        public bool LoginErrorLock(string AccountID)
        {
            bool _result = false;

            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.AuthConnect))
            {
                string table = "[SysUser]";
                string _sql = $" Update {table} set [ErrorCount] = 0,UnLockTime = DATEADD(minute,15,getdate()) Where AccountID = '{AccountID}'";

                _result = db.ToExecute(_sql);
            }
            return _result;
        }
        public List<vw_Species> GetSpecies(string city, string IPCC, string IPCCSub, string Family)
        {
            List<vw_Species> _data = new List<vw_Species>();


            string _sql = string.Empty;
            _sql = $"SELECT * FROM [vw_Species] WHERE Locate like '%{city}%' ";
            if (IPCC != "請選擇")
            {
                _sql += $" AND IPCC = '{IPCC}'";
            }
            if (IPCCSub != "請選擇")
            {
                _sql += $" AND IPCCSub = '{IPCCSub}'";
            }
            if (Family != "請選擇")
            {
                _sql += $" AND Family = '{Family}'";
            }
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                DataTable dt = db.ToDataTable(_sql);
                _data = DataTableExtensions.ToList<vw_Species>(dt).ToList();
            }
            return _data;

        }
        public string getSpeciesName(int ID)
        {
            string _result = string.Empty;
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                string _sql = string.Empty;
                _sql += $"select ComName from Species where ID = {ID}";

                _result = db.getResult(_sql);

            }
            return _result;
        }
    }
}