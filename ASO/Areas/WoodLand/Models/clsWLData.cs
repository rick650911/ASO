using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ASO.Areas.WoodLand.Models
{
    public class StereoscopicImageSavePersonel
    {
        public int ShapeIndex { get; set; }
        public string AccountID { get; set; }
        public int? StereoscopicImage_ID { get; set; }
        public string btn_exchange { get; set; }
        public string rotate { get; set; }
        public string transition { get; set; }
        public string btn_lock { get; set; }
        public string btn_zoom { get; set; }
        public double? tb_Lengtheye { get; set; }
    }

    public class Stereoscopic
    {
        public int ID { get; set; }
        public int SID { get; set; }
        public int? SortID { get; set; }
        public int? PhotoA { get; set; }
        public int? PhotoB { get; set; }
        public string StePair { get; set; }
        public string StePairL { get; set; }
        public string StePairR { get; set; }
        public string Locate { get; set; }
        public DateTime? TakePhotoTime { get; set; }
        public string PicNumber { get; set; }
        public string FilmNumber { get; set; }
        public string SteSuo { get; set; }
        public decimal? Xmax { get; set; }
        public decimal? Xmin { get; set; }
        public decimal? Ymax { get; set; }
        public decimal? Ymin { get; set; }
        public int? AltMin { get; set; }
        public int? AltMax { get; set; }
        public string Aspect { get; set; }
        public decimal? Area { get; set; }
        public string LineID { get; set; }
        public string FlyH { get; set; }
        public DateTime? ShTime { get; set; }
        public double? ShDeg { get; set; }
        public int? CamFoc { get; set; }
        public string CamMod { get; set; }
        public string FWHM { get; set; }
        public decimal? LocX1 { get; set; }
        public decimal? LocY1 { get; set; }
        public decimal? LocX2 { get; set; }
        public decimal? LocY2 { get; set; }
        public decimal? LocX3 { get; set; }
        public decimal? LocY3 { get; set; }
        public string IPCCStatement { get; set; }
        public bool Del { get; set; }

        public string ImgW { get; set; }
        public string ImgH { get; set; }
    }
}