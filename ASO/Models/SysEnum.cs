using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ASO.Models {
    public enum enFileCatelog {
        未設定 = -1,
        公布欄 = 0
    }

    public enum enFunc {
        系統管理 = 1000,
        權限管理 = 1001,
        群組管理 = 1002,
        群組權限 = 1003,
        圖層權限 = 1004,
        個人權限 = 1005,
        帳號管理 = 1006,
        帳號資料 = 1007,
        角色資料 = 1008,
        單位資料 = 1009,
        林業管理 = 1010,
        公布欄管理 = 1011,
        平台資訊管理 = 1012,
        使用者意見回饋 = 1013,
        訓練教室使用統計 = 1014,
        訓練教室考題編輯 = 1015,
        帳號申請審核 = 1016,
        帳號申請設定 = 1017,
        使用紀錄 = 1018,
        IPCC敘述管理 = 1019,

        平台介紹 = 2001,
        航照特性 = 2002,
        立體觀測原理 = 2003,
        航照判釋 = 2004,
        立體判釋特徵 = 2005,
        像片對查詢 = 2006,
        像片對總攬 = 2007,
        網路資源 = 2008,
        地圖瀏覽 = 2009,
        修改密碼 = 2010,
        航照判釋基本概念問答 = 2011,
        立體觀察問答 = 2012,
        樹種判釋問答 = 2013,
        像片對詳細資料 = 2014,
        訓練教室 = 2015,
        平台地物分類簡介 = 2016,
        紅藍濾片3D技術 = 2017,
    }

    public enum enFuncAct {
        登入 = 0,
        登出 = 1,
        瀏覽 = 2,
        新增 = 3,
        修改 = 4,
        刪除 = 5,
        測驗 = 6,
    }

    public enum enLayers {
        測試圖層1 = 9001,
        測試圖層2 = 9002
    }

    //基本介紹項目
    public enum enAboutItem {
        平台介紹 = 0,
        航照特性 = 1,
        立體觀測原理 = 2,
        航照判釋 = 3,
        立體判釋特徵 = 4,
        平台地物分類簡介 = 5,
        紅藍濾片3D技術 = 6
    }

    public enum enIsOn {
        停用 = 0,
        啟用 = 1,
    }

    #region 判釋特徵代碼

    //判釋難易程度
    public enum enDeterMineLevel {
        簡單 = 0,
        中等 = 1,
        困難 = 2
    }


    //樹冠輪廓
    public enum enFLCrown1 {
        無設定 = -1,
        圓形 = 0,
        不規則型 = 1,
        大型葉片 = 2
    }

    //樹冠邊緣
    public enum enFLCrown2 {
        無設定 = -1,
        全緣 = 0,
        裂緣 = 1,
        鈍鋸齒 = 2,
        纖毛狀 = 3,
        星芒狀 = 4,
    }

    //樹冠邊緣
    public enum enFLCrown3 {
        無設定 = -1,
        連續 = 0,
        非連續 = 1
    }

    //樹冠數量
    public enum enFLCrown4 {
        無設定 = -1,
        單冠 = 0,
        多冠 = 1,
        單桿 = 2,
        叢生 = 3
    }

    //樹冠尺寸
    public enum enFLCrown5 {
        無設定 = -1,
        尺寸相近 = 0,
        尺寸不一 = 1,
        單冠無尺寸差異 = 2,
    }

    //冠層結構-樹梢
    public enum enFLCrown6 {
        無設定 = -1,
        平展 = 0,
        圓角 = 1,
        圓錐 = 2,
        細銳 = 3,
        尖塔 = 4,
    }

    //冠層結構-深度
    public enum enFLCrown7 {
        無設定 = -1,
        連身 = 0,
        頂葉 = 1,
    }

    //冠層結構-層次
    public enum enFLCrown8 {
        無設定 = -1,
        分層 = 0,
        分段 = 1,
        無 = 2,
    }

    //冠層結構-通透
    public enum enFLCrown9 {
        無設定 = -1,
        半透明 = 0,
        不透明 = 1,
    }

    //冠層結構-質地
    public enum enFLCrown10 {
        無設定 = -1,
        粒狀 = 0,
        條狀 = 1,
        平滑 = 2,
        粗糙 = 3,
    }

    public enum enTexture {
        無設定 = -1,
        光滑 = 0,
        細緻 = 1,
        粗糙 = 2,
        極粗糙 = 3,
    }

    //明度
    public enum enLightness {
        無設定 = -1,
        一般 = 0,
        偏低 = 1,
        偏高 = 2,
    }

    //組織與圖案
    public enum enPattern {
        無設定 = -1,
        一般 = 0,
        細緻 = 1,
        粗糙 = 2,
        極粗造 = 2
    }

    //彩度
    public enum enSaturation {
        無設定 = -1,
        一般 = 0,
        偏低 = 1,
        偏高 = 2,
    }
    #endregion

    #region 訓練教室

    public enum enTrainingType {
        樹種判釋問答 = 0,
        航照判釋基本概念問答 = 1,
        立體觀察問答 = 2,
    }

    public enum enQuestionType {
        是非題 = 0,
        選擇題 = 1,
    }

    public enum enExamResult {
        未作答 = -1,
        錯 = 0,
        對 = 1
    }

    public enum enLevel {
        簡單 = 0,
        中等 = 1,
        困難 = 2
    }
    #endregion

    #region 案例參考

    public enum enCRType
    {
        濫墾地續辦清理計畫 = 0,
        其他 = 1,
    }

    public enum enCRAppearance
    {
        墾地 = 0,
        建地 = 1,
    }
    #endregion
}