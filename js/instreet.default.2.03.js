(function(window,undefined){
        
		if (typeof(window.InstreetWidget) != "undefined" || (window.InstreetWidget != null)){
			return null;
		} else {
			window.InstreetWidget = {
				version : "2.0.3",
		        name    : "InstreetWidget"
			}; 
		}

	   var document = window.document,
		   navigator = window.navigator,
		   location = window.location,
		   imgs=[],
           readylist=[],
           urlPrefix="",
           config = {
						redurl	:	"http://www.instreet.cn/click.action",
					//widgetSid	:	"79cjp47BnLo3NdNaLeICIw",
					//widgetSid   :   "77WCO3MnOq5GgvoFH0fbH2",
						cssurl 	:	"http://static.instreet.cn/widgets/push/css/instreet_default.css",
					ocssurl		:	"http://static.instreet.cn/widgets/push/css/InstreetWidget_ifeng.css",
					callbackurl	:	"http://ts.instreet.cn:90/push.action",
						murl	:	"http://ts.instreet.cn:90/tracker.action",
						iurl    :	"http://ts.instreet.cn:90/tracker8.action",
						ourl	:	"http://ts.instreet.cn:90/loadImage.action",
						imih	:	290,
						imiw	:	290,
						timer   :   1000,
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
				findByAttr:function(arr,attr,val){
				    var res=[];
				    if(arr){
					   for(var i=0,len=arr.length;i<len;i++){
					      var item=arr[i];
						  if(item.getAttribute(attr)==val.toString()){
						      res.push(item);
						  }
					   
					   }
					   
					}
					return res;				
				},
				show   :function(ele){
				    ele.style.display='block';
				},
				hide   :function(ele){
				   ele.style.display='none';
				},
				hasClass:function(obj,c){
				   if(obj&&obj.className){
				      var reg=new RegExp(c);

				      return reg.test(obj.className);
				   }
				   return false;
				}
		    },
			$=function(id){return document.getElementById(id);};
        
        
        var readylist=[],
			run = function () {   
				for (var i = 0; i < readylist.length; i++) readylist[i]&&readylist[i]();   
			},
		    doScrollCheck=function(){
			  try {   
					document.documentElement.doScroll('left');   
					 
			  }catch (err){   
					setTimeout(doScrollCheck, 1); 
                    return;					
			  }  
			  run();  
			};	
		document.ready = function (fn){  
                var isIE = !!window.ActiveXObject;
                if(document.readyState==="complete") {readylist.push(fn);run();return;}				
				if (readylist.push(fn) > 1) return; 	
				if (document.addEventListener)  			
				return document.addEventListener('DOMContentLoaded', run, false);   

				if (isIE) {   
                     doScrollCheck();
			    }  
						  

		}; 

		   
		/******video********/
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
				 e.className="instreet_video_wrap";
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
			    var _this=this,container=$('INSTREET_CONTAINER'),wrap=this.container,str,pos=ev.getXY(_this.img),w=_this.img.width,padTop=Math.round(_this.img.height-_this.height)/2<0?0:Math.round(_this.img.height-_this.height)/2,h=_this.img.height-padTop;
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

		var slideDown=function(ele,speed){
		
		    var slider=function(ele, speed){
			    
				this.ele=ele;
				this.speed=speed||500;
				this.flag=null;

				
				var height=this.ele.offsetHeight;
				this.ele.style.display ="block";										
				this.ele.style.marginTop=height+'px';
									
			};
			slider.prototype.animate=function(){
			   var _this=this, ele=_this.ele,speed=_this.speed,
				   startTime=new Date().getTime();
			   var	loop=function(){
				   var p=(new Date().getTime()-startTime)/speed,
					   swing=((Math.cos(p*Math.PI)/2) + 0.5);
					ele.style.marginTop=Math.floor(ele.offsetHeight*swing)+'px';				
					if (p<=1) {
					    clearTimeout(_this.flag);
						_this.flag=setTimeout(loop,10);
					}				
					
				};
				loop();
			
			};
			slider.prototype.stop=function(){
			   clearTimeout(this.flag);
			};
			return new slider(ele, speed);
		};
		
		/********************************
		*cache对象，加载广告数据
		********************************/
		var cache={
		    dataArray  :[],
			avaImages  :[],
			adsArray   :[],
	        initData   :function(){
			    
			   for(var i=0,len=imgs.length;i<len;i++){
			   	  var img=imgs[i];
			   	  img.insId=i;img.setAttribute("instreet_img_id",i);
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
					 IMG.onload=function(){					   
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
						   cache.createJsonp(clientImg);
						   instreet.recordImage(clientImg);
					    }
					}
			   }

			},
			createJsonp  :function(img){
			   var iu=encodeURIComponent(encodeURIComponent(img.src)),url=config.callbackurl+"?index="+img.insId+"&pd="+config.widgetSid+"&iu="+iu+"&callback=insjsonp";
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
			    var cssUrl=config.cssurl;
				//var cssUrl='css/instreet_default.css';
				ev.importFile('css',cssUrl);
				this.getImgs();
				instreet.createContainer();
				widgetBox=new WidgetsBox();
				//this.bindEvents();
								
			},
			createContainer: function(){						//创建广告容器
		       var container=document.createElement('div');        
			   container.id="INSTREET_CONTAINER";
			   instreet.container=container;
			   document.body.insertBefore(container,document.body.firstChild);				
			},
			dataReady:function(data){       //图片数据请求完成后所执行的方法
				var c=$('INSTREET_CONTAINER'),icon_holder=this.createIcons(data),
				    iconW=ev.$(c,'div','icon_wrapper')[0],fw=ev.$(c,null,'foot_wrapper')[0],share_icons=ev.$(icon_holder,null,'instreet_share_icons')[0];
				iconW&&iconW.appendChild(icon_holder);
				instreet.createSpots(data);
				var foot=instreet.createFootAd(data);
				if(foot){fw.appendChild(foot);}
				
				
				icon_holder.onmouseover=function(){var tool=ev.$(this,null,'tool_bar')[0];tool&&(tool.style.display='block');};     //iconholder上的鼠标事件
				icon_holder.onmouseout=function(eve){var tool=ev.$(this,null,'tool_bar')[0]; tool&&(tool.style.display='none');
						var event=ev.getEvent(eve),
							rel=ev.getRelatedTarget(event),
							index=this.getAttribute('instreet_img_id');
							
					   if(rel&&rel.tagName=='IMG'&&rel.getAttribute('instreet_img_id')==index){  
						  return;
					   }else{
					    if(foot&&config.triggerFootAd=="mouse"){              //处于"mouse"触发模式时，鼠标离开底部广告 底部隐藏
						   ev.hide(foot.firstChild);
						  }
					   }
				};
				share_icons.onmouseover=function(){this.previousSibling.className+=' hover'; ev.show(this);};
				share_icons.onmouseout=function(){this.previousSibling.className='icon_share'; ev.hide(this);};
				if(foot){
					foot.onmouseover=function(e){
						ev.show(this.firstChild); 
					    c.setAttribute('instreet_img_id',this.getAttribute('instreet_img_id'));  //鼠标移动到底部广告时修改container的instreet_img_id属性

					    var event=ev.getEvent(e),			//底部广告鼠标事件,会统计用户鼠标移动到底部广告的行为
							rela=ev.getRelatedTarget(event),
							tar=ev.getTarget(event);
							if(!this.contains(rela)){
							   instreet.recordAction(this);							
							}
					};                      
					foot.onmouseout=function(eve){			  
						var event=ev.getEvent(eve),
							rel=ev.getRelatedTarget(event),
							index=this.getAttribute('instreet_img_id');
					   if(config.triggerFootAd=="mouse"){	 
						   if(rel&&rel.tagName=='IMG'&&rel.getAttribute('instreet_img_id')==index){
							  return;
						   }else{
							  ev.hide(this.firstChild);
						   }
					    }
					    instreet.hideAll(index);
					};
					instreet.lazyTrigger();
				 }
			},
			getImgs:function(){		
			
				  var images=document.getElementsByTagName('img'),img;
				  for(var i=0,len=images.length;i<len;i++){
					  img=images[i];
					//if(img.style.display!='none'&&img.style.visibility!='hidden'){
					  img.setAttribute('instreet_img_id',i);
					  imgs[i]=img;
					//}
				  }		   
			},
		    recordImage:function(img){                                //页面加载的时候向服务器发送页面中的所有图片
		       var iu=encodeURIComponent(encodeURIComponent(img.src)),
			       pd=config.widgetSid,
				   pu=encodeURIComponent(encodeURIComponent(location.href)),
				   t=encodeURIComponent(encodeURIComponent(document.title)),
				   ul=config.ourl;

				  ul+="?iu="+iu+"&pd="+pd+"&pu="+pu+"&t="+t;
				  ev.importFile('js',ul);
			   
		    },
		    recordImgAction:function(index){                           //记录鼠标移动到图片上的行为
		       var data=cache.dataArray[index],img=imgs[index],
				   ul=config.iurl,pd=data.widgetSid,muh=data.imageUrlHash,
				   iu=encodeURIComponent(encodeURIComponent(img.src));
				   
				ul+="?pd="+pd+"&muh="+muh+"&iu="+iu;
				ev.importFile('js',ul);
		   
		    },
		    recordAction:function(tar){                        //记录用户浏览广告信息的行为
		       
			   var index=tar.parentNode.parentNode.parentNode.parentNode.getAttribute('instreet_img_id')||tar.parentNode.parentNode.getAttribute('instreet_img_id');

			   if(index!=undefined){
				   var data=cache.dataArray[index],
					   img=imgs[index],
					   iu=encodeURIComponent(encodeURIComponent(img.src)),
					   pd=data.widgetSid,
					   ul=config.murl,
					   mid=data.imageNumId||'',
					   muh=data.imageUrlHash,
					   ad='',at='',ift=0,tty=1;

			        if(tar.className.match("weibo_holder")){
					    ift=2;
					}
					else if(tar.className.match("wiki_holder")){
					    ift=4;
					}
					else if(tar.className.match("foot_holder")){
					   ad=data.badsSpot[0].adsId;
					   at=data.badsSpot[0].adsType;
					}
					else if(tar.id="instreet_ads_focus"){
					    ad=tar.getAttribute("adsid");
                        at=1;
						tty=0;
					}
					   
					ul+="?iu="+iu+"&pd="+pd+"&muh="+muh+"&ad="+ad+"&mid="+mid+"&at="+at+"&tty="+tty+"&tg=&ift="+ift;				
					ev.importFile('js',ul);
			    }
		    },
			createHolder:function(){         //创建插件容器
			    var holder=document.createElement("div"),
				    adBox="<div class='ads_wrapper'><div class='ads_holder'></div><div class='weibo_holder'></div><div class='wiki_holder'></div></div>",
					spotBox="<div class='spot_wrapper'></div>",
					footBox="<div class='foot_wrapper'></div>",
					iconBox="<div class='icon_wrapper'></div>";
				holder.id="INSTREET_CONTAINER";
				
				document.body.appendChild(holder);
			    holder.innerHTML=adBox+footBox+spotBox+iconBox;
			},

			createIcons:function(data){        //创建icons
			   if(data){
			    var index=parseInt(data.index),
				    img=imgs[index],
				    pos=ev.getXY(img),
				    width=img.width,
					height=img.height,
					str='',
					pad=30,
					top=pos.y+height-pad,
					left,
					icon=document.createElement("div");
				left=config.position==='right'?pos.x+width-pad:pos.x+2;
				
				
                icon.className="instreet_icons_holder";
				icon.setAttribute('instreet_img_id',index);
				icon.style.cssText="left:"+left+"px;top:"+top+"px;";					
				str="<a title='尚街网' instreet_img_id='"+index+"' class='icon_logo' href='javascript:;'></a><dl class='tool_bar'><dd><a href='http://www.imeiding.com' target='_blank' class='icon_setting'></a></dd><dd><a title='分享' href='javascript:;' class='icon_share'></a><div instreet_img_id='"+index+"' class='instreet_share_icons "+config.position+"'>";
				str+="<a class='instreet_sina'href='javascript:;'title='分享到新浪微博'></a><a title='分享到人人网' href='javascript:;' class='instreet_renren'></a><a href='javascript:;' title='分享到腾讯微博' class='instreet_tx'></a></div></dd><dd><a instreet_img_id='"+index+"' title='尚街网' href='javascript:;' class='icon_logo_hover'></a></dd></dl>";
				icon.innerHTML=str;
			    return icon;
				}
			},
			createSpots:function(data){                 //创建一张图片的所有spot
			   if(data){
			    var container=$('#INSTREET_CONTAINER'),spotW=ev.$(container,null,'spot_wrapper')[0],
				    index=parseInt(data.index),adArr=[],i,len,w,spot;
				if(config.showAd){	
					for(i=0,len=data.adsSpot.length;i<len;i++){
						var ad=data.adsSpot[i];
						adArr.push(parseInt(ad.metrix));						
					}
					adArr=ev.aTrim(adArr);
					for(i=0,len=adArr.length;i<len;i++){
						w=data.adsSpot[0].width;
						spot=this.createSpot({metrix:adArr[i],width:w,adsType:true},index);
						spotW.appendChild(spot);
					}
				}
				if(config.showWeibo){
					for(i=0,len=data.weiboSpot.length;i<len;i++){
						spot=this.createSpot(data.weiboSpot[i],index);
						spotW.appendChild(spot);
					}
				}
				if(config.showWiki){
					for(i=0,len=data.wikiSpot.length;i<len;i++){
						spot=this.createSpot(data.wikiSpot[i],index);
						spotW.appendChild(spot);
					}
				}
			   
			   }
			
			},
			createSpot:function(data,index){        //创建spot
			   if(data){
			    
			   var pos=this.getPosition(data,index),
			       top=pos.top,left=pos.left,r=11.5;

			   var spot=document.createElement('a');
			   if(data.adsType)
			      spot.className="instreet_spot_ads";
			   else if(data.type==1||data.type==2)  
			      spot.className="instreet_spot_weibo";
			   else if(data.type==4)
  			      spot.className="instreet_spot_wiki";
			   spot.href="javascript:;";
			   spot.setAttribute('metrix',data.metrix);
			   spot.setAttribute('instreet_img_id',index);
			   spot.setAttribute('width',data.width);
			   spot.style.cssText="top:"+(top-r)+"px;left:"+(left-r)+"px;";
			   return spot;
			    
				}
			
			},
			createHolderContent:function(spot){                  //创建广告、微博、wiki内容
			    var cont=document.createElement("div"),index=spot.getAttribute('instreet_img_id'),
				    img=imgs[index],data=cache.dataArray[index],str='',metrix=spot.getAttribute('metrix');

					str+="<h2 class='cont_head'><a class='button_close_holder' href='javascript:;' title='关闭'></a></h2>";
			    switch(spot.className){
				   case "instreet_spot_ads":
				     var adId=0,f='';
					 for(var i=0,len=data.adsSpot.length;i<len;i++){
					    var ad=data.adsSpot[i],
						
						    redUrl=config.redurl+"?tty=0&mid="+ad.imageNumId+"&muh="+data.imageUrlHash+"&pd="+ad.widgetSid+"&ift=&tg=&at="+ad.adsType+"&ad="+ad.adsId+"&rurl="+encodeURIComponent(encodeURIComponent(ad.adsLinkUrl));;
					    if(ad.metrix==metrix){
                            f=adId?'':'instreet_ads_focus';	
                            if(adId){
							   str+="<a class='instreet_slider_left' href='javascript:;' title='上一个商品'></a><a title='下一个商品' class='instreet_slider_right' href='javascript:;'></a>";
							}							
							str+="<div class='cont_body' id='"+f+"' adsid='"+ad.adsId+"' index='"+adId+"'><div class='left'><a class='thumb' target='_blank' href='"+redUrl+"' title='"+ad.adsTitle+"'><img src='"+ad.adsPicUrl+"'/></a></div><div class='right'><p class='p_desc'><a target='_blank' href='"+redUrl+"'>"+ad.adsTitle+"</a></p>";
							if(ad.adsDiscount){
							   str+="<p class='p_money'>原价：<strong>"+ad.adsPrice+"</strong></p><p class='p_nowmoney'>现价：<strong>"+ad.adsDiscount+"</strong></p>";
							}else{
							   str+="<p class='p_money'>价格：<strong>"+ad.adsPrice+"</strong></p>";
							}
							str+="<p class='p_buyit'><a class='button_buy' href='"+redUrl+"' target='_blank'></a></p></div><div class='clear'></div></div>";
							adId++;
					   }
					 }
				   break;
				   case "instreet_spot_weibo":				   
				   for(var i=0,len=data.weiboSpot.length;i<len;i++){
				     var Data=data.weiboSpot[i],
					     title=Data.title,
						 nickName=Data.nickName,
						 icon=Data.icon,
						 avatar=Data.avatar,
						 latestStatus=Data.latestStatus,
					     redUrl=config.redurl+"?tty=1&mid="+data.imageNumId+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+Data.type+"&at=&ad=&tg="+encodeURIComponent(encodeURIComponent(title))+"&rurl="+encodeURIComponent(encodeURIComponent(Data.userUrl));
					if(Data.metrix==metrix){
					  str+="<div class='cont_body'><div class='left'><a class='thumb' target='_blank' href='"+redUrl+"' title='"+nickName+"'><img src='"+avatar+"'/></a></div><div class='right'><p class='summary'><a class='nickname' target='_blank' href='"+redUrl+"'>"+nickName+"</a>："+latestStatus+"</p><p class='icon'><a target='_blank' href='"+redUrl+"' title='微博'><img src='"+icon+"'/></a></p></div><div class='clear'></div></div>";
				    }
				   }
				   
				   break;
				   case "instreet_spot_wiki":
				   for(var i=0,len=data.wikiSpot.length;i<len;i++){
				     var Data=data.wikiSpot[i],
					     title=Data.title,
						 firstimg=Data.firstimg,
						 summary=Data.summary,
					     redUrl=config.redurl+"?tty=1&mid="+data.imageNumId+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+Data.type+"&at=&ad=&tg="+encodeURIComponent(encodeURIComponent(title))+"&rurl="+encodeURIComponent(encodeURIComponent(Data.url));
				     if(Data.metrix==metrix){
					 str+="<div class='cont_body'><div class='left'><a class='thumb' target='_blank' href='"+redUrl+"' title='"+title+"'><img src='"+firstimg+"'/></a></div><div class='right'><p><a class='nickname' target='_blank' href='"+redUrl+"'>"+title+"</a></p><p class='summary'>"+summary+"</p><p class='icon'><a target='_blank' href='"+redUrl+"' title='互动百科'><img src='http://static.instreet.cn/widgets/push/images/icon_baike.png'/></a></p></div><div class='clear'></div></div>";
					 }
				   }
				   break;
				
				}	
			  cont.innerHTML=str;
			  return cont;
			},
		    createFootAd:function(data){                     //创建底部广告
			   var index=data.index,img=imgs[index],pos=ev.getXY(img),height=img.height,width=img.width,
			   	   h=100,w=300,c=$('INSTREET_CONTAINER'),str='';
		        if(data.badsSpot.length>0&&config.showFootAd){   

				      var footAd=data.badsSpot[0],foot=document.createElement('div');
					  /*******change adstype******		  
					    footAd.adsType=2;
						footAd.adsPicUrl="http://ads.gumgum.com/com/vibrantmedia/mazda/mazda3.png";
						footAd.adsTitle="马自达6限时优惠活动进行中";
					 ***************/	
					  
					  foot.className='foot_holder';
					  foot.setAttribute('instreet_img_id',index);

					  foot.style.cssText="top:"+(pos.y+height-h)+'px;left:'+(pos.x+(width-w)/2)+'px';

					  str="<div class='foot_cont'><a class='button_close_foot'title='关闭' href='javascript:;'></a>";
					  if(footAd.adsType){
					  var redUrl=config.redurl+"?tty=0&mid="+(data.imageNumId||0)+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift=&at="+(footAd.adsType||'')+"&ad="+(footAd.adsId||'')+"&tg=&rurl="+encodeURIComponent(encodeURIComponent(footAd.adsLinkUrl||''));
					     if(footAd.adsType=='3'){							
							str+="<a href='"+redUrl+"' target='_blank'><img src='"+footAd.adsPicUrl+"' alt=''/></a>";
						  }else if(footAd.adsType=='8'){
							 str+="<img src='"+footAd.adsPicUrl+"' instreet_img_id='"+index+"' media_src='"+footAd.description+"' class='instreet_video_trigger' alt='' style='cursor:pointer;'/>";
						  }else if(footAd.adsType=='9'){
							 str+="<a href='"+redUrl+"' target='_blank'><embed wmode='transparent' width='300' height='100'  src='"+footAd.adsPicUrl+"' type='application/x-shockwave-flash'></embed></a>";
						  }else if(footAd.adsType=='2'){
						    h=35;
							w=width-32;
							var urlArr=footAd.adsPicUrl.split(','),pt=30;
							foot.setAttribute("width",w);
							foot.setAttribute("height",h+pt);
						    foot.style.cssText="width:"+w+"px;height:"+h+"px;left:"+pos.x+"px;top:"+(pos.y+height-h-pt)+"px;padding-top:30px;";     
						    if(w>375){
							str+="<a href='"+redUrl+"' class='black_bg' target='_blank'><img class='sprite1' src='"+(urlArr[0]||"")+"' alt=''/><span class='slogan'><p class='light'>"+footAd.adsTitle+"</p><p>更多精彩»</p></span></a>";
							}else{
							str+="<a href='"+redUrl+"' class='black_bg' target='_blank'><span class='slogan'><p class='light'>"+footAd.adsTitle+"</p><p>更多精彩»</p></span></a>";
							}
						  }
						  
					  }else if(!footAd.adsLinkUrl&&footAd.description){
						 var fra=footAd.description;
						 str+=fra.slice(0,-2)+'></iframe>';
					  }
					  str+="</div>";
					  
					  //if(!config.openFootAd){
					    foot.style.display="none";
					  //}
					  foot.innerHTML=str;
					  return foot;
				   
				}
				return null;
			},
			getPosition:function(data,index){
			    var img=imgs[index],metrix=data.metrix,ox=metrix%3000,
				    oy=Math.round(metrix/3000),w=data.width,zoomNum=img.width/w,
				    x=ox*zoomNum,y=oy*zoomNum,pos=ev.getXY(img);	

				return {top:(y+pos.y),left:(x+pos.x)};	
			
			},
			eventDelegate:function(eve){               //所有的事件接口
			    var event=ev.getEvent(eve),
					target=ev.getTarget(event),
					type=event.type,
					c=target.className;

				if(target.tagName==='IMG'&&target.getAttribute('instreet_data_ready')){
				
					instreet.imgEvent(event);	
					
				}else if(c=='instreet_spot_ads'||c=='instreet_spot_weibo'||c=='instreet_spot_wiki'){
				
				    instreet.spotEvent(event);
							
				}
				else if(c=='instreet_slider_left'||c=='instreet_slider_right'||c=='button_close_holder'||c=='button_close_foot'||c=='instreet_video_trigger'){
				    instreet.otherEvent(event);
				
				}
				
				//else if((target.className==='icon_logo'&&target.parentNode.className==='instreet_icons_holder')||(target.className==='icon_logo_hover'||ev.hasClass(target,'icon_share')&&target.parentNode.tagName==='DD')){
				
				    instreet.iconEvent(event);
				
				//}
				
				
		    },
			otherEvent:function(event){       
			  var	target=ev.getTarget(event),
					type=event.type,
					container=$('INSTREET_CONTAINER'),
					c=target.className;
			   if(type==='click'){
			       if(c=='button_close_holder'){
                      ev.hide(target.parentNode.parentNode.parentNode);
				   
				   }else if(c=='button_close_foot'){
				      var fo=target.parentNode.parentNode;
					  ev.hide(fo);
					  fo.className='foot_holder_noshow';
				   }else if(c=='instreet_video_trigger'){
				      var index=target.getAttribute('instreet_img_id'),img=imgs[index],src=target.getAttribute('media_src'),v=new video({img:img,src:src});
					  v.watch();
				   }
				   else{
				       var conts=ev.$(target.parentNode,null,'cont_body '),
					       length=conts.length,
					       focus=$('instreet_ads_focus'),
						   index=parseInt(focus.getAttribute('index')),next;
						   function go(num){
						      var cont;
						      ev.hide(focus);focus.id='';
							  cont=ev.findByAttr(conts,'index',num)[0];
							  ev.show(cont);
							  cont.id='instreet_ads_focus';
						   };
						   
				       if(c=="instreet_slider_left"){

						   if(index>0)
						       next=index-1;
							else
					           next=length-1;
												      
							go(next);   
					   }else{

						   if(index<(length-1))
						       next=index+1;
							else
					           next=0;
					        go(next);
					   }
					  
				   
				   }
			    }
			
			
			},
            spotEvent:function(event){           //和spot有关的事件
				var	target=ev.getTarget(event),
					type=event.type,
					container=$('INSTREET_CONTAINER'),
					c=target.className,
					index=target.getAttribute('instreet_img_id'),
					spotOver=function(s,h){
                       	  var pos=ev.getXY(s),r=24;			  
						  if(s.id=='instreet_spot_focus'){	
							   h.style.cssText="top:"+(pos.y+r)+"px;left:"+(pos.x+r)+"px";
							   ev.show(h);						 
						  }
						  else{
							  var spot_focus= $('instreet_spot_focus');
                              if(spot_focus){
							    var regExp=b=/(\w+)_(\w+)_(\w+)/g,result=regExp.exec(spot_focus.className),fName=result[3]+'_holder',
								    fh=ev.$(container,null,fName)[0];

								spot_focus.id='';
								ev.hide(fh);
							  }							  																  
							  s.id='instreet_spot_focus';

							  h.style.cssText="top:"+(pos.y+r)+"px;left:"+(pos.x+r)+"px";
							  cont=instreet.createHolderContent(s),
							  h.innerHTML='';
							  h.appendChild(cont);
			
						  }

					};
			   if(type==='mouseover'){

					switch(c){
					  case "instreet_spot_ads":
					  var adHolder=ev.$(container,null,'ads_holder')[0];
					  spotOver(target,adHolder);

					  break;
					  case "instreet_spot_weibo":
					  var weiboHolder=ev.$(container,null,'weibo_holder')[0];
					  spotOver(target,weiboHolder);

					  break;
					  case "instreet_spot_wiki":
					  var wikiHolder=ev.$(container,null,'wiki_holder')[0];
					  spotOver(target,wikiHolder);
	
					  break;
					
					}				  
				  
				}
			
			},
			iconEvent:function(event){              //和icon有关的事件
				var	target=ev.getTarget(event),
					type=event.type,
					container=$('INSTREET_CONTAINER'),
					c=target.className;

				if(type==='click'){

					  if(c==='icon_logo'){
						  target.nextSibling.className='tool_bar';
						  target.nextSibling.style.display='block';
						  var index=target.getAttribute('instreet_img_id'),spots=instreet.findSpotsByImg(index);
						  
						  if(spots){
						     for(var i=0,len=spots.length;i<len;i++){
							    ev.show(spots[i]);
							 }
						   }
						   imgs[index].setAttribute('showAd',true);
					  }else if(c==='icon_logo_hover'){
				      
					   var toolbar=target.parentNode.parentNode,index=target.getAttribute('instreet_img_id'),spots=instreet.findSpotsByImg(index);

						   instreet.hideAll(index);
						   toolbar.className='tool_bar_hidden';
						   imgs[index].setAttribute('showAd',false);
						   
					  }else if(c=='instreet_sina'||c=='instreet_renren'||c=='instreet_tx'){
						var index=parseInt(target.parentNode.getAttribute('instreet_img_id')), picUrl=imgs[index].src;
						switch(c){
							case "instreet_sina": 
							window.open('http://v.t.sina.com.cn/share/share.php?title='+encodeURIComponent(document.title)+'&url='+encodeURIComponent(document.URL)+'&pic='+encodeURIComponent(picUrl),"_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=580, height=500");
							break;
							case "instreet_renren":
							window.open('http://share.renren.com/share/buttonshare.do?link='+encodeURIComponent(document.URL),"_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=570, height=326");
							break;
							case "instreet_tx"   :
							window.open('http://share.v.t.qq.com/index.php?c=share&a=index&title='+encodeURI(document.title+'\n\n')+'&url='+encodeURI(document.URL)+'&pic='+encodeURIComponent(picUrl),"_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=580, height=500");
							break;						
						}
					  
					  }				  
				   
				}else if(type==='mouseover'){
				    if(c==='icon_share'){
					    c+=' hover';
						target.nextSibling.style.display="block";
				    }
				}else if(type==='mouseout'){
				     if(ev.hasClass(target,'icon_share')){
					    c='icon_share';
						ev.hide(target.nextSibling);
				    }
				
				}
				
			},
			imgEvent:function(event){          //和大图有关的事件
			
				var	target=ev.getTarget(event),
					type=event.type,
					container=$('INSTREET_CONTAINER'),
					index=target.getAttribute('instreet_img_id'),
					toolbar=instreet.findToolByImg(index),
					spots=instreet.findSpotsByImg(index),
					foot=instreet.findFootByImg(index);
                if(imgs[index].getAttribute('showAd')!="false"){  
					if(type==='mouseover'){                             //鼠标mouseover图片

					   if(spots){
						   for(var i=0,len=spots.length;i<len;i++){
							  ev.show(spots[i]);
						   }
					   }
					   if(foot&&foot.style.display=='none'&&config.triggerFootAd=="mouse"){                    
					      ev.show(foot);
					      slideDown(foot.firstChild).animate();
					   }
					   container.setAttribute('instreet_img_id',index);
					   if(toolbar){
					        if(toolbar.style.display!="block"){
								instreet.recordImgAction(index);         //记录鼠标移动到图片的行为
								toolbar.style.display='block';
							}
							toolbar.parentNode.style.zIndex="111111";
					   }
					   
					   
								
					}else if(type==='mouseout'){                        //鼠标mouseout图片

                         instreet.hideAll(index);
					}
			    }
			
			},
			lazyTrigger:function(){                                 //延迟显示底部广告
			
			   if(config.triggerFootAd!=="scroll"){
			      return;
			   }
			   var images=cache.avaImages,
				  scrollTop=window.scrollY,
				  height=window.innerHeight;
				for(var i=0,len=images.length;i<len;i++){
				   var img=images[i], pos=ev.getXY(img),index=img.getAttribute('instreet_img_id'),
				       foot=instreet.findFootByImg(index);
					
					if(!foot||foot.style.display!="none"){
						continue;
					}else if(scrollTop+height>pos.y&&scrollTop<=pos.y+img.height){
					
					   ev.show(foot);slideDown(foot.firstChild).animate();
				    				   
				    }
				}
			
			
			},
			hideAll:function(index){
			   	var	container=$('INSTREET_CONTAINER'),
					toolbar=instreet.findToolByImg(index),
					spotW=ev.$(container,null,'spot_wrapper')[0],
				    spots=spotW.getElementsByTagName('a'),
					foot=instreet.findFootByImg(index);
			   var spot_focus=$('instreet_spot_focus');
			   if(foot&&config.triggerFootAd=="mouse"){
				  ev.hide(foot);
				  ev.hide(foot.firstChild);
			   }
			   if(spot_focus){
					var regExp=b=/(\w+)_(\w+)_(\w+)/g,result=regExp.exec(spot_focus.className),fName=result[3]+'_holder',
						fh=ev.$(container,null,fName)[0];
					ev.hide(fh);
			   }
			   if(spots){
				   for(var i=0,len=spots.length;i<len;i++){
					  ev.hide(spots[i]);
				   }
				}
			   if(toolbar){
					toolbar.style.display='none';
					toolbar.parentNode.style.zIndex="99999";
			   }				   
	
			
			},			
			holderEvent:function(eve,ele){
			   var event=ev.getEvent(eve),
				   rel=ev.getRelatedTarget(event),
				   spot_focus= $('instreet_spot_focus'),
				   index=spot_focus.getAttribute('instreet_img_id');
						
			   if(rel&&rel.tagName=='IMG'&&rel.getAttribute('instreet_img_id')==index){
				  return;
			   }else{
				  instreet.hideAll(index);
			   }
			},
			findSpotsByImg:function(index){
			   var container=$('INSTREET_CONTAINER'),
				   spotW=ev.$(container,null,'spot_wrapper')[0],
				   spotsAll=spotW.getElementsByTagName('a'),
				   spots=ev.findByAttr(spotsAll,'instreet_img_id',index);
			    return spots;
			},
			findToolByImg:function(index){
				var container=$('INSTREET_CONTAINER'),
					aw=ev.$(container,null,'instreet_icons_holder'),
				    w=ev.findByAttr(aw,'instreet_img_id',index)[0],
					toolbar=ev.$(w,null,'tool_bar')[0];

				return toolbar;	
			},
			findFootByImg:function(index){
				var container=$('INSTREET_CONTAINER'),
					fw=ev.$(container,null,'foot_holder'),
				    foot=ev.findByAttr(fw,'instreet_img_id',index)[0];
				return foot;	
			
			},
			checkPosition:function(){
			   var c=$("INSTREET_CONTAINER"),iconHs=ev.$(c,null,'instreet_icons_holder'),index,i,len,
			       spotsW=ev.$(c,null,'spot_wrapper')[0],spots=spotsW.getElementsByTagName('A'),pos,footHs=ev.$(c,null,'foot_holder');
			      
			   for(i=0,len=iconHs.length;i<len;i++){
			     var h=iconHs[i],img,pad=30,left,top;
				 index=h.getAttribute('instreet_img_id');
				 img=imgs[index];
				 pos=ev.getXY(img);
				 top=pos.y+img.height-pad;
				 left=config.position==='right'?pos.x+img.width-pad:pos.x+2;
				 h.style.cssText="top:"+top+"px;left:"+left+"px;";
			   }
			   
			   for(i=0,len=spots.length;i<len;i++){			     
			     var s=spots[i],metrix=s.getAttribute('metrix'),width=s.getAttribute('width'),r=2;
				 index=s.getAttribute('instreet_img_id');
				 pos=instreet.getPosition({metrix:metrix,width:width},index);
			     s.style.cssText="top:"+(pos.top-r)+"px;left:"+(pos.left-r)+"px;";
			   }
			   
			   for(i=0,len=footHs.length;i<len;i++){
			     var fo=footHs[i],index=fo.getAttribute('instreet_img_id'),img=imgs[index],pos=ev.getXY(img),width=img.width,height=img.height,w=parseInt(fo.getAttribute('width'))||300,
				 h=parseInt(fo.getAttribute('height'))||100;

				 fo.style.top=(pos.y+height-h)+"px";

				 if(fo.getAttribute('width'))
					fo.style.left=pos.x+"px";
				 else 				
					fo.style.left=(pos.x+(width-w)/2)+"px";
			   }
			
			},
			bindEvents:function(){                    //为body及container绑定相应事件处理函数
			
				var c=$('INSTREET_CONTAINER'),ads=ev.$(c,null,'ads_holder')[0],weibo=ev.$(c,null,'weibo_holder')[0],wiki=ev.$(c,null,'wiki_holder')[0];
			    ev.bind(document.body,'mouseover',instreet.eventDelegate);
				ev.bind(document.body,'mouseout',instreet.eventDelegate);
				ev.bind(document.body,'click',instreet.eventDelegate);
				if(config.triggerFootAd=="scroll"){ev.bind(window,'scroll',instreet.lazyTrigger);}
				ev.bind(window,'load',function(){instreet.checkPosition();ev.bind(window,'resize',instreet.checkPosition);
				});
				c.onmouseover=function(event){

				   var index=this.getAttribute('instreet_img_id'),spots,toolbar,foot;

				   if(index!=undefined){
					   if(imgs[index].getAttribute('showAd')!='false'){
					   
							  spots=instreet.findSpotsByImg(index);
							  toolbar=instreet.findToolByImg(index);
							  foot=instreet.findFootByImg(index);
							  if(spots){
							   for(var i=0,len=spots.length;i<len;i++){
								  ev.show(spots[i]);
							   }
							  }
							  if(foot&&config.triggerFootAd=="mouse"){
								ev.show(foot);
								ev.show(foot.firstChild);
							  }
							  toolbar&&ev.show(toolbar);
	
						   
					   }				   
				  }
				   
				};
				ads.onmouseover=function(e){                       //记录鼠标移动到广告上的行为
				    ev.show(this);
					var event=ev.getEvent(e),
					    rela=ev.getRelatedTarget(event),
						foc=$('instreet_ads_focus'),
						tar=ev.getTarget(event);

					if(!foc.contains(rela)&&foc.contains(tar)){
					
						instreet.recordAction(foc);
						
					}
				};
				ads.onmouseout=function(eve){
                   instreet.holderEvent(eve,this);
				};
				weibo.onmouseover=function(e){
				   ev.show(this);
				   var event=ev.getEvent(e),
					   rela=ev.getRelatedTarget(event);

					if(!this.contains(rela)){
					
						instreet.recordAction(this);
						
					}
				};
				weibo.onmouseout=function(eve){
					instreet.holderEvent(eve,this);
				};
				wiki.onmouseover=function(e){
				   ev.show(this);
				   ev.show(this);
				   var event=ev.getEvent(e),
					   rela=ev.getRelatedTarget(event);

					if(!this.contains(rela)){
					
						instreet.recordAction(this);
						
					}
				};
				wiki.onmouseout=function(eve){
					instreet.holderEvent(eve,this);
				};

				
			}
		};


		/***********************************
		* WidgetsBox   广告容器类
		************************************/
		var WidgetsBox=function(){
			this.init();
		};

		WidgetsBox.prototype.init=function(){                //widgetsbox初始化函数
			                   		      
		    var holder=document.createElement("div"),
		    	section=document.createDocumentFragment(),
		        ad=document.createElement("div"),weibo=document.createElement("div"),wiki=document.createElement("div");
		    holder.className="widgets_wrapper";
		    ad.className="ads_holder";
		    weibo.className="weibo_holder";
		    wiki.className="wiki_holder";
		    section.appendChild(ad);
		    section.appendChild(weibo);
		    section.appendChild(wiki);
		    holder.appendChild(section);
		    //adBox="<div class='ads_wrapper'><div class='ads_holder'></div><div class='weibo_holder'></div><div class='wiki_holder'></div></div>",
			// spotBox="<div class='spot_wrapper'></div>",
			// footBox="<div class='foot_wrapper'></div>",
			// iconBox="<div class='icon_wrapper'></div>";

			instreet.container.appendChild(holder);
			this.ad=ad;this.weibo=weibo;this.wiki=wiki;
		
		};

		/***************************************
		*InstreetAd类
		***************************************/
		var InstreetAd=function(data){			
			var img=imgs[data.index];
			this.adsData=data;
			this.spotsArray=[];
			this.init();
		};
		InstreetAd.prototype={
			constructor:InstreetAd,
			init       :function(){
				var wrapper=document.createElement("div");
				instreet.container.appendChild(wrapper);
				this.wrapper=wrapper;
				this.createSpots();
				this.locate();
			},
			createSpots:function(){                 //创建一张图片的所有spots
			  
			    var _this=this,container=instreet.container,data=_this.adsData,
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
						spot=InstreetAd.createSpot({type:'ad',metrix:metrixArray[i],width:w});
						wrapper.appendChild(spot);
						_this.spotsArray.push[spot];
					}
				}
				if(config.showWeibo){              //创建weiboSpot
					for(i=0,len=data.weiboSpot.length;i<len;i++){
						w=data.weiboSpot[0].width;
						spot=InstreetAd.createSpot({type:'weibo',metrix:data.weiboSpot[i],width:w});
						wrapper.appendChild(spot);
						_this.spotsArray.push[spot];
					}
				}
				if(config.showWiki){              //创建wikiSpot
					for(i=0,len=data.wikiSpot.length;i<len;i++){
						w=data.wikiSpot[0].width;
						spot=InstreetAd.createSpot({type:'wiki',metrix:data.wikiSpot[i],width:w});
						wrapper.appendChild(spot);
						_this.spotsArray.push[spot];
					}
				}
			   
			   
			
			},
			getCoor  :function(spot){

                var _this=this,img=_this.img,
      				metrix=spot.metrix,ox=metrix%3000,
				    oy=Math.round(metrix/3000),w=spot.originWidth,zoomNum=img.width/w,
				    x=ox*zoomNum,y=oy*zoomNum,pos=ev.getXY(img);	

				return {top:(y+pos.y),left:(x+pos.x)};	
                
			},
			locate  :function(){
				var _this=this,spots=_this.spotsArray;
				for(var len=spots.length,i=0;i<len;i++){
					var spot=spots[i];
					var coor=_this.getCoor(spot);
					spot.style.cssText="top:"+coor.top+"px;left:"+coor.left+"px;display:block;";
				}
			}

		};
		InstreetAd.createSpot=function(obj){        //创建spot		    

			  if(obj){
				   var spot=document.createElement('a');
				   if(obj.type=="ad"){
				      spot.className="instreet_spot_ads";
				   }
				   else if(obj.type=="weibo"){  
				      spot.className="instreet_spot_weibo";
				   }
				   else if(obj.type=="wiki"){
	  			      spot.className="instreet_spot_wiki";
	  			   }else{
	  			   	  return;
	  			   }
				   spot.href="javascript:;";
				   spot.metrix=obj.metrix;
				   spot.originWidth=obj.width;
				   return spot;
			   }
			    			
		};



		/*********************************
		*jsonp callback
		**********************************/
		window['insjsonp']=function(data){
			if(data){
			  var index=data.index,img=imgs[index];
			  cache.dataArray[index]=data;
			  cache.avaImages.push(img);
			  img.setAttribute('instreet_data_ready',true);
			  cache.adsArray[index]=new InstreetAd(data);
			}
				
		};
		
		
		/********Mix config*************/
		var mixConfig=function(c){
		   if(c&&typeof c=="object"){
		   
		     for(var i in c){
			    config[i]=c[i];
			 }
		   
		   }else{
		     return;		   
		   }
		
		};
		mixConfig(instreet_config);
		
        /*******插件初始化******/
        var init=function(){
		
			instreet.init();
		    cache.initData();
		
		};		
		
		document.ready(function(){
            init();
		});
		
 })(window);	
		
	