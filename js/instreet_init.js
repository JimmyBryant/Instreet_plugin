var instreet_config;
(function(){
  var widgetSid="6ed7yugOfTf7BQKm8ShWw0",
	  actionUrl="http://localhost/action.php",
	  ifengUrl="js/instreet_ifeng.js";  
	  
	  
  var ranN=Math.round(Math.random()*1000000),funcName="callback_"+ranN;
  actionUrl+="?pd="+widgetSid+"&pu="+encodeURIComponent(encodeURIComponent(location.href))+"&callback="+funcName; 
  
  window[funcName]=function(data){
      if(data&&typeof data=="object"){

			data["widgetSid"]=widgetSid; 
			instreet_config=data;
			document.write('<script src="'+ifengUrl+'" charset="utf-8" type="text/javascript"><'+'/script>');
	  }
  
  }
  
  document.write('<script src="'+actionUrl+'" charset="utf-8" type="text/javascript"><'+'/script>');

})();