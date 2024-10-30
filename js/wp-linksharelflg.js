/*
Plugin Name: WP-Amazon
Version: 2.1
Plugin URI: http://manalang.com/wp-amazon/
Description: WP-Amazon adds the ability to search and include items from Amazon to your entries.
Author: Rich Manalang
Author URI: http://groups.google.com/group/wp-amazon

WP-Amazon Plugin for Wordpress 2.3+
Copyright (C) 2005-2007 Rich Manalang
Version 2.0  $Rev: 7794 $ $Date: 2007-02-03 20:58:29 -0800 (Sat, 03 Feb 2007) $

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 2 of the
License, or (at your cption) any later version.

This program is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
USA
*/

if (!wpa2AssociatesId) var wpa2AssociatesId = 'manalangcom-20';
if (!wpa2CountryTLD) var wpa2CountryTLD = 'com';	
var wpa2 = function() {
	var amazonRS = {};
	var pub = {};
	 
	



        // public methods



        pub.process = function(rs) {
		amazonRS = rs;
		jQuery('#wpa-blended').remove();
		jQuery('#wpa-prod-img-preview').remove();
		var rslt = '';
		var items = '';
		var srchRsltMap = fo(rs.ItemSearchResponse.Items,'SearchResultsMap');
		try { srchRsltMap.sort(sbr) } catch (e) {}
		for (var i in srchRsltMap) {
			// only one category returned
			if (i == 'SearchIndex') var srchIdx = srchRsltMap[i];
			// multiple categories returned
			else var srchIdx = fo(srchRsltMap[i],'SearchIndex');
			if (srchIdx) {
				var items = getItems(srchIdx);
				if (items)
					rslt += '<dt>' + fo(srchIdx,'IndexName') 
						+ ' (' + fo(srchIdx,'Results') + ')'
						+ '</dt><dd>' + items + '</dd>';
			};
		};
		var rslt = '<dl id="wpa-blended">' + rslt + '</dl>';
		jQuery(rslt).appendTo('#wpa').Accordion({
			headerSelector: 'dt',
			panelSelector: 'dd',
			activeClass: 'wpa-accordian-active',
			hoverClass: 'wpa-accordian-hover',
			panelHeight: 274,
			speed: 300
		});
		jQuery('#wpa dt').css('cursor','default');
		jQuery('.wpa-prod tr:nth-child(odd)').css("background",'#E0E9EF');
		var navTimer = null;
		jQuery('.wpa-prod-img-other').click(
			function() {
				jQuery('#wpa-prod-img-preview').remove();
				var top = jQuery(this).offset().top + jQuery(this).height();
				var left = jQuery(this).offset().left - ((parseInt(jQuery(this).attr('wpawidth'))+12)/2);
				if (jQuery(this).offset().left + ((parseInt(jQuery(this).attr('wpawidth'))+12)/2) + 30 > 
					jQuery(window).width())
					var hOffset = 'right:5';
				else
					var hOffset = 'left:' + left;
				jQuery('<div id="wpa-prod-img-preview" style="top:' + top + 'px;' + hOffset + 'px">'
					+ '<img id="wpa-preview-close" src="../wp-content/plugins/wp-amazon/images/close.gif" alt="Close preview"/>'
					+ '<div><a href="' + jQuery(this).attr('wpaurl') + '" title="Click and drag this image to the post editor">'
					+ '<img src="' + jQuery(this).attr('href') + '" width="' + jQuery(this).attr('wpawidth') + 'px" />'
					+ '</a></div></div>').appendTo(document.body);
				jQuery('#wpa-preview-close').click(function() { jQuery('#wpa-prod-img-preview').remove() });
				return false;
			}
		);
		jQuery('.wpa-loading').remove();
	};
	
	pub.exec = function() {
		var q = jQuery('#wpa-q').val();
		if (!q) return false;
		if (wpa2AssociatesId) var assocTag = '&AssociateTag=' + wpa2AssociatesId;
		else var assocTag = '';
		var url = baseUrl + q + assocTag + '&noCacheIE=' + (new Date()).getTime();
		jQuery('<div id="wpa-loading" class="wpa-loading">Loading...<div>').appendTo(document.body);
		jQuery('#wpa-script').remove();

		var scriptObj = document.createElement("script");
	    scriptObj.setAttribute("type", "text/javascript");
	    scriptObj.setAttribute("charset", "utf-8");
	    scriptObj.setAttribute("src", url);
	    scriptObj.setAttribute("id", "wpa-script");
		document.getElementsByTagName("head").item(0).appendChild(scriptObj);
		return false;
	};
	return pub;
};

processLinkshare=function()
   {
    //$("#lsans").html("...One Moment Please...");
     $("#lsans").append('<div id="lsmore"></div>')
                    .children("#lsmore").hide()
                    .load("http://feed.linksynergy.com/createcustomlink.shtml ul#favoriteMovies", function()
                     {

                      $("#lsmore").slideDown("slow");
                     });
   return false;
   
}


var findElementByIdPrefix=function(root, elementTagName,prefix){
   var x=root.getElementsByTagName(elementTagName);
   for (i=0;i<x.length;i++)  { 
      if (x[i].id.indexOf(prefix)==0){
        return x[i];
      }       
    }
  return null;
}



jQuery(function() {
	jQuery('<div id="wpa-container"><div id="wpa">'
                + '<h3> LinkShare Link Lookup  </h3> <i> Turn products from LinkShare  merchant\'s site into revenue!</i>'
                + '<br> <h4> Begin by choosing a merchant: <form> '
                + '  <select id="merchant" name="merchant">'
                +"<option value='773'> 1-800-FLOWERS.COM </option>"
                +"<option value='2101'> 1-800-PetMeds </option>"
                +"<option value='3248'> 4 All Memory </option>"
                +"<option value='24611'> 49ers.com </option>"
                +"<option value='24170'> Acacia Catalog </option>"
                +"<option value='24315'> Ace Hardware  </option>"
                +"<option value='3384'> Acorn Online </option>"
                +"<option value='24955'> Adagio Teas </option>"
                +"<option value='828'> Advanced Response </option>"
                +"<option value='913'> Affiliate Development</option>"
                +"<option value='2653'> Alibris </option>"
                +"<option value='24390'> Alibris U.K., Inc. </option>"
                +"<option value='3102'> alle' Fine Jewelry </option>"
                +"<option value='13504'> Alloy.com </option>"
                +"<option value='3046'> American Blooms </option>"
                +"<option value='24752'> AmericaRx.com </option>"
                +"<option value='24404'> AmeriMark.com </option>"
                +"<option value='3176'> Appetizerstogo.com </option>"
                +"<option value='13508'> Apple iTunes </option>"
                +"<option value='13810'> AppliancePartsPros.com, Inc. </option>"
                +"<option value='24250'> Artful Home  </option>"
                +"<option value='24919'> Arthur Price </option>"

                +"<option value='24944'> AskPCExperts </option>"
                +"<option value='24346'> Avon UK </option>"
                +"<option value='24243'> Babies R Us </option>"
                +"<option value='24618'> Baby Universe  </option>"
                +"<option value='24282'> BabyAge.com </option>"
              +"<option value='13631'> Bailey Banks & Biddle </option>"
                +"<option value='14063'> Bake Me  A Wish </option>"
                +"<option value='24394'> BargainCell.com </option>"
                +"<option value='35150'> Beautorium.com </option>"
                +"<option value='3002'> Beauty.com </option>"
                +"<option value='3350'> Bedford Fair Lifestyles </option>"
                +"<option value='24862'> Benefit Cosmetics (UK) </option>"
                +"<option value='24765'> Benefit Cosmetics LLC </option>"
                +"<option value='3432'> Blinds.com </option>"
                +"<option value='24827'> Bliss World, LLC </option>"
                +"<option value='13867'> Bloomingdale's </option>"
                +"<option value='3026'> Blooms Today  </option>"
                +"<option value='24649'> Blue Nile UK </option>"
                +"<option value='1549'> Brigade Quartermasters </option>"
                +"<option value='24959'> Brighter Planet Inc. </option>"
                +"<option value='35118'> Browns Fashion </option>"
                +"<option value='2652'> Buckle.com </option>"
                +"<option value='25016'> BuyAndWalk.com </option>"
                +"<option value='3440'> BuyerZone.com, Inc. </option>"
                +"<option value='24638'> C&C California, Inc. </option>"
                +"<option value='1165'> Cambridge SoundWorks </option>"
                +"<option value='3332'> Camping World </option>"
                +"<option value='24234'> Canadian Hickory Farms, </option>"
                +"<option value='24318'> Cath Kidston Ltd. </option>"
                +"<option value='13514'> Catherines </option>"
                +"<option value='14122'> CBSSportsStore.com </option>"
                +"<option value='13824'> CCS.com </option>"
                +"<option value='24300'> Cellhut.com, Inc. </option>"
                +"<option value='3156'> Championcatalog.com  </option>"
                +"<option value='25020'> CheapOair.com </option>"
                +"<option value='25000'> Chico's  </option>"
                +"<option value='24928'> Christopher & Banks Inc.  </option>"
                +"<option value='24929'> CJ Banks </option>"
                +"<option value='3277'> Click Test 4 </option>"
                +"<option value='24775'> Clinique Online (ELC) </option>"
                +"<option value='24395'> CoastalContacts.com </option>"
                +"<option value='2285'> Coldwater Creek  </option>"
                +"<option value='2293'> Colorful Images </option>"
                +"<option value='24845'> CompUSA </option>"
                +"<option value='2488'> Computers4SURE </option>"
                +"<option value='24240'> Costume SuperCenter </option>"
                +"<option value='1046'> Critics' Choice Video  </option>"
                +"<option value='14055'> Crock-Pot.com   </option>"
                +"<option value='3242'> Cuban Crafters Cigars </option>"
                +"<option value='2792'> Cutter and Buck, Inc. </option>"
                +"<option value='2337'> David's Cookies </option>"
                +"<option value='768'> dELiA*s </option>"
                +"<option value='3178'> Dell Canada Inc </option>"
                +"<option value='1787'> DERMAdoctor.com, Inc. </option>"
                +"<option value='24812'> Designer Linens Outlet </option>"
                +"<option value='24918'> DHC USA Incorporated </option>"
                +"<option value='3200'> Diamonds International </option>"
                +"<option value='14118'> DicksSportingGoods.com </option>"
                +"<option value='24895'> Dillards Inc. </option>"
                +"<option value='24916'> Dorma Group Ltd. </option>"
                +"<option value='24162'> Drs. Foster and Smith Inc. </option>"
                +"<option value='2762'> drugstore.com </option>"
                +"<option value='14129'> DunhamsSports.com </option>"
                +"<option value='2635'> Dutch Gardens, Inc. </option>"
                +"<option value='3342'> eastbay.com </option>"
                +"<option value='24520'> Easy Comforts  </option>"
                +"<option value='1232'> EBgames.com </option>"
                +"<option value='24791'> Elemis </option>"
                +"<option value='1695'> Enterprise Rent-A-Car </option>"
                +"<option value='13914'> ESPN Shop </option>"
                +"<option value='25038'> eSportsonline </option>"
                +"<option value='3446'> etoys.com  </option>"
                +"<option value='24517'> Exposures </option>"
                +"<option value='2052'> F1 Marketing Group, Inc. </option>"
                +"<option value='13515'> Fashion Bug </option>"
                +"<option value='24809'> FavorAffair.com </option>"
                +"<option value='2984'> Figis, Inc. </option>"
                +"<option value='13846'> figleaves.com </option>"
                +"<option value='3084'> FineStationery.com </option>"
                +"<option value='3437'> Fingerhut Direct Marketing</option>"
                +"<option value='24759'> Firebox.com Inc. </option>"
                +"<option value='24423'> Firenze Seta SRL </option>"
                +"<option value='3382'> florsheim.com </option>"
                +"<option value='13581'> Flower.com Flowers </option>"
                +"<option value='14116'> FogDog Sports </option>"
                +"<option value='3071'> Footlocker.com </option>"
                +"<option value='25033'> Footnote.com </option>"
                +"<option value='1805'> Forzieri.com   </option>"
                +"<option value='216'> FragranceNet.com </option>"
                +"<option value='1263'> Franklin Mint </option>"
                +"<option value='24990'> French Connection   </option>"
                +"<option value='836'> Frenchtoast.com </option>"
                +"<option value='3158'> From You Flowers. LLC </option>"
                +"<option value='24922'> FTPress.com </option>"
                +"<option value='2192'> Fuller Brush Company </option>"
                +"<option value='24416'> fye.com </option>"
                +"<option value='2311'> Gaiam.com, Inc </option>"
                +"<option value='24348'> GameStop, Inc. </option>"
                +"<option value='982'> Gardener's Supply Company </option>"
                +"<option value='1400'> Gemplers </option>"
                +"<option value='25017'> Gemshine S.A. </option>"
                +"<option value='24529'> GiftsForYouNow.com </option>"
                +"<option value='1493'> GigaGolf, Inc. </option>"
                +"<option value='24568'> giggle </option>"
                +"<option value='24730'> Glenny's </option>"
                +"<option value='24605'> Goldsmiths Ltd. </option>"
                +"<option value='2119'> Golfballs.com </option>"
                +"<option value='24988'> Goodwill Too </option>"
                +"<option value='24503'> Gordon's Jewelers </option>"
                +"<option value='1162'> Great American Products </option>"
                +"<option value='24993'> Great Plains </option>"
                +"<option value='3005'> GreatSkin.com </option>"
                +"<option value='24409'> Griffin Technology, Inc. </option>"
                +"<option value='24872'> Handango Inc. </option>"
                +"<option value='24434'> HandHelditems </option>"
                +"<option value='24366'> Hanes.com </option>"
                +"<option value='24452'> Hatley  </option>"
                +"<option value='24244'> Hay House, Inc. </option>"
                +"<option value='2920'> HearthSong </option>"
                +"<option value='2948'> Hello Direct, Inc. </option>"
                +"<option value='24193'> HerRoom </option>"
                +"<option value='3436'> Highlights Catalog </option>"
                +"<option value='24525'> Holland USA, Inc. </option>"
                +"<option value='24462'> Hoovers, Inc. </option>"
                +"<option value='24751'> House of Fraser Ltd </option>"
                +"<option value='13602'> Hudson Reed </option>"
                +"<option value='1110'> ICE.com </option>"
                +"<option value='24594'> Identity Direct </option>"
                +"<option value='13585'> Improvement Direct </option>"
                +"<option value='24808'> InformIT   </option>"
                +"<option value='13764'> Inspired Silver </option>"
                +"<option value='2513'> International Jock </option>"
                +"<option value='2065'> Internet Florist </option>"
                +"<option value='2728'> iUniverse, Inc. </option>"
                +"<option value='24553'> iWin, Inc. </option>"
                +"<option value='1145'> J&R Computer/Music World </option>"
                +"<option value='2219'> J.Crew </option>"
                +"<option value='24843'> Jaman.com </option>"
                +"<option value='24418'> James Allen  </option>"
                +"<option value='24836'> jbandme.com </option>"
                +"<option value='788'> JCPenney </option>"
                +"<option value='781'> JewelryWeb.com Inc </option>"
                +"<option value='14131'> Joe's Sports </option>"
                +"<option value='13997'> Just Because Baskets </option>"
                +"<option value='24204'> Just Blinds  </option>"
                +"<option value='2855'> justmysize.com    </option>"
                +"<option value='25009'> Kabiri Ltd </option>"
                +"<option value='1697'> Kaplan Test Prep </option>"
                +"<option value='13930'> Karmaloop LLC </option>"
                +"<option value='3447'> kbtoys.com   </option>"
                +"<option value='2776'> KegWorks.com </option>"
                +"<option value='24952'> Kellyco Metal Detectors </option>"
                +"<option value='24561'> Kew </option>"
                +"<option value='24977'> KitchenStir </option>"
                +"<option value='24994'> Koodos Ltd. </option>"
                +"<option value='24863'> Kosher.com  </option>"
                +"<option value='24803'> Kurt Geiger Ltd.  </option>"
                +"<option value='24972'> Lab Series (ELC) </option>"
                +"<option value='25028'> Lakeside Collection </option>"
                +"<option value='24278'> LampsPlus.com </option>"
                 +"<option value='133'> LandscapeUSA.com </option>"
                +"<option value='13505'> Lane Bryant </option>"
                +"<option value='24680'> Lane Bryant Catalog </option>"
                +"<option value='24575'> LeapFrog Enterprises Inc. </option>"
                +"<option value='13923'> LEGO  </option>"
                +"<option value='3358'> Level2testaccountVERSION2 </option>"
                +"<option value='13576'> Lew Magram </option>"
                +"<option value='24432'> Lighting By Gregory </option>"
                +"<option value='2305'> Lillian Vernon Online </option>"
                +"<option value='2142'> Limoges Jewelry </option>"
                +"<option value='14083'> Linens N' Things </option>"
                +"<option value='25044'> Links of London </option>"
                +"<option value='560'> LinkShare  Referral  Prg </option>"
                +"<option value='2227'> LinkShare Advertising  </option>"
                +"<option value='2253'> LinkShare Email Acquisition </option>"
                +"<option value='2345'> LinkShare UK Test 2 </option>"
                +"<option value='2346'> LinkShare UK Test 3 </option>"
                +"<option value='2347'> LinkShare UK Test 4 </option>"
                +"<option value='2343'> LinkShare UK Test1 </option>"
                +"<option value='24532'> Livingxl.com  </option>"
                +"<option value='13979'> L'Occitane </option>"
                +"<option value='24359'> L'Occitane UK </option>"
                +"<option value='24194'> Lucky Brand Jeans </option>"
                +"<option value='1565'> Luggage OnLine </option>"
                +"<option value='24290'> Lumber Liquidators </option>"
                +"<option value='1154'> Magazines.com, Inc. </option>"
                +"<option value='2921'> Magic Cabin </option>"
                +"<option value='25065'> Manhattanite </option>"
                +"<option value='13769'> Marty Shoes Inc. </option>"
                +"<option value='24987'> Masterbeat.com </option>"
                +"<option value='14125'> MC Sports </option>"
                +"<option value='1106'> McAfee, Inc </option>"
                +"<option value='24810'> MD Skincare LLC </option>"
                +"<option value='24965'> MediaZone.com, Inc. </option>"
                +"<option value='1431'> Medifocus.com,Inc. </option>"
                +"<option value='2262'> Mikasa </option>"
                +"<option value='24516'> Miles Kimball Company </option>"
                +"<option value='13502'> MilitaryClothing.com </option>"
                +"<option value='24338'> Misco.co.uk </option>"
                +"<option value='24973'> MLB.com Shop </option>"
                +"<option value='14126'> Modell's </option>"
                +"<option value='2692'> Mondera.com, Inc. </option>"
                +"<option value='13578'> Monterey Bay Clothing </option>"
                +"<option value='24927'> Montgomery UK </option>"
                +"<option value='13662'> Morgan Mint </option>"
                +"<option value='24512'> MTV Networks </option>"
                +"<option value='13770'> Musicnotes.com </option>"
                +"<option value='24266'> MusicSpace.com </option>"
                +"<option value='24934'> MYLA </option>"
                +"<option value='25059'> MyPypeline.com </option>"
                +"<option value='3448'> Mytwinn.com </option>"
                +"<option value='14121'> NASCAR Superstore </option>"
                +"<option value='1951'> National Bike Registry </option>"
                +"<option value='2456'> National Business Furn.</option>"
                +"<option value='14080'> NBAStore.com </option>"
                +"<option value='2185'> Net2Phone.com </option>"
                +"<option value='24198'> NFLShop.com </option>"
                +"<option value='14120'> Nickelodeon Shop </option>"
                +"<option value='1237'> NORDSTROM.com </option>"
                +"<option value='926'> Office Depot, Inc </option>"
                +"<option value='1519'> Officefurniture.com </option>"
                +"<option value='3349'> Old Pueblo Traders </option>"
                +"<option value='14142'> OlympiaSports.net </option>"
                +"<option value='147'> OmahaSteaks.com, Inc. </option>"
                +"<option value='2856'> onehanesplace.com </option>"
                +"<option value='14152'> Onlineshoes.com </option>"
                +"<option value='1025'> Oriental Trading Company</option>"
                +"<option value='2613'> Overstock.com, Inc. </option>"
                +"<option value='2829'> Palmbeachjewelry.com </option>"
                +"<option value='13932'> Parkseed </option>"
                +"<option value='24891'> PC World Business </option>"
                +"<option value='24509'> PCSecurityShield </option>"
                +"<option value='24921'> PeachPit   </option>"
                +"<option value='3434'> Perfume Worldwide, Inc </option>"
                +"<option value='2071'> Personal Creations </option>"
                +"<option value='3346'> PersonalizationMall.com </option>"
                +"<option value='24447'> Peruvian Connection LTD </option>"
                +"<option value='24933'> Peruvian Connection UK </option>"
                +"<option value='24654'> Petite Sophisticate </option>"
                +"<option value='13565'> PetSmart </option>"
                +"<option value='1661'> Pfaelzer Brothers  </option>"
                +"<option value='1899'> Physician's Choice </option>"
                +"<option value='2848'> Plow & Hearth  </option>"
                +"<option value='24232'> Prep Sportswear </option>"
                +"<option value='24777'> Prescriptives (ELC) </option>"
                +"<option value='14144'> ProGolf.com </option>"
                +"<option value='1065'> Promgirl </option>"
                +"<option value='24591'> PurelyGadgets  </option>"
                +"<option value='24196'> Puritan's Pride </option>"
                +"<option value='24760'> Queen Bee Girls </option>"
                +"<option value='24280'> Queensboro Shirt Company </option>"
                +"<option value='24464'> Racingone.com </option>"
                +"<option value='13974'> RadioShack </option>"
                +"<option value='24344'> Radisson Edwardian </option>"
                +"<option value='24930'> Real Goods Solar  </option>"
                +"<option value='24754'> Refurbdepot.com </option>"
                +"<option value='2750'> Relax The Back </option>"
                +"<option value='14130'> Rockport.com </option>"
                +"<option value='3096'> ROOTS Direct </option>"
                +"<option value='24176'> SA Test Merchant Venue </option>"
                +"<option value='13816'> Saks Fifth Avenue </option>"
                +"<option value='24226'> Sea of Diamonds   </option>"
                +"<option value='3246'> ServiceMagic, Inc. </option>"
                +"<option value='24408'> Shoemart  </option>"
                +"<option value='13900'> ShoeTrader.com </option>"
                +"<option value='13968'> Shop4Tech </option>"
                +"<option value='25008'> ShopEcko.com </option>"
                +"<option value='24228'> ShopPBS.Org </option>"
                +"<option value='2047'> Sierra Club </option>"
                +"<option value='2640'> Sierra Trading Post </option>"
                +"<option value='24646'> Silverts.com </option>"
                +"<option value='3476'> Simply Audiobooks, Inc. </option>"
                +"<option value='24511'> Sirius Satellite Radio </option>"
                +"<option value='1108'> Smallflower.com </option>"
                +"<option value='13892'> SmartBargains.com </option>"
                +"<option value='1845'> Smarthome, Inc. </option>"
                +"<option value='25001'> Soma.com (Chico's) </option>"
                +"<option value='24566'> Space NK Limited </option>"
                +"<option value='13638'> SpinLife.com, LLC </option>"
                +"<option value='14127'> Sport Chalet </option>"
                +"<option value='14119'> SportsAuthority.com </option>"
                +"<option value='3383'> stacyadams.com </option>"
                +"<option value='24907'> Starblu Holdings Ltd. (UK) </option>"
                +"<option value='2661'> Stonewall Kitchen, LLC </option>"
                +"<option value='14124'> Store.HBO.com </option>"
                +"<option value='13790'> Super Warehouse </option>"
                +"<option value='3004'> SwissOutpost Knife Depot </option>"
                +"<option value='1617'> Szul.com </option>"
                +"<option value='2061'> tabasco.com  </option>"
                +"<option value='1280'> Tactics.com </option>"
                +"<option value='25045'> TCP GLOBAL CORPORATION </option>"
                +"<option value='14117'> Teamstore.com </option>"
                +"<option value='2504'> Tech Depot </option>"
                +"<option value='1301'> TerrysVillage.com </option>"
                +"<option value='1947'> textbookx.com </option>"
                +"<option value='24518'> The Home Marketplace </option>"
                +"<option value='25086'> The North Face </option>"
                +"<option value='14112'> The Occasions Group </option>"
                +"<option value='24356'> The Savile Row Company </option>"
                +"<option value='24357'> The Savile Row Company (CA) </option>"
                +"<option value='1674'> The Wine Messenger </option>"
                +"<option value='1142'> TheBabyOutlet </option>"
                +"<option value='24811'> TheFurniture.com LLC </option>"
                +"<option value='1866'> Things Remembered </option>"
                +"<option value='14028'> TigerDirect </option>"
                +"<option value='14029'> TigerDirect (CA) </option>"
                +"<option value='25102'> TimeForMeCatalog.com </option>"
                +"<option value='3318'> TimeLife.com </option>"
                +"<option value='3467'> Total Training DVDs  </option>"
                +"<option value='24242'> Toys R Us </option>"
                +"<option value='24538'> TravelCountry.com </option>"
                +"<option value='24995'> Trueshopping Ltd  </option>"
                +"<option value='13752'> Ty's Toy Box, LLC </option>"
                +"<option value='1961'> UncommonGoods </option>"
                +"<option value='24724'> UNIQLO </option>"
                +"<option value='24405'> Upurea, Inc. </option>"
                +"<option value='3401'> usolympicshop.com </option>"
                +"<option value='24747'> Vans</option>"
                +"<option value='24635'> VistaPrint USA Inc. </option>"
                +"<option value='1155'> Vitacost.com </option>"
                +"<option value='24550'> Vitamin World </option>"
                +"<option value='2393'> Walt Disney Parks </option>"
                +"<option value='24519'> Walter Drake  </option>"
                +"<option value='25030'> Warehouse Express Ltd. </option>"
                +"<option value='3470'> Waterford  </option>"
                +"<option value='13933'> Wayside Gardens </option>"
                +"<option value='24709'> Webroot Software Inc. </option>"
                +"<option value='24970'> Wendy Culpepper LLC </option>"
                +"<option value='25002'> White House Black Market  </option>"
                +"<option value='13902'> Willow Ridge  </option>"
                +"<option value='24427'> Wilson's Leather </option>"
                +"<option value='2025'> wine.com </option>"
                +"<option value='24380'> Wolfgang's Vault </option>"
                +"<option value='24522'> World of Watches </option>"
                +"<option value='24606'> Wyevale Garden Centres  </option>"
                +"<option value='24285'> YOOX.COM </option>"
                +"<option value='13630'> Zales </option>"
                +"<option value='2678'> ZIRH </option>"
                +"<option value='25100'> ZizZazz </option>"




                +'</select>'
                +'<div style="color:#D51019;font-size:14px;"> Option 1: Convert any URL from the Merchant Site </div> '
                +'First, type a URL: <input type="text" id="ls-url">'
                +'<br> Second, select some text to the left for the link.<br>'
                +'<p class="submit"> <input  type="submit" value="Third, Create Link" id="lsconvert"> </p>'
                +'<div id="lsans"> <i> Converted URL:  <div id="message"></div></i></div><br><br>'
                

               +'<div style="color:#D51019;font-size:14px;">  Option 2: Search for Links by Keyword</div>'
                +'<br> First, choose a keyword:<input type="text" value="" id="lskeyword"><br>'
                +'<p class="submit"> <input type="submit" value="Second, Search Product Links" id="lslookup"></p>'
                +'Third, drag an image below to the editor'
                +'</form>' 
                +'<div id="lsitems"></div>'

 
	+ '</div>'
	+ '<a href="#" id="wpa-toggle" title="Convert LinkShare URLs" class="wpa-open"/></a></div>').appendTo(document.body);
		


function handleURL(text) {
  if (text.indexOf('http:')>=0){
     jQuery("#message").html('<a href="javascript:bigger();"> (show url) </a>');  
     //var iframe = document.getElementById('mcWindow_0_iframe');
     var iframe=findElementByIdPrefix(document,'iframe','mcWindow'); 

     var doc = iframe.document || iframe.contentDocument ||iframe.contentWindow && iframe.contentWindow.document || null;
     var xb0=jQuery("iframe",doc);
     var iframe2=findElementByIdPrefix(doc,'iframe','mcWindow');
     var doc2 = iframe2.document || iframe2.contentDocument ||iframe2.contentWindow && iframe2.contentWindow.document || null;
     var href=jQuery("#href",doc2).val(text);
    } else {
      jQuery("#message").html(text);
    }
 }
	
	
jQuery('#lsconvert').click(function()
   {
    jQuery("#message").html("...One Moment Please...");
    jQuery("#mce_editor_0_link").click();
    var x=$("ls-url").value;    
    var mer=$("merchant").value;
    //var loadMe="../wp-content/plugins/wp-amazon/proxy2.php?proxy_url=http://feed.linksynergy.com/createcustomlink.shtml?token=f13bbd201fa8cf5ea75721da6785d52f1420a7fc7b85448392aaaca092efe828%26mid=";
    //loadMe=loadMe+mer+"%26murl="+x;
    var loadMe="../wp-admin/admin-ajax.php";
    var params={mid:mer,url:x,action:'myplugin_linkgenerator_lookup',cookie:document.cookie};
    jQuery("#lsans").append('<div id="lsmore"> &nbsp;</div>')
                    .children("#lsmore").hide()
                    .load(loadMe, params, handleURL);
   return false;
   }
);

jQuery('#lslookup').click(function()
   {
    jQuery("#lsitems").html("...One Moment Please...").css("background","#c0c9cF");
    var x=$("lskeyword").value;
    var mer=$("merchant").value;
    var loadMe="../wp-admin/admin-ajax.php";
    var params={mid:mer,keyword:x,action:'myplugin_linkfinder_lookup',cookie:document.cookie};
    jQuery("#lsans").append('<div id="lsmore"> &nbsp;</div>')
                    .children("#lsmore").hide();
    jQuery.post(loadMe, params, function(xml)
                     {insertXML(xml);


                     });
   return false;
   }
);

 function cutString(x,maxlength){
    if (x.length<maxlength) return x;
    var i=maxlength;
    while ((i>0) && (x.charAt(i)!=' ')){
      i=i-1;
    }
    if (i==0){
       return x.substring(0,maxlength)+'...';
    }
    return x.substring(0,i)+'...';
 }

 function itemToImage(i){
    var imgSrc=i.find("imageurl").text();
    var link=i.find("linkurl").text();
    return '<a href="' + link + '" target="_blank">' + '<img src="' + imgSrc
                                + '" height="45px"/></a>';
 }
 
function bigger(){
   jQuery('#lsmore').slideDown('slow');
   return false;
}
 
function itemToTableRow(i){
 return '<tr>'
  + '<td class="wpa-prod-img">' + itemToImage(i) + '</td>'
  + '<td class="wpa-prod-title" ><a href="' + i.find("linkurl").text() + '" target="_blank">' + i.find("productname").text() + '</a>'
  + 'Price: $'+ i.find("price").text() + '</td>'
  +  cutString(i.find("long").text(),70);
  + '</tr>';
 }
 
 function insertXML(xml){
   var val='<table class="wpa-prod"><tbody>';
   jQuery('item',xml).each(function(i){
      var x=itemToTableRow(jQuery(this));
      val+=x; 
    });
    val+='</tbody></table>';
   jQuery('#lsitems').html(val);
   jQuery('.wpa-prod tr:nth-child(odd)').css("background",'#E0E9EF');
}



	jQuery('#wpa-toggle').toggle(
		function() {
			jQuery('#wpa').css('width', jQuery(document).width() - 	jQuery('#moremeta').offset().left);
			jQuery('#wpa').animate({opacity: 'toggle'},'normal');
			jQuery(this).removeClass('wpa-open').addClass('wpa-close');
			jQuery('#wpa-q')[0].focus();
		},
		function() {
			jQuery('#wpa-prod-img-preview').remove();
			jQuery('#wpa').animate({opacity: 'toggle'},'normal');
			jQuery(this).removeClass('wpa-close').addClass('wpa-open');
		}
	);
	jQuery('#wpa-container').css('top',jQuery('#submenu').offset().top + jQuery('#submenu').height() + 4)
		.css('height',jQuery(document).height() - (jQuery('#submenu').offset().top + jQuery('#submenu').height()));
	jQuery(window).bind('resize',function() {
		jQuery('#wpa').css('width', jQuery(document).width() - 	jQuery('#moremeta').offset().left);
		jQuery('#wpa-container').css('top',jQuery('#submenu').offset().top + jQuery('#submenu').height() + 4)
			.css('height',jQuery(document).height() - (jQuery('#submenu').offset().top + jQuery('#submenu').height()));
	});
	jQuery('#wpa-go').bind('click',wpa2().exec);
	jQuery('#wpa form').bind('submit',wpa2().exec);




})




