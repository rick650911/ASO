using System;
using System.Data.OleDb;
using WeiCommon;

namespace ASO.Models {
    public class DbResult {
        public OleDbDataReader reader { get; set; }
        public OleDbConnection conn { get; set; }
        public Boolean result { get; set; }
        public int AffectCount { get; set; }
        public string ErrorMessage { get; set; }
    }

    public class DbWoodLandFunc : DbWoodLand {
        protected DbResult ExecuteQuery(string sql, string name) {
            DbResult result = new DbResult { result = false };
            OleDbConnection dbConn = null;
            try {
                dbConn = GetConnection();
                OleDbCommand objCmd = new OleDbCommand(sql, dbConn);
                result.reader = objCmd.ExecuteReader();
                result.result = true;
            }
            catch (Exception ex) {
                result.ErrorMessage = name + ":" + ex.Message;
                WLog.LogError(this.GetType().ToString(), name, ex.Message);
            }
            result.conn = dbConn;
            return result;
        }

        protected DbResult ExecuteNonQuery(string sql, string name) {
            DbResult result = new DbResult { result = false };
            OleDbConnection dbConn = null;
            try {
                dbConn = GetConnection();
                OleDbCommand objCmd = new OleDbCommand(sql, dbConn);
                result.AffectCount = objCmd.ExecuteNonQuery();
                result.result = result.AffectCount > 0;

            }
            catch (Exception ex) {
                result.ErrorMessage = name + ":" + ex.Message;
                WLog.LogError(this.GetType().ToString(), name, ex.Message);
            }
            finally {
                base.ReleaseConnection(dbConn);
            }
            return result;
        }
    }

    public class DbSdeFunc : DbSde {
        protected DbResult ExecuteQuery(string sql, string name) {
            DbResult result = new DbResult { result = false };
            OleDbConnection dbConn = null;
            try {
                dbConn = GetConnection();
                OleDbCommand objCmd = new OleDbCommand(sql, dbConn);
                result.reader = objCmd.ExecuteReader();
                result.result = true;
            }
            catch (Exception ex) {
                result.ErrorMessage = name + ":" + ex.Message;
                WLog.LogError(this.GetType().ToString(), name, ex.Message);
            }
            result.conn = dbConn;
            return result;
        }

        protected DbResult ExecuteNonQuery(string sql, string name) {
            DbResult result = new DbResult { result = false };
            OleDbConnection dbConn = null;
            try {
                dbConn = GetConnection();
                OleDbCommand objCmd = new OleDbCommand(sql, dbConn);
                result.AffectCount = objCmd.ExecuteNonQuery();
                result.result = result.AffectCount > 0;

            }
            catch (Exception ex) {
                result.ErrorMessage = name + ":" + ex.Message;
                WLog.LogError(this.GetType().ToString(), name, ex.Message);
            }
            finally {
                base.ReleaseConnection(dbConn);
            }
            return result;
        }
    }
}