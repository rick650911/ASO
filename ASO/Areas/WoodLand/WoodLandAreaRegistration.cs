using System.Web.Mvc;

namespace ASO.Areas.WoodLand
{
    public class WoodLandAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "WoodLand";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "WoodLand_default",
                "WoodLand/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}