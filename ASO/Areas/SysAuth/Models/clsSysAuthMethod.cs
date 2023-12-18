using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using Wei.SysAuth;

namespace ASO.Areas.SysAuth.Models
{
    public class clsSysAuthMethod
    {
        public clsDataSysUser getPersonalSysUserData(string _ac)
        {
            List<clsDataSysUser> _data = new List<clsDataSysUser>();

            string table = "[SysUser]";
            string where = " [AccountID]=@AccountID ";
            string _sql = $" select * from {table} where {where} ";

            using (clsDB db = new clsDB())
            {
                List<SqlParameter> _par = new List<SqlParameter>();
                _par.Add(new SqlParameter("@AccountID", _ac));

                DataTable dt = db.ToDataTable(_sql, _par.ToArray());
                _data = DataTableExtensions.ToList<clsDataSysUser>(dt).ToList();
            }

            return _data.Count > 0 ? _data[0] : new clsDataSysUser();
        }
        public bool SetPersonalNameDataAndBackUpEmail(string _ac, string _Name, string _BackupEmail)
        {
            bool _sucess = false;

            using (clsDB db = new clsDB())
            {
                string table = "[SysUser]";
                string _filter = " where [AccountID]=@AccountID ";
                string _sql = $" update {table} set [Name]=@Name,[BackupEmail]=@BackupEmail {_filter} ";
                List<SqlParameter> _par = new List<SqlParameter>();
                _par.Add(new SqlParameter("@Name", _Name));
                _par.Add(new SqlParameter("@BackupEmail", _BackupEmail));
                _par.Add(new SqlParameter("@AccountID", _ac));

                _sucess = db.ToExecute(_sql, _par.ToArray());
            }

            return _sucess;
        }
        public string getPersonalEmail(string _ac)
        {
            string _result = string.Empty;
            using (clsDB db = new clsDB())
            {
                string _sql = string.Empty;
                _sql += " select case when ISNULL([EMail],'') = '' then ISNULL([BackupEmail],'') else [EMail] end ";
                _sql += " from [SysUser] ";
                _sql += " where [AccountID]=@AccountID ";

                List<SqlParameter> _par = new List<SqlParameter>();
                _par.Add(new SqlParameter("@AccountID ", _ac));

                _result = db.getResult(_sql, _par.ToArray());
            }

            return _result;
        }
        public string getPersonalBackupEmail(string _ac)
        {
            string _result = string.Empty;
            using (clsDB db = new clsDB())
            {
                string _sql = string.Empty;
                _sql += " select ISNULL([BackupEmail],'') ";
                _sql += " from [SysUser] ";
                _sql += " where [AccountID]=@AccountID ";

                List<SqlParameter> _par = new List<SqlParameter>();
                _par.Add(new SqlParameter("@AccountID ", _ac));

                _result = db.getResult(_sql, _par.ToArray());
            }

            return _result;
        }
        public List<SysUser> GetUserList(string Account, string Name, int DeptID)
        {
            List<SysUser> _data = new List<SysUser>();
            List<SqlParameter> _par = new List<SqlParameter>();

            string _sql = string.Empty;
            _sql = $"SELECT [UserID],[AccountID],[Name],[DeptID],[Status] FROM [SysUser] WHERE 1=1";
            if (!string.IsNullOrEmpty(Account))
            {
                _sql += $" AND AccountID = @AccountID";
            }
            if (!string.IsNullOrEmpty(Name))
            {
                _sql += $" AND Name = @Name";
            }
            if (DeptID > 0)
            {
                _sql += $" AND DeptID = @DeptID";
            }
            _sql += " AND RowStatus <> 0";
            _par.Add(new SqlParameter("@AccountID ", Account));
            _par.Add(new SqlParameter("@Name ", Name));
            _par.Add(new SqlParameter("@DeptID ", DeptID));
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.AuthConnect))
            {
                DataTable dt = db.ToDataTable(_sql, _par.ToArray());
                _data = DataTableExtensions.ToList<SysUser>(dt).ToList();
            }
            return _data;

        }
        public List<clsDataSysUser> getManageGroupEmail()
        {
            List<clsDataSysUser> _data = new List<clsDataSysUser>();

            string _result = string.Empty;
            using (clsDB db = new clsDB())
            {
                string _sql = string.Empty;
                _sql += "select * from SysUser where TitID = 1 and EMail <> ''";

                DataTable dt = db.ToDataTable(_sql);
                _data = DataTableExtensions.ToList<clsDataSysUser>(dt).ToList();

            }

            return _data;
        }
        public string getUserName(int ID)
        {
            string _result = string.Empty;
            using (clsDB db = new clsDB())
            {
                string _sql = string.Empty;
                _sql += $"select Name from SysUser where UserID = {ID}";

                _result = db.getResult(_sql);

            }
            return _result;
        }
    }
}