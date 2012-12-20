/*********************
*instreet video ad
*********************/

// (function(window){

	// var document=window.document
	// ,location=window.location;
    
    //jsonp对象
	var Jsonp=function(url,params,callback){

		this.url=url;
		this.params=params;
		if(typeof callback==='function'){
			var funcName="instreet_video_jsonp"+new Date().getTime();
			window[funcName]=callback;
		}
			
		this.callback=funcName;
        
	};

    Jsonp.prototype.load=function() {
        var _=this
        ,script = document.createElement('script')
        ,paramArra=[]
        ,url=_.url
        ,params=_.params
        ,callback=_.callback
        ,head;
        if(params&&typeof params=='object'){
        	for(var i in params){
                paramArra.push(i+'='+params[i]);
        	}
        }
        callback&&paramArra.push('callback='+_.callback);
        url+=paramArra.length?"?"+paramArra.join('&'):'';
        script.src = url;
        script.async = true;

        script.onload = script.onreadystatechange = function () {
            if ( !this.readyState || this.readyState === "loaded" || this.readyState === "complete") {

                script.onload = script.onreadystatechange = null;
                if (script && script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            }
        };
        if (!head) {
            head = document.getElementsByTagName('head')[0];
        }
        head.appendChild(script);
    };

// }(window));

