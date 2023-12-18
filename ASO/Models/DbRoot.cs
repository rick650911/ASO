using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.Text;
using System.Threading.Tasks;

namespace ASO.Models {
    public class DbWoodLand {
        private string _LastestErrMsg = "";

        private static string _ConnString = "";

        public static void SetDBInfo(string dbConnStr) {
            _ConnString = dbConnStr;
        }

        public static void SetDBInfo(string dbConnStr, string dbIp, int poolMin, int poolMax) {
            _ConnString = dbConnStr;
        }

        public string LastestErrMsg {
            get { return this._LastestErrMsg; }
            set { this._LastestErrMsg = value; }
        }

        protected OleDbConnection GetConnection() {
            OleDbConnection newConn = new OleDbConnection(_ConnString);
            try {
                newConn.Open();
                return newConn;
            }
            catch (Exception ex) {
                throw (new Exception("Connection Open Fail-" + ex.Message));
            }
        }

        protected void ReleaseConnection(OleDbConnection conn) {
            if (conn != null)
                conn.Close();
        }

        protected void DBConnectFail() {
        }
    }

    public class DbSde {
        private string _LastestErrMsg = "";

        private static string _ConnString = "";

        public static void SetDBInfo(string dbConnStr) {
            _ConnString = dbConnStr;
        }

        public static void SetDBInfo(string dbConnStr, string dbIp, int poolMin, int poolMax) {
            _ConnString = dbConnStr;
        }

        public string LastestErrMsg {
            get { return this._LastestErrMsg; }
            set { this._LastestErrMsg = value; }
        }

        protected OleDbConnection GetConnection() {
            OleDbConnection newConn = new OleDbConnection(_ConnString);
            try {
                newConn.Open();
                return newConn;
            }
            catch (Exception ex) {
                throw (new Exception("Connection Open Fail-" + ex.Message));
            }
        }

        protected void ReleaseConnection(OleDbConnection conn) {
            if (conn != null)
                conn.Close();
        }

        protected void DBConnectFail() {
        }
    }
}