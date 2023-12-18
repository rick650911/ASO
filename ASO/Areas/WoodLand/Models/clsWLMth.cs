using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace ASO.Areas.WoodLand.Models
{
    public class clsWLMth
    {
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
                foreach(string item in _setItems)
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

        public StereoscopicImageSavePersonel GetUserImageSetting(string AccountID,int StereoscopicImage_ID)
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
        public List<Stereoscopic> StereoscopicViaSid(int _sid,int _SortID = 0)
        {
            List<Stereoscopic> _data = new List<Stereoscopic>();
            List<SqlParameter> _par = new List<SqlParameter>();
            _par.Add(new SqlParameter("@SID", _sid));

            string table = "[StereoscopicImage]";
            string _sql = $" select * from {table} ";
            _sql += " where [Del]=0 ";
            _sql += " and [SID]=@SID ";

            if(_SortID != 0)
            {
                _sql += " and [SortID]=@SortID ";
                _par.Add(new SqlParameter("@SortID", _SortID));
            }

            _sql += " order by [ID],[SortID] ";

            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                DataTable dt = db.ToDataTable(_sql, _par.ToArray());
                _data = DataTableExtensions.ToList<Stereoscopic>(dt).ToList();
            }
            return _data;
        }
    }
}