﻿/**********尚街广告初始化代码**************/

var instreet_config;
(function(){
  var scripts=document.getElementsByTagName("script"),len=scripts.length,src=scripts[len-1].src,reg=/pd=([^?|&]*)/,widgetSid,
  	  actionUrl="http://ts.instreet.cn:90/statCheck.action",defaultUrl="js/instreet.default.js",ifengUrl="js/instreet.ifeng.js";  

   if(src.match(reg)){
     widgetSid=src.match(reg)[1];
   }
   else 
	return false;
	  
  var funcName="injsonp";
  actionUrl+="?pd="+widgetSid+"&pu="+encodeURIComponent(encodeURIComponent(location.href))+"&callback="+funcName; 
  
  window[funcName]=function(data){
      if(data&&typeof data=="object"){

			data["widgetSid"]=widgetSid; 
			instreet_config=data;
			if(data.style=="")
				document.write('<script src="'+defaultUrl+'" charset="utf-8" type="text/javascript"><'+'/script>');
			else if(data.style=="blue")
				document.write('<script src="'+ifengUrl+'" charset="utf-8" type="text/javascript"><'+'/script>');
			
	  }
  
  }
  
  document.write('<script src="'+actionUrl+'" charset="utf-8" type="text/javascript"><'+'/script>');

})();