dojo.declare("SGSTileLayer", esri.layers.TiledMapServiceLayer, 
{
	constructor: function(sUrl, serviceRes, nLayer) 
	{
	    //debugger;
		this._url = sUrl;
		this._resource = null;
		this._layer = nLayer;
		
		var pThis = this;
		var url = sUrl + "/GetCacheConfig?FORMAT=JSON";
		LoadScript(url, function()
		{
			var pNodeRes = result.Infomation;
			if (!pNodeRes)
				return;
			this._resource = pNodeRes.ResourceName;			//取得TGOS圖磚服務名稱
			var ImgWidth = parseInt(pNodeRes.TileWidth);
			var ImgHeight = parseInt(pNodeRes.TileHeight);
			var dCLeft = parseFloat(pNodeRes.CornerLeft);
			var dCLower = parseFloat(pNodeRes.CornerLower);
			
			var pEnv = pNodeRes.Envelope;
			var dCacheLeft = parseFloat(pEnv.Left);
			var dCacheTop = parseFloat(pEnv.Top);
			var dCacheRight = parseFloat(pEnv.Right);
			var dCacheBottom = parseFloat(pEnv.Bottom);
			
			pThis.spatialReference = new esri.SpatialReference({ wkid: 102443 });
			
			pThis.initialExtent = (pThis.fullExtent = new esri.geometry.Extent(dCacheLeft, dCacheBottom, dCacheRight, dCacheTop, pThis.spatialReference));
			
			var resolutions = new Array();
			var pSclss = pNodeRes.Scales;
			var pScls = pSclss.Scale;
			if (pScls)
			{
				if (pScls.length > 0)
				{
					for (var i = 0 ; i < pScls.length ; i++)
					{
						var pScl = pScls[i];
						var dem;
						if (pScl.Denominator)
							dem = parseFloat(pScl.Denominator);
						else
							dem = parseFloat(pScl._text);
						var fac = parseFloat(pScl.Factor);
						resolutions.push({ level: i, scale: dem, resolution: fac});
					}
				}
			}
			
			pThis.tileInfo = new esri.layers.TileInfo(
			{
				"dpi": "96",
				"format": "image/png",
				"compressionQuality": 0,
				"spatialReference": { "wkid": "102443" },
				"rows": ImgWidth, 
				"cols": ImgHeight, 
				"origin": { "x": dCLeft, "y": dCLower }, 
				"lods": resolutions
			});
			pThis.loaded = true;
			pThis.onLoad(pThis);
		});
		
	},
	getTileUrl: function(level, row, col) 
	{
		var scnt = this.tileInfo.lods.length;
		//var sUrl = this._url + "/GetCacheImage?ResourceName=" + encodeURIComponent(this._resource) + 
		//		"&S=" + level + "&X=" + col + "&Y=" + (-row-1) + "&L=" + this._layer;
		
		var sUrl = this._url + "/GetCacheImage?S=" + level + "&X=" + col + "&Y=" + (-row - 1) + "&L=" + this._layer;
		return sUrl;
	}
});