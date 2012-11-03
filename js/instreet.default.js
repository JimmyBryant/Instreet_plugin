(function(window,undefined){
        
		if (typeof(window.InstreetWidget) != "undefined" || (window.InstreetWidget != null)){
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
		   prefix="http://push.instreet.cn/",
		   config = {

						cssurl 	:	"http://static.instreet.cn/widgets/push/css/instreet-ifeng.css",
						redurl	:	prefix+"click.action",
					callbackurl	:	prefix+"push.action",
						murl	:	prefix+"tracker.action",
						iurl    :	prefix+"tracker90.action",
						ourl	:	prefix+"loadImage.action",
						surl    :   prefix+"share/weiboshare",						
						imih	:	290,
						imiw	:	290,
						timer   :   1000
						,
						widgetSid: "79cjp47BnLo3NdNaLeICIw",
						triggerFootAd: "mouse",        //mouse为鼠标移动到图片显示、scroll为页面滚动的时候显示
						showAd  :   true,
						showFootAd: true,
				        showWeibo:  true,
						showWiki:   true,
						position:   'right'
		    },			
			ev = {                  
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
				aTrim          :function(arr){	       
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
				getStyle:function(elem,style){
					var value=elem.style[style];
					if(!value){
			             if (document.defaultView && document.defaultView.getComputedStyle) {
			                var _css=document.defaultView.getComputedStyle(elem, null);
			                value= _css ? _css.getPropertyValue(style) : null;
			             }else{
			                if (elem.currentStyle){
			                    value = elem.currentStyle[style];
			                }
			             }
					}

			        if(style == "opacity"){
			            try {
			                value = elem.filters['DXImageTransform.Microsoft.Alpha'].opacity;
			                value =value/100;
			            }catch(e) {
			                try {
			                    value = elem.filters('alpha').opacity;
			                } catch(err){}
			            }
		        	}
					return value;
				},
				hasClass:function(obj,c){
				   if(obj&&obj.className){
				      var reg=new RegExp(c);

				      return reg.test(obj.className);
				   }
				   return false;
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

		   
		/**************************
		*video
		***************************/
		var video=function(defaults){
		   var img=defaults.img,src=defaults.src,w=400,h=300,
			   createMedia=function() {
				 var e=document.createElement("embed");
					 e.type="application/x-shockwave-flash";
					 e.quality="high";
				 return e;
			   },
			   createContainer=function(){
			     var e=document.createElement("div");
				 e.className="instreet-video-wrap";
				 return e;
			   };
		   this.container=createContainer();
		   this.video=createMedia();
		   this.video.width=w;
		   this.video.height=h;
		   this.height=h;
		   this.img=img;
		   this.video.src=src;	   
		};
		video.prototype={
		    watch:function(){
			    var _this=this,container=$('instreet-plugin-container'),wrap=this.container,str,pos=ev.getXY(_this.img),w=_this.img.width,padTop=Math.round(_this.img.height-_this.height)/2<0?0:Math.round(_this.img.height-_this.height)/2,h=_this.img.height-padTop;
				wrap.style.cssText="position:absolute;text-align: center;padding-top:"+padTop+"px;top:"+pos.y+"px;left:"+pos.x+"px;background:#FFF;z-index:100010;opacity:.5;filter:alpha(opacity=50);width:"+w+"px;height:"+h+"px;";
				var close=document.createElement("a");
				close.href="javascript:;"; close.style.cssText="display:inline-block;text-decoration:none;background:#000;font-size:14px;font-weight:bold;width:25px;height:25px;vertical-align:top;line-height:27px;color:#FFF;";
				close.title="关闭视频";
				close.innerHTML="×";
				close.onclick=function(){
				  var c=this.parentNode,p=c.parentNode||document.body;
				  p.removeChild(c);
				};
				wrap.appendChild(_this.video);
				wrap.appendChild(close);
				container.appendChild(wrap);
			},
			close:function(){
			  var parent=this.container.parentNode||document.body;
			  parent.removeChild(this.container);
			}
		};

		/**************************************
		*slider对象 包含slideDown和slideUp
		**************************************/
		var slider=(function(elem,speed){
			var timerId=null,list=[];
		    var slider=function(elem, speed){
			    
				this.elem=elem;
				this.speed=speed||500;
				this.flag=null;				
				this.height=parseInt(ev.getStyle(elem,'height'));
				elem.style.height=0;  

			};
			slider.prototype.slideDown=function(callback){
			   var _this=this, elem=_this.elem,speed=_this.speed,
				   startTime=new Date().getTime(),
				   now=parseInt(elem.style.height),gap=_this.height-now;

			   elem.style.display ="block"; 
			   var	loop=function(){
				    var p=(new Date().getTime()-startTime)/speed,
					   swing=(-Math.cos( p*Math.PI ) / 2 ) + 0.5;
					elem.style.height=now+(gap*swing)+'px';	

					if (p<=1) {
					    clearTimeout(_this.flag);
						_this.flag=setTimeout(loop,30);
					}else{
						callback&&callback();
					}				
					
				};
				loop();
			
			};
			slider.prototype.slideUp=function(callback){
			   var _this=this, elem=_this.elem,speed=_this.speed,
				   startTime=new Date().getTime(),now=parseInt(parseInt(elem.style.height)),gap=-now;

			   var	loop=function(){
				   var p=(new Date().getTime()-startTime)/speed,
					   swing=(-(Math.cos(p*Math.PI)/2) + 0.5);
					elem.style.height=now+Math.floor(gap*swing)+'px';				
					if (p<=1) {
					    clearTimeout(_this.flag);
						_this.flag=setTimeout(loop,30);
					}else{
						callback&&callback();
					}				
					
				};
				loop();

			};
			slider.prototype.stop=function(){
			   clearTimeout(this.flag);
			   this.flag=null;
			};
			return slider;
		})();
		
		/********************************
		*cache对象，加载广告数据
		********************************/
		var cache={
		     // dataArray  :[],
			// avaImages  :[],
			adsArray   :[],
	        initData   :function(){
			   var images=document.getElementsByTagName('img');
			   for(var i=0,len=images.length;i<len;i++){
			   	  var img=images[i];
			   	  imgs[i]=img;
			   	  img.insId=i;
			   	  img.setAttribute("instreet-img-id",i);
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
               if(clientImg){			   
				   if(img.width>=config.imiw&&img.height>=config.imih){
					   	if(clientImg.clientWidth>=config.imiw&&clientImg.clientHeight>=config.imih){

					   	   instreet.recordImage(clientImg);				   
						   cache.createJsonp(clientImg);
						   
					    }
					}
			   }

			},
			createJsonp  :function(img){
			   var w=img.clientWidth,h=0;
			   var iu=encodeURIComponent(encodeURIComponent(img.src)),url=config.callbackurl+"?index="+img.insId+"&pd="+config.widgetSid+"&iu="+iu+"&callback=insjsonp&w="+w+"&h="+h;
			   ev.importFile('js',url);
			}
		
		};

		/*********************************
		*instreet对象
		*********************************/
		var instreet={
			container :null,
			widgetBox :null,
		    init   :function(){
			    // var cssUrl=config.cssurl;
				var cssUrl='css/instreet.default.css';
				ev.importFile('css',cssUrl);
				instreet.createContainer();
				instreet.bindEvents();
								
			},
			createContainer: function(){						//创建广告容器
		       var container=document.createElement('div');        
			   container.id="instreet-plugin-container";
			   instreet.container=container;
			   document.body.insertBefore(container,document.body.firstChild);	
			   instreet.createWidgetBox();			
			},
			createWidgetBox:function(){
			     
			    var	section=document.createDocumentFragment(),
			        shop=document.createElement("div"),weibo=document.createElement("div"),wiki=document.createElement("div");
			    shop.className="shop-holder";
			    weibo.className="weibo-holder";
			    wiki.className="wiki-holder";

			    section.appendChild(shop);
			    section.appendChild(weibo);
			    section.appendChild(wiki);
				instreet.container.appendChild(section);
				instreet.shop=shop;instreet.weibo=weibo;instreet.wiki=wiki;

			},
			bindEvents :function(){

				var	shop=instreet.shop,weibo=instreet.weibo,wiki=instreet.wiki,index;
				instreet.container.onclick=function(e){
					var event=ev.getEvent(e),tar=ev.getTarget(event);
					if(tar.className=="button-close-holder"){
						hide(tar.parentNode.parentNode);
					}
				};
				shop.onmouseover=function(e){
					var event=ev.getEvent(e),rela=ev.getRelatedTarget(e),
						ad=cache.adsArray[index];

					index=this.insId;
					cache.adsArray[index].showWidget();
					show(this);


				};
				shop.onmouseout=function(e){
					instreet.leaveApp(e,this.insId,this);					
				};
				weibo.onmouseover=function(){
					index=this.insId;
					cache.adsArray[index].showWidget();
					show(this);
				};
				weibo.onmouseout=function(e){
					instreet.leaveApp(e,this.insId,this);
				};
				wiki.onmouseover=function(){
					index=this.insId;
					cache.adsArray[index].showWidget();
					show(this);
				};
				wiki.onmouseout=function(e){
					instreet.leaveApp(e,this.insId,this);
				};

			},
			hideApps  :function(){          //隐藏所有app
				hide(instreet.shop);
				hide(instreet.weibo);
				hide(instreet.wiki);
			},
			leaveApp  :function(e,index,app){
				var event=ev.getEvent(e),rela=ev.getRelatedTarget(event);
				var ad=cache.adsArray[index];	
				ad.hideWidget();
				hide(app);				
				if(!instreet.container.contains(rela)&&rela!==ad.img){
					ad.hideAd();
				}
			},
			recordImage:function(img){
	          var iu=encodeURIComponent(encodeURIComponent(img.src)),
			       pd=config.widgetSid,
				   pu=encodeURIComponent(encodeURIComponent(location.href)),
				   t=encodeURIComponent(encodeURIComponent(document.title)),
				   ul=config.ourl;

			  var time=new Date().getTime();   
			  ul+="?iu="+iu+"&pd="+pd+"&pu="+pu+"&t="+t+"&time="+time;
			  ev.importFile('js',ul);

			}


		};



		/***************************************
		*InstreetAd类
		***************************************/
		var InstreetAd=function(data){			
			var img=imgs[data.index];
			this.data=data;
			this.img=img;
			this.init();
		};
		InstreetAd.prototype={
			constructor:InstreetAd,
			init       :function(){
				var _this=this;
				_this.createAll();
				_this.locate();
				_this.bindEvents();
			},
			createAll  :function(){
				var _this=this,boxWrapper=document.createElement("div"),spotHolder=document.createElement("div");
				boxWrapper.className="instreet-box-wrapper";
				spotHolder.className="spot-holder";
				instreet.container.appendChild(boxWrapper);
				boxWrapper.appendChild(spotHolder);
				_this.boxWrapper=boxWrapper;
				_this.spotHolder=spotHolder;

				_this.createIconsHolder();
				_this.createSpots();
				_this.createAd();

			},
			locate  :function(){
				var _this=this,spots=_this.spotHolder.children,icons=_this.icons,ad=_this.ad,img=_this.img,pos=ev.getXY(img),
					icons_left,icons_top,imgW=img.offsetWidth,imgH=img.offsetHeight,pad=5;
					
				icons_left=config.position=="left"?pos.x+pad+"px":pos.x+imgW-icons.offsetWidth-pad+"px";
				icons_top=pos.y+imgH-icons.offsetHeight+"px";					
				icons.style.cssText="left:"+icons_left+";top:"+icons_top;

				for(var len=spots.length,i=0;i<len;i++){               //定位spot
					var spot=spots[i];
					var coor=_this.getCoor(spot);
					spot.style.cssText="top:"+coor.top+"px;left:"+coor.left+"px;";
				}
			},
			bindEvents :function(){
				var _this=this,box=_this.boxWrapper,icons=_this.icons,logo=icons.firstChild,img=_this.img,
					shareIcon=icons.lastChild.children[1],spotHolder=_this.spotHolder,ad=_this.ad;
				//box onclick
				box.onclick=function(e){
					var event=ev.getEvent(e),tar=ev.getTarget(event);
					if(tar.className=="icon-logo"){
						if(_this.stopMouseover){
							_this.showWidget();
							_this.stopMouseover=false;
						}else{
							_this.hideWidget();
							instreet.hideApps();
							_this.hideAd();
							_this.stopMouseover=true;
						}
					}else if(tar.parentNode.className.match("instreet-share-icons")){

				  		 var img=_this.img,data=_this.data,picUrl=encodeURIComponent(img.src),shareTo=tar.className.replace("instreet-",""),widgetSid=data.widgetSid,
				  		     url=encodeURIComponent(location.href),title=encodeURIComponent(document.title),				  		 	
				  		     recordUrl=config.surl+"?content=''&imgUrl="+picUrl+"&widgetSid="+widgetSid+"&pageUrl="+url+"&shareTo="+shareTo;
				  		 ev.importFile('js',recordUrl);  //record share click 
						 var winStr="toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=580, height=500";
						 switch(tar.className){
						    case "instreet-sina": 
							window.open('http://v.t.sina.com.cn/share/share.php?title='+title+'&url='+url+'&pic='+picUrl,"_blank",winStr);
	                        break;
	                        case "instreet-renren":
							window.open('http://share.renren.com/share/buttonshare.do?link='+url,"_blank",winStr);
							break;
	                        case "instreet-tx"   :
							window.open('http://share.v.t.qq.com/index.php?c=share&a=index&title='+title+'&url='+url+'&pic='+picUrl,"_blank",winStr);
							break;
						}
					}
				};

				//adbox onclick
				if(typeof ad!="undefined"){
					ad.onclick=function(e){
						var event=ev.getEvent(e),tar=ev.getTarget(event);
						if(tar.className=="button-close-ad"){
							_this.adClosed=false;
							_this.hideAd();
						}
					}
				};

				//box mouseover
				box.onmouseover=function(e){
					var event=ev.getEvent(e),rela=ev.getRelatedTarget(event);
					!_this.stopMouseover&&_this.showWidget();
					if(rela!==img){
						!_this.stopMouseover&&_this.showAd();
					}
				};
				//box mouseout
				box.onmouseout=function(e){
					var event=ev.getEvent(e),rela=ev.getRelatedTarget(event);
					_this.hideWidget();
					if(!instreet.container.contains(rela)&&rela!==img){
						_this.hideAd();
					}
				};

				//share icon mouseover
				shareIcon.onmouseover=function(){
					show(this.lastChild);
				};	
				//share icon mouseout
				shareIcon.onmouseout=function(){
					hide(this.lastChild);
				};	
				//img mouseover
				ev.bind(img,"mouseover",function(e){
					var event=ev.getEvent(e),rela=ev.getRelatedTarget(event);	
					!_this.stopMouseover&&_this.showWidget();			
					if(!instreet.container.contains(rela)){
						_this.recordShow(10);
						!_this.stopMouseover&&_this.showAd();
					}
				});
				//img mouseout
				ev.bind(img,"mouseout",function(e){
					var event=ev.getEvent(e),rela=ev.getRelatedTarget(event);
					_this.hideWidget();
				    !box.contains(rela)&&instreet.hideApps();
					if(!instreet.container.contains(rela)){
						_this.hideAd();
					}

				});
				//spotsHolder mouseover
				spotHolder.onmouseover=function(e){
					var event=ev.getEvent(e),tar=ev.getTarget(event);
					if(tar.className=="instreet-spot-shop"&&instreet.shop.display!=="block"){
						_this.recordShow(9,tar);
					}
					instreet.hideApps();
					_this.showApp(tar);

				};

				
			},
			createIconsHolder:function(){                      //创建尚街图标
				var div=document.createElement("div"),str='';
				div.className="icons-holder";
				str='<a class="icon-logo" href="javascript:;" title="尚街网"></a><dl class="tool-bar"><dd><a class="icon-meiding" target="-blank" href="http://www.imeiding.com?ufrom=ad"></a></dd><dd><a class="icon-share" href="javascript:;" title="分享"></a><div class="instreet-share-icons right" instreet-img-id="5"><a class="instreet-sina" title="分享到新浪微博" href="javascript:;"></a><a class="instreet-renren" href="javascript:;" title="分享到人人网"></a><a class="instreet-tx" title="分享到腾讯微博" href="javascript:;"></a></div></dd><dd><a class="icon-logo" href="javascript:;" title="尚街网"></a></dd></dl>';
				div.innerHTML=str;
				this.boxWrapper.appendChild(div);
				this.icons=div;
			},
			createSpots  :function(){                 //创建一张图片的所有spots
			  
			    var _this=this,container=instreet.container,data=_this.data,
				    index=parseInt(data.index),wrapper=_this.wrapper,w,
				    metrixArray=[],i,len,w,spot;
				if(config.showAd){               //创建adSpot	
					for(i=0,len=data.adsSpot.length;i<len;i++){
						var ad=data.adsSpot[i];
						metrixArray.push(parseInt(ad.metrix));						
					}
					metrixArray=ev.aTrim(metrixArray);            //数组去重
					for(i=0,len=metrixArray.length;i<len;i++){
						w=data.adsSpot[0].width;
						_this.createSpot({metrix:metrixArray[i],width:w},"shop");
					}
				}
				if(config.showWeibo){              //创建weiboSpot
					for(i=0,len=data.weiboSpot.length;i<len;i++){
						w=data.weiboSpot[0].width;
						_this.createSpot({metrix:data.weiboSpot[i].metrix,width:w},"weibo");
					}
				}
				if(config.showWiki){              //创建wikiSpot
					for(i=0,len=data.wikiSpot.length;i<len;i++){
						w=data.wikiSpot[0].width;
						_this.createSpot({metrix:data.wikiSpot[i].metrix,width:w},"wiki");
					}
				}			   			  
			
			},
			createSpot: function(obj,type){        //创建spot		    

			  if(type&&obj){
				   var spot=document.createElement('a');
				   spot.className="instreet-spot-"+type;
				   spot.href="javascript:;";
				   spot.metrix=obj.metrix;
				   spot.originWidth=obj.width;
				   this.spotHolder.appendChild(spot);
			   }
			    			
			},
			createAd :function(){
				var _this=this,data=_this.data,index=data.index,img=_this.img,
					pos=ev.getXY(img),height=img.offsetHeight,width=img.offsetWidth,
			   	   h=100,w=300,str='';
		        if(config.showFootAd&&data.badsSpot.length>0){   

				      var app=data.badsSpot[0],ad=document.createElement('div');
					  /*******change adstype******		  
					    footAd.adsType=2;
						footAd.adsPicUrl="http://ads.gumgum.com/com/vibrantmedia/mazda/mazda3.png";
						footAd.adsTitle="马自达6限时优惠活动进行中";
					 ***************/	
					  
					  ad.className='ad-holder';
					  str="<div class='ad-cont'><a class='button-close-ad'title='关闭' href='javascript:;'>×</a>";
					  if(app.adsType){
					  var redUrl=config.redurl+"?tty=0&mid="+(data.imageNumId||0)+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift=&at="+(app.adsType||'')+"&ad="+(app.adsId||'')+"&tg=&rurl="+encodeURIComponent(encodeURIComponent(app.adsLinkUrl||''));
					     if(app.adsType=='3'){							
							str+='<a href="'+redUrl+'" class="imgbox" target="_blank"><img class="adimg" src="'+app.adsPicUrl+'" alt=""/></a>';
						  }else if(app.adsType=='8'){
							 str+="<img src='"+app.adsPicUrl+"'  media-src='"+app.description+"' class='instreet-video-trigger' alt='' style='cursor:pointer;'/>";
						  }else if(app.adsType=='9'){
							 str+="<a href='"+redUrl+"' target='_blank'><embed wmode='transparent' width='300' height='100'  src='"+app.adsPicUrl+"' type='application/x-shockwave-flash'></embed></a>";
						  }else if(app.adsType=='2'){
						    h=35;
							w=width-32;
							var urlArr=app.adsPicUrl.split(','),pt=30;
							ad.setAttribute("width",w);
							ad.setAttribute("height",h+pt);
						    ad.style.cssText="width:"+w+"px;height:"+h+"px;left:"+pos.x+"px;top:"+(pos.y+height-h-pt)+"px;padding-top:30px;";     
						    if(w>375){
							str+="<a href='"+redUrl+"' class='black-bg' target='-blank'><img class='sprite1' src='"+(urlArr[0]||"")+"' alt=''/><span class='slogan'><p class='light'>"+footAd.adsTitle+"</p><p>更多精彩»</p></span></a>";
							}else{
							str+="<a href='"+redUrl+"' class='black-bg' target='-blank'><span class='slogan'><p class='light'>"+footAd.adsTitle+"</p><p>更多精彩»</p></span></a>";
							}
						  }
						  
					  }else if(!app.adsLinkUrl&&app.description){
						 var fra=app.description;
						 str+=fra.slice(0,-2)+'></iframe>';
					  }
					  str+="</div>";
					  ad.innerHTML=str;
				   	  _this.boxWrapper.appendChild(ad);
				   	  _this.ad=ad;
				}
			},
			getCoor  :function(spot){

                var _this=this,img=_this.img,
      				metrix=spot.metrix,ox=metrix%3000,
				    oy=Math.round(metrix/3000),w=spot.originWidth,zoomNum=img.width/w,
				    x=ox*zoomNum,y=oy*zoomNum,pos=ev.getXY(img);	

				return {top:(y+pos.y),left:(x+pos.x)};	
                
			},
			showWidget    :function(){
				var _this=this,spots=_this.spotHolder,icons=_this.icons;
				show(icons.lastChild);
				show(spots.children);
				icons.style.zIndex=100000;
			},
			hideWidget    :function(){
				var _this=this,spots=_this.spotHolder,icons=_this.icons;
				hide(icons.lastChild);
				hide(spots.children);
				icons.style.zIndex=99999;
			},
			showAd        :function(){
				var _this=this,ad=_this.ad,img=_this.img,pos=ev.getXY(img),
					imgW=img.offsetWidth,imgH=img.offsetHeight;
				if(ad&&ad.style.display!="block"){
					show(ad);
					var adW=parseInt(ev.getStyle(ad.lastChild,"width")),adH=100;
	
					ad.style.cssText="display:block;left:"+(pos.x+(imgW-adW)/2)+"px;top:"+(pos.y+imgH-adH)+"px;width:"+adW+"px;height:"+adH+"px";
					if(!_this.slider){  //如果不存在slider对象则初始化一个
						_this.adClosed=true;
						_this.slider=new slider(ad.lastChild);
					}
					if(_this.adClosed){
						_this.slider.stop();
						_this.slider.slideDown();
					}

				}
			},
			hideAd       :function(){
				var _this=this,ad=_this.ad;
				if(ad&&ad.style.display=="block"){
					_this.slider.stop();
					_this.slider.slideUp(function(){hide(ad);_this.adClosed=true;});
				}
			},
			showApp         :function(tar){
				var _this=this,data=_this.data,cn=tar.className,appBox,
					metrix=tar.metrix,str="",
					// pos=ev.getXY(tar),
					pos={x:parseInt(tar.style.left),y:parseInt(tar.style.top)},
					size=25;

				str+="<h2 class='cont-head'><a class='button-close-holder' href='javascript:;' title='关闭'></a></h2>";	
				switch(cn){
					case "instreet-spot-shop":
					appBox=instreet.shop;
					appBox.style.cssText="left:"+(pos.x+size)+"px;top:"+(pos.y+size)+"px;display:block";//显示该app
					var adId=0;
					if(appBox.metrix==metrix)
						return;

					appBox.metrix=metrix;
					appBox.insId=_this.img.insId;   //标记app属于哪张图片
				    for(var i=0,len=data.adsSpot.length;i<len;i++){
					    var app=data.adsSpot[i],						
						    redUrl=config.redurl+"?tty=0&mid="+app.imageNumId+"&muh="+data.imageUrlHash+"&pd="+app.widgetSid+"&ift=&tg=&at="+app.adsType+"&ad="+app.adsId+"&rurl="+encodeURIComponent(encodeURIComponent(app.adsLinkUrl));
					    if(app.metrix==metrix){
                            f=adId?'':'instreet-shop-focus';	
                            if(adId){
							   str+="<a class='instreet-slider-left' href='javascript:;' title='上一个商品'></a><a title='下一个商品' class='instreet-slider-right' href='javascript:;'></a>";
							}							
							str+="<div class='cont-body' id='"+f+"' adsid='"+app.adsId+"' index='"+adId+"'><div class='left'><a class='thumb' target='-blank' href='"+redUrl+"' title='"+app.adsTitle+"'><img src='"+app.adsPicUrl+"'/></a></div><div class='right'><p class='p-desc'><a target='-blank' href='"+redUrl+"'>"+app.adsTitle+"</a></p>";
							str+="<p class='p-money'>原价：<strong>"+app.adsPrice+"</strong></p><p class='p-nowmoney'>现价：<strong>"+(app.adsDiscount||app.adsPrice)+"</strong></p>";
							str+="<p class='p-buyit'><a class='button-buy' href='"+redUrl+"' target='-blank'></a></p></div><div class='clear'></div></div>";
							adId++;
					    }
					 }
					appBox.innerHTML=str;					
					break;

					case "instreet-spot-weibo":
					appBox=instreet.weibo;
					appBox.style.cssText="left:"+(pos.x+size)+"px;top:"+(pos.y+size)+"px;display:block";//显示该app
					if(appBox.metrix==metrix)
						return;
					appBox.metrix=metrix;
					appBox.insId=_this.img.insId; 
				    for(var i=0,len=data.weiboSpot.length;i<len;i++){
				     var app=data.weiboSpot[i],
					     title=app.title,
						 nickName=app.nickName,
						 icon=app.icon,
						 avatar=app.avatar,
						 latestStatus=app.latestStatus,
					     redUrl=config.redurl+"?tty=1&mid="+data.imageNumId+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+app.type+"&at=&ad=&tg="+encodeURIComponent(encodeURIComponent(title))+"&rurl="+encodeURIComponent(encodeURIComponent(app.userUrl));
					if(app.metrix==metrix){
					  str+="<div class='cont-body'><div class='left'><a class='thumb' target='-blank' href='"+redUrl+"' title='"+nickName+"'><img src='"+avatar+"'/></a></div><div class='right'><p class='summary'><a class='nickname' target='-blank' href='"+redUrl+"'>"+nickName+"</a>："+latestStatus+"</p><p class='icon'><a target='-blank' href='"+redUrl+"' title='微博'><img src='"+icon+"'/></a></p></div><div class='clear'></div></div>";
				    }
				   }
				   appBox.innerHTML=str;
				   break;

				   case "instreet-spot-wiki":
				   appBox=instreet.wiki;
				   appBox.style.cssText="left:"+(pos.x+size)+"px;top:"+(pos.y+size)+"px;display:block";//显示该app
					if(appBox.metrix==metrix)
						return;
					appBox.metrix=metrix;
					appBox.insId=_this.img.insId; 
   				    for(var i=0,len=data.wikiSpot.length;i<len;i++){
				     var app=data.wikiSpot[i],
					     title=app.title,
						 firstimg=app.firstimg,
						 summary=app.summary,
					     redUrl=config.redurl+"?tty=1&mid="+data.imageNumId+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+app.type+"&at=&ad=&tg="+encodeURIComponent(encodeURIComponent(title))+"&rurl="+encodeURIComponent(encodeURIComponent(app.url));
				     if(app.metrix==metrix){
					 str+="<div class='cont-body'><div class='left'><a class='thumb' target='-blank' href='"+redUrl+"' title='"+title+"'><img src='"+firstimg+"'/></a></div><div class='right'><p><a class='nickname' target='-blank' href='"+redUrl+"'>"+title+"</a></p><p class='summary'>"+summary+"</p><p class='icon'><a target='-blank' href='"+redUrl+"' title='互动百科'><img src='http://static.instreet.cn/widgets/push/images/icon-baike.png'/></a></p></div><div class='clear'></div></div>";
					 }
				   }
				   appBox.innerHTML=str;
				   break;
				
				}


			},
		   //鼠标移动到图片的时候发送展现记录
		   recordShow: function(flag,spot){  

		       var _this=this,data=_this.data,img=_this.img,
				   ul=config.iurl,pd=data.widgetSid,muh=data.imageUrlHash,
				   iu=encodeURIComponent(encodeURIComponent(img.src));
				var adsId="",adsType="";
				if(flag==9&&spot){
					var metrix=spot.metrix;
					for(var i=0,len=data.adsSpot.length;i<len;i++){
						var app=data.adsSpot[i];
						if(app.metrix==metrix){
							adsId+=adsId==""?app.adsId:","+app.adsId;
							adsType+=adsType==""?app.adsType:","+app.adsType;
						}
					}
				}

				var time=new Date().getTime();  
				ul+="?pd="+pd+"&muh="+muh+"&iu="+iu+"&ad="+adsId+"&at="+adsType+"&flag="+flag+"&time="+time;
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
					   tty=1;
                    var cn=tar.className.replace("-holder");
                    if(cn=="shop"){
                       
					   ad=data.adsSpot[index].adsId;
					   at=data.adsSpot[index].adsType;
					   tty=0;
					}else if(cn=="weibo"){
					   ift=2;
					   tg=data.weiboSpot[index].title||'';
					}else if(cn=="wiki"){
					   ift=4;
					   tg=data.wikiSpot[index].title||'';
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
					ul+="?iu="+iu+"&pd="+pd+"&muh="+muh+"&ad="+ad+"&mid="+mid+"&at="+at+"&tty="+tty+"&ift="+ift+"&tg="+tg+"&time="+time;				
					ev.importFile('js',ul);				
			}

		};






		/*********************************
		*jsonp callback
		**********************************/
		window['insjsonp']=function(data){
			if(data){
			  var index=data.index,img=imgs[index];
			  // cache.dataArray[index]=data;
			  // cache.avaImages.push(img);
			  img.setAttribute('instreet-data-ready',true);
			  cache.adsArray[index]=new InstreetAd(data);
			}
				
		};
		
		
		/*********************************
		*Mix config
		**********************************/
		var mixConfig=function(c){
		   if(c&&typeof c=="object"){
		   
		     for(var i in c){
			    config[i]=c[i];
			 }
		   
		   }else{
		     return;		   
		   }
		
		};
		
		
        //插件初始化
        var init=function(){
			typeof instreet-config!='undefined'&&mixConfig(instreet-config);
			instreet.init();
		    cache.initData();
		
		};		
		
		document.DomReady(function(){
            init();
		});
		
 })(window);	
		
	