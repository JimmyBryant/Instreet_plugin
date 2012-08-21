(function(window,undefined){
        
		if (window.InstreetWidget!=undefined||window.InstreetWidget != null){
			return null;
		} else {
			window.InstreetWidget = new Object();
			window.InstreetWidget.version = "2.0.1";
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
        
		/**********插件相关配置************/
		var config = {
						redurl	:	"http://www.instreet.cn/click.action",
					//widgetSid	:	"79cjp47BnLo3NdNaLeICIw",
					//widgetSid   :   "5D6FZL6a13wcmpgBnoVWsU",
					//widgetSid  :"6ed7yugOfTf7BQKm8ShWw0",
						cssurl 	:	"http://static.instreet.cn/widgets/push/css/instreet_ifeng.css",
					callbackurl	:	"http://ts.instreet.cn:90/push.action",
						murl	:	"http://ts.instreet.cn:90/tracker.action",
						iurl    :	"http://ts.instreet.cn:90/tracker8.action",
						ourl	:	"http://ts.instreet.cn:90/loadImage.action",
						imih	:	200,
						imiw	:	200,
						timer   :   1000
					/*	autoShow:   true,
						showAd  :   true,           //是否显示广告
						showFootAd: true,           //是否显示底部广告
						showShare:  true,          //是否显示分享
						showMD  :   true,          //是否显示美叮
				        showWeibo:  true,          //是否显示微博信息
						showWiki:   true,          //是否显示互动百科
						showNews:   false,         //是否显示新闻
						showWeather:true          //是否显示天气
					*/	
						
		};

		var tool={
		   getImgs  :function(){
		      var images=document.getElementsByTagName('img'),img;
			  for(var i=0,len=images.length;i<len;i++){
			    img=images[i];
			    //if(img.style.display!='none'&&img.style.visibility!='hidden'){
 					  img.setAttribute('instreet_img_id',i.toString());
					  imgs[i]=img;
				//}
			  }
		   },
		   recordImage:function(img){
		       var iu=encodeURIComponent(encodeURIComponent(img.src)),
			       pd=config.widgetSid,
				   pu=encodeURIComponent(encodeURIComponent(location.href)),
				   t=encodeURIComponent(encodeURIComponent(document.title)),
				   ul=config.ourl;

				  ul+="?iu="+iu+"&pd="+pd+"&pu="+pu+"&t="+t;
				  ev.importFile('js',ul);
			   
		   },
		   recordImgAction:function(index){                           //鼠标移动到图片上的时候发送行为记录
		       var data=cache.dataArray[index],img=imgs[index],
				   ul=config.iurl,pd=data.widgetSid,muh=data.imageUrlHash,
				   iu=encodeURIComponent(encodeURIComponent(img.src));
				   
				ul+="?pd="+pd+"&muh="+muh+"&iu="+iu;
				ev.importFile('js',ul);
		   
		   },
		   recordAction:function(tar){                    //鼠标移动到广告或者微博、百科上发送行为记录
		       
			   var index=tar.parentNode.parentNode.parentNode.getAttribute('instreet_img_id');

			   if(index!=undefined){
			      var  data=cache.dataArray[index],m,spots,img=imgs[index],
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
		   },
		   isLeft:function(img){
		   		var pos=ev.getXY(img),
				   left=pos.x+img.width+360>document.body.clientWidth?true:false;
				
				return left;		   
		   
		   }
		  
		};

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
		   getElementsByClassName:  function(parentNode,tagName,className){  		   
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
			

		var cache={
		    dataArray  :[],
			avaImages  :[],
	        initData   :function(){

			   for(var i=0,len=imgs.length;i<len;i++){
			    
			     var img=new Image(),index=i;
                 img.src=imgs[index].src;				 
				 img.setAttribute('instreet_img_id',index);
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
			   var index=img.getAttribute('instreet_img_id'),clientImg;
               for(var i=imgs.length;i--;){
			      if(imgs[i].getAttribute('instreet_img_id')==index.toString()){
				    clientImg=imgs[i];break;
				  }
			   }			   
			   if(img.width>=config.imiw&&img.height>=config.imih&&clientImg.clientWidth>=config.imiw&&clientImg.clientHeight>=config.imiw){		
				   tool.recordImage(img);			   
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
				  ifeng.startShowAd(id);
				  firstData=false;
				}
				
		};
		
		

		
		var ifeng={
		    container   :   null,
			spotBox     :   null,
		    init        :  function(){
			   var cssUrl=config.cssurl;
			   //var cssUrl="css/instreet_ifeng.css";
			   ev.importFile('css',cssUrl);
			   var container=document.createElement('div'),
			       spotBox=document.createElement('div');
			   container.id="INSTREET_CONTAINER";
			   spotBox.id="INSTREET_SPOTBOX";
			   this.container=container;
			   this.spotBox=spotBox;
			   document.body.appendChild(container);
			   container.appendChild(spotBox);
			   this.bindBodyEvent();

			},
			bindBodyEvent  :function(){                      //所有绑定在body上的事件
			
			    var eventDelegate=function(eve){
			      var event=ev.getEvent(eve),
					  target=ev.getTarget(event),
					  type=event.type;
                  switch(type){
				    
					case "mouseover":if(target.tagName=='A'&&target.className=='instreet_other_close'){
					   var parent=target.parentNode;if(parent.className==='instreet_other_title'){
					     parent.id="instreet_other_close";
					   }
					}else if(target.tagName=='A'&&target.className=='instreet_share_button'){
					    var next,
						    parent;
						   ifeng.closeActiveAd();						   

						   parent=target.parentNode;
						   next=target.nextSibling;
						   target.style.display="none";
						   parent.id="INSTREET_AD_ACTIVE";
						   next.style.display="block";
						   next.onmouseover=null;
						   next.onmouseout=null;
						   next.onmouseover=function(){
						      parent.id="INSTREET_AD_ACTIVE";
                              this.style.display="block";
							  target.style.display="none";
						  };
						  next.onmouseout=function(){
                              parent.id='';
							  this.style.display="none";
							  target.style.display="block";
						  };
					}else if(target.tagName=='IMG'&&target.getAttribute('instreet_data_ready')){
						  clearTimeout(outFlag);
						  var img_id=target.getAttribute('instreet_img_id'),
						      other=ifeng.find_instreet_other(img_id),
							  active=document.getElementById('INSTREET_AD_ACTIVE');
						
						  if(!other)
						     return;
						  if(active&&active.parentNode==other)
						     return;
						  
						  ifeng.closeActiveAd();
						  var li=other.firstChild;
						  if(li){
							li.id="INSTREET_AD_ACTIVE";
							if(li.firstChild&&li.firstChild.className=='instreet_share_button'){
								li.firstChild.style.display="none";
							}
							li.lastChild.style.display="block";
						  }
						  tool.recordImgAction(img_id);
					
					}
					
					break;
					
					case "mouseout":if(target.tagName=='A'&&target.className=='instreet_other_close'){
					   var parent=target.parentNode;if(parent.className==='instreet_other_title'){
					     parent.id="";
					   }
					}else if(target.tagName=='IMG'&&target.getAttribute('instreet_data_ready')){
					   outFlag=setTimeout(ifeng.closeActiveAd,config.timer);
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
			startShowAd:function(index){
				this.createAllBox(index);
				this.checkPosition();
			},
			createAllBox  :function(index){
		   	   var data=cache.dataArray[index],
			       img=imgs[index],
			       pos=ev.getXY(img),
				   str='';
			   var instreet_other=document.createElement('ul');
			   instreet_other.setAttribute('instreet_img_id',index);
			   instreet_other.className="instreet_other";
			   instreet_other.style.cssText="top:"+pos.y+"px;left:"+(pos.x+img.width)+"px;margin-top:10px;";
			   this.container.appendChild(instreet_other);
			  
			   for(i in modual){
			      str+=modual[i]?modual[i](data,img):'';

			   }

			   instreet_other.innerHTML+=str;
			   this.addMouseEvent(instreet_other);
			},

			createSpot:function(data,img){
			   var index=img.getAttribute('instreet_img_id'),
			       w=data.width,
			       metrix=data.metrix,
				   ox=metrix%3000,
				   oy=Math.round(metrix/3000),
				   zoomNum=img.width/w,
				   x=ox*zoomNum,
				   y=oy*zoomNum,
				   pos=ev.getXY(img),
				   r=17;

			   var spot=document.createElement('a');
			   if(data.adsType)
			      spot.className="instreet_ad_spot";
			   else if(data.type.toString()=="1"||data.type.toString()=="2")  
			      spot.className="instreet_weibo_spot";
			   else if(data.type.toString()=="4")
  			      spot.className="instreet_wiki_spot";
			   spot.href="javascript:;";
			   spot.setAttribute('metrix',metrix);
			   spot.setAttribute('instreet_img_id',index);
			   spot.style.cssText="top:"+(y+pos.y-r)+"px;left:"+(x+pos.x-r)+"px;";
			   this.spotBox.appendChild(spot);
			   this.addSpotEvent(spot);
			},
			addSpotEvent  :function(spot){
			
			   
				
					spot.onmouseover=function(){
						ifeng.closeActiveAd();
					    var imgId=this.getAttribute('instreet_img_id'),
					       metrix=this.getAttribute('metrix'),
					       other=ifeng.find_instreet_other(imgId),
						   box,
						   items;
						   
                        if(spot.className=='instreet_ad_spot'){ 
							box=ev.getElementsByClassName(other,null,'instreet_aditem');
						   for(var i=0,len=box.length;i<len;i++){

						      if(box[i].getAttribute('metrix')==metrix.toString()){
							    clearTimeout(outFlag);
							    box[i].id="INSTREET_AD_ACTIVE";
								box[i].lastChild.style.display="block";
							  }
						   }
						 }
						 else{
						 
							if(spot.className=='instreet_weibo_spot')	
								box=ev.getElementsByClassName(other,null,'instreet_weibo')[0];
							else if(spot.className=='instreet_wiki_spot')	
								box=ev.getElementsByClassName(other,null,'instreet_wiki')[0];
							items=ev.getElementsByClassName(other,null,'other_weibo_box');	
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
                            box.lastChild.style.display="block";							
						 
						 }
					     
					};
					spot.onmouseout=function(){
							var imgId=this.getAttribute('instreet_img_id'),
							   metrix=this.getAttribute('metrix'),
							   other=ifeng.find_instreet_other(imgId),
							   item;
							item=document.getElementById('instreet_box_focus');
							if(item){
								item.id='';	
							}										
					
					};
										
			},
			addMouseEvent :function(target){	                    //绑定tip上的鼠标事件
                			
			     var tips=ev.getElementsByClassName(target,null,'instreet_tip');
                 for(var i=tips.length;i--;){

                    var tip=tips[i],adItem=tip.nextSibling;
                    tip.onmouseover=function(e){
                       var parent=this.parentNode,adItem=this.nextSibling,imgId=parent.parentNode.getAttribute('instreet_img_id');
					   clearTimeout(outFlag);
					   ifeng.closeActiveAd();
					   parent.id='INSTREET_AD_ACTIVE';
					   adItem.style.display="block";

					};
					
					tip.onmouseout=function(){
					  outFlag=setTimeout(ifeng.closeActiveAd,config.timer);					   
					};
					
					adItem.onmouseover=function(){
					   clearTimeout(outFlag);
					   this.parentNode.id="INSTREET_AD_ACTIVE";
					   this.style.display="block";
					};	
					
					adItem.onmouseout=function(){
					   outFlag=setTimeout(ifeng.closeActiveAd,config.timer);	
					};
					var children=adItem.childNodes;
                    
					for(var j=children.length;j--;){
					    if(j==0) break;
						children[j].onmouseover=function(e){
						   var event=ev.getEvent(e),
							   rela=ev.getRelatedTarget(event);
						   if(this.contains(rela)){
							  return;
						   }
						   else{				 
							  tool.recordAction(this);		
						   }
									
						}
					}
					
				 }			 

			},
			closeActiveAd :	function (){			
					var cont=this.container;
					 var active_box=document.getElementById('INSTREET_AD_ACTIVE');
					 if(active_box){
						 active_box.id="";
						 
						 if(active_box.firstChild.className=='instreet_share_button'){
							active_box.firstChild.style.display="block";
						 }
						 if(active_box.lastChild){
						    active_box.lastChild.style.display="none";
						 }
					 }
			},
			checkPosition  :function(){

			   var img,
				   data_ready,
				   instreet_others,
				   cont=ifeng.container;
			       instreet_others=ev.getElementsByClassName(cont,'ul','instreet_other');

			   for(var i=0,len=imgs.length;i<len;i++){
			      img=imgs[i];
			      data_ready=img.getAttribute('instreet_data_ready');
			      if(data_ready) {

				       var img_id=img.getAttribute('instreet_img_id'),
						   pos=ev.getXY(img),
					       w=img.width;
					   for(var j=0,l=instreet_others.length;j<l;j++){
					     var other=instreet_others[j];
					     if(img_id==other.getAttribute('instreet_img_id')){
						    var top=parseInt(other.style.top.replace('px','')),
							    left=parseInt(other.style.left.replace('px',''));
							if(top!=pos.y||left!=(pos.x+w)){
							   other.style.cssText="top:"+pos.y+"px;left:"+(pos.x+w)+'px;margin-top:10px;';
							   if(pos.x+w+360>document.body.clientWidth){
							     var boxes=ev.getElementsByClassName(other,null,'instreet_other_box'),box;
								 for(var k=0;k<boxes.length;k++){
								   box=boxes[k];
							       box.style.left="-331px";
								 }
							   }
							}
						 }
					   }

					
				  }
			   } 
			 
			},
			checkSpot:function(){
			  var img,
			  	  spots=ifeng.spotBox.getElementsByTagName('a');

			  for(var i=0,len=imgs.length;i<len;i++){
			      img=imgs[i];
			      data_ready=img.getAttribute('instreet_data_ready');
			      if(data_ready) {
				       var img_id=img.getAttribute('instreet_img_id'),
						   pos=ev.getXY(img),
						   spot,
						   data,						   						   
						   r=17;
 
					   for(var j=0,l=spots.length;j<l;j++){
					     spot=spots[j];

						 if(spot.getAttribute('instreet_img_id')==img_id){
							 switch(spot.className){
								case "instreet_ad_spot":data=cache.dataArray[img_id].adsSpot[0]; break;
								case "instreet_weibo_spot":data=cache.dataArray[img_id].weiboSpot[0]; break;
								case "instreet_wiki_spot":data=cache.dataArray[img_id].wikiSpot[0]; break;
						    }

							var	w=data.width,
								metrix=parseInt(spot.getAttribute('metrix')),
								zoomNum=img.width/w,
								ox=metrix%3000,
								oy=Math.round(metrix/3000),
								x=ox*zoomNum,
								y=oy*zoomNum;

							spot.style.cssText="top:"+(y+pos.y-r)+"px;left:"+(x+pos.x-r)+"px;";
							 
						 }
					   
					   }
				  
				  }
			    }
			
			},
			find_instreet_other:function(imgId){
			  var instreet_others=ev.getElementsByClassName(ifeng.container,'ul','instreet_other');
			  for(var i=instreet_others.length;i--;){
				  if(instreet_others[i].getAttribute('instreet_img_id')==imgId.toString()){
				    return instreet_others[i];
				  }
			  }
			  return null;
			}
            
		
		};
        

		/******插件功能模块****/
		var modual={
			createAdBox :function(data,img){
			   var str='',
				   arr=[],
				   aMetrix=[],
				   len=data.adsSpot.length,
				   footAd=data.badsSpot[0],
				   left=tool.isLeft(img),id='',dis='',
                   open=firstData&&config.autoShow?true:false,
				   createAd=function(data,metrix,img){
						var str='',
					        len=data.adsSpot.length,
					        ad,
					        redUrl,
					        adData=null;  
					   
						for(var j=0;j<len;j++){
							if(data.adsSpot[j].metrix===metrix){
							  ad=data.adsSpot[j];
							  redUrl=config.redurl+"?tty=0&mid="+ad.imageNumId+"&muh="+data.imageUrlHash+"&pd="+ad.widgetSid+"&ift=&tg=&at="+ad.adsType+"&ad="+ad.adsId+"&rurl="+encodeURIComponent(encodeURIComponent(ad.adsLinkUrl));
							  if(j==len-1)
							     str+="<div adsid='"+ad.adsId+"' class='other_ad_box no_border'><table><tbody><tr><td class='td1'><a class='imgbox' href='"+redUrl+"'><img src='"+ad.adsPicUrl+"' alt='' /></a></td>";
							  else
                                 str+="<div adsid='"+ad.adsId+"' class='other_ad_box'><table><tbody><tr><td  class='td1'><a href='"+redUrl+"'><img src='"+ad.adsPicUrl+"' alt='' /></a></td>";							  
							  str+="<td class='td2'><p class='other_ad_title'><a href='"+redUrl+"' title='' target='_blank'>"+ad.adsTitle+"</a></p>";
							  str+="<p class='other_ad_new'><b>宝贝价：<span class='other_ad_price'>"+(ad.adsDiscount||ad.adsPrice)+"</span>元</b></p><p class='other_ad_buy'><a target='_blank' href='"+redUrl+"'></a></p></td></tr></tbody></table></div>";
							  if(!adData){
								adData=ad;
							  }
							}
						}
						ifeng.createSpot(adData,img);
						return str;				  
					},
					createFootAd=function(data){		

					   var footAd=data.badsSpot[0],
						   str='';
					   if(!footAd||!footAd.description){     
						  return str;
					   }else{
						  str+="<div class='other_foot_ad'>";
						  if(footAd.adsPicUrl){
						      var redUrl=config.redurl+"?tty=0&mid="+data.imageNumId+"&muh="+data.imageUrlHash+"&pd="+data.widgetSid+"&ift=&at="+(footAd.adsType||'')+"&ad="+(footAd.adsId||'')+"&tg=&rurl="+encodeURIComponent(encodeURIComponent(footAd.adsLinkUrl));
							  str=str+"<a href='"+redUrl+"'><img src='"+footAd.adsPicUrl+"' alt=''/></a>";
						  }else if(!footAd.adsLinkUrl&&footAd.description){
							 var fra=footAd.description;
							 str+=fra.slice(0,-2)+'></iframe>';
						  }
						  str+="</div>";
					   }
					   return str;
					   					
					};

               			    
				if(open){
				   id="INSTREET_AD_ACTIVE";
				   dis="display:block;";
				}	
			
               if(!config.showAd&&!config.showFootAd){
			      return str;
			   }

			   if(len<=0||!config.showAd){
			      if(footAd&&config.showFootAd){
				    if(left)
					 str="<li id='"+id+"' class='instreet_aditem' instreet_ad_id='0'><div class='instreet_tip'><span class='tip_top'></span><p>热门信息</p><span class='tip_bottom'></span></div><div class='instreet_other_box' style='left:"+leftPad+"px;"+dis+"'><div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>热门信息</div>";
					else 
					 str="<li id='"+id+"' class='instreet_aditem' instreet_ad_id='0'><div class='instreet_tip'><span class='tip_top'></span><p>热门信息</p><span class='tip_bottom'></span></div><div class='instreet_other_box' style='left:"+rightPad+"px;"+dis+"'><div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>热门信息</div>";
					str+=createFootAd(data);
					str+="</li>";
					return str;
				 }
			   }
			   else if(config.showAd&&len>0){
			   
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
				    if(id!==''){
					  id='';
					}
					if(dis!==''){
					  dis='';
					}
				  }
				  str=str+"<li id='"+id+"' instreet_ad_id='"+i+"' metrix='"+aMetrix[i]+"' class='instreet_aditem'><div class='instreet_tip'><span class='tip_top'></span><p>相似商品"+tipId+"</p><span class='tip_bottom'></span></div>";
				  
				  if(left){
				    str+="<div class='instreet_other_box' style='left:"+leftPad+"px;"+dis+"'>";
				 				     
				  }else{
				    str+="<div class='instreet_other_box' style='left:"+rightPad+"px;"+dis+"'>";
				  }
				  str+="<div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>图中相似商品</div>";
				  str+=createAd(data,aMetrix[i],img);		          
				  if(config.showFootAd)
				     str+=createFootAd(data);
				  
				  str+="</div></li>";
			   }
			  }
			   return str;

			},
			createWeibo: function(data,img){
			   var str="",
				   left=tool.isLeft(img);

			   if(data.weiboSpot.length>0&&config.showWeibo){
			   
			       str="<li class='instreet_weibo'><a href='javascript:;' class='instreet_tip instreet_weibo_button'></a>";
				  if(left){
				     str+="<div class='instreet_weibo_box' style='left:"+leftPad+"px;'>";
				  }else{
				    str+="<div class='instreet_weibo_box' style='left:"+rightPad+"px;'>";
				  }
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
						ifeng.createSpot(weibo,img);
				   }
				   str+="</div></li>";
			   
			   }
			    return str;

			
			},			
			createWiki:function(data,img){
			   var str="",
			   	   left=tool.isLeft(img);
			   if(data.wikiSpot.length>0&&config.showWiki){

			       str="<li class='instreet_wiki'><a href='javascript:;' class='instreet_tip instreet_wiki_button'></a>";
				  if(left){
				     str+="<div class='instreet_wiki_box' style='left:"+leftPad+"px;'>";
				  }else{
				     str+="<div class='instreet_wiki_box' style='left:"+rightPad+"px;'>";
				  }
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
						ifeng.createSpot(wiki,img);
				   }
				   str+="</div></li>";			   
			   }
			   return str;
			   			
			},
			createNews  :function(data,img){		  
			  data={widgetSid:"79cjp47BnLo3NdNaLeICIw",imageNumId:3210181,imageUrlHash:"-5247197737280147510",newsSpot:[{type:5,content:"6月30日晚，<font color='#CC0033'></font> 次出征选择黑色波点古董裙，黑发红唇，气势依旧。", title:"<font color='#CC0033'>范冰冰</font>为扮美不惜争分夺秒在车里也敷面膜(图)", url:"http%3A%2F%2Fwww.chinanews.com%2Fyl%2F2012%2F07-03%2F4003609.shtml",publisher:"中国新闻网",titleNoFormatting:"范冰冰为扮美不惜争分夺秒在车里也敷面膜(图)",unescapedUrl:"http://www.chinanews.com/yl/2012/07-03/4003609.shtml"}]};

			   var str="",
			   	  left=tool.isLeft(img);
			   if(config.showNews){

			       str="<li class='instreet_news'><a href='javascript:;' class='instreet_tip instreet_news_button'></a>";
				  if(left){
				     str+="<div class='instreet_news_box' style='left:"+leftPad+"px;'>";
				  }else{
				     str+="<div class='instreet_news_box' style='left:"+rightPad+"px;'>";
				  }
				  str+="<div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>图中相关新闻讯息</div>";
				
				  str+='<div class="other_news_box no_border"><iframe frameborder="0" width="300" height="250" marginwidth="0" marginheight="0" src="http://www.google.com/uds/modules/elements/newsshow/iframe.html?topic=h&rsz=small&format=300x250"></iframe></div></div></li>';			   
			   }
			   return str;
			},
			createWheather:function(data,img){
			    
			    var str="",
					left=tool.isLeft(img),
					index=img.getAttribute('instreet_img_id'),
					url="http://www.instreet.cn/weather?location=&callback=showWeather_"+index;
				if(config.showWeather){
				  str="<li class='instreet_weather'><a href='javascript:;' class='instreet_tip instreet_weather_button'></a>";
				  if(left){
				     str+="<div class='instreet_weather_box' style='left:"+leftPad+"px;'>";
				  }else{
				     str+="<div class='instreet_weather_box' style='left:"+rightPad+"px;'>";
				  }
				  str+="<div class='instreet_other_title'><a class='instreet_other_close' title='关闭'>x</a>图中相关天气讯息</div>";
				  str+="<div class='other_weather_box no_border'><iframe name='weather_inc' src='http://tianqi.xixik.com/cframe/2' width='290' height='70' frameborder='0' marginwidth='0' marginheight='0' scrolling='no'></iframe></div></div></li>";
				
				}
				return str;
			
			},
			createShare :function(){
			   var str='';
			   if(config.showShare)
			   str+="<li class='instreet_share'><a class='instreet_share_button' title='分享图片'></a><div class='instreet_share_icons'><a class='instreet_sina'  title='新浪微博'></a><a class='instreet_renren' title='人人网' ></a><a class='instreet_tx' title='腾讯微博'></a></div></li>";
			   return str;
			},
			createMD   :function(){
			   var str='';
			   if(config.showMD)
               str+="<li class='instreet_imeiding'><a class='share_button' href='http://www.imeiding.com' target='_blank' title='每叮网'></a></li>";
			   return str;
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
		
		}
		mixConfig(instreet_config);
		
		
		
        document.ready(function(){
		     tool.getImgs();
			 cache.initData();
			 ifeng.init();
			 ev.bind(window,'load',function(){ifeng.checkPosition();ifeng.checkSpot();ev.bind(window,'resize',function(){ifeng.checkPosition();ifeng.checkSpot();});	});	 
		});
        
		
    })(window);