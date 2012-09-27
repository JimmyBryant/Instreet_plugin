﻿/*************************************
*尚街广告插件 2.1.0
*1.支持通过上移代码，加速广告展现
*2.新增对幻灯形式图库页面的支持
*
*************************************/
(function(window,undefined){
        
		if (window.InstreetWidget != null||typeof window.InstreetWidget!="undefined"){
			return null;
		} else {
			window.InstreetWidget = new Object();
			window.InstreetWidget.version = "2.1.0";
			window.InstreetWidget.name = "InstreetWidget";
		}

	   var document = window.document,
		   navigator = window.navigator,
		   location = window.location,
		   imgs=[],
		   outFlag,
           readylist=[],
		   leftPad=-331,
		   rightPad=28,
		   isFirst=true;

		 var isIE6= !!window.ActiveXObject&&!window.XMLHttpRequest;   
		 var isIE7= /msie 7/i.test(navigator.userAgent); 
        
		/********************************
		*Config对象
		*********************************/
		var config = {
						redurl	:	"http://www.instreet.cn/click.action",
						cssurl 	:	"http://static.instreet.cn/widgets/push/css/instreet_ifeng.css",
					callbackurl	:	"http://ts.instreet.cn:90/push.action",
						murl	:	"http://ts.instreet.cn:90/tracker.action",
						iurl    :	"http://ts.instreet.cn:90/tracker8.action",
						ourl	:	"http://ts.instreet.cn:90/loadImage.action",
					// callbackurl	:	"http://test.instreet.cn/push.action",
					// 	murl	:	"http://test.instreet.cn/tracker.action",
					// 	iurl    :	"http://test.instreet.cn/tracker8.action",
					// 	ourl	:	"http://test.instreet.cn/loadImage.action",
						imih	:	300,
						imiw	:	300,
						timer   :   1000,
						widgetSid:"79cjp47BnLo3NdNaLeICIw",
						showAd:true,
						showFootAd:true,
						showWeibo:true,
						showWiki:true,
						showShare:true,
						showWeather:true,
						showNews:true,
						showMD  :true,
						openFootAd:true,
						autoShow:  true
						
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
	        }
		};
        
        var $=function(id){return document.getElementById(id);},
            hide=function(elem){elem.style.display="none"},
            show=function(elem){elem.style.display="block"} ;
        /*********************************
        *为document扩展DomReady方法
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
			
        /*********************************
        *cache对象，加载广告数据
        **********************************/
		var cache={
		    //dataArray  :[],
			avaImages  :[],
			adsArray   :[],
	        initData   :function(){

			   for(var i=0,len=imgs.length;i<len;i++){
			   	  var img=imgs[i];
			   	  img.insId=i;img.setAttribute("instreet_img_id",i);
			   	  cache.onImgLoad(img);
			   }


		    },
		    onImgLoad  :function(image){
				 var img=new Image();
				 img.src=image.src,
				 img.insId=image.insId;
				 if(img.complete){
				    cache.loadData(image);
				 }else{
					 img.onload=function(){					   
					   var obj=this;
					   obj.onload=null;
					   cache.loadData(image);  
					 }				 
			     }
		    },
			loadData     :function(img){
			   var index=img.insId;		   
			   if(img.width>=config.imiw&&img.height>=config.imih){
			   	 if(img.clientWidth>=config.imiw&&img.clientHeight>=config.imiw){		
				   InstreetAd.recordImage(img);			   
				   cache.createJsonp(img);
			   	  }
			   }
			},
			createJsonp  :function(img){
			   var iu=encodeURIComponent(encodeURIComponent(img.src)),url=config.callbackurl+"?index="+img.insId+"&pd="+config.widgetSid+"&iu="+iu+"&callback=insjsonp";
			   ev.importFile('js',url);
			}
		
		};

        window['insjsonp']=function(data){

			    if(data){
				  var index=data.index,img=imgs[index];
				  img.setAttribute('instreet_data_ready',true);
				  instreet.reLocateAd();        //重新定位已经显示的广告
				  var ad=new InstreetAd(data);
				  cache.adsArray[index]=ad;
				  instreet.autoShow(ad);
				  isFirst=false;
				}
				
		};
		
		
        /*****************************
        *instreet对象
        *****************************/
		
		var instreet={
		    container   :   null,
			spotBox     :   null,
		    init        :  function(data){

		   	   var images=document.getElementsByTagName('img'),img;
			   for(var i=0,len=images.length;i<len;i++){
				    img=images[i];
				    //if(img.style.display!='none'&&img.style.visibility!='hidden'){
	 					  //img.setAttribute('instreet_img_id',i.toString());	 					 
	 					  img.insId=i;
						  imgs[i]=img;
					//}
			   }
			   var cssUrl=config.cssurl;
			   //var cssUrl="css/instreet_ifeng.css";
			   ev.importFile('css',cssUrl);
		       instreet.createContainer();
			   this.bindBodyEvent();

			},
			createContainer: function(){						//创建广告容器
		       var container=document.createElement('div'),           
			       spotBox=document.createElement('div');
			   container.id="INSTREET_CONTAINER";
			   spotBox.id="INSTREET_SPOTBOX";
			   instreet.container=container;
			   instreet.spotBox=spotBox;
			   container.appendChild(spotBox);
			   document.body.insertBefore(container,document.body.firstChild);				
			},
			bindBodyEvent  :function(){                      //创建事件委托
			
			    var eventDelegate=function(eve){
			      var event=ev.getEvent(eve),
					  tar=ev.getTarget(event),
					  type=event.type;
                  switch(type){
				    
					case "mouseover":
					/*
					if(tar.tagName=='A'&&tar.className=='instreet_other_close'){
					   var parent=tar.parentNode;
					   if(parent.className==='instreet_other_title'){
					     	parent.id="instreet_other_close";
					   }
					}else
					*/
					//鼠标over到分享按钮
					if(tar.tagName=='A'&&tar.className=='instreet_share_button'){
					    var next,
						    parent;
						   instreet.closeActiveAd();						   

						   parent=tar.parentNode;
						   next=tar.nextSibling;
						   hide(tar);
						   parent.id="INSTREET_AD_ACTIVE";
						   show(next);
						   next.onmouseover=null;
						   next.onmouseout=null;
						   next.onmouseover=function(){
						   	  clearTimeout(outFlag);
						      parent.id="INSTREET_AD_ACTIVE";
                              show(this);
							  hide(tar);
						  };
						  next.onmouseout=function(){
                              parent.id='';
							  hide(this);
							  show(tar);

						  };
					}
					
					break;
					/*
					case "mouseout":
					if(tar.tagName=='A'&&tar.className=='instreet_other_close'){              
					   var parent=tar.parentNode;if(parent.className==='instreet_other_title'){
					     parent.id="";
					   }
					}
					break;
					*/
					//关闭按钮点击事件
					case "click":
					if(tar.tagName=='A'&&tar.className=='instreet_other_close'){
					     var parent=tar.parentNode;if(parent.className==='instreet_other_title'){
						     var adbox=parent.parentNode;
							 hide(adbox);
							 adbox.parentNode.id='';
					   }
					}
					//分享按钮点击事件
					else if(tar.className=='instreet_sina'||tar.className=='instreet_renren'||tar.className=='instreet_tx'){
					   var other=tar.parentNode.parentNode.parentNode;
					   var index=other.getAttribute('instreet_img_id');
					   var picUrl=imgs[index].src;
					   switch(tar.className){
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
					break;
				  
				  }
				  
			   };

			   ev.bind(document.body,'mouseover',eventDelegate);
			  // ev.bind(document.body,'mouseout',eventDelegate);
			   ev.bind(document.body,'click',eventDelegate);
			
			},


			closeActiveAd :	function (){	             //关闭当前显示的广告		

				 var active_box=$('INSTREET_AD_ACTIVE');
				 if(active_box){
					 active_box.id="";					 
					 active_box.firstChild.className=='instreet_share_button'&&show(active_box.firstChild);						 
					 active_box.children.length>1&& hide(active_box.lastChild);					    					 
				 }
			},
			reLocateAd  :function(){                   //重新定位广告

               var adsArray=cache.adsArray;
               
               for(i in adsArray){

                  var adObj=adsArray[i];
                  adObj.locateAd();
			 
			    }
			},
			autoShow  :function(ad){                  //自动展示第一个加载成功的广告

				if(isFirst){

					var side=ad.sideWrapper,li=side.firstChild;
					if(li&&li.children.length>1){
						li.id="INSTREET_AD_ACTIVE";
						show(li.lastChild);
					}

				}

			},
			search   :function(){                     //搜索未被发现的图片

				var images=document.getElementsByTagName("img");
				
				for(var i=0;i<images.length;i++){
					var img=images[i],len=imgs.length;
					if(img.insId==undefined){
						imgs[len]=img;
						img.insId=len;
						img.setAttribute("instreet_img_id",len);
						cache.onImgLoad(img);
					}
				}

			}

		};
        
         var TimerId=null;         //全局时间函数计时器

         /**********************************
         *TimerTick 类
         ***********************************/
         var TimerTick=function(arr){
            this.queue=arr;
            this.go=function(){
                 var arr=this.queue;
                 TimerId=setInterval(function(){
		         	 for(var i=0;i<arr.length;i++){
						arr[i]&&arr[i].detect();
		         	 }
                 },1000);


         	}

         };


        /********************************
        *InstreetAd 类
        ********************************/
        var InstreetAd=function(data){

             var img=imgs[data.index];
             this.dataPackage=data;           
             this.img=img;
             this.originInfo={width:img.clientWidth,height:img.clientHeight,src:img.src};
             this.spotsArray=[];
             this.init();
        };

        InstreetAd.prototype={

        	constructor:InstreetAd,
            init  :function(){

		   	   var _this=this,
		   	   	   data=_this.dataPackage,
		   	   	   index=data.index,
		   	   	   img=_this.img,
			       pos=ev.getXY(img),
				   str='';
			   var side=document.createElement('ul');
			   side.className="instreet_other";
			   side.setAttribute("instreet_img_id",index);
			   this.sideWrapper=side;
			   this.chooseLeft();                           //判断广告放置在图片左侧或者右侧
			  
			   for(i in InstreetAd.modual){

			     var lis=InstreetAd.modual[i](data,_this);
			     
			     for(var len=lis.length,i=0;i<len;i++){
			     	side.appendChild(lis[i]);
			     }
			    			     	
			   }

			   this.addTipEvent();
			   this.addImgEvent();
			   this.locateAd();
			   instreet.container.appendChild(side);

			},
			chooseLeft    :function(){						//判断广告放置在图片左侧或者右侧
				var img=this.img,pos=ev.getXY(img);
				this.isLeft=pos.x+img.offsetWidth+360>document.body.clientWidth?true:false;
				return this.isLeft;    
			},
			createSpot:function(spotData){
			   var _this=this, 
			       img=_this.img,
			       w=spotData.width,
			       metrix=spotData.metrix;

			   var spot=document.createElement('a');
			   if(spotData.adsType)
			      spot.className="instreet_ad_spot";
			   else if(spotData.type.toString()=="1"||spotData.type.toString()=="2")  
			      spot.className="instreet_weibo_spot";
			   else if(spotData.type.toString()=="4")
  			      spot.className="instreet_wiki_spot";
			   spot.href="javascript:;";
			   spot.metrix=metrix;
			   spot.imgWidth=w;
			   instreet.spotBox.appendChild(spot);
			   this.addSpotEvent(spot);
			   this.spotsArray.push(spot);
			},
			addSpotEvent  :function(spot){
				var _this=this,
					insId=_this.dataPackage.index,
					side=_this.sideWrapper;		   				
				spot.onmouseover=function(){
						instreet.closeActiveAd();
					    
						var boxes,box,
							metrix=this.metrix,
						    items;
						   
                        if(spot.className=='instreet_ad_spot'){ 
							boxes=ev.$(side,null,'instreet_aditem');
						   for(var i=0,len=boxes.length;i<len;i++){

						      if(boxes[i].getAttribute('metrix')==metrix){
							    clearTimeout(outFlag);
							    boxes[i].id="INSTREET_AD_ACTIVE";
								show(boxes[i].lastChild);
							  }
						   }
						 }
						 else{
						 
							if(spot.className=='instreet_weibo_spot'){
								box=ev.$(side,null,'instreet_weibo')[0];
								items=ev.$(box,null,'other_weibo_box');
							}									
							else if(spot.className=='instreet_wiki_spot'){	
								box=ev.$(side,null,'instreet_wiki')[0];
								items=ev.$(box,null,'other_wiki_box');
							}
								
							for(var i=0,len=items.length;i<len;i++){
							   var item=items[i];
							   if(item.getAttribute('metrix')==metrix){
								 item.id="instreet_box_focus";
							   }else{							     
								 item.id="";
							   }
							}
							clearTimeout(outFlag);	
							box.id="INSTREET_AD_ACTIVE";	
                            show(box.lastChild);							
						 
						 }
					     
				};
				spot.onmouseout=function(){

					var	item=$('instreet_box_focus');
					if(item){
							item.id='';	
					}										
				
				};
										
			},
			addTipEvent :function(){	                    //为tip绑定鼠标事件
                			
			     var _this=this, 
			     	lis=_this.sideWrapper.children;
  
                 for(var i=lis.length;i--;){

                    var tip=lis[i].firstChild,
                    	adItem=lis[i].lastChild;
                    tip.onmouseover=function(e){
                       var parent=this.parentNode,adItem=this.nextSibling;
					   clearTimeout(outFlag);
					   instreet.closeActiveAd();
					   parent.id='INSTREET_AD_ACTIVE';
					   show(adItem);

					};
					
					tip.onmouseout=function(){
					  outFlag=setTimeout(instreet.closeActiveAd,config.timer);					   
					};
					
					adItem.onmouseover=function(e){

					   clearTimeout(outFlag);
					   this.parentNode.id="INSTREET_AD_ACTIVE";
					   show(this);

					};	
					
					adItem.onmouseout=function(){
					   outFlag=setTimeout(instreet.closeActiveAd,config.timer);	
					};

					var children=adItem.children;

					for(var j=1,len=children.length;j<len;j++){                //记录鼠标行为
						children[j].onmouseover=function(e){
					      var event=ev.getEvent(e),
					  		 rela=ev.getRelatedTarget(event);
	                       if(!this.contains(rela)){
	                       	 _this.recordAction(this);	
	                       }
						}
					 }								 		 

		  		}
		  },
		  addImgEvent  :function(){
		  	   var _this=this,img=this.img,side=_this.sideWrapper;
		  	   ev.bind(img,'mouseover',function(){
		  	   	    clearTimeout(outFlag);
		  	   	    var active=$("INSTREET_AD_ACTIVE");
		  	   	    if(side.contains(active)){
		  	   	    	return;
		  	   	    }else{
		  	   	    	var li=side.firstChild,children=li.children;
		  	   	    	if(children&&children.length>1){
		  	   			   instreet.closeActiveAd();
		  	   			   li.id="INSTREET_AD_ACTIVE";
		  	   			   show(li.lastChild);
		  	   			   InstreetAd.recordImgAction(img.insId);
		  	   			}
		  	   		}

               });
   		  	   ev.bind(img,'mouseout',function(){
					outFlag=setTimeout(instreet.closeActiveAd,config.timer);
               });

		  },
	       //鼠标移动到广告或者微博、百科上发送行为记录
 	      recordAction:function(tar){   		       

			      var  _this=this,data=_this.dataPackage,
			      	   img=_this.img,
					   iu=encodeURIComponent(encodeURIComponent(img.src)),
					   pd=data.widgetSid,
					   ul=config.murl,
					   mid=data.imageNumId||'',
					   muh=data.imageUrlHash,
					   adData,
					   ad='',
					   at='',
					   ift=0,
					   tty=1,adReg=/other_ad_box/,weiboReg=/other_weibo_box/,wikiReg=/other_wiki_box/,footReg=/other_foot_ad/;
                    if(adReg.test(tar.className)){
					   ad=tar.getAttribute('adsid');
					   at=1;
					}else if(weiboReg.test(tar.className)){
					   ift=2;
					}else if(wikiReg.test(tar.className)){
					   ift=4;
					}else if(footReg.test(tar.className)){
					   ad=data.badsSpot[0].adsId;
					   at=data.badsSpot[0].adsType;
					}
													
					ul+="?iu="+iu+"&pd="+pd+"&muh="+muh+"&ad="+ad+"&mid="+mid+"&at="+at+"&tty="+tty+"&ift="+ift+"&tg=";				
					ev.importFile('js',ul);
				
			},
			locateAd :function(){                    //定位广告

                  var _this=this,
                      side=_this.sideWrapper,
                      spotsArray=_this.spotsArray,
                      img=_this.img,
                      dis=img.clientWidth>=config.imiw&&img.clientWidth>=config.imih?"block":"none",
                      pos=ev.getXY(img);

                   side.style.cssText="top:"+pos.y+"px;left:"+(pos.x+img.offsetWidth)+"px;margin-top:5px;display:"+dis+";";
                   lis=side.children;
                   for(var j=lis.length;j--;){
                   	   if(lis[j].children.length>1){
                   		var box=lis[j].lastChild;
                   		if(box.className!="instreet_share_icons"){
                   		    dir=_this.chooseLeft()?leftPad+"px":rightPad+"px" ;
	                   		box.style.left=dir;
                   		 }
                   	   } 
                   }

                   if(spotsArray.length>0){              //如果存在spot，同时也对其重定位


                     var w=spotsArray[0].imgWidth,
                     	 zoomNum=img.width/w,
					 	 r=17;
                      
	                  for(var j=spotsArray.length;j--;){
	                  	   var  spot=spotsArray[j];				      
					       metrix=spot.metrix,
						   ox=metrix%3000,
						   oy=Math.round(metrix/3000),					  
						   x=ox*zoomNum,
						   y=oy*zoomNum;
	 					  spot.style.cssText="top:"+(y+pos.y-r)+"px;left:"+(x+pos.x-r)+"px;"

	                   }

                    }  
			},
			detect   :function(){                     //每隔一段时间开始检测图片对象是否change

                var _this=this,img=_this.img,origin=_this.originInfo,
                	side=_this.sideWrapper;

                if(img.src&&img.src!=origin.src){
                    var parent=side.parentNode||document.body;
                    parent.removeChild(side);
                    cache.onImgLoad(img);
                    origin.src=img.src;
                }
                else if(img.clientWidth!=origin.width||img.clientHeight!=origin.height){

                		_this.locateAd();
                }
                

			}
			


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

			  ul+="?iu="+iu+"&pd="+pd+"&pu="+pu+"&t="+t;
			  ev.importFile('js',ul);
		   
	    };
	    /**************************************
	    *鼠标移动到图片上的时候发送行为记录
	    **************************************/
	    InstreetAd.recordImgAction=function(index){                           
		       var ad=cache.adsArray[index],img=ad.img,data=ad.dataPackage,
				   ul=config.iurl,pd=data.widgetSid,muh=data.imageUrlHash,
				   iu=encodeURIComponent(encodeURIComponent(img.src));
				   
				ul+="?pd="+pd+"&muh="+muh+"&iu="+iu;
				ev.importFile('js',ul);
		   
		};



		/*****************************
		*插件应用模块
		*****************************/
		InstreetAd.modual={
			createAdBox :function(data,obj){
			   var str='',
				   arr=[],
				   liArray=[],
				   aMetrix=[],
				   img=obj.img,
				   len=data.adsSpot.length,
				   footData=data.badsSpot[0],
				   left=obj.isLeft,id='',dis='',
				   createAd=function(data,metrix){                    //创建metrix值相同的精准匹配广告节点
						var str='',
					        len=data.adsSpot.length,
					        ad,
					        redUrl,
					        adData=null;  
					   
						for(var j=0;j<len;j++){
							if(data.adsSpot[j].metrix===metrix){
							  ad=data.adsSpot[j];
							  redUrl=config.redurl+"?tty=0&mid="+ad.imageNumId+"&muh="+data.imageUrlHash+"&pd="+ad.widgetSid+"&ift=&tg=&at="+ad.adsType+"&ad="+ad.adsId+"&rurl="+encodeURIComponent(encodeURIComponent(ad.adsLinkUrl));
							  var className="other_ad_box no_border";
							  str+="<div adsid='"+ad.adsId+"' class='"+className+"'>";
					          str+="<table><tbody><tr><td class='td1'><a class='imgbox' href='"+redUrl+"'><img src='"+ad.adsPicUrl+"' alt='' /></a></td>";                                							  
							  str+="<td class='td2'><p class='other_ad_title'><a href='"+redUrl+"' title='' target='_blank'>"+ad.adsTitle+"</a></p>";
							  str+="<p class='other_ad_new'><b>宝贝价：<span class='other_ad_price'>"+(ad.adsDiscount||ad.adsPrice)+"</span>元</b></p><p class='other_ad_buy'><a target='_blank' href='"+redUrl+"'></a></p></td></tr></tbody></table></div>";
							  if(!adData){
								adData=ad;
							  }
							
							}
						}
						obj.createSpot(adData);	
						return str;		  
					},
					createFootAd=function(footData){	                 //创建底部广告节点	

					   var 	str='';
					   if(!footData){     
						  return str;
					   }else{
						  str="<div class='other_foot_ad'>";
						  if(footData.adsType==3){
						      var redUrl=config.redurl+"?tty=0&mid="+data.imageNumId+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift=&at="+(footData.adsType||'')+"&ad="+(footData.adsId||'')+"&tg=&rurl="+encodeURIComponent(encodeURIComponent(footData.adsLinkUrl));
							  str+="<a href='"+redUrl+"'><img src='"+footData.adsPicUrl+"' alt=''/></a>";
						  }else if(!footData.adsLinkUrl&&footData.description){
							 var fra=footData.description;
							 str+=fra.slice(0,-2)+'></iframe>';
						  }
						  str+="</div>";
						  return str;
					   }
					   					
					};

                 var footAd=createFootAd(footData);
               			    
			
                if(!config.showAd&&!config.showFootAd){
			      return str;
			    }

                var createLI=function(index){       //创建LI

	   		      	var li=document.createElement("li");
			      	li.setAttribute("instreet_ad_id",index);
			      	li.className="instreet_aditem";
			      	return li;
				};

			   if(len<=0||!config.showAd){                   //只有底部广告
			      if(footData&&config.showFootAd){
	   		      	var li=createLI(0);
			      	var str="<div class='instreet_tip'><span class='tip_top'></span><p>热门信息</p><span class='tip_bottom'></span></div>";
					str+="<div class='instreet_other_box'><div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>热门信息</div>";
					li.innerHTML=str+footAd;
					liArray.push(li);
				 }
			   }
			   else if(config.showAd&&len>0){              //存在图片匹配广告
			   
				   while(len--){
					arr.push(data.adsSpot[len].metrix);
				   }
				   aMetrix=ev.aTrim(arr);

			   for(var i=0,len=aMetrix.length;i<len;i++){   
   		   
			      var ad,tipId='';
				  switch (i){
					 case 0:tipId="一";break;
					 case 1:tipId="二";break;
					 case 2:tipId="三";break;
					 case 3:tipId="四";break;
					 case 4:tipId="五";break;
					 case 5:tipId="六";break;
				   }

				  var li=createLI(i);
				  li.setAttribute("metrix",aMetrix[i]);
				  str="<div class='instreet_tip'><span class='tip_top'></span><p>相似商品"+tipId+"</p><span class='tip_bottom'></span></div>";
				  str+="<div class='instreet_other_box' ><div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>图中相似商品</div>";
				  str+=createAd(data,aMetrix[i]);	 //广告html	  
				  if(config.showFootAd){
                      str+=footAd;                   //底部广告html                 
				  }
			      li.innerHTML=str+"</div>";    
			      liArray.push(li);      
			   }
			  }
			   return liArray;

			},

			createWeibo: function(data,obj){
			   var str="",
				   left=obj.isLeft,
				   liArray=[],
				   img=obj.img;

			   if(data.weiboSpot.length>0&&config.showWeibo){
			   	   var li=document.createElement("li");
			   	   	li.className="instreet_weibo";   
			   
			       str="<a href='javascript:;' class='instreet_tip instreet_weibo_button'></a><div class='instreet_weibo_box'>";		
				   str+="<div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>图中相关微博</div>";
				   for(var len=data.weiboSpot.length,i=0;i<len;i++){
				      var weibo=data.weiboSpot[i],
					      nickName=weibo.nickName,
						  icon=weibo.icon,
						  avatar=weibo.avatar,
						  latestStatus=weibo.latestStatus,
						  title=weibo.title,
						  userUrl=config.redurl+"?tty=1&mid="+data.imageNumId+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+weibo.type+"&at=&ad=&tg="+encodeURIComponent(encodeURIComponent(title))+"&rurl="+encodeURIComponent(encodeURIComponent(weibo.userUrl)),
						  metrix=weibo.metrix,
						  s="";
						if(i==len-1)  
							s="<div class='other_weibo_box no_border' metrix='"+metrix+"'>";
						else
						    s="<div class='other_weibo_box' metrix='"+metrix+"'>";
						s+="<table><tr><td class='td1'><a href='"+userUrl+"' target='_blank'><img src='"+avatar+"'/></a></td><td class='td2'><p><a target='_blank' class='name' href='"+userUrl+"'>"+nickName+"</a></p><p class='cont'>"+latestStatus+"</p><p class='icon'><a href='"+userUrl+"' title='微博'><img src='"+icon+"'/></a></p></td></tr></table></div>";  
				        str+=s;
						obj.createSpot(weibo);
				   }
				   str+="</div>";
				   li.innerHTML=str;
				   liArray.push(li);
			   
			   }
			    return liArray;

			
			},			
			createWiki:function(data,obj){
			   var str="",
			   	   left=obj.isLeft,
			   	   img=obj.img,
			   	   liArray=[];
			   if(data.wikiSpot.length>0&&config.showWiki){

   			   	    var li=document.createElement("li");
			   	   	
			   	   	li.className="instreet_wiki";   

			       str="<a href='javascript:;' class='instreet_tip instreet_wiki_button'></a><div class='instreet_wiki_box'>";
				   str+="<div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>图中相关互动百科</div>";
				   for(var len=data.wikiSpot.length,i=0;i<len;i++){
				      var wiki=data.wikiSpot[i],
					      title=wiki.title,
						  firstimg=wiki.firstimg,
						  isexist=wiki.isexist,
						  summary=wiki.summary,
						  url=config.redurl+"?tty=1&mid="+data.imageNumId+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift="+wiki.type+"&at=&ad=&tg="+encodeURIComponent(encodeURIComponent(title))+"&rurl="+encodeURIComponent(encodeURIComponent(wiki.url)),
						  metrix=wiki.metrix,
						  s="";
						if(i==len-1)   
							s="<div class='other_wiki_box no_border' metrix='"+metrix+"'>";
						else
						    s="<div class='other_wiki_box' metrix='"+metrix+"'>";
						s+="<table><tr><td class='td1'><a href='"+url+"' target='_blank'><img src='"+firstimg+"'/></a></td><td class='td2'><p><a target='_blank' class='name' href='"+url+"'>"+title+"</a></p><p class='cont'>"+summary+"</p><p class='icon'><a href='"+url+"' title='互动百科'><img src='http://static.instreet.cn/widgets/push/images/icon_baike.png'/></a></p></td></tr></table></div>";  
				        str+=s;
						obj.createSpot(wiki);
				    }
				    str+="</div>";	
				    li.innerHTML=str;
				    liArray.push(li);		   
			   }
			   return liArray;
			   			
			},
			createNews  :function(data,obj){		  
			   var str="",
			   	  left=obj.isLeft,
			   	  liArray=[];
			   if(config.showNews){

   			   	   var li=document.createElement("li");
			   	   	   
			   	   li.className="instreet_news";  
			       str="<a href='javascript:;' class='instreet_tip instreet_news_button'></a><div class='instreet_news_box'>";
				   str+="<div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>图中相关新闻讯息</div>";				
				   str+='<div class="other_news_box no_border"><iframe frameborder="0" width="300" height="250" marginwidth="0" marginheight="0" src="http://www.google.com/uds/modules/elements/newsshow/iframe.html?topic=h&rsz=small&format=300x250"></iframe></div></div>';			   
			   	   li.innerHTML=str;
				   liArray.push(li);
			   }
			   return liArray;
			},
			createWheather:function(data,obj){
			    
			    var str="",liArray=[],
					left=obj.isLeft,
					url="http://www.instreet.cn/weather?location=&callback=showWeather_"+data.index;
				if(config.showWeather){
		   	      var li=document.createElement("li");
			   	   	   
			   	  li.className="instreet_weather"; 
				  str="<a href='javascript:;' class='instreet_tip instreet_weather_button'></a><div class='instreet_weather_box'>";
				  str+="<div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>图中相关天气讯息</div>";
				  str+="<div class='other_weather_box no_border'><iframe name='weather_inc' src='http://tianqi.xixik.com/cframe/2' width='290' height='70' frameborder='0' marginwidth='0' marginheight='0' scrolling='no'></iframe></div></div>";
			   	  li.innerHTML=str;
				  liArray.push(li);
				}
				return liArray;
			
			},
			createShare :function(){
			   var str='',liArray=[];
			   if(config.showShare){
		   	      var li=document.createElement("li");
			   	  li.className="instreet_share"; 
			   	  str="<a class='instreet_share_button' title='分享图片'></a><div class='instreet_share_icons'><a class='instreet_sina'  title='新浪微博'></a><a class='instreet_renren' title='人人网' ></a><a class='instreet_tx' title='腾讯微博'></a></div>";
  			   	  li.innerHTML=str;
				  liArray.push(li);
			   }
			   
			   return liArray;
			},
			createMD   :function(){
			   var str='',liArray=[];
			   if(config.showMD){
			   	  var li=document.createElement("li");
			   	  li.className="instreet_imeiding"; 
				  str="<a class='share_button' href='http://www.imeiding.com' target='_blank' title='每叮网'></a>";
			   	  li.innerHTML=str;
				  liArray.push(li);
			   }             
			   return liArray;
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

			 mixConfig(instreet_config);                  //组合配置信息
		     instreet.init();
			 cache.initData();
			 ev.bind(window,'load',function(){
			 	instreet.reLocateAd();		 		
			 });	
			 ev.bind(window,'resize',function(){instreet.reLocateAd();}); 
			 //dom ready后搜索是否有新的图片
			 document.DomReady(function(){
			 		instreet.search()
			 });
			 //定时检测图片是否变化
             var ts=new TimerTick(cache.adsArray);
             ts.go();

		};
		
		
		
        //插件初始化
        init();

        
    })(window);