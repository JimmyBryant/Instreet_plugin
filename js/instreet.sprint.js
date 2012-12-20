/*********************************************
*
*sprint.js
*
*1.广告位置可选在图片左边或者右边
*
**********************************************/
(function(window,undefined){
        
		if (typeof window.InstreetWidget!="undefined"||window.InstreetWidget != null){
			return null;
		} else {

			window.InstreetWidget = {
				version : "@REVISION@",
		        name    : "InstreetWidget"
			}; 

		}

	   var document = window.document,
		   navigator = window.navigator,
		   location = window.location,
		   imgs=[],
	       readylist=[],
		   isFirst=true,
		   sizeList=[250,250,200,200],
		   cssList=["http://static.instreet.cn/widgets/push/css/instreet.sprint.min.css",
		   "http://static.instreet.cn/widgets/push/css/instreet.sprint200.min.css"];


   		/********************************
		*Config对象
		*********************************/
		var prefix="http://push.instreet.cn/";
		var config = {
						redurl	:	prefix+"click.action",
					callbackurl	:	prefix+"push.action",
						murl	:	prefix+"tracker.action",
						iurl    :	prefix+"tracker90.action",
						ourl	:	prefix+"loadImage.action",
						surl    :   prefix+"share/weiboshare",					
						imih	:	290,
						imiw	:	290,
						timer   :   1000
						// ,
						// adsLimit :  5,
						// widgetSid:"4z9rxazql3QnEikIZVMWf6",
						// // widgetSid:"WkN2vxXpNE7MUOgnYxnAk",
						// showAd:true,
						// showFootAd:true,
						// showWeibo:true,
						// showWiki:true,
						// showShareButton:true,
						// showWeather:true,
						// showNews:true,
						// showMeiding  :true,
						// footAuto:  true,
						// sizeNum : 1	,      //0为250*250 1为200*200
						// position: 1       //0为right 1为left

		};


        /****************************
        *常用方法对象
        ****************************/
		var ev = {                  
			bind : function(element,type,handler){
				if(element.addEventListener){
					element.addEventListener(type,handler,false);
				}else if(element.attachEvent){
					element.attachEvent("on"+type,handler);
				}else{
					element["on"+type] = handler;
				}
			},
			remove : function(element,type,handler){
				if(element.removeEventListener){
					element.removeEventListener(type,handler,false);
				}else if(element.datachEvent){
					element.datachEvent("on"+type,handler);
				}else{
					element["on"+type] = null;
				}
			},
			getEvent : function(event){
				return event ? event : window.event;
			},
			getTarget : function(event){
				return event.target || event.srcElement;
			},
			stopPropagation : function(event){
				if(event.stopPropagation){
					event.stopPropagation();
				}else{
					event.cancelBubble = true;
				}
			},
			getRelatedTarget : function(event){
				if(event.relatedTarget){
					return event.relatedTarget;
				}else if(event.type == "mouseover"){
					return event.fromElement;
				}else if(event.type == "mouseout"){
					return event.toElement;
				}else{
					return null;
				}
			},
			getXY : function (obj){
					var x = 0, y = 0;
					if (obj.getBoundingClientRect) {
						var box = obj.getBoundingClientRect();
						var D = document.documentElement;
						x = box.left + Math.max(D.scrollLeft, document.body.scrollLeft) - D.clientLeft;
						y = box.top + Math.max(D.scrollTop, document.body.scrollTop) - D.clientTop;
					} else {
						for (; obj != document.body; x += obj.offsetLeft, y += obj.offsetTop, obj = obj.offsetParent) {  }
					};
					return {  x: x,  y: y };
			},
			aTrim  :function(arr){	       
				   var array=new Array();
				   arr.sort(sortNum);
				   var len=arr.length,flag=0;
				   for(var i=0;i<len;i++){
					   if(arr[i]!=arr[i+1]){
						 array[flag]=arr[i];
						 flag++;
					  }
				   }
				   return array;
				   function sortNum(a,b){return a-b;}
		    },
		    $:  function(parentNode,tagName,className){  		   
				   var parent=parentNode||document;
				   if(document.getElementsByClassName) return parent.getElementsByClassName(className);
				   var arr=[];
				   var tag=tagName||'*';
				   tag=tag.toUpperCase();
				   var elements=parent.getElementsByTagName(tag);
				   for(var l=elements.length,i=l;i--;){
					   var ele=elements[i];
					   if(ele.className){
						 var cn=ele.className.replace(/\s/g,'|').split('|');
						 for(var len=cn.length,j=len;j--;){
							if(cn[j]==className){arr.push(ele);break;}
						 }
					   }
				   }
				   return arr;
		    },
		   importFile  :function(type,name){
				 var ele;
				 switch(type){
				   case "js": 
				   ele=document.createElement('script');ele.src=name;ele.charset="utf-8";ele.type="text/javascript";
				   break;
				   case "css":
				   ele = document.createElement("link");ele.type = "text/css";ele.rel = "stylesheet";ele.href=name;
				   break;					   
				 }
				 var head=document.getElementsByTagName('head')[0];
				 head.appendChild(ele);
	        },
	       isVisible :function(obj){
			    if (obj == document) return true;

			    if (!obj) return false;
			    if (!obj.parentNode) return false;
			    if (obj.style) {
			        if (obj.style.display == 'none') return false;
			        if (obj.style.visibility == 'hidden') return false;
			    }

			    //Try the computed style in a standard way
			    if (window.getComputedStyle) {
			        var style = window.getComputedStyle(obj, "");
			        if (style.display == 'none') return false;
			        if (style.visibility == 'hidden') return false;
			    }

			    //Or get the computed style using IE's silly proprietary way
			    var style = obj.currentStyle;
			    if (style) {
			        if (style['display'] == 'none') return false;
			        if (style['visibility'] == 'hidden') return false;
			    }

			    return ev.isVisible(obj.parentNode);
			}
		};
        
        var $=function(id){return document.getElementById(id);}
        	,
            each=function(arrs,handler){
            	if(arrs.length){
            		for(var i=0,len=arrs.length;i<len;i++){
            			handler.call(arrs[i],i);
            		}
            	}else{
            		handler.call(arrs,0);
            	}
            }
            ,
            hide=function(elem){
            	each(elem,function(){
            		this.style.display="none";
            	});
        	}
        	,
            show=function(elem){            	
            	each(elem,function(){
            		this.style.display="block";
            	});
            };


        /*********************************
        *扩展DomReady方法
        **********************************/
        var readylist=[];
		var run = function () {   
				for (var i = 0; i < readylist.length; i++) readylist[i]&&readylist[i]();   
		};
		var doScrollCheck=function(){
			  try {   
					document.documentElement.doScroll('left');   
					 
			  }catch (err){   
					setTimeout(doScrollCheck, 1); 
                    return;					
			  }  
			  run();  
	    };	
		document.DomReady = function (fn){ 

                var isIE = !!window.ActiveXObject;
                if(document.readyState==="complete") {readylist.push(fn);run();return;}				
				if (readylist.push(fn) > 1) return; 	
				if (document.addEventListener)  			
				return document.addEventListener('DOMContentLoaded', run, false);   

				if (isIE) {   
                     doScrollCheck();
			    }  
						  
		}; 

	var css={                                //css对象，用于设置样式或者获取样式

		   get:function(elem,style){

			   var value;
			   if(style == "float"){
				 document.defaultView ? style = 'cssFloat': style='styleFloat';
			   }
			   if(style=="opacity"){
				 document.defaultView ? style = 'opacity': style='filter';
			   }

			   if (document.defaultView && document.defaultView.getComputedStyle) {
				 var value=document.defaultView.getComputedStyle(elem, null)[style];

			   }else if (elem.currentStyle){

					value = elem.currentStyle[style];
					if(style=="filter"){

						if(value.match("alpha")){

							value=parseFloat(value.match(/\d+/)[0])/100;

						}else if(!value){

							value=1;
						}
					}

			   }

			   typeof value=="string"&&value.match("px")?value=parseInt(value.replace("px","")):value;          //如果value包含px则转换成num
			   style=="opacity"?value=parseInt(value):value;
			   return value;

		   },
		   set:function(elem,style,value){

			  if(style=="float"){
				document.defaultView ? style = 'cssFloat': style='styleFloat';
			  }
			  if(style=="opacity"){
				elem.style.filter="alpha(opacity="+value*100+")";
				elem.style.zoom=1;
			  }
				elem.style[style]=value;
		   }



		};
	/**************************
	*animate方法
	*************************/		
	var animate=(function(){

	    var timers=[],       //用于存放Fx对象
			timerId;         //全局计时器
		   

		var isEmptyObject=function(obj){            //判断对象是否为空

				for ( var name in obj ) {
					return false;
				}
				return true;

		};

	    var Animate= function	(elem,property, duration, easing, callback){               //js动画入口API

		   var options=Animate.getOpt(duration, easing, callback);                     //修正参数

		   if(elem&&elem.nodeType==1){

			    var start,to;
			    if(property&&typeof property=="object"){

					if(isEmptyObject(property)){             //如果property为空直接执行callback

					    callback.call(elem);

					}else{

					   for(var name in property){

					      var fx=new FX(elem,options,name);
						  start=css.get(elem,name);
						  end=parseFloat(property[name]);
					      fx.custom(start, end);  

					   }


					}

				}

		   }

		 };

		Animate.getOpt=function(duration, easing, callback){       // 修正参数

			 var options ={duration:duration||200,easing:easing||"linear"};
			 options.callback=function(){callback&&callback();};
			 return options;

		};

	    Animate.stop=function(elem,end){                               //停止某个dom元素的动画  end为true则会把动画进行到最后一帧 false则停止到当前帧
		    end=end||false;
			for(var i=timers.length;i--;){
			   var fx=timers[i];
			   if(fx.elem===elem){
			    if(end){
				  fx.update(fx.name,fx.end); 
				}
			    timers.splice(i,1);
			   }

			}

		};

		var FX=function(elem,options,name){                      //FX对象    每一个css属性实例一个FX对象 

			this.elem=elem;
			this.options=options;
			this.name=name;

		};
		FX.prototype.custom=function(from,end){                      //custom方法用于将FX对象推入timers队列

			this.startTime = new Date().getTime();  
			this.start = from;  
			this.end = end; 

			timers.push(this);  
			FX.tick();  

		};
		FX.prototype.step=function(){
		    var now=new Date().getTime(),
				nowPos;

			if(now>this.options.duration+this.startTime){                  //完成动画后执行回调函数并且使用stop方法将fx从timers队列清除
			   nowPos=this.end;
			   this.options.callback.call(this.elem);  
			   this.stop();		
			}else{
			    var n = now - this.startTime;  
	            var state = n / this.options.duration;  
	            var pos =Easing[this.options.easing](state, 0, 1, this.options.duration);  
	            nowPos = this.start + ((this.end - this.start) * pos);  
	        }  

	        this.update(this.name,nowPos);  
		};

		FX.prototype.stop=function(){

			for(var i=timers.length;i--;){

				if(timers[i]===this){
					timers.splice(i,1);
				}
			}

		};

		FX.prototype.update=function(name,value){

			if(name!="opacity")
			{
				value+="px";
			}

			css.set(this.elem,name,value);

		};


		FX.tick = function(){  
	        if (timerId) return;                                   //如果计时器已经在走则退出
	   
	        timerId = setInterval(function(){  
	            for (var i = 0,len=timers.length;i<len;i++){  
	                timers[i]&&timers[i].step();  
	            }  
	            if (!timers.length){  
	                FX.stop();  
	            }  
	        }, 13);  
	    };  
	     
		FX.stop = function(){                                  //清除全局计时器 停止所有动画 
	        clearInterval(timerId);   
	        timerId = null;  
	    };

	    var Easing={                                         //easing对象
	 	
			linear: function( p ) {
				return p;
			},
			swing: function( p ) {
				return ( -Math.cos( p*Math.PI ) / 2 ) + 0.5;
			}

		};	

		return Animate;

	})();


    

     /**********************************
     *TimerTick 方法
     ***********************************/
    var TimerTick=(function(){
    	var timerId=null;   //全局时间函数计时器
    	return function(arr){
             timerId=setInterval(function(){
	         	 for(var i=0;i<arr.length;i++){
					arr[i]&&arr[i].detect();
	         	 }
             },500);
    	};
    })();


    /*********************************
    *cache对象，加载广告数据
    **********************************/
		var cache={

			adsArray   :[],
	        initData   :function(){

				var images=document.getElementsByTagName('img');
			   for(var i=0,len=images.length;i<len;i++){
			   	  var img=images[i];
			   	  imgs[i]=img;
			   	  img.insId=i;
			   	  img.setAttribute("instreet_img_id",i);
			   	  cache.onImgLoad(img);
			   }

		    },
		    onImgLoad  :function(img){                
				 var image=new Image();
				 image.src=img.src,
				 image.insId=img.insId;
				 if(image.complete){
				    cache.loadData(image);
				 }else{
					 image.onload=function(){					   
					   var obj=this;
					   obj.onload=null;
					   cache.loadData(image);  
					 }				 
			     }
		    },
			loadData     :function(img){
			   var index=img.insId,clientImg=imgs[index];		   
			   if(img.width>=config.imiw&&img.height>=config.imih){
			   	 if(clientImg.clientWidth>=config.imiw&&clientImg.clientHeight>=config.imih){  
				   	  if(typeof config.adsLimit=="number"&&config.adsLimit<=0){	
				   	  	return;
				   	  }	
				   	   InstreetAd.recordImage(clientImg);	 //loadImage action	   
					   cache.createJsonp(clientImg);
					   config.adsLimit&&config.adsLimit--;
			   	    }
			    }
			},
			createJsonp  :function(img){
			   var w=250,h=250;
			   if(typeof config.sizeNum=="number"){
			   	  w=sizeList[config.sizeNum*2];
			   	  h=sizeList[config.sizeNum*2+1];
			   }
			   var iu=encodeURIComponent(encodeURIComponent(img.src)),url=config.callbackurl+"?index="+img.insId+"&pd="+config.widgetSid+"&iu="+iu+"&callback=insjsonp"+"&w="+w+"&h="+h;
			   ev.importFile('js',url);
			}
		
		};

        window['insjsonp']=function(data){

		    if(data){
			  var index=data.index,img=imgs[index];
			  img.setAttribute('instreet_data_ready',true);
			  var ad=new InstreetAd(data,instreet.container);
			  cache.adsArray[index]=ad;
			  InstreetAd.autoShow(ad);
			}
				
		};

		/***************************************
		*instreet 对象
		****************************************/
		var instreet={

			init :function(){
				var cssurl=cssList[config.sizeNum];
				ev.importFile('css',cssurl);
				instreet.createContainer();
			},
			createContainer: function(){						//创建广告容器
		       var container=document.createElement('div'),           
			       spotBox=document.createElement('div');
			   container.id="instreet-plugin-container";
			   spotBox.id="instreet-plugin-spotbox";
			   instreet.container=container;
			   instreet.spotBox=spotBox;
			   container.appendChild(spotBox);
			   document.body.children&&document.body.insertBefore(container,document.body.firstChild);				
			}


		};



		/***********************************
		*InstreetAd类
		************************************/
		var InstreetAd=function(data,container){
			var img=imgs[data.index];
			this.data=data;
			this.container=container;
			this.img=img;
			this.originInfo={width:img.clientWidth,height:img.clientHeight,src:img.src,pos:ev.getXY(img)};
			this.spotsArray=[];
			this.timerId=null;
			this.init();
		};

		InstreetAd.prototype={

			constructor:InstreetAd,

			isFirstApp:true,

			init    :function(){
				var _this=this;
				_this.createApps();
				_this.locate();
				_this.bindEvents();
			},

			createApps :function(){
				var _this=this;
				//创建广告容器
				var adWrapper=document.createElement("div"),
				tabWrapper=document.createElement("ul"),
				contentWrapper=document.createElement("ul");
				//根据Position为容器定义不同的class
				if(config.position==0){
					adWrapper.className="in-ad-wrapper in-position-right";
				}else if(config.position==1){
					adWrapper.className="in-ad-wrapper in-position-left";
				}
				tabWrapper.className="in-tabs-wrapper";
				contentWrapper.className="in-contents-wrapper";
				contentWrapper.style.width="0";
				//创建文档碎片
				var tabFrag=document.createDocumentFragment(),
				contFrag=document.createDocumentFragment();
				for(i in InstreetAd.modules){

					if(typeof InstreetAd.modules[i]=='function'){
						var res=InstreetAd.modules[i](_this);
						if(res){
						res.tab&&tabFrag.appendChild(res.tab);
						res.cont&&contFrag.appendChild(res.cont);
						}
					}
				}
				tabWrapper.appendChild(tabFrag);
				contentWrapper.appendChild(contFrag);
				adWrapper.appendChild(tabWrapper);
				adWrapper.appendChild(contentWrapper);

				_this.container.appendChild(adWrapper);
				_this.adWrapper=adWrapper;
				_this.tabs=tabWrapper;
				_this.contents=contentWrapper;

			},
			createSpot :function(app,index){
				var oWidth=app.width,metrix=app.metrix,
				    spot=document.createElement("a"),spotContainer=$("instreet-plugin-spotbox");
			    spot.href="javascript:;";
			    spot.index=index;
				spot.metrix=metrix;
				spot.imgWidth=oWidth;	
			    if(app.adsType)
			      spot.className="instreet-shopSpot";
			    else if(app.type.toString()=="1"||app.type.toString()=="2")  
			      spot.className="instreet-weiboSpot";
			    else if(app.type.toString()=="4")
				  spot.className="instreet-wikiSpot";
				this.spotsArray.push(spot);
				spotContainer.appendChild(spot);
			},
			locate   :function(){                            //定位广告
				var _this=this,img=_this.img,pos=ev.getXY(img)
				,w=img.offsetWidth
				,left=(pos.x+w)+"px"
				,right=!!window.ActiveXObject?(document.body.offsetWidth-pos.x)+"px":(document.documentElement.offsetWidth-pos.x)+"px"
				,top=pos.y+"px",spotsArray=_this.spotsArray;

				var dis=img.clientWidth>=config.imiw&&img.clientHeight>=config.imih?"block":"none";
				if(config.position==0){
					_this.adWrapper.style.left=left;
				}
			    else if(config.position==1){
			   	    _this.adWrapper.style.right=right;
			    }
				_this.adWrapper.style.top=top;
				_this.adWrapper.style.display=dis;
				// _this.adWrapper.style.cssText="left:"+left+";top:"+top+";display:"+dis;

               if(spotsArray.length>0){              //如果存在spot，同时也对其重定位

                     var oWidth=spotsArray[0].imgWidth,
                     	 zoomNum=img.width/oWidth,
					 	 r=15;
                      
	                  for(var j=spotsArray.length;j--;){
	                  	   var  spot=spotsArray[j];				      
					       metrix=spot.metrix,
						   ox=metrix%3000,
						   oy=Math.round(metrix/3000),					  
						   x=ox*zoomNum,
						   y=oy*zoomNum;
	 					  spot.style.cssText="top:"+(y+pos.y-r)+"px;left:"+(x+pos.x-r)+"px;display:"+dis;

	                   }

                } 
			},
			bindEvents :function(){
				var _this=this,list=_this.tabs.children,contents=_this.contents.children;

				//bind img event 
				_this.bindImgEvents(_this.img);
				// _this.findCover();
				_this.tabs.onmouseover=function(){
					clearTimeout(_this.timerId);
				};
				_this.tabs.onmouseout=function(){
					_this.timerId=setTimeout(function(){_this.closeApp()},config.timer);
				};
			   _this.contents.onmouseover=function(){
					clearTimeout(_this.timerId);
				};
				_this.contents.onmouseout=function(){
					_this.timerId=setTimeout(function(){_this.closeApp()},config.timer);
				};
				_this.contents.onclick=function(e){
					var event=ev.getEvent(e),tar=ev.getTarget(event);
					if(tar.className=='in-close'){
						_this.closeApp();
					}else if(tar.parentNode.className=="in-share-icons"){
						_this.shareImg(tar);
					}
					ev.stopPropagation(event);
				};
				// click shop slider item
				var shopSelector=ev.$(_this.contents,null,'in-shop-selector')[0];
				shopSelector&&each(shopSelector.children,function(index){
					var item=this;
					item.onclick=function(){					
						InstreetAd.chooseItem(this,index);
					};
				});
				// click weibo slider item
				var weiboSelector=ev.$(_this.contents,null,'in-weibo-selector')[0];
				weiboSelector&&each(weiboSelector.children,function(index){
					var item=this;
					item.onclick=function(){					
						InstreetAd.chooseItem(this,index);
					};
				});
				
				// click wiki slider item
				var wikiSelector=ev.$(_this.contents,null,'in-wiki-selector')[0];
				wikiSelector&&each(wikiSelector.children,function(index){
					var item=this;
					item.onclick=function(){					
						InstreetAd.chooseItem(this,index);
					};
				});
				for(var i=0,len=list.length;i<len;i++){

					var tab=list[i],content=contents[i];
					//tab mouseover
					tab.onmouseover=function(){												
						if(this.className.match(" focus")){
							return;
						}
						var type=this.lastChild.className;
						_this.showApp(this);
						if(type=="ad"||type=="shop"){
							_this.recordShow(9);
						}
						

					};
					//tab mouseout
					// tab.onmouseout=function(){


					// };
					//content mouseover
					content.onmouseover=function(e){
						var event=ev.getEvent(e),tar=ev.getRelatedTarget(event);
						show(this);
						if(!this.contains(tar)){
							_this.recordWatch(this);
						}
					};
					//content mouseout
					// content.onmouseout=function(){
		
					// };

				}
				//spots event	
				for(var j=0,l=_this.spotsArray.length;j<l;j++){
					var spot=_this.spotsArray[j];
					spot.onmouseover=function(){
						clearTimeout(_this.timerId);
						switch(this.className){
							case "instreet-shopSpot":
							var tab=ev.$(_this.tabs,null,'shop')[0].parentNode,
								sel=ev.$(_this.contents,null,'in-shop-selector')[0].children[this.index];
							var isFocus;
							if(sel){
							    isFocus=sel.className.match(" focus");
							}							
							else{
								isFocus=tab.className.match(" focus");
							}							
							sel&&InstreetAd.chooseItem(sel,this.index);	
							_this.showApp(tab);
							if(!isFocus){
								_this.recordShow(9); //record adShow times
							}     
							break;
							case "instreet-weiboSpot":
							var tab=ev.$(_this.tabs,null,'weibo')[0].parentNode,
							sel=ev.$(_this.contents,null,'in-weibo-selector')[0].children[this.index];				
							sel&&InstreetAd.chooseItem(sel,this.index);	
							_this.showApp(tab);
							break;
							case "instreet-wikiSpot":
							var tab=ev.$(_this.tabs,null,'wiki')[0].parentNode;
							sel=ev.$(_this.contents,null,'in-wiki-selector')[0].children[this.index];
							sel&&InstreetAd.chooseItem(sel,this.index);
							_this.showApp(tab);
							break;
						}
					}
				}		

			},
			bindImgEvents  :function(img){           //为图片绑定事件
				var _this=this;
				//img mouseover
				ev.bind(img,'mouseover',function(){
					clearTimeout(_this.timerId);
					if(_this.contents.offsetWidth==0){
						_this.showApp();
						_this.recordShow(10);
					}
				});
				//img mouseout
				ev.bind(img,'mouseout',function(){
 					_this.timerId=setTimeout(function(){_this.closeApp()},config.timer);
				});
			},

			hideApps:function(){
				var _this=this,list=_this.tabs.children;
				//寻找focus tab
				for(var j=list.length;j--;){
					if(list[j].className.match("focus")){
						list[j].className=list[j].className.replace(" focus","");
					}
				}
				hide(_this.contents.children);
				if(_this.adWrapper.style.width!="auto"){	
					_this.adWrapper.style.width="auto";
				}	
			},
			closeApp:function(){				
				this.hideApps();
				this.contents.style.width=0;
			},
			showApp: function(tab){   
				var _this=this,list=_this.tabs.children,type,app,width;        
				if(!tab){
					tab=list[0];
				}				
				type=tab.lastChild.className;
				_this.hideApps();
				if(_this.adWrapper.style.width=="auto"){
					_this.adWrapper.style.width=config.sizeNum==1?"242px":"292px";
				}
				tab.className+=" focus";
				show(ev.$(_this.contents,'li',type));
				width=(sizeList[config.sizeNum*2]+16)+"px";	
				if(css.get(_this.contents,'width')==0){
					animate(_this.contents,{width:width},200,'linear');
				}
											
			},
			getSelectedIndex:function(type){

               var cn='in-'+type+'-selector', sels=ev.$(this.contents,null,cn)[0]?ev.$(this.contents,null,cn)[0].children:[];
               for(var j=0,len=sels.length;j<len;j++){
               		if(sels[j].className.match(" focus")){
               			return j;
               		}
               }
               return 0;
			},
			shareImg :function(icon){
				var _this=this,picUrl=encodeURIComponent(_this.img.src),shareTo=icon.className.replace("-ico",""),widgetSid=_this.data.widgetSid,time=new Date().getTime(),
					title=encodeURIComponent(document.title),url=encodeURIComponent(location.href);
			    var recordUrl=config.surl+"?content=''&imgUrl="+encodeURIComponent(picUrl)+"&widgetSid="+widgetSid+"&pageUrl="+encodeURIComponent(location.href)+"&shareTo="+shareTo+"&time="+time;
				var winStr="toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=580, height=500";
			   switch(icon.className){
				    case "sina-ico": 
					window.open('http://v.t.sina.com.cn/share/share.php?title='+title+'&url='+url+'&pic='+picUrl,"_blank",winStr);
                    break;
                    case "renren-ico":
					window.open('http://share.renren.com/share/buttonshare.do?link='+url,"_blank",winStr);
					break;
                    case "tx-ico"   :
					window.open('http://share.v.t.qq.com/index.php?c=share&a=index&title='+title+'&url='+url+'&pic='+picUrl,"_blank",winStr);
					break;
					case "qzone-ico" :	
					window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?showcount=1&url='+url+'&title='+title+'&pics='+picUrl+'&summary=','_blank',winStr);
					break;	
					case "sohu-ico"  :	
					window.open('http://t.sohu.com/third/post.jsp?url='+url+'&title='+title+'&content=&pic='+picUrl,'_blank',winStr);
					break;		
					case "kaixin-ico"  :	
					window.open('http://www.kaixin001.com/login/open_login.php?flag=1&url='+url+'&pic='+picUrl+'&content='+title,'_blank',winStr);
					break;
					case "wangyi-ico"  :
					window.open('http://t.163.com/article/user/checkLogin.do?link='+location.host+'source=&info='+title+url+'&images='+picUrl,'_blank',winStr);		
			    	break;
			    	case "douban-ico" :
			    	window.open('http://shuo.douban.com/!service/share?image='+picUrl+'&href='+url+'&name='+title,'_blank',winStr);
			    	break;
			    }
			    ev.importFile('js',recordUrl);     //记录分享行为
			},
			detect   :function(){                     //每隔一段时间开始检测图片对象是否change

                var _this=this,img=_this.img,origin=_this.originInfo,
                	side=_this.sideWrapper,pos=ev.getXY(img);

                if(img.src&&img.src!=origin.src){          //针对幻灯片
                    var parent=side.parentNode||document.body;
                    parent.removeChild(side);
                    cache.onImgLoad(img);
                    origin.src=img.src;
                }
                else if(img.clientWidth<=0||img.clientHeight<=0){   //针对原图被删除或者display为none的情况              		
        			var images=document.images;
        			for(var i=images.length;i--;){
        				if(images[i].src==img.src&&images[i].clientWidth>=config.imiw&&images[i].clientHeight>=config.imih){
        					images[i].insId=img.insId;
        					_this.img=images[i];
        					origin.pos=pos;       //修改原来的pos值   
        					_this.bindImgEvents(_this.img);        
        					break;
        				}
        			}
            		_this.locate();

                }else if(pos.x!==origin.pos.x||pos.y!==origin.pos.y){   //针对图片位置发生变化的情况
                	
                	    origin.pos=pos;
						_this.locate();

                }else if(!ev.isVisible(img)&&_this.adWrapper.style.display!="none"){  //图片被隐藏
                	hide(_this.adWrapper);
                }else if(ev.isVisible(img)&&_this.adWrapper.style.display=="none"){
					show(_this.adWrapper);
                }
                
			},

		   //鼠标移动到图片的时候发送展现记录
		   recordShow: function(flag){  

		       var _this=this,data=_this.data,img=_this.img,
				   ul=config.iurl,pd=data.widgetSid,muh=data.imageUrlHash,
				   iu=encodeURIComponent(encodeURIComponent(img.src)),focus=ev.$(_this.tabs,null,'focus')[0];
				var adsId="",adsType="",index=0,mx='';

				if(focus){ 
					if(focus.lastChild.className=="ad"){
						adsId=data.badsSpot[0].adsId;
						adsType=data.badsSpot[0].adsType;
					}else if(focus.lastChild.className=="shop"){						
						index=_this.getSelectedIndex("shop");
						adsId=data.adsSpot[index].adsId;
						adsType=data.adsSpot[index].adsType;						
						mx=data.adsSpot[index].metrix;
					}
				}
				var time=new Date().getTime();  
				ul+="?pd="+pd+"&mx="+mx+"&muh="+muh+"&iu="+iu+"&ad="+adsId+"&at="+adsType+"&flag="+flag+"&time="+time;
				ev.importFile('js',ul);
						   
		   },
		   //鼠标移动到广告或者微博、百科上发送行为记录
 	      recordWatch:function(tar){   		       

			      var  _this=this,data=_this.data,
			      	   img=_this.img,
					   iu=encodeURIComponent(encodeURIComponent(img.src)),
					   pd=data.widgetSid,
					   ul=config.murl,
					   mid=data.imageNumId||'',
					   muh=data.imageUrlHash,
					   adData,
					   ad='',
					   at='',
					   tg='',
					   ift=0,
					   tty=1,
					   mx='';
                    var cn=tar.className,index=_this.getSelectedIndex(cn);
                    if(cn=="shop"){
                       
					   ad=data.adsSpot[index].adsId;
					   at=data.adsSpot[index].adsType;
					   mx=data.adsSpot[index].metrix;
					   tty=0;
					}else if(cn=="weibo"){
					   ift=2;
					   mx=data.weiboSpot[index].metrix||'';
					}else if(cn=="wiki"){
					   ift=4;
					   mx=data.wikiSpot[index].metrix||'';
					}else if(cn=="weather"){
					   ift=7;
					}else if(cn=="news"){
					   ift=5;
					}else if(cn=="ad"){
					   ad=data.badsSpot[0].adsId;
					   at=data.badsSpot[0].adsType;
					   tty=0;
					}else{
						return;
					}
					var time=new Date().getTime();  								
					ul+="?iu="+iu+"&mx="+mx+"&pd="+pd+"&muh="+muh+"&ad="+ad+"&at="+at+"&tty="+tty+"&ift="+ift+"&time="+time;				
					ev.importFile('js',ul);				
			}

		};


		/*****************************
		*InstreetAd static method
		*****************************/
		InstreetAd.createTab =function(type,text,flag){
			var tab=document.createElement("li");
			tab.className="clearfix tab";
			tab.className+=flag?" "+flag:"";
			tab.innerHTML="<a class='"+type+"' href='javascript:;'><span></span><em>"+text+"</em></a>";
			return tab;
		};

		InstreetAd.chooseItem =function(sel,nth){	
			if(sel.className.match(" focus")){
				return;
			}	
			var selector=sel.parentNode,container=selector.previousSibling,fi=ev.$(container,null,'focus')[0],
				fs=ev.$(selector,null,'focus')[0],next=container.children[nth];
				
			fi.className=fi.className.replace(" focus","");
			fs.className=fs.className.replace(" focus","");
			next.className+=" focus";
			sel.className+=" focus";
		};	
		InstreetAd.reLocate =function(){                   //重新定位广告

           var adsArray=cache.adsArray;
           
           for(i in adsArray){

              var adObj=adsArray[i];
              adObj.locate&&adObj.locate();
		 
		    }
		};
		InstreetAd.autoShow=function(ad){
			if(config.footAuto&&isFirst){
				ad.showApp();
				ad.recordShow(9);
			}
			isFirst=false;
		};


    	/****************************************
        *页面加载时向服务器返回符合要求的图片信息
        ****************************************/
        InstreetAd.recordImage=function(img){

	       var iu=encodeURIComponent(encodeURIComponent(img.src)),
		       pd=config.widgetSid,
			   pu=encodeURIComponent(encodeURIComponent(location.href)),
			   t=encodeURIComponent(encodeURIComponent(document.title)),
			   ul=config.ourl;
			var time=new Date().getTime();   
			  ul+="?iu="+iu+"&pd="+pd+"&t="+t+"&time="+time;
			  ev.importFile('js',ul);
		   
	    };

		/*******************************
		*InstreetAd Apps generator
		*******************************/
		InstreetAd.modules={

			shopApp :function(obj){
				if(!config.showAd||obj.data.adsSpot.length==0)
					return;
				
				var tab,cont,str,data,app,redUrl,imgUrl,title,price,focus,
					selectStr='<div class="in-shop-selector">';
				if(obj.isFirstApp){
					tab=InstreetAd.createTab('shop','折扣','first');
					obj.isFirstApp=false;
				}else{
					tab=InstreetAd.createTab('shop','折扣');
				}
				
				data=obj.data;
				cont=document.createElement("li");
				cont.className="shop";
				str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" class="in-close">×</a>品牌折扣</h3><div class="main-cont">';
				str+='<div class="in-slider-container">';
				for(var i=0,len=data.adsSpot.length;i<len;i++){
					focus=i==0?" focus":"";
					app=data.adsSpot[i];
					obj.createSpot(app,i);        //创建spot
					redUrl=config.redurl+"?tty=0&mx="+app.metrix+"&muh="+data.imageUrlHash+"&pd="+app.widgetSid+"&ift=&at="+app.adsType+"&ad="+app.adsId+"&rurl="+encodeURIComponent(encodeURIComponent(app.adsLinkUrl));
					title=app.adsTitle;
					price=app.adsDiscount||app.adsPrice;
					imgUrl=app.adsPicUrl.replace("160x160",sizeList[config.sizeNum*2]+"x"+sizeList[config.sizeNum*2]);
					str+='<a target="_blank" class="pro-box'+focus+'" href="'+redUrl+'"><img src="'+imgUrl+'"/><span class="pro-info"><span class="pro-name">'+title+'</span><span class="pro-tobuy"><em>进入商店</em></span><span class="pro-price">¥'+price+'</span></span></a>';
					if(len>1)selectStr+='<a href="javascript:;" class="select-item'+focus+'"></a>';
				}
	 			str+='</div>'+selectStr+'</div></div>';	 
				cont.innerHTML=str;
				return {tab:tab,cont:cont};
			},
			adApp  :function(obj){
				if(!config.showFootAd||obj.data.badsSpot.length==0)
					return;
				var tab,cont,data,app,redUrl,w=sizeList[config.sizeNum*2];
				if(obj.isFirstApp){
					tab=InstreetAd.createTab('ad','推广','first');
					obj.isFirstApp=false;
				}else{
					tab=InstreetAd.createTab('ad','推广');
				}
				data=obj.data;				
				app=data.badsSpot[0];

				// app.adsType=9;
				// app.description="http://static.youku.com/v1.0.0223/v/swf/loader.swf?winType=adshow&VideoIDS=118492875&isAutoPlay=true&delayload=true&isShowRelatedVideo=false&imglogo=http://static.atm.youku.com/Youku2012/201211/1112/20635/280-210.jpg";
				
				cont=document.createElement("li");
				cont.className="ad";
				redUrl=config.redurl+"?tty=0&mx=&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift=&at="+(app.adsType||'')+"&ad="+(app.adsId||'')+"&rurl="+encodeURIComponent(encodeURIComponent(app.adsLinkUrl||''));
				str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" class="in-close">×</a>产品推广</h3><div class="main-cont">';
			  	if(app.adsType==3){      //图片广告			     
				  str+="<a class='large-image' target='_blank' href='"+redUrl+"'><img src='"+app.adsPicUrl+"' alt=''/></a>";
			  	}else if(app.adsType==9){              //flash广告
			  	  str+='<object id="afg-adloader" width="'+w+'" height="'+w+'"  align="middle" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000">';
				  str+='<param value="always" name="allowScriptAccess"/><param value="'+app.adsPicUrl+'" name="movie"/><param value="high" name="quality"/><param value="opaque" name="wmode"/><param value="high" name="quality"><param value="#F1F1F1" name="bgcolor"/>';
				  str+='<embed width="'+w+'" height="'+w+'" align="middle" pluginspage="http://www.adobe.com/go/getflashplayer"  type="application/x-shockwave-flash" allowscriptaccess="always" wmode="opaque"  bgcolor="#F1F1F1" quality="high" src="'+app.adsPicUrl+'"></object>';
			  	  str+='<a class="flash-cover" href="'+redUrl+'" target="_blank"></a>';
			  	}
			  	else if(!app.adsLinkUrl&&app.description){   //谷歌广告
				  var frame='<iframe src="'+app.description+'" scrolling="no" height="'+app.adsHeight+'" width="'+app.adsWidth+'" frameborder="0" border="0" marginwidth="0" marginheight="0"></iframe>';
				  str+='<i class="small-info"></i>'+frame;
			    }
	 			str+='</div>';	
	 			cont.innerHTML=str;
				return {tab:tab,cont:cont};
			},
			weiboApp:function(obj){
				if(!config.showWeibo||obj.data.weiboSpot.length==0)
					return;
				var tab,cont,data,app,title,redUrl,article,avatar,str="",focus="",
					selectStr='<div class="in-weibo-selector">';
				if(obj.isFirstApp){
					tab=InstreetAd.createTab('weibo','微博','first');
					obj.isFirstApp=false;
				}else{
					tab=InstreetAd.createTab('weibo','微博');
				}

				data=obj.data;
				cont=document.createElement("li");
				cont.className="weibo";
				str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" class="in-close">×</a>相关微博</h3><div class="main-cont">';
				str+='<div class="in-slider-container">';
				for(var i=0,len=data.weiboSpot.length;i<len;i++){
					focus=i==0?" focus":"";
					app=data.weiboSpot[i];	
					obj.createSpot(app,i);        //创建spot					
					avatar=app.avatar;
					icon=app.icon;
					title=app.title;
					article=app.latestStatus;
					redUrl=config.redurl+"?tty=1&mx="+app.metrix+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+app.type+"&at=&ad=&rurl="+encodeURIComponent(encodeURIComponent(app.userUrl));
					str+='<div class="weibo-item'+focus+'"><div class="left"><a href="'+redUrl+'" target="_blank" title="'+title+'"><img src="'+avatar+'"/></a></div><div class="right"><h3><a href="'+redUrl+'" target="_blank">'+title+'</a></h3><p><em class="arrow-one"></em><em class="arrow-two"></em>'+article+'</p><div class="icon-section"><a href="'+redUrl+'" target="_blank"><img src="'+icon+'"/></a></div></div></div>';				
					if(len>1)selectStr+='<a href="javascript:;" class="select-item'+focus+'"></a>';
				}
	 			str+='</div>'+selectStr+'</div></div>';	
				cont.innerHTML=str;
				return {tab:tab,cont:cont};

			},
			wikiApp:function(obj){
				if(!config.showWiki||obj.data.wikiSpot.length==0)
					return;
				var tab,cont,data,app,title,redUrl,article,avatar,str="",focus="",
					selectStr='<div class="in-wiki-selector">';;
				if(obj.isFirstApp){
					tab=InstreetAd.createTab('wiki','百科','first');
					obj.isFirstApp=false;
				}else{
					tab=InstreetAd.createTab('wiki','百科');
				}
				data=obj.data;
				cont=document.createElement("li");
				cont.className="wiki";
				str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" class="in-close">×</a>相关百科</h3><div class="main-cont">';
				str+='<div class="in-slider-container">';
				for(var i=0,len=data.wikiSpot.length;i<len;i++){
					focus=i==0?" focus":"";
					app=data.wikiSpot[i];	
					obj.createSpot(app,i);        //创建spot				
					avatar=app.firstimg;
					title=app.title;
					article=app.summary;
					redUrl=config.redurl+"?tty=1&mx="+app.metrix+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+app.type+"&at=&tg="+encodeURIComponent(encodeURIComponent(title))+"&rurl="+encodeURIComponent(encodeURIComponent(app.url));
					str+='<div class="wiki-item'+focus+'"><div class="left"><a class="thumb" href="'+redUrl+'" target="_blank" title="'+title+'"><img src="'+avatar+'"/></a><h3><a class="tagName" href="'+redUrl+'" target="_blank">'+title+'</a></h3></div><div class="right"><p><em class="arrow-one"></em><em class="arrow-two"></em>'+article+'</p><div class="icon-section"><a href="'+redUrl+'" target="_blank"><img src="http://static.instreet.cn/widgets/push/images/icon_baike.png"/></a></div></div></div>';
					if(len>1)selectStr+='<a href="javascript:;" class="select-item'+focus+'"></a>';
				}
				str+='</div>'+selectStr+'</div></div>';				
				cont.innerHTML=str;
				return {tab:tab,cont:cont};
			},
			newsApp:function(obj){
				if(!config.showNews)
					return;
				var tab,cont,data=obj.data,w=sizeList[config.sizeNum*2],
				    newsUrl=prefix+"news?size="+w+"&pd="+data.widgetSid;

				if(obj.isFirstApp){
					tab=InstreetAd.createTab('news','新闻','first');
					obj.isFirstApp=false;
				}else{
					tab=InstreetAd.createTab('news','新闻');
				}

   			   	var cont=document.createElement("li");			   	   	   
		   	    cont.className="news";  
		        str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" class="in-close">×</a>热点新闻</h3><div class="main-cont">';
			    str+='<iframe name="weather_inc" src="'+newsUrl+'" width="'+w+'" height="'+w+'" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>';
			    str+='</div>';
		   	    cont.innerHTML=str;
			   
				return {tab:tab,cont:cont};
			},
			weatherApp:function(obj){
				if(!config.showWeather)
					return;
				var tab,cont,
					w=sizeList[config.sizeNum*2],
					weatherUrl="http://www.thinkpage.cn/weather/weather.aspx?uid=&cid=101010100&l=zh-CHS&p=CMA&a=1&u=C&s=1&m=0&x=1&d=3&fc=&bgc=&bc=&ti=1&in=1&li=2&ct=iframe";
				if(obj.isFirstApp){
					tab=InstreetAd.createTab('weather','天气','first');
					obj.isFirstApp=false;
				}else{
					tab=InstreetAd.createTab('weather','天气');
				}
   			   	var cont=document.createElement("li");			   	   	   
		   	    cont.className="weather";  
		        str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" class="in-close">×</a>天气预报</h3><div class="main-cont">';
			    str+='<iframe name="weather_inc" src="'+weatherUrl+'" width="'+w+'" height="110" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="true" ></iframe>';
			    str+='</div>';
		   	    cont.innerHTML=str;
				return {tab:tab,cont:cont};
			},
			shareApp:function(obj){
				if(!config.showShareButton)
					return;
				var tab,cont;
				if(obj.isFirstApp){
					tab=InstreetAd.createTab('share','分享','first');
					obj.isFirstApp=false;
				}else{
					tab=InstreetAd.createTab('share','分享');
				}
				var cont=document.createElement("li");			   	   	   
		   	    cont.className="share";
		   	    str='<h3 class="title clearfix"><a title="关闭" href="javascript:;" class="in-close">×</a>图片分享</h3><div class="main-cont">';  
				str+='<div class="in-share-icons"><a title="新浪微博" class="sina-ico" href="javascript:;"></a><a title="腾讯微博" class="tx-ico" href="javascript:;"></a><a title="QQ空间" class="qzone-ico" href="javascript:;"></a><a title="人人网" class="renren-ico" href="javascript:;"></a><a title="搜狐微博" class="sohu-ico" href="javascript:;"></a><a title="网易微博" class="wangyi-ico" href="javascript:;"></a><a title="豆瓣" class="douban-ico" href="javascript:;"></a><a title="开心网" class="kaixin-ico" href="javascript:;"></a>';
				str+='</div></div>';
				cont.innerHTML=str;
				return {tab:tab,cont:cont};
			}

		};








		/*****************************
		*Mix config
		*****************************/
		var mixConfig=function(c){
		   if(c&&typeof c=="object"){

		     for(var i in c){
			    config[i]=c[i];
			 }
		   
		   }else{
		     return;		   
		   }
		
		};
		

		/************************* 
		*init function
		*************************/
		function init(){

			 if(typeof instreet_config!="undefined"){		//mix配置信息
				 mixConfig(instreet_config);
			 }                  
		     instreet.init();
			 cache.initData();
			 ev.bind(window,'load',function(){InstreetAd.reLocate();}); 
			 ev.bind(window,'resize',function(){InstreetAd.reLocate();}); 
			 //定时检测图片是否变化
             TimerTick(cache.adsArray);

		};
		
		
		/******************************
		*dom ready then init ad plugin
		*******************************/
		document.DomReady(function(){
        	//插件初始化
        	init();
    	});

})(window);