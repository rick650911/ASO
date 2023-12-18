using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Data.SqlClient;
using Wei.SysAuth;
using System.Configuration;
using System.Web.WebPages;

namespace ASO.Models
{
    #region 林業立體判釋
    public class WLBulletinBoard : DbWoodLandFunc
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime ModTime { get; set; }
        public int ModMemberNo { get; set; }
        public DateTime AddTime { get; set; }
        public int AddMemberNo { get; set; }
        public string Dept { get; set; }
        public bool Del { get; set; }
        public List<WLUploadFile> File { get; set; }

        public int DbInsert()
        {
            int result = 0;
            StringBuilder sqlstr = new StringBuilder();
            sqlstr.AppendLine("INSERT INTO BulletinBoard (Title, [Content], AddMemberNo, ModTime) ");
            sqlstr.AppendLine("OUTPUT Inserted.ID");
            sqlstr.AppendLine("VALUES (N'" + this.Title + "', N'" + this.Content + "', " + this.AddMemberNo + ", GETDATE()); ");
            DbResult ret = new DbResult();
            ret = ExecuteQuery(sqlstr.ToString(), "InsertWLBulletinBoard");
            if (ret.reader.Read())
                result = Convert.ToInt32(ret.reader["ID"]);
            return result;
        }

        public bool DbUpdate(int kind)
        {
            StringBuilder sqlstr = new StringBuilder();
            sqlstr.AppendLine("UPDATE BulletinBoard SET ");
            switch (kind)
            {
                case 0:
                    sqlstr.AppendLine("Title                           = N'" + this.Title + "', ");
                    sqlstr.AppendLine("[Content]                 = N'" + this.Content + "', ");
                    sqlstr.AppendLine("ModTime                 = GETDATE(), ");
                    sqlstr.AppendLine("ModMemberNo    = " + this.ModMemberNo + " ");
                    break;
                case 1:
                    sqlstr.AppendLine("Del                            = 1 ");
                    break;
            }
            sqlstr.AppendLine("WHERE ID = " + this.ID + " ");
            return ExecuteNonQuery(sqlstr.ToString(), "UpdateWLBulletinBoard").result;
        }
    }

    public class WLUploadFile : DbWoodLandFunc
    {
        public int No { get; set; }
        public string MatchNo { get; set; }
        public enFileCatelog FileCate { get; set; }
        public string FilePath { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public int FileSize { get; set; }
        public DateTime AddTime { get; set; }
        public int AddMemberNo { get; set; }

        public bool DbInsert()
        {
            StringBuilder sqlstr = new StringBuilder();
            sqlstr.AppendLine("INSERT INTO UploadFile (MatchNo, FileCate, FilePath, FileName, ContentType, FileSize, AddMemberNo ) VALUES ( ");
            sqlstr.AppendLine("'" + this.MatchNo + "', " + (int)FileCate + ", '" + this.FilePath + "', '" + this.FileName + "', ");
            sqlstr.AppendLine("'" + this.ContentType + "', " + this.FileSize + ", " + this.AddMemberNo + ")");
            return ExecuteNonQuery(sqlstr.ToString(), "InsertWLUploadFile").result;
        }
    }

    #region 平台資訊
    public class WLAbout : DbWoodLandFunc
    {
        public enAboutItem Item { get; set; }
        public string Content { get; set; }
        public DateTime ModTime { get; set; }
        public int ModMemberNo { get; set; }

        public bool DbUpdate()
        {
            StringBuilder sqlstr = new StringBuilder();
            sqlstr.AppendLine("UPDATE About SET ");
            sqlstr.AppendLine("[Content]                 = N'" + this.Content.Replace("'", "''") + "', ");
            sqlstr.AppendLine("ModTime                 = GETDATE(), ");
            sqlstr.AppendLine("ModMemberNo    = " + this.ModMemberNo + " ");
            sqlstr.AppendLine("WHERE Item = " + (int)this.Item + " ");
            return ExecuteNonQuery(sqlstr.ToString(), "UpdateWLAbout").result;
        }
    }
    #endregion

    #region 樹種
    public class WLTree : DbWoodLandFunc
    {
        public int ID { get; set; }
        public string ComName { get; set; }
        public enDeterMineLevel Level { get; set; }
        public int IPCCID { get; set; }
        public int IPCCsubID { get; set; }
        public string IPCC { get; set; }
        public string IPCCsub { get; set; }
        public string Family { get; set; }
        public string SciName { get; set; }
        public string SciName_1 { get; set; }
        public string BasDes { get; set; }
        public string SpeDes { get; set; }
        public string AltRange { get; set; }
        public string ScePic { get; set; }
        public string THeight { get; set; }
        public string TShape { get; set; }
        public string CroWidth { get; set; }
        public string MonoCro { get; set; }
        public string GrouCro { get; set; }
        public string SideShape { get; set; }

        public List<WLStereoscopicImage> StereoscopicImageList { get; set; }
        public AerialImage AerialImage { get; set; }
        public WLFeatures Features { get; set; }

        //第一筆袖珍立體像對圖檔
        public WLStereoscopicImage StereoscopicImage
        {
            get
            {
                WLStereoscopicImage img = new WLStereoscopicImage();
                if (StereoscopicImageList != null && StereoscopicImageList.Count() > 0)
                {
                    img = StereoscopicImageList.FirstOrDefault();
                }
                return img;
            }
        }
    }

    //航空照片
    public class AerialImage : DbWoodLandFunc
    {
        public int ID { get; set; }
        public int IPCCsubID { get; set; }
        public string LineID { get; set; }
        public string PhotoA { get; set; }
        public string PhotoB { get; set; }
        public string FlyH { get; set; }
        public string ShTime { get; set; }
        public string ShDeg { get; set; }
        public string CamFoc { get; set; }
        public string CamMod { get; set; }
        public string FWHM { get; set; }
    }
    #endregion

    #region 地物種類

    //地物種類-母表
    public class Species : DbWoodLandFunc
    {
        public int ID { get; set; }
        public string IPCC { get; set; }
        public string IPCCsub { get; set; }
        public int IPCCsubID { get; set; }
        public string ComName { get; set; }
        public enLevel Level { get; set; }
        public string Family { get; set; }
        public string SciName { get; set; }
        public string SciSubName { get; set; }
        public string BasDes { get; set; }
        public string SpeDes { get; set; }
        public string AltRange { get; set; }
        public string ScePic { get; set; }
        public string IDCompare { get; set; }
        public SpeciesFL SpeciesFL { get; set; }
        public SpeciesCL SpeciesCL { get; set; }
        public SpeciesGL SpeciesGL { get; set; }
        public SpeciesWL SpeciesWL { get; set; }
        public SpeciesSL SpeciesSL { get; set; }
        public SpeciesOL SpeciesOL { get; set; }
        public FeaturesFL FeaturesFL { get; set; }
        public FeaturesCL FeaturesCL { get; set; }
        public FeaturesGL FeaturesGL { get; set; }
        public FeaturesWL FeaturesWL { get; set; }
        public FeaturesSL FeaturesSL { get; set; }
        public FeaturesOL FeaturesOL { get; set; }
        public string ImgW { get; set; }
        public string ImgH { get; set; }
        public List<StereoscopicImage> StereoscopicImages { get; set; }
        public bool Del { get; set; }
        public bool DbInsert()
        {
            StringBuilder sqlstr = new StringBuilder();
            sqlstr.AppendLine("INSERT INTO Species (ComName, Level, IPCCsubID, Family, SciName,SciSubName, BasDes, SpeDes, AltRange, IDCompare) ");
            sqlstr.AppendLine(" VALUES ");
            sqlstr.AppendLine("(N'" + ComName + "', " + (int)Level + ", " + IPCCsubID + ", N'" + Family + "', '" + SciName + "', '" + SciSubName + "', N'" + BasDes + "', ");
            sqlstr.AppendLine("N'" + AltRange + "', '" + ScePic + "', '" + IDCompare + "')");
            return ExecuteNonQuery(sqlstr.ToString(), "InsertSpecies").result;
        }

        public bool DbUpdate()
        {
            if (ID > 0)
            {
                StringBuilder sqlstr = new StringBuilder();
                sqlstr.AppendLine("UPDATE Species SET ");
                sqlstr.AppendLine("ComName = N'" + ComName + "', ");
                sqlstr.AppendLine("Level = " + (int)Level + ", ");
                sqlstr.AppendLine("IPCCsubID = " + IPCCsubID + ", ");
                sqlstr.AppendLine("Family = N'" + Family + "', ");
                sqlstr.AppendLine("SciName = N'" + SciName + "', ");
                sqlstr.AppendLine("SciSubName = N'" + SciSubName + "', ");
                sqlstr.AppendLine("BasDes = N'" + BasDes + "', ");
                //sqlstr.AppendLine("SpeDes = N'" + SpeDes + "', ");
                sqlstr.AppendLine("AltRange = N'" + AltRange + "', ");
                if (ScePic != null && ScePic != "")
                    sqlstr.AppendLine("ScePic = N'" + ScePic + "', ");
                sqlstr.AppendLine("IDCompare = '" + IDCompare + "' ");
                sqlstr.AppendLine("WHERE ID = " + ID);
                return ExecuteNonQuery(sqlstr.ToString(), "UpdateSpecies").result;
            }
            else
            {
                return false;
            }
        }

        public bool DbDelete()
        {
            string sqlstr = "UPDATE Species SET Del = 1 WHERE ID = " + ID;
            return ExecuteNonQuery(sqlstr, "DeleteSpecies").result;
        }
    }

    //地物種類-林地
    public class SpeciesFL : DbWoodLandFunc
    {
        public int SID { get; set; }
        public string THeight { get; set; }
        public string TShape { get; set; }
        public string CroWidth { get; set; }
        public string MonoCro { get; set; }
        public string GrouCro { get; set; }
        public string SideShape { get; set; }
        public bool DbInsert()
        {
            StringBuilder sqlstr = new StringBuilder();
            sqlstr.AppendLine("INSERT INTO SpeciesFL (SID, THeight, TShape, CroWidth, MonoCro, GrouCro, SideShape) ");
            sqlstr.AppendLine(" VALUES ");
            sqlstr.AppendLine("(" + SID + ", N'" + THeight + "', N'" + TShape + "', N'" + CroWidth + "', ");
            sqlstr.AppendLine("N'" + MonoCro + "', N'" + GrouCro + "', N'" + SideShape + "')");
            return ExecuteNonQuery(sqlstr.ToString(), "InsertSpeciesFL").result;
        }

        public bool DbUpdate()
        {
            if (SID > 0)
            {
                StringBuilder sqlstr = new StringBuilder();
                sqlstr.AppendLine("UPDATE SpeciesFL SET ");
                sqlstr.AppendLine("THeight = N'" + THeight + "', ");
                sqlstr.AppendLine("TShape = N'" + TShape + "', ");
                sqlstr.AppendLine("CroWidth = N'" + CroWidth + "' ");
                if (MonoCro != null && MonoCro != "")
                    sqlstr.AppendLine(", MonoCro = N'" + MonoCro + "'");
                if (GrouCro != null && GrouCro != "")
                    sqlstr.AppendLine(", GrouCro = N'" + GrouCro + "'");
                if (SideShape != null && SideShape != "")
                    sqlstr.AppendLine(", SideShape = N'" + SideShape + "'");
                sqlstr.AppendLine(" WHERE SID = " + SID);
                return ExecuteNonQuery(sqlstr.ToString(), "UpdateSpeciesFL").result;
            }
            else
            {
                return false;
            }
        }
    }

    //地物種類-農地
    public class SpeciesCL : DbWoodLandFunc
    {
        public int SID { get; set; }
    }

    //地物種類-草地
    public class SpeciesGL : DbWoodLandFunc
    {
        public int SID { get; set; }
    }

    //地物種類-濕地
    public class SpeciesWL : DbWoodLandFunc
    {
        public int SID { get; set; }
    }

    //地物種類-定居地
    public class SpeciesSL : DbWoodLandFunc
    {
        public int SID { get; set; }
    }

    //地物種類-其他土地
    public class SpeciesOL : DbWoodLandFunc
    {
        public int SID { get; set; }
    }
    #endregion

    #region 判釋特徵
    //判釋特徵母表
    public class Features
    {
        public int ID { get; set; }
        public int IPCCsubID { get; set; }
        public string Shape { get; set; }
        public string Size { get; set; }
        public string ToneColor { get; set; }
        public enTexture Texture { get; set; }
        public string Shadow { get; set; }
        public string Pattern { get; set; }
        public string Association { get; set; }
        public string ComName { get; set; }
        public string SciName { get; set; }
        public string Family { get; set; }
        public int IDCompare { get; set; }

        public List<StereoscopicImage> StereoscopicImageList { get; set; }
        public AerialImage AerialImage { get; set; }
        #region 查詢用        
        //最低海拔
        public string AltMin { get; set; }
        //最高海拔
        public string AltMax { get; set; }
        #endregion
    }

    //判釋特徵-林地
    public class FeaturesFL : DbWoodLandFunc
    {
        public int SID { get; set; }
        public string Shape { get; set; }
        public string Size { get; set; }
        public string ToneColor { get; set; }
        public enTexture Texture { get; set; }
        public string Shadow { get; set; }
        public string Pattern { get; set; }
        public string Association { get; set; }
        public enFLCrown1 Crown1 { get; set; }
        public enFLCrown2 Crown2 { get; set; }
        public enFLCrown3 Crown3 { get; set; }
        public enFLCrown4 Crown4 { get; set; }
        public enFLCrown5 Crown5 { get; set; }
        public enFLCrown6 Crown6 { get; set; }
        public enFLCrown7 Crown7 { get; set; }
        public enFLCrown8 Crown8 { get; set; }
        public enFLCrown9 Crown9 { get; set; }
        public enFLCrown10 Crown10 { get; set; }
        public bool DbInsert()
        {
            StringBuilder sqlstr = new StringBuilder();
            sqlstr.AppendLine("INSERT INTO FeaturesFL (SID, Shape, Size, ToneColor, Texture, Shadow, Pattern, Association, ");
            sqlstr.AppendLine("Crown1, Crown2, Crown3, Crown4, Crown5, Crown6, Crown7, Crown8, Crown9, Crown10 ) ");
            sqlstr.AppendLine(" VALUES ");
            sqlstr.AppendLine("(" + SID + ", N'" + Shape + "', N'" + Size + "', N'" + ToneColor + "', " + (int)Texture + ", ");
            sqlstr.AppendLine("N'" + Shadow + "', N'" + Pattern + "', N'" + Association + "', " + (int)Crown1 + ", " + (int)Crown2 + ", ");
            sqlstr.AppendLine((int)Crown3 + ", " + (int)Crown4 + ", " + (int)Crown5 + ", " + (int)Crown6 + ", ");
            sqlstr.AppendLine((int)Crown7 + ", " + (int)Crown8 + ", " + (int)Crown9 + ", " + (int)Crown10 + ")");
            return ExecuteNonQuery(sqlstr.ToString(), "InsertFeaturesFL").result;
        }

        public bool DbUpdate()
        {
            if (SID > 0)
            {
                StringBuilder sqlstr = new StringBuilder();
                sqlstr.AppendLine("UPDATE FeaturesFL SET ");
                sqlstr.AppendLine("Shape = N'" + Shape + "', ");
                sqlstr.AppendLine("Size = N'" + Size + "', ");
                sqlstr.AppendLine("ToneColor = N'" + ToneColor + "', ");
                sqlstr.AppendLine("Texture = " + (int)Texture + ", ");
                sqlstr.AppendLine("Shadow = N'" + Shadow + "', ");
                sqlstr.AppendLine("Pattern = N'" + Pattern + "', ");
                sqlstr.AppendLine("Association = N'" + Association + "', ");
                sqlstr.AppendLine("Crown1 = " + (int)Crown1 + ", ");
                sqlstr.AppendLine("Crown2 = " + (int)Crown2 + ", ");
                sqlstr.AppendLine("Crown3 = " + (int)Crown3 + ", ");
                sqlstr.AppendLine("Crown4 = " + (int)Crown4 + ", ");
                sqlstr.AppendLine("Crown5 = " + (int)Crown5 + ", ");
                sqlstr.AppendLine("Crown6 = " + (int)Crown6 + ", ");
                sqlstr.AppendLine("Crown7 = " + (int)Crown7 + ", ");
                sqlstr.AppendLine("Crown8 = " + (int)Crown8 + ", ");
                sqlstr.AppendLine("Crown9 = " + (int)Crown9 + ", ");
                sqlstr.AppendLine("Crown10 = " + (int)Crown10 + " ");
                sqlstr.AppendLine("WHERE SID = " + SID);
                return ExecuteNonQuery(sqlstr.ToString(), "UpdateFeaturesFL").result;
            }
            else
            {
                return false;
            }
        }
    }

    //判釋特徵-農田
    public class FeaturesCL
    {
        public int SID { get; set; }
    }

    //判釋特徵-草地
    public class FeaturesGL
    {
        public int SID { get; set; }
    }

    //判釋特徵-濕地
    public class FeaturesWL
    {
        public int SID { get; set; }
    }

    //判釋特徵-定居地
    public class FeaturesSL
    {
        public int SID { get; set; }
    }

    //判釋特徵-其他土地
    public class FeaturesOL
    {
        public int SID { get; set; }
    }

    public class WLFeatures
    {
        public int ID { get; set; }
        public enFLCrown6 crown6 { get; set; }
        public enFLCrown7 crown7 { get; set; }
        public enFLCrown8 crown8 { get; set; }
        public enFLCrown9 crown9 { get; set; }
        public enTexture texture { get; set; }
        public string hue { get; set; }
        public enLightness lightness { get; set; }
        public enSaturation saturation { get; set; }
        public enPattern pattern { get; set; }
        public string shadow { get; set; }
        public string SpaRe { get; set; }
        public string period { get; set; }
        public enFLCrown2 crown2 { get; set; }
        public enFLCrown3 crown3 { get; set; }
        public enFLCrown4 crown4 { get; set; }
        public enFLCrown5 crown5 { get; set; }
        public enFLCrown1 crown1 { get; set; }
        #region 查詢用
        //最低海拔
        public string AltMin { get; set; }
        //最高海拔
        public string AltMax { get; set; }
        #endregion
    }
    #endregion

    #region 立體像對資料

    //立體像對母表
    public class StereoscopicImage : DbWoodLandFunc
    {
        public int ID { get; set; }
        public int SID { get; set; }
        public string IntroName { get; set; }
        public int SortID { get; set; }
        public string ComName { get; set; }
        public int PhotoA { get; set; }
        public int PhotoB { get; set; }
        public string StePair { get; set; }
        public string Stereoscopics { get; set; }
        public string StePairL { get; set; }
        public string StePairR { get; set; }
        public string ScePic { get; set; }
        public string Locate { get; set; }
        public DateTime? TakePhotoTime { get; set; }
        public string PicNumber { get; set; }
        public string FilmNumber { get; set; }
        public string SteSuo { get; set; }
        public double Ymax { get; set; }
        public double Xmax { get; set; }
        public double Ymin { get; set; }
        public double Xmin { get; set; }
        public int AltMin { get; set; }
        public int AltMax { get; set; }
        public string Aspect { get; set; }
        public double Area { get; set; }
        public string LineID { get; set; }
        public string FlyH { get; set; }
        public String ShTime { get; set; }
        public double ShDeg { get; set; }
        public int CamFoc { get; set; }
        public string CamMod { get; set; }
        public string FWHM { get; set; }
        public double LocX1 { get; set; }
        public double LocY1 { get; set; }
        public double LocX2 { get; set; }
        public double LocY2 { get; set; }
        public double LocX3 { get; set; }
        public double LocY3 { get; set; }
        public string IPCCStatement { get; set; }
        public bool Del { get; set; }
        public StereoscopicImageFL StereoscopicImageFL { get; set; }
        public StereoscopicImageCL StereoscopicImageCL { get; set; }
        public StereoscopicImageGL StereoscopicImageGL { get; set; }
        public StereoscopicImageWL StereoscopicImageWL { get; set; }
        public StereoscopicImageSL StereoscopicImageSL { get; set; }
        public StereoscopicImageOL StereoscopicImageOL { get; set; }

        public bool DbInsert()
        {
            StringBuilder sqlstr = new StringBuilder();
            string ShTimeValue = (ShTime == "" || ShTime == null) ? "NULL" : "'" + ShTime + "'";
            sqlstr.AppendLine("INSERT INTO StereoscopicImage (SID,SortID,IntroName, PhotoA, PhotoB, StePair, StePairL, StePairR ,ScePic , Locate,TakePhotoTime,PicNumber,FilmNumber,SteSuo, Ymax, Ymin, ");
            sqlstr.AppendLine("Xmax, Xmin, LocX1, LocY1, AltMin, AltMax, Aspect, Area, LineID, FlyH, ShTime, ShDeg, CamFoc, CamMod, FWHM, ");
            sqlstr.AppendLine("LocX2, LocY2, LocX3, LocY3, IPCCStatement )VALUES ");
            sqlstr.AppendLine("(" + SID + ", " + SortID + ", N'" + IntroName + "', " + PhotoA + ", " + PhotoB + ", N'" + StePair + "', N'" + StePairL + "', N'" + StePairR + "', N'" + ScePic + "',");
            sqlstr.AppendLine("N'" + Locate + "', N'" + TakePhotoTime + "', N'" + PicNumber + "', N'" + FilmNumber + "', N'" + SteSuo + "', " + Ymax + ", " + Ymin + ", " + Xmax + ", " + Xmin + ", " + LocX1 + ", ");
            sqlstr.AppendLine(LocY1 + ", " + AltMin + ", " + AltMax + ", N'" + Aspect + "', " + Area + ", '" + LineID + "', '" + FlyH + "', ");
            sqlstr.AppendLine(ShTimeValue + ", " + ShDeg + ", " + CamFoc + ", '" + CamMod + "', '" + FWHM + "', " + LocX2 + ", " + LocY2 + ", ");
            sqlstr.AppendLine(LocX3 + ", " + LocY3 + ", N'" + IPCCStatement + "')");
            return ExecuteNonQuery(sqlstr.ToString(), "InsertFeaturesFL").result;
        }

        public bool DbUpdate()
        {
            if (SID > 0)
            {
                StringBuilder sqlstr = new StringBuilder();
                sqlstr.AppendLine("UPDATE StereoscopicImage SET ");
                sqlstr.AppendLine("IntroName = '" + IntroName + "', ");
                sqlstr.AppendLine("PhotoA = " + PhotoA + ", ");
                sqlstr.AppendLine("PhotoB = " + PhotoB + ", ");
                if (StePair != null && StePair != "")
                    sqlstr.AppendLine("StePair = N'" + StePair + "', ");
                if (StePairL != null && StePairL != "")
                    sqlstr.AppendLine("StePairL = N'" + StePairL + "', ");
                if (StePairR != null && StePairR != "")
                    sqlstr.AppendLine("StePairR = N'" + StePairR + "', ");
                if (ScePic != null && ScePic != "")
                    sqlstr.AppendLine("ScePic = N'" + ScePic + "', ");
                sqlstr.AppendLine("Locate = N'" + Locate + "', ");
                sqlstr.AppendLine("TakePhotoTime = N'" + TakePhotoTime + "', ");
                sqlstr.AppendLine("PicNumber = N'" + PicNumber + "', ");
                sqlstr.AppendLine("FilmNumber = N'" + FilmNumber + "', ");
                sqlstr.AppendLine("SteSuo = N'" + SteSuo + "', ");
                sqlstr.AppendLine("Ymax = " + Ymax + ", ");
                sqlstr.AppendLine("Ymin = " + Ymin + ", ");
                sqlstr.AppendLine("Xmax = " + Xmax + ", ");
                sqlstr.AppendLine("Xmin = " + Xmin + ", ");
                sqlstr.AppendLine("IPCCStatement = '" + IPCCStatement + "', ");
                if (LocX1 != 0)
                    sqlstr.AppendLine("LocX1 = " + LocX1 + ", ");
                if (LocY1 != 0)
                    sqlstr.AppendLine("LocY1 = " + LocY1 + ", ");
                if (LocX2 != 0)
                    sqlstr.AppendLine("LocX2 = " + LocX2 + ", ");
                if (LocY2 != 0)
                    sqlstr.AppendLine("LocY2 = " + LocY2 + ", ");
                if (LocX3 != 0)
                    sqlstr.AppendLine("LocX3 = " + LocX3 + ", ");
                if (LocY3 != 0)
                    sqlstr.AppendLine("LocY3 = " + LocY3 + ", ");
                if (AltMin != 0)
                    sqlstr.AppendLine("AltMin = " + AltMin + ", ");
                if (AltMax != 0)
                    sqlstr.AppendLine("AltMax = " + AltMax + ", ");
                sqlstr.AppendLine("Aspect = N'" + Aspect + "', ");
                if (Area != 0)
                    sqlstr.AppendLine("Area = " + Area + ", ");
                sqlstr.AppendLine("LineID = '" + LineID + "', ");
                sqlstr.AppendLine("FlyH = '" + FlyH + "', ");
                if (ShTime != null && ShTime != "")
                    sqlstr.AppendLine("ShTime = '" + ShTime + "', ");
                if (ShDeg != 0)
                    sqlstr.AppendLine("ShDeg = " + ShDeg + ", ");
                if (CamFoc != 0)
                    sqlstr.AppendLine("CamFoc = " + CamFoc + ", ");
                sqlstr.AppendLine("CamMod = '" + CamMod + "', ");
                sqlstr.AppendLine("FWHM = '" + FWHM + "' ");
                sqlstr.AppendLine("WHERE SID = " + SID + " and SortID = " + SortID);
                return ExecuteNonQuery(sqlstr.ToString(), "UpdateFeaturesFL").result;
            }

            else
            {
                return false;
            }
        }
        public bool DbDelete()
        {
            if (SID > 0)
            {
                string sqlstr = "Update StereoscopicImage set Del = 1 WHERE SID = " + SID + " and SortID = " + SortID;
                return ExecuteNonQuery(sqlstr, "DeleteFeaturesFL").result;
            }
            else
            {
                return false;
            }
        }
        public bool DbImport()
        {
            bool _sucess = false;
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                string table = "[StereoscopicImage]";
                string _sql = $"insert into {table} (SID,SortID,IntroName, StePairL, StePairR  , Locate,LocX1, LocY1,IPCCStatement ) VALUES (@SID,(select isNull(MAX(SortID),0)+1 from {table} where [Del]=0 and [SID]= @SID),@IntroName,@StePairL,@StePairR,@Locate,@LocX1,@LocY1,@IPCCStatement)";

                List<SqlParameter> _par = new List<SqlParameter>();
                _par.Add(new SqlParameter("@SID", SID));
                _par.Add(new SqlParameter("@IntroName", IntroName));
                _par.Add(new SqlParameter("@StePairL", StePairL));
                _par.Add(new SqlParameter("@StePairR", StePairR));
                _par.Add(new SqlParameter("@Locate", Locate));
                _par.Add(new SqlParameter("@LocX1", LocX1));
                _par.Add(new SqlParameter("@LocY1", LocY1));
                _par.Add(new SqlParameter("@IPCCStatement", IPCCStatement == null ? string.Empty : IPCCStatement));



                _sucess = db.ToExecute(_sql, _par.ToArray());
            }
            return _sucess;
        }
        public bool UpdateSte()
        {
            bool result = false;
            using (clsDB db = new clsDB(clsDB.ConnStrNameEnum.WLConnect))
            {
                string table = "[StereoscopicImage]";
                string _filter = " where [SortID]=@SortID and [SID]=@SID ";
                string _sql = $" update {table} set [Stereoscopics]=@Stereoscopics {_filter} ";
                List<SqlParameter> _par = new List<SqlParameter>();
                _par.Add(new SqlParameter("@SortID", SortID));
                _par.Add(new SqlParameter("@SID", SID));
                _par.Add(new SqlParameter("@Stereoscopics", Stereoscopics));

                result = db.ToExecute(_sql, _par.ToArray());
            }
            return result;
        }
    }

    //立體像對-林地
    public class StereoscopicImageFL : DbWoodLandFunc
    {
        public int SIID { get; set; }
        public int StDen { get; set; }
        public int CroCov { get; set; }
        public int CroDen { get; set; }
        public string StAge { get; set; }

        public bool DbInsert()
        {
            StringBuilder sqlstr = new StringBuilder();
            sqlstr.AppendLine("INSERT INTO StereoscopicImageFL (SIID, StDen, CroCov, CroDen, StAge) ");
            sqlstr.AppendLine(" VALUES ");
            sqlstr.AppendLine("(" + SIID + ", " + StDen + ", " + CroCov + ", " + CroDen + ", N'" + StAge + "') ");
            return ExecuteNonQuery(sqlstr.ToString(), "InsertStereoscopicImageFL").result;
        }

        public bool DbUpdate()
        {
            if (SIID > 0)
            {
                StringBuilder sqlstr = new StringBuilder();
                sqlstr.AppendLine("UPDATE StereoscopicImageFL SET ");
                sqlstr.AppendLine("StDen = " + StDen + ", ");
                sqlstr.AppendLine("CroCov = " + CroCov + ", ");
                sqlstr.AppendLine("CroDen = " + CroDen + ", ");
                sqlstr.AppendLine("StAge = N'" + StAge + "' ");
                sqlstr.AppendLine("WHERE SIID = " + SIID);
                return ExecuteNonQuery(sqlstr.ToString(), "UpdateStereoscopicImageFL").result;
            }
            else
            {
                return false;
            }
        }
    }

    //立體像對-農地
    public class StereoscopicImageCL : DbWoodLandFunc
    {
        public int SIID { get; set; }
    }

    //立體像對-草地
    public class StereoscopicImageGL : DbWoodLandFunc
    {
        public int SIID { get; set; }
    }

    //立體像對-濕地
    public class StereoscopicImageWL : DbWoodLandFunc
    {
        public int SIID { get; set; }
    }

    //立體像對-定居地
    public class StereoscopicImageSL : DbWoodLandFunc
    {
        public int SIID { get; set; }
    }

    //立體像對-其他土地
    public class StereoscopicImageOL : DbWoodLandFunc
    {
        public int SIID { get; set; }
    }

    public class WLStereoscopicImage : DbWoodLandFunc
    {
        public int NO { get; set; }
        public int ID { get; set; }
        public string PhotoA { get; set; }
        public string PhotoB { get; set; }
        public string StePair { get; set; }
        public string Locate { get; set; }
        public string SteSuo { get; set; }
        public string Ymax { get; set; }
        public string Xmin { get; set; }
        public string Ymin { get; set; }
        public string Xmax { get; set; }
        public string StDen { get; set; }
        public string CroCov { get; set; }
        public string CroDen { get; set; }
        public string StAge { get; set; }
        public string IPCCsub { get; set; }
        public string AltMin { get; set; }
        public string AltMax { get; set; }
        public string Aspect { get; set; }
        public string LocX { get; set; }
        public string LocY { get; set; }
        public string ScePic { get; set; } //樹種現場照片
    }
    public class vw_Species : DbWoodLandFunc
    {
        public int SID { get; set; }
        public int SortID { get; set; }
        public string IPCC { get; set; }
        public string IPCCsub { get; set; }
        public string Family { get; set; }
        public string ComName { get; set; }
        public Decimal LocX1 { get; set; }
        public Decimal LocY1 { get; set; }

        public string Locate { get; set; }
    }
    #endregion

    #region IPCC

    public class WLIPCC : DbWoodLandFunc
    {
        public int IPCCID { get; set; }
        public string IPCC { get; set; }
        public string IsOn { get; set; }
        public List<WLIPCCsub> SubList { get; set; }
    }

    public class WLIPCCsub : DbWoodLandFunc
    {
        public int IPCCID { get; set; }
        public int IPCCsubID { get; set; }
        public string IPCCsub { get; set; }
    }

    #endregion

    #region 意見回饋
    public class WLFeedback : DbWoodLandFunc
    {
        public int NO { get; set; }
        public int ID { get; set; }
        public DateTime AddTime { get; set; }
        public int AddMemberNo { get; set; }
        public string Content { get; set; }

        #region 外部資訊
        public List<WLFeedbackReply> ReplyList { get; set; } //回覆資訊
        public string ComName { get; set; } // 樹種中文名稱
        public string AddAccount { get; set; } // 反映人帳號
        public string AddName { get; set; } // 反映人姓名
        public string Email { get; set; } // 反映人信箱
        public bool IsReply { get; set; } // 是否回覆
        public string LastReplyTime { get; set; } // 最後回覆時間
        #endregion

        public bool DbInsert()
        {
            StringBuilder sqlstr = new StringBuilder();
            sqlstr.AppendLine("INSERT INTO Feedback ");
            sqlstr.AppendLine("(ID, AddTime, AddMemberNo, [Content])");
            sqlstr.AppendLine(" VALUES ");
            sqlstr.AppendLine("(" + this.ID + ",GETDATE()," + this.AddMemberNo + ",N'" + this.Content.Replace("'", "''") + "')");
            return ExecuteNonQuery(sqlstr.ToString(), "InsertWLFeedback").result;
        }
    }

    public class WLFeedbackReply : DbWoodLandFunc
    {
        public int FNO { get; set; }
        public DateTime ReplyTime { get; set; }
        public int ReplyMemberNo { get; set; }
        public string ReplyContent { get; set; }

        public bool DbInsert()
        {
            StringBuilder sqlstr = new StringBuilder();
            sqlstr.AppendLine("INSERT INTO FeedbackReply ");
            sqlstr.AppendLine("(FNO, ReplyTime, ReplyMemberNo, ReplyContent)");
            sqlstr.AppendLine(" VALUES ");
            sqlstr.AppendLine("(" + this.FNO + ",GETDATE()," + this.ReplyMemberNo + ",N'" + this.ReplyContent.Replace("'", "''") + "')");
            return ExecuteNonQuery(sqlstr.ToString(), "InsertWLFeedbackReply").result;
        }
    }

    #endregion

    #region 訓練教室
    public class WLQuestion : DbWoodLandFunc
    {
        public int NO { get; set; }
        public int CID { get; set; }
        public enQuestionType QuestionType { get; set; }
        public string QuestionDesc { get; set; }
        public int Answer { get; set; }
        public string AnswerDesc { get; set; }
        public string ImagePath { get; set; }
        public string ImagePathLeft { get; set; }
        public string ImagePathRight { get; set; }
        public int Level { get; set; }
        public enIsOn IsOn { get; set; }
        public DateTime AddTime { get; set; }
        public int AddMemberNo { get; set; }
        public DateTime ModTime { get; set; }
        public int ModMemberNo { get; set; }
        public string UID { get; set; }
        public List<Unit> Unit { get; set; }

        #region 外部資訊
        public int UserAnswer { get; set; } //使用者的答案
        public List<WLQuestionOption> OptionList { get; set; } //選項

        #endregion

        public bool DbInsert()
        {
            int NO = 0;
            string sqlstr = string.Format(@"
                                            INSERT INTO Question(CID, QuestionType, QuestionDesc, 
                                                        Answer, AnswerDesc, IsOn, [Level], AddTime, AddMemberNo, ImagePath, ImagePathLeft, ImagePathRight,UID)
                                            OUTPUT Inserted.NO
                                            VALUES ('{0}', '{1}', N'{2}', N'{3}', N'{4}', '1', '{5}', GETDATE(), {6}, '{7}', '{8}', '{9}','{10}')",
                                            CID, (int)QuestionType, this.QuestionDesc.Replace("'", "''"),
                                            this.Answer, this.AnswerDesc.Replace("'", "''"), this.Level, this.AddMemberNo,
                                            this.ImagePath, this.ImagePathLeft, this.ImagePathRight, this.UID);
            DbResult ret = new DbResult();
            ret = ExecuteQuery(sqlstr.ToString(), "InsertWLBulletinBoard");
            if (ret.reader.Read()) NO = Convert.ToInt32(ret.reader["NO"]);
            else return false;

            sqlstr = "";
            /*
            if (this.QuestionType == enQuestionType.是非題)
            {
                sqlstr += string.Format(@"
                                              INSERT INTO QuestionOption(QNO, OptionID, OptionDesc,ImagePath)
                                              VALUES ({0},1,'O');
                                              INSERT INTO QuestionOption(QNO, OptionID, OptionDesc,ImagePath)
                                              VALUES ({0},2,'X');", NO);
                return ExecuteNonQuery(sqlstr.ToString(), "InsertWLQuestion").result;
            }
            else
            {*/
            if (OptionList != null && OptionList.Count() > 0)
            {
                foreach (WLQuestionOption option in OptionList)
                {
                    sqlstr += string.Format(@"
                                              INSERT INTO QuestionOption(QNO, OptionID, OptionDesc, ImagePath,ImagePath2)
                                              VALUES ({0}, {1}, N'{2}', '{3}','{4}');",
                                          NO, option.OptionID, option.OptionDesc, option.ImagePath, option.ImagePath2);
                }
                return ExecuteNonQuery(sqlstr.ToString(), "InsertWLQuestion").result;
            }
            //}
            return true;
        }

        public bool DbUpdate()
        {
            string sqlstr = string.Format(@"
                                           UPDATE Question 
                                           SET QuestionDesc = N'{1}', Answer = N'{2}', AnswerDesc = N'{3}',
                                               ModTime = GETDATE(), ModMemberNo = {4}, IsOn = {5}, [Level] = {6}, [UID] = '{10}' {7} {8} {9}
                                           WHERE NO = '{0}';",
                                           this.NO, this.QuestionDesc.Replace("'", "''"), this.Answer, this.AnswerDesc.Replace("'", "''"),
                                           this.ModMemberNo, (int)this.IsOn, this.Level,
                                           this.ImagePath != null ? ", ImagePath = '" + this.ImagePath + "'" : "",
                                           this.ImagePathLeft != null ? ", ImagePathLeft = '" + this.ImagePathLeft + "'" : "",
                                           this.ImagePathRight != null ? ", ImagePathRight = '" + this.ImagePathRight + "'" : "", this.UID);
            if (OptionList != null)
            {
                foreach (WLQuestionOption option in OptionList)
                {
                    sqlstr += string.Format(@"
                                              UPDATE QuestionOption
                                              SET OptionDesc = N'{2}' {3} {4}
                                              WHERE QNO = '{0}' AND OptionID = '{1}';",
                                              NO, option.OptionID, option.OptionDesc,
                                              option.ImagePath != null ? ",ImagePath = '" + option.ImagePath + "'" : "",
                                              option.ImagePath2 != null ? ",ImagePath2 = '" + option.ImagePath2 + "'" : "");
                }
            }
            return ExecuteNonQuery(sqlstr.ToString(), "UpdateWLQuestion").result;

        }

        public bool DbDelete()
        {
            string sqlstr = string.Format(@"
                                           DELETE QuestionOption WHERE QNO='{0}';
                                           DELETE Question WHERE NO='{0}';
                                           ", this.NO);
            WLQuestion data = SysApp.WLMgn.GetWL_Question(CID, NO).ReturnData.FirstOrDefault();
            if (ExecuteNonQuery(sqlstr.ToString(), "DeleteWLQuestion").result)
            {
                #region 刪除檔案
                if (!string.IsNullOrEmpty(data.ImagePath))
                {
                    if (System.IO.File.Exists(HttpContext.Current.Server.MapPath(data.ImagePath)))
                    {
                        System.IO.File.Delete(HttpContext.Current.Server.MapPath(data.ImagePath));
                    }
                }
                if (!string.IsNullOrEmpty(data.ImagePathLeft))
                {
                    if (System.IO.File.Exists(HttpContext.Current.Server.MapPath(data.ImagePathLeft)))
                    {
                        System.IO.File.Delete(HttpContext.Current.Server.MapPath(data.ImagePathLeft));
                    }
                }
                if (!string.IsNullOrEmpty(data.ImagePathRight))
                {
                    if (System.IO.File.Exists(HttpContext.Current.Server.MapPath(data.ImagePathRight)))
                    {
                        System.IO.File.Delete(HttpContext.Current.Server.MapPath(data.ImagePathRight));
                    }
                }
                foreach (WLQuestionOption opotion in data.OptionList)
                {
                    if (!string.IsNullOrEmpty(opotion.ImagePath))
                    {
                        if (System.IO.File.Exists(HttpContext.Current.Server.MapPath(opotion.ImagePath)))
                        {
                            System.IO.File.Delete(HttpContext.Current.Server.MapPath(opotion.ImagePath));
                        }
                    }
                }
                #endregion
                return true;
            }
            else
                return false;

        }


    }

    public class WLQuestionOption : DbWoodLandFunc
    {
        public int QNO { get; set; }
        public int OptionID { get; set; }
        public string OptionDesc { get; set; }
        public string ImagePath { get; set; }
        public string ImagePath2 { get; set; }
    }

    public class WLExam : DbWoodLandFunc
    {
        public int NO { get; set; }
        public int MemberNo { get; set; }
        public int CID { get; set; }
        public Int64 ExamTime { get; set; }
        public DateTime SubmitTime { get; set; }
        public int Level { get; set; }
        public int ExamNum { get; set; }
        public int PassNum { get; set; }

        #region 外部資訊
        public List<WLExamDetail> ExamList { get; set; } //題目

        #endregion

        public int DbInsert()
        {
            int NO = 0;
            //string sqlstr = string.Format(@"
            //                                INSERT INTO Exam(MemberNo, CID, ExamTime, 
            //                                            SubmitTime, Level, ExamNum, PassNum)
            //                                OUTPUT Inserted.NO
            //                                VALUES ('{0}','{1}','{2}',GETDATE(),'{3}','{4}',0)",
            //                                this.MemberNo, CID, this.ExamTime,
            //                                this.Level, ExamList.Count());
            string table = "[Exam]";
            //string _val = "[NO],[MemberNo],[CID],[ExamTime],[SubmitTime],[Level],[ExamNum],[PassNum],[NewOrder]";
            //string _sel = $" select ISNULL(MAX([NO]),0)+1,'{MemberNo}','{CID}','{ExamTime}',GETDATE(),'{Level}','{ExamList.Count}',0,ISNULL(MAX([NO]),0)+1 from {table}";
            string _val = "[MemberNo],[CID],[ExamTime],[SubmitTime],[Level],[ExamNum],[PassNum],[NewOrder]";
            string _sel = $" select '{MemberNo}','{CID}','{ExamTime}',GETDATE(),'{Level}','{ExamList.Count}',0,ISNULL(MAX([NO]),0)+1 from {table}";

            string sqlstr = $" insert into {table} ({_val}) OUTPUT Inserted.NO {_sel} ";
            DbResult ret = new DbResult();
            ret = ExecuteQuery(sqlstr.ToString(), "InsertWLExam");
            if (ret.reader.Read()) NO = Convert.ToInt32(ret.reader["NO"]);
            else return 0;

            sqlstr = "";
            int sort = 0;
            foreach (WLExamDetail detail in ExamList)
            {
                sort += 1;
                sqlstr += string.Format(@"
                                            INSERT INTO ExamDetail(ENO,QNO, Answer,Result,Sort)
                                            VALUES ({0},{1},'{2}',-1,{3});",
                                            NO, detail.QNO, detail.Answer, sort);
            }
            //回填答對題數
            sqlstr += string.Format(@"
                                            UPDATE ExamDetail
                                            SET ExamDetail.Result=0
                                            FROM ExamDetail a
                                            LEFT JOIN Question b on a.QNO=b.NO
                                            WHERE a.ENO='{0}' and a.Answer <> b.Answer and a.Answer != -1;

                                            UPDATE ExamDetail
                                            SET ExamDetail.Result=1
                                            FROM ExamDetail a
                                            LEFT JOIN Question b on a.QNO=b.NO
                                            WHERE a.ENO='{0}' and a.Answer = b.Answer and a.Answer != -1;
                                            
                                            UPDATE Exam
                                            SET PassNum=(
	                                            SELECT Count(QNO)
	                                            FROM ExamDetail
	                                            WHERE ENO={0} AND Result=1
                                            )
                                            WHERE NO='{0}'", NO);

            if (ExecuteNonQuery(sqlstr.ToString(), "InsertExamDetail").result)
            {
                return NO;
            }
            else return 0;
        }

    }

    public class WLExamDetail : DbWoodLandFunc
    {
        public int ENO { get; set; }
        public int QNO { get; set; }
        public int Answer { get; set; }
        public int Sort { get; set; }
        public enExamResult Result { get; set; }
        public WLQuestion Question { get; set; }
    }


    #endregion

    public class UseRecord : DbWoodLandFunc
    {
        public int NO { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; }
        public int Dept { get; set; }
        public string DeptName { get; set; }
        public enFunc Func { get; set; }
        public string FuncStr
        {
            get { return this.Func.ToString(); }
        }
        public enFuncAct Act { get; set; }
        public string ActStr
        {
            get { return this.Act.ToString(); }
        }
        public DateTime UseTime { get; set; }
        public string UserIP { get; set; }

        public bool DbInsert()
        {
            StringBuilder sqlstr = new StringBuilder();
            sqlstr.AppendLine("INSERT INTO UseRecord ");
            sqlstr.AppendLine("(UserID, Dept, Func, Act, UserIP) VALUES ");
            sqlstr.AppendLine("(" + this.UserID + ", " + this.Dept + ", " + (int)this.Func + ", " + (int)this.Act + ", '" + this.UserIP + "')");
            return ExecuteNonQuery(sqlstr.ToString(), "InsertUseRecord").result;
        }
    }

    public class EnumValue
    {
        public string text { get; set; }
        public int value { get; set; }
    }


    public class CaseReference : DbWoodLandFunc
    {
        public int ID { get; set; }
        public enCRType Type { get; set; }
        public string TypeStr
        {
            get { return this.Type.ToString(); }
        }
        public enCRAppearance Appearance { get; set; }
        public string AppearanceStr
        {
            get { return this.Appearance.ToString(); }
        }
        public string Explain { get; set; } = string.Empty;
        public DateTime? CreatTime { get; set; }
        public List<CaseReferenceImage> CaseReferenceImageList { get; set; }
        public int ImageCount
        {
            get { return this.CaseReferenceImageList != null ? this.CaseReferenceImageList.Count() : 0; }
        }

        public int DbInsert()
        {
            string sql = "INSERT INTO CaseReference (Type, Appearance, Explain, CreatTime) OUTPUT INSERTED.ID VALUES (@Type, @Appearance, @Explain, GETDATE())";

            using (SqlConnection connection = new SqlConnection(ConfigurationManager.ConnectionStrings[clsDB.ConnStrNameEnum.WLConnect.ToString()].ToString()))
            {
                connection.Open();
                using (SqlCommand command = new SqlCommand(sql, connection))
                {
                    command.Parameters.AddWithValue("@Type", (int)this.Type);
                    command.Parameters.AddWithValue("@Appearance", (int)this.Appearance);
                    command.Parameters.AddWithValue("@Explain", this.Explain ?? string.Empty);

                    // 执行插入操作并获取返回的 ID
                    int insertedId = (int)command.ExecuteScalar();
                    return insertedId;
                }
            }
        }

        public bool DbUpdate()
        {
            string sqlstr = string.Format(@"
                                           UPDATE CaseReference 
                                           SET Type = {1}, Appearance = {2}, Explain = N'{3}'
                                           WHERE ID = {0};",
                                           this.ID, 
                                           (int)this.Type, (int)this.Appearance, this.Explain);
            return ExecuteNonQuery(sqlstr.ToString(), "UpdateCaseReference").result;

        }

        public bool DbDelete()
        {
            string sqlstr = string.Format(@"
                                           DELETE CaseReference WHERE ID='{0}';
                                           ", this.ID);
            CaseReference data = SysApp.WLMgn.GetCaseReference(ID).ReturnData.FirstOrDefault();
            if (ExecuteNonQuery(sqlstr.ToString(), "DeleteCaseReference").result)
            {
                if (data.CaseReferenceImageList != null)
                {
                    #region 刪除檔案
                    foreach (var item in data.CaseReferenceImageList)
                    {
                        if (!string.IsNullOrEmpty(item.ImagePath))
                        {
                            if (System.IO.File.Exists(HttpContext.Current.Server.MapPath(item.ImagePath)))
                            {
                                System.IO.File.Delete(HttpContext.Current.Server.MapPath(item.ImagePath));
                            }
                        }
                    }
                    #endregion
                }
                return true;
            }
            else
                return false;

        }
    }

    public class CaseReferenceImage : DbWoodLandFunc
    {
        public int ID { get; set; }
        public int CaseReferenceID { get; set; }
        public string NO { get; set; } = string.Empty;
        public DateTime ShootingTime { get; set; }
        public string Explain { get; set; } = string.Empty;
        public double CoordinateX { get; set; } = 0.0;
        public double CoordinateY { get; set; } = 0.0;
        public string ImagePath { get; set; } = string.Empty;
        public bool IsEdit { get; set; } = false;
        public bool IsDel { get; set; } = false;

        public bool DbInsert()
        {
            string sqlstr = string.Format(@"
                                           INSERT INTO CaseReferenceImage (CaseReferenceID, NO, ShootingTime, Explain, CoordinateX, CoordinateY, ImagePath)
                                           VALUES ({0}, N'{1}', '{2}', N'{3}', {4}, {5}, '{6}');",
                                           (int)this.CaseReferenceID, this.NO ?? string.Empty, this.ShootingTime.ToString("yyyy-MM-dd"), this.Explain ?? string.Empty, this.CoordinateX, this.CoordinateY, this.ImagePath ?? string.Empty);
            return ExecuteNonQuery(sqlstr.ToString(), "InsertCaseReferenceImage").result;
        }

        public bool DbUpdate()
        {
            string sqlstr = string.Format(@"
                                           UPDATE CaseReferenceImage 
                                           SET NO = N'{1}', ShootingTime = '{2}', Explain = N'{3}', CoordinateX = N'{4}', CoordinateY = N'{5}', ImagePath = '{6}'
                                           WHERE ID = {0};",
                                           this.ID,
                                           this.NO ?? string.Empty, this.ShootingTime.ToString("yyyy-MM-dd"), this.Explain ?? string.Empty, this.CoordinateX, this.CoordinateY, this.ImagePath ?? string.Empty);
            return ExecuteNonQuery(sqlstr.ToString(), "UpdateCaseReferenceImage").result;
        }

        public bool DbDelete()
        {
            string sqlstr = string.Format(@"
                                           DELETE CaseReferenceImage WHERE ID = '{0}';
                                           ", this.ID);
            return ExecuteNonQuery(sqlstr.ToString(), "DeleteCaseReferenceImage").result;
        }
    }

    #endregion

    #region 操作手冊

    public class OperationManual : DbWoodLandFunc
    {
        public int ID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public string PDFPath { get; set; } = string.Empty;
        public int Sort { get; set; }
    }

    #endregion

    #region 課程
    public class Course : DbWoodLandFunc
    {
        public int ID { get; set; }
        public int Icon { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Outline { get; set; }
        public string Ability { get; set; }
        public string Qexist { get; set; }
        public string Source { get; set; }
        public string Link { get; set; }
        public string AddTime { get; set; }
        public int AddMemberNo { get; set; }
        public List<CourseHandouts> Handouts { get; set; }
        public List<Unit> Unit { get; set; }
        public List<CourseQuizzes> Quizzes { get; set; }

        public int DbInsert()
        {
            int result = 0;
            StringBuilder sqlstr = new StringBuilder();
            sqlstr.AppendLine("INSERT INTO Course (Icon, Title, Description, Outline, Ability, Source, Link, AddMemberNo) ");
            sqlstr.AppendLine("OUTPUT Inserted.ID ");
            sqlstr.AppendLine(" VALUES ( " + Icon + ", N'" + Title + "', N'" + Description + "', N'" + Outline + "', ");
            sqlstr.AppendLine("N'" + Ability + "', N'" + Source + "', N'" + Link + "', " + AddMemberNo + ")");
            DbResult ret = new DbResult();
            ret = ExecuteQuery(sqlstr.ToString(), "InsertCourse");
            if (ret.reader.Read())
                result = Convert.ToInt32(ret.reader["ID"]);
            return result;
        }

        public bool DbUpdate()
        {
            if (ID > 0)
            {
                StringBuilder sqlstr = new StringBuilder();
                sqlstr.AppendLine("UPDATE Course SET ");
                if (Icon != 0)
                    sqlstr.AppendLine("Icon = " + Icon + ", ");
                if (Title != null && Title != "")
                    sqlstr.AppendLine("Title = N'" + Title + "', ");
                if (Title != null && Title != "")
                    sqlstr.AppendLine("Description = N'" + Description + "', ");
                if (Title != null && Title != "")
                    sqlstr.AppendLine("Outline = N'" + Outline + "', ");
                if (Title != null && Title != "")
                    sqlstr.AppendLine("Ability = N'" + Ability + "', ");
                if (Title != null && Title != "")
                    sqlstr.AppendLine("Source = N'" + Source + "', ");
                if (Title != null && Title != "")
                    sqlstr.AppendLine("Link = N'" + Link + "', ");
                sqlstr.AppendLine("Del = " + 0 + " ");
                sqlstr.AppendLine("WHERE ID = " + ID);
                return ExecuteNonQuery(sqlstr.ToString(), "UpdateCourse").result;
            }
            else
            {
                return false;
            }
        }

        public bool DbDelete()
        {
            string sqlstr = "UPDATE Course SET Del = 1 WHERE ID = " + ID;
            return ExecuteNonQuery(sqlstr, "DeleteCourse").result;
        }
    }

    public class CourseHandouts : DbWoodLandFunc
    {
        public int ID { get; set; }
        public int CID { get; set; }
        public string Title { get; set; }
        public string FilePath { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public int FileSize { get; set; }
        public int AddMemberNo { get; set; }
        public int UID { get; set; }
        public string name { get; set; }
        public bool DbInsert()
        {
            StringBuilder sqlstr = new StringBuilder();
            sqlstr.AppendLine("INSERT INTO CourseHandouts (CID, Title, FilePath, FileName, ContentType, FileSize, AddMemberNo,UID) ");
            sqlstr.AppendLine("VALUES (" + CID + ", N'" + Title + "', N'" + FilePath + "', N'" + FileName + "', ");
            sqlstr.AppendLine("'" + ContentType + "', " + FileSize + ", " + AddMemberNo + ", " + UID + ")");
            return ExecuteNonQuery(sqlstr.ToString(), "InsertCourseHandouts").result;
        }

        public bool DbDelete()
        {
            string sqlstr = "UPDATE CourseHandouts SET Del = 1 WHERE ID = " + ID;
            return ExecuteNonQuery(sqlstr, "DeleteCourseHandouts").result;
        }
    }

    public class CourseQuizzes : DbWoodLandFunc
    {
        public int CID { get; set; }
        public int QNO { get; set; }
        public string QuizTitle { get; set; }
        public int UID { get; set; }

        public bool DbInsert()
        {
            StringBuilder sqlstr = new StringBuilder();
            sqlstr.AppendLine("INSERT CourseQuizzes (CID, QNO, QuizTitle,UID) VALUES (");
            sqlstr.AppendLine(CID + ", " + QNO + ", '" + QuizTitle + "', " + UID + ")");
            return ExecuteNonQuery(sqlstr.ToString(), "InsertCourseQuizzes").result;
        }

        public bool DbDelete()
        {
            string sqlstr = "DELETE CourseQuizzes WHERE CID = " + CID + " AND QuizTitle = '" + QuizTitle + "' AND UID = " + UID;
            return ExecuteNonQuery(sqlstr, "DeleteCourseQuizzes").result;
        }
    }
    #endregion

    public class Unit : DbWoodLandFunc
    {
        public int CID { get; set; }
        public int ID { get; set; }
        public string Name { get; set; }
    }


    #region SDE
    public class COUNTY
    {
        public int OBJECTID { get; set; }
        public string COUNTYID { get; set; }
        public string COUNTYNAME { get; set; }
        public string CENTER { get; set; }
    }

    public class TOWN
    {
        public int OBJECTID { get; set; }
        public string TOWNID { get; set; }
        public string TOWNCODE { get; set; }
        public string COUNTYNAME { get; set; }
        public string TOWNNAME { get; set; }
        public string CENTER { get; set; }
    }
    #endregion

    #region 共用
    public class CenterPoint
    {
        public string X { get; set; }
        public string Y { get; set; }
    }

    public class UploadImageRecord
    {
        public int Seq_No { get; set; }
        public string FilePath { get; set; }
        public string FileName { get; set; }
        public string UploadBy { get; set; }
        public DateTime UploadDate { get; set; }
        public int Del { get; set; }
    }
    #endregion
}