/*************************************
*尚街广告插件 2.1.0
*1.新增对幻灯图片的支持
*2.复杂页面dom ready前就能出现首个广告
*************************************/
(function(window,undefined){
        
		if (window.InstreetWidget != null||typeof window.InstreetWidget!="undefined"){
			return null;
		} else {
			window.InstreetWidget = new Object();
			window.InstreetWidget.version = "2.1.1";
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
		   firstData=true;

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
						imih	:	200,
						imiw	:	200,
						timer   :   1000,
						widgetSid:"77WCO3MnOq5GgvoFH0fbH2",
						showAd:true,
						showFootAd:true,
						showWeibo:true,
						showWiki:true,
						showShare:true,
						showWeather:true,
						showNews:true,
						showMD  :true,
						openFootAd:true
						
		};

		var tool={


		  
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
        *cache对象，加载并缓存广告数据
        **********************************/
		var cache={
		    dataArray  :[],
			avaImages  :[],
			adsArray   :[],
	        initData   :function(){

			   for(var i=0,len=imgs.length;i<len;i++){
			    
			     var img=new Image(),index=i;
                 img.src=imgs[index].src;				 
				 img.imgId=index;
				 if(img.complete){
				    cache.loadData(img);
				 }else{
					 img.onload=function(){					   
					   var obj=this;
					   obj.onload=null;
					   cache.loadData(obj);  
					 }				 
			     }
			   }

		    },
			loadData     :function(img){
			   var index=img.imgId,clientImg;
               for(var i=imgs.length;i--;){
			      if(imgs[i].imgId==index.toString()){
				    clientImg=imgs[i];break;
				  }
			   }			   
			   if(img.width>=config.imiw&&img.height>=config.imih&&clientImg.clientWidth>=config.imiw&&clientImg.clientHeight>=config.imiw){		
				   InstreetAd.recordImage(img);			   
				   cache.createJsonp(index);
                   
			   }
			},
			createJsonp  :function(index){
			   var iu=encodeURIComponent(encodeURIComponent(imgs[index].src)),url=config.callbackurl+"?index="+index+"&pd="+config.widgetSid+"&iu="+iu+"&callback=insjsonp";
			   ev.importFile('js',url);
			}
		
		};

        window['insjsonp']=function(data){
			    if(data){
				  var id=data.index,img=imgs[id],obj={img:img,imgId:id};
				  cache.dataArray[id]=data;
				  img.setAttribute('instreet_data_ready',true);
				  cache.avaImages.push(obj);
				  cache.adsArray[data.index]=new InstreetAd(data);
				  //instreet.startShowAd(id);
				  firstData=false;
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
	 					  img.imgId=i;
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
					  target=ev.getTarget(event),
					  type=event.type;
                  switch(type){
				    
					case "mouseover":
					if(target.tagName=='A'&&target.className=='instreet_other_close'){
					   var parent=target.parentNode;
					   if(parent.className==='instreet_other_title'){
					     	parent.id="instreet_other_close";
					   }
					}else if(target.tagName=='A'&&target.className=='instreet_share_button'){
					    var next,
						    parent;
						   instreet.closeActiveAd();						   

						   parent=target.parentNode;
						   next=target.nextSibling;
						   hide(target);
						   parent.id="INSTREET_AD_ACTIVE";
						   show(next);
						   next.onmouseover=null;
						   next.onmouseout=null;
						   next.onmouseover=function(){
						      parent.id="INSTREET_AD_ACTIVE";
                              show(this);
							  hide(target);
						  };
						  next.onmouseout=function(){
                              parent.id='';
							  hide(this);
							  show(target);

						  };
					}else if(target.tagName=='IMG'&&target.getAttribute('instreet_data_ready')){
						  clearTimeout(outFlag);
						  var index=target.imgId,
						      other=cache.adsArray[index].sideWrapper,
							  active=$('INSTREET_AD_ACTIVE');
						
						  if(!other)
						     return;
						  if(active&&active.parentNode==other)
						     return;
						  
						  instreet.closeActiveAd();
						  var li=other.firstChild;
						  if(li){
							li.id="INSTREET_AD_ACTIVE";
							if(li.firstChild&&li.firstChild.className=='instreet_share_button'){
								hide(li);
							}
							show(li.lastChild);
						  }
						  InstreetAd.recordImgAction(index);
					
					}
					
					break;
					
					case "mouseout":
					if(target.tagName=='A'&&target.className=='instreet_other_close'){
					   var parent=target.parentNode;if(parent.className==='instreet_other_title'){
					     parent.id="";
					   }
					}else if(target.tagName=='IMG'&&target.getAttribute('instreet_data_ready')){
					   outFlag=setTimeout(instreet.closeActiveAd,config.timer);
					}
					break;
					
					case "click":if(target.tagName=='A'&&target.className=='instreet_other_close'){
					     var parent=target.parentNode;if(parent.className==='instreet_other_title'){
						     var adbox=parent.parentNode;
							 adbox.style.display='none';
							 adbox.parentNode.id='';
					   }
					}else if(target.className=='instreet_sina'||target.className=='instreet_renren'||target.className=='instreet_tx'){
					   var other=target.parentNode.parentNode.parentNode;
					   var index=other.getAttribute('instreet_img_id');
					   var picUrl=imgs[index].src;
					   switch(target.className){
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
			   ev.bind(document.body,'mouseout',eventDelegate);
			   ev.bind(document.body,'click',eventDelegate);
			
			},


			closeActiveAd :	function (){			

				 var active_box=$('INSTREET_AD_ACTIVE');
				 if(active_box){
					 active_box.id="";					 
					 active_box.firstChild.className=='instreet_share_button'&&show(active_box.firstChild)						 
					 active_box.children.length>1&& hide(active_box.lastChild);					    					 
				 }
			},
			reLocateAd  :function(){                   //重新定位广告

               var adsArray=cache.adsArray;
               for(i in adsArray){
                  var adObj=adsArray[i],
                      sideWrapper=adObj.sideWrapper,
                      img=adObj.img,
                      pos=ev.getXY(img);

                   sideWrapper.style.cssText="top:"+pos.y+"px;left:"+(pos.x+img.width)+"px;margin-top:5px;";
                   lis=sideWrapper.children;
                   for(var j=lis.length;j--;){
                   		var box=lis[j].lastChild,
                   		    style=adObj.chooseLeft?leftPad+"px;":rightPad+"px;"
                   		 box.style.left=style;
                   }
                   

               }

			 
			},
			reLocateSpot:function(){                  //重新定位spot

               var adsArray=cache.adsArray;
               for(i in adsArray){
                  var adObj=adsArray[i],
                      spotsArray=adObj.spotsArray;
                  if(spotsArray.length>0){
                      img=adObj.img,
                      pos=ev.getXY(img),
                      w=spotsArray[0].imgWidth,
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

               }
			
			}
            


		};
        



        /********************************
        *InstreetAd 类
        ********************************/
        var InstreetAd=function(data){

             this.dataPackage=data;
             this.img=imgs[data.index];
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
			   side.setAttribute('instreet_img_id',index);
			   side.className="instreet_other";
			   side.style.cssText="top:"+pos.y+"px;left:"+(pos.x+img.width)+"px;margin-top:5px;";
			   this.sideWrapper=side;
			   this.chooseLeft();                           //判断广告放置在图片左侧或者右侧
			  
			   for(i in InstreetAd.modual){

			     var lis=InstreetAd.modual[i](data,_this);
			     
			     for(var len=lis.length,i=0;i<len;i++){
			     	side.appendChild(lis[i]);
			     }
			    			     	
			   }

			   this.addTipEvent(side);
			   instreet.container.appendChild(side);
			},
			chooseLeft    :function(){						//判断广告放置在图片左侧或者右侧
				var img=this.img,pos=ev.getXY(img);
				return this.isLeft=pos.x+img.width+360>document.body.clientWidth?true:false;    
			},
			createSpot:function(spotData){
			   var _this=this, 
			       index=_this.dataPackage.index,
			       img=_this.img,
			       w=spotData.width,
			       metrix=spotData.metrix,
				   ox=metrix%3000,
				   oy=Math.round(metrix/3000),
				   zoomNum=img.width/w,
				   x=ox*zoomNum,
				   y=oy*zoomNum,
				   pos=ev.getXY(img),
				   r=17;

			   var spot=document.createElement('a');
			   if(spotData.adsType)
			      spot.className="instreet_ad_spot";
			   else if(spotData.type.toString()=="1"||spotData.type.toString()=="2")  
			      spot.className="instreet_weibo_spot";
			   else if(spotData.type.toString()=="4")
  			      spot.className="instreet_wiki_spot";
			   spot.href="javascript:;";
			   spot.setAttribute('metrix',metrix);
			   spot.metrix=metrix;
			   spot.imgWidth=w;
			   spot.setAttribute('instreet_img_id',index);
			   spot.style.cssText="top:"+(y+pos.y-r)+"px;left:"+(x+pos.x-r)+"px;";
			   instreet.spotBox.appendChild(spot);
			   this.addSpotEvent(spot);
			   this.spotsArray.push(spot);
			},
			addSpotEvent  :function(spot){
				var _this=this,
					imgId=_this.dataPackage.index,
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
		       var data=cache.dataArray[index],img=imgs[index],
				   ul=config.iurl,pd=data.widgetSid,muh=data.imageUrlHash,
				   iu=encodeURIComponent(encodeURIComponent(img.src));
				   
				ul+="?pd="+pd+"&muh="+muh+"&iu="+iu;
				ev.importFile('js',ul);
		   
		};



		/*****************************
		*插件功能模块
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
                   open=firstData&&config.autoShow?true:false,
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
               			    
				if(open){
				   id="INSTREET_AD_ACTIVE";
				   dis="display:block;";
				}	
			
                if(!config.showAd&&!config.showFootAd){
			      return str;
			    }

                var createLI=function(index){       //创建LI

	   		      	var li=document.createElement("li");
			      	li.setAttribute("instreet_ad_id",index);
			      	li.className="instreet_aditem";
			      	li.id=id;
			      	return li;
				};

			   if(len<=0||!config.showAd){                   //只有底部广告
			      if(footData&&config.showFootAd){
	   		      	var li=createLI(0);
		      		var style=left?"left:"+leftPad+"px;"+dis:"left:"+rightPad+"px;"+dis;
			      	var str="<div class='instreet_tip'><span class='tip_top'></span><p>热门信息</p><span class='tip_bottom'></span></div>";
					str+="<div class='instreet_other_box' style='"+style+"'><div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>热门信息</div>";
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
                  if(i!=0){				    
					  id="";										
					  dis="";					
				  }
				  var li=createLI(i);
				  li.setAttribute("metrix",aMetrix[i]);
				  var style=left?"left:"+leftPad+"px;"+dis:"left:"+rightPad+"px;"+dis;
				  str="<div class='instreet_tip'><span class='tip_top'></span><p>相似商品"+tipId+"</p><span class='tip_bottom'></span></div>";
				  str+="<div class='instreet_other_box' style='"+style+"'><div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>图中相似商品</div>";
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
			   	   var li=document.createElement("li"),
			   	   	   style=left?"left:"+leftPad+"px;":"left:"+rightPad+"px;";
			   	   	li.className="instreet_weibo";   
			   
			       str="<a href='javascript:;' class='instreet_tip instreet_weibo_button'></a><div class='instreet_weibo_box' style='"+style+"'>";		
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
			   	   img=obj.img
			   	   liArray=[];
			   if(data.wikiSpot.length>0&&config.showWiki){

   			   	    var li=document.createElement("li"),
			   	   	   style=left?"left:"+leftPad+"px;":"left:"+rightPad+"px;";
			   	   	li.className="instreet_wiki";   

			       str="<a href='javascript:;' class='instreet_tip instreet_wiki_button'></a><div class='instreet_wiki_box' style='"+style+"'>";
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
			  data={widgetSid:"79cjp47BnLo3NdNaLeICIw",imageNumId:3210181,imageUrlHash:"-5247197737280147510",newsSpot:[{type:5,content:"6月30日晚，<font color='#CC0033'></font> 次出征选择黑色波点古董裙，黑发红唇，气势依旧。", title:"<font color='#CC0033'>范冰冰</font>为扮美不惜争分夺秒在车里也敷面膜(图)", url:"http%3A%2F%2Fwww.chinanews.com%2Fyl%2F2012%2F07-03%2F4003609.shtml",publisher:"中国新闻网",titleNoFormatting:"范冰冰为扮美不惜争分夺秒在车里也敷面膜(图)",unescapedUrl:"http://www.chinanews.com/yl/2012/07-03/4003609.shtml"}]};

			   var str="",
			   	  left=obj.isLeft,
			   	  liArray=[];
			   if(config.showNews){

   			   	    var li=document.createElement("li"),
			   	   	   style=left?"left:"+leftPad+"px;":"left:"+rightPad+"px;";
			   	   	li.className="instreet_news";  
			       str="<a href='javascript:;' class='instreet_tip instreet_news_button'></a><div class='instreet_news_box' style='"+style+"'>";
				   str+="<div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>图中相关新闻讯息</div>";				
				   str+='<div class="other_news_box no_border"><iframe frameborder="0" width="300" height="250" marginwidth="0" marginheight="0" src="http://www.google.com/uds/modules/elements/newsshow/iframe.html?topic=h&rsz=small&format=300x250"></iframe></div></div>';			   
			   	   li.innerHTML=str;
				   liArray.push(li);
			   }
			   return liArray;
			},
			createWheather:function(data,obj){
			    
			    var str="",liArray=[]
					left=obj.isLeft,
					url="http://www.instreet.cn/weather?location=&callback=showWeather_"+data.index;
				if(config.showWeather){
		   	      var li=document.createElement("li"),
			   	   	   style=left?"left:"+leftPad+"px;":"left:"+rightPad+"px;";
			   	  li.className="instreet_weather"; 
				  str="<a href='javascript:;' class='instreet_tip instreet_weather_button'></a><div class='instreet_weather_box' style='"+style+"'>";
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
		//mixConfig(instreet_config);

		/************************* 
		*init function
		*************************/
		function init(){

		     instreet.init();
			 cache.initData();
			 ev.bind(window,'load',function(){instreet.reLocateAd();instreet.reLocateSpot();ev.bind(window,'resize',function(){instreet.reLocateAd();instreet.reLocateSpot();});	});	 

		};
		
		
		
        //document.DomReady(function(){
             init();
		//});
        
    })(window);