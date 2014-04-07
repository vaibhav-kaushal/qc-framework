/*! (c) 2001-2013 QCubed Project | http://qcu.be | https://github.com/qcubed/framework/blob/master/_LICENSE.txt */
var $j=jQuery.noConflict(),qcubed,qc;$j.fn.extend({wait:function(b,a){b=b||1000;a=a||"fx";return this.queue(a,function(){var c=this;setTimeout(function(){$j(c).dequeue()},b)})}});$j.ajaxQueue=function(a){if(typeof $j.ajaxq==="undefined"){$j.ajax(a)}else{$j.ajaxq("qcu.be",a)}};$j.ajaxSync=function(c){var a=$j.ajaxSync.fn,b=$j.ajaxSync.data;pos=a.length;a[pos]={error:c.error,success:c.success,complete:c.complete,done:false};b[pos]={error:[],success:[],complete:[]};c.error=function(){b[pos].error=arguments};c.success=function(){b[pos].success=arguments};c.complete=function(){var d;b[pos].complete=arguments;a[pos].done=true;if(pos===0||!a[pos-1]){for(d=pos;d<a.length&&a[d].done;d++){if(a[d].error){a[d].error.apply($j,b[d].error)}if(a[d].success){a[d].success.apply($j,b[d].success)}if(a[d].complete){a[d].complete.apply($j,b[d].complete)}a[d]=null;b[d]=null}}};return $j.ajax(c)};$j.ajaxSync.fn=[];$j.ajaxSync.data=[];qcubed={recordControlModification:function(c,a,b){if(!qcubed.controlModifications[c]){qcubed.controlModifications[c]={}}qcubed.controlModifications[c][a]=b},postBack:function(d,e,c,a){var b;d=$j("#Qform__FormId").val();b=$j("#"+d);if(a&&(typeof a!=="string")){a=$j.param({Qform__FormParameter:a});b.append('<input type="hidden" name="Qform__FormParameterType" value="obj">')}$j("#Qform__FormControl").val(e);$j("#Qform__FormEvent").val(c);$j("#Qform__FormParameter").val(a);$j("#Qform__FormCallType").val("Server");$j("#Qform__FormUpdates").val(this.formUpdates());$j("#Qform__FormCheckableControls").val(this.formCheckableControls(d,"Server"));b.trigger("submit")},formUpdates:function(){var b="",c,a;for(c in qcubed.controlModifications){for(a in qcubed.controlModifications[c]){b+=c+" "+a+" "+qcubed.controlModifications[c][a]+"\n"}}qcubed.controlModifications={};return b},formCheckableControls:function(d,b){var c=$j("#"+d).find("input,select,textarea"),a="";c.each(function(g){var e=$j(this),h=e.prop("type"),f;if(((h==="checkbox")||(h==="radio"))&&((b==="Ajax")||(!e.prop("disabled")))){f=e.attr("id");if(f.indexOf("_")>=0){if(f.indexOf("_0")>=0){a+=" "+f.substring(0,f.length-2)}}else{a+=" "+f}}});return(a.length)?a.substring(1):""},getPostData:function(g,h,f,c,e){var d=$j("#"+g).find("input,select,textarea"),b="",a="#Qform__FormParameter";if(c&&(typeof c!=="string")){b=$j.param({Qform__FormParameter:c});d=d.not(a)}else{$j(a).val(c)}$j("#Qform__FormControl").val(h);$j("#Qform__FormEvent").val(f);$j("#Qform__FormCallType").val("Ajax");$j("#Qform__FormUpdates").val(this.formUpdates());$j("#Qform__FormCheckableControls").val(this.formCheckableControls(g,"Ajax"));d.each(function(){var j=$j(this),o=j.prop("type"),m=j.attr("id"),n=j.attr("name"),l,i,k=j.val();switch(o){case"checkbox":case"radio":if(j.is(":checked")){i=n.indexOf("[");if(i>0){l=n.substring(0,i)+"_"}else{l=n+"_"}if(m.substring(0,l.length)===l){b+="&"+n+"="+m.substring(l.length)}else{b+="&"+m+"="+k}}break;case"select-multiple":j.find(":selected").each(function(){b+="&"+n+"="+$j(this).val()});break;default:b+="&"+m+"=";if(k){k=k.replace(/\%/g,"%25");k=k.replace(/&/g,escape("&"));k=k.replace(/\+/g,"%2B")}b+=k;break}});return b},postAjax:function(strForm,strControl,strEvent,mixParameter,strWaitIconControlId){var objForm=$j("#"+strForm),strFormAction=objForm.attr("action"),qFormParams={};qFormParams.form=strForm;qFormParams.control=strControl;qFormParams.event=strEvent;qFormParams.param=mixParameter;qFormParams.waitIcon=strWaitIconControlId;if(strWaitIconControlId){this.objAjaxWaitIcon=this.getWrapper(strWaitIconControlId);if(this.objAjaxWaitIcon){this.objAjaxWaitIcon.style.display="inline"}}$j.ajaxQueue({url:strFormAction,type:"POST",qFormParams:qFormParams,fnInit:function(o){o.data=qcubed.getPostData(o.qFormParams.form,o.qFormParams.control,o.qFormParams.event,o.qFormParams.param,o.qFormParams.waitIcon)},error:function(XMLHttpRequest,textStatus,errorThrown){var result=XMLHttpRequest.responseText,objErrorWindow,dialog;if(XMLHttpRequest.status!==0||result.length>0){if(result.substr(0,6)==="<html>"){alert("An error occurred during AJAX Response parsing.\r\n\r\nThe error response will appear in a new popup.");objErrorWindow=window.open("about:blank","qcubed_error","menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,width=1000,height=700,left=50,top=50");objErrorWindow.focus();objErrorWindow.document.write(result);return false}else{dialog=$j('<div id="Qcubed_AJAX_Error" />').html(result).dialog({modal:true,height:200,width:400,autoOpen:true,title:"An Error Occurred",buttons:{Ok:function(){$j(this).dialog("close")}}});return false}}},success:function(xml){var strCommands=[];$j(xml).find("control").each(function(){var $this=$j(this),strControlId="#"+$this.attr("id"),strControlHtml=$this.text(),$control=$j(strControlId),$relParent,relSelector="[data-rel='"+strControlId+"']";if(strControlId==="#Qform__FormState"){$control.val(strControlHtml)}else{if($control.length&&!$control.get(0).wrapper){if($this.data("hasrel")){$relParent=$control.parents(relSelector).last();if($relParent.length){$control.insertBefore($relParent)}$j(relSelector).remove()}$control.before(strControlHtml).remove()}else{$j(strControlId+"_ctl").html(strControlHtml)}}}).end().find("command").each(function(){strCommands.push($j(this).text())});eval(strCommands.join(""));if(qcubed.objAjaxWaitIcon){$j(qcubed.objAjaxWaitIcon).hide()}}})},initialize:function(){this.loadJavaScriptFile=function(a,b){if(a.indexOf("/")===0){a=qc.baseDir+a}else{if(a.indexOf("http")!==0){a=qc.jsAssets+"/"+a}}$j.ajax({url:a,success:b,dataType:"script",cache:true})};this.loadStyleSheetFile=function(a,b){if(a.indexOf("/")===0){a=qc.baseDir+a}else{if(a.indexOf("http")!==0){a=qc.cssAssets+"/"+a}}if(b){b=" media="+b}$j("head").append('<link rel="stylesheet"'+b+' href="'+a+'" type="text/css" />')};this.wrappers=[];return this}};qcubed._objTimers={};qcubed.clearTimeout=function(a){if(qcubed._objTimers[a]){clearTimeout(qcubed._objTimers[a]);qcubed._objTimers[a]=null}};qcubed.setTimeout=function(b,c,a){qcubed.clearTimeout(b);qcubed._objTimers[b]=setTimeout(c,a)};qcubed.terminateEvent=function(a){a=qcubed.handleEvent(a);if(a){if(a.preventDefault){a.preventDefault()}if(a.stopPropagation){a.stopPropagation()}a.cancelBubble=true;a.returnValue=false}return false};qcubed.getControl=function(a){if(typeof a==="string"){return document.getElementById(a)}else{return a}};qcubed.getWrapper=function(b){var a=qcubed.getControl(b);if(!a){if(typeof b==="string"){return this.getControl(b+"_ctl")}return null}else{if(a.wrapper){return a.wrapper}}return a};qcubed.controlModifications={};qcubed.javascriptStyleToQcodo={};qcubed.javascriptStyleToQcodo.backgroundColor="BackColor";qcubed.javascriptStyleToQcodo.borderColor="BorderColor";qcubed.javascriptStyleToQcodo.borderStyle="BorderStyle";qcubed.javascriptStyleToQcodo.border="BorderWidth";qcubed.javascriptStyleToQcodo.height="Height";qcubed.javascriptStyleToQcodo.width="Width";qcubed.javascriptStyleToQcodo.text="Text";qcubed.javascriptWrapperStyleToQcodo={};qcubed.javascriptWrapperStyleToQcodo.position="Position";qcubed.javascriptWrapperStyleToQcodo.top="Top";qcubed.javascriptWrapperStyleToQcodo.left="Left";qcubed.recordControlModification=function(c,a,b){if(!qcubed.controlModifications[c]){qcubed.controlModifications[c]={}}qcubed.controlModifications[c][a]=b};qcubed.registerControl=function(b){var a=qcubed.getControl(b),c;if(!a){return}c=this.getControl(a.id+"_ctl");if(!c){c=a}else{c.control=a;a.wrapper=c;qcubed.wrappers[c.id]=c}c.updateStyle=function(f,e){var d=(this.control)?this.control:this,g,h,i;switch(f){case"className":d.className=e;qcubed.recordControlModification(d.id,"CssClass",e);break;case"parent":if(e){g=qcubed.getControl(e);g.appendChild(this);qcubed.recordControlModification(d.id,"Parent",e)}else{h=this.parentNode;h.removeChild(this);qcubed.recordControlModification(d.id,"Parent","")}break;case"displayStyle":d.style.display=e;qcubed.recordControlModification(d.id,"DisplayStyle",e);break;case"display":i=$j(this);if(e){i.show();qcubed.recordControlModification(d.id,"Display","1")}else{i.hide();qcubed.recordControlModification(d.id,"Display","0")}break;case"enabled":if(e){d.disabled=false;qcubed.recordControlModification(d.id,"Enabled","1")}else{d.disabled=true;qcubed.recordControlModification(d.id,"Enabled","0")}break;case"width":case"height":d.style[f]=e;if(qcubed.javascriptStyleToQcodo[f]){qcubed.recordControlModification(d.id,qcubed.javascriptStyleToQcodo[f],e)}if(this.handle){this.updateHandle()}break;case"text":d.innerHTML=e;qcubed.recordControlModification(d.id,"Text",e);break;default:if(qcubed.javascriptWrapperStyleToQcodo[f]){this.style[f]=e;qcubed.recordControlModification(d.id,qcubed.javascriptWrapperStyleToQcodo[f],e)}else{d.style[f]=e;if(qcubed.javascriptStyleToQcodo[f]){qcubed.recordControlModification(d.id,qcubed.javascriptStyleToQcodo[f],e)}}break}};c.getAbsolutePosition=function(){var d=(this.control)?this.control:this,e=$j(d).offset();return{x:e.left,y:e.top}};c.setAbsolutePosition=function(g,f,e){var d=this.offsetParent;while(d){g-=d.offsetLeft;f-=d.offsetTop;d=d.offsetParent}if(e){if(this.parentNode.nodeName.toLowerCase()!=="form"){g=Math.max(g,0);f=Math.max(f,0);g=Math.min(g,this.offsetParent.offsetWidth-this.offsetWidth);f=Math.min(f,this.offsetParent.offsetHeight-this.offsetHeight)}}this.updateStyle("left",g+"px");this.updateStyle("top",f+"px")};c.toggleDisplay=function(d){var e="display";if(d){if(d==="show"){this.updateStyle(e,true)}else{this.updateStyle(e,false)}}else{this.updateStyle(e,(this.style.display==="none"))}};c.toggleEnabled=function(f){var d=(this.control)?this.control:this,e="enabled";if(f){if(f==="enable"){this.updateStyle(e,true)}else{this.updateStyle(e,false)}}else{this.updateStyle(e,d.disabled)}};c.registerClickPosition=function(e){var d=(this.control)?this.control:this,g=e.pageX-d.offsetLeft,f=e.pageY-d.offsetTop;$j("#"+d.id+"_x").val(g);$j("#"+d.id+"_y").val(f)};if(c.control){c.focus=function(){$j(this.control).focus()}}if(c.control){c.select=function(){$j(this.control).select()}}c.blink=function(f,e){var d=(this.control)?this.control:this;$j(d).css("background-color",""+f).animate({backgroundColor:""+e},500)}};qcubed.registerControlArray=function(b){var c=b.length,a;for(a=0;a<c;a++){this.registerControl(b[a])}};qc=qcubed;qc.pB=qc.postBack;qc.pA=qc.postAjax;qc.getC=qc.getControl;qc.getW=qc.getWrapper;qc.regC=qc.registerControl;qc.regCA=qc.registerControlArray;qc.initialize();