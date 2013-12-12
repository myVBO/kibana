/*! kibana - v3.0.0pre-milestone5 - 2013-12-12
 * Copyright (c) 2013 Rashid Khan; Licensed Apache License */

define("panels/histogram/interval",["kbn"],function(a){function b(b){this.string=b;var c=a.describe_interval(b);this.type=c.type,this.ms=1e3*c.sec*c.count,"y"===this.type||"M"===this.type?(this.get=this.get_complex,this.date=new Date(0)):this.get=this.get_simple}return b.prototype={toString:function(){return this.string},after:function(a){return this.get(a,1)},before:function(a){return this.get(a,-1)},get_complex:function(a,b){switch(this.date.setTime(a),this.type){case"M":this.date.setUTCMonth(this.date.getUTCMonth()+b);break;case"y":this.date.setUTCFullYear(this.date.getUTCFullYear()+b)}return this.date.getTime()},get_simple:function(a,b){return a+b*this.ms}},b}),define("panels/histogram/timeSeries",["underscore","./interval"],function(a,b){function c(a){return parseInt(a,10)}function d(a){return 1e3*Math.floor(a.getTime()/1e3)}var e={};return e.ZeroFilled=function(c){c=a.defaults(c,{interval:"10m",start_date:null,end_date:null,fill_style:"minimal"}),this.interval=new b(c.interval),this._data={},this.start_time=c.start_date&&d(c.start_date),this.end_time=c.end_date&&d(c.end_date),this.opts=c},e.ZeroFilled.prototype.addValue=function(b,e){b=b instanceof Date?d(b):c(b),isNaN(b)||(this._data[b]=a.isUndefined(e)?0:e),this._cached_times=null},e.ZeroFilled.prototype.getOrderedTimes=function(b){var d=a.map(a.keys(this._data),c);return a.isArray(b)&&(d=d.concat(b)),a.uniq(d.sort(function(a,b){return a-b}),!0)},e.ZeroFilled.prototype.getFlotPairs=function(b){var c,d,e=this.getOrderedTimes(b);return c="all"===this.opts.fill_style?this._getAllFlotPairs:"null"===this.opts.fill_style?this._getNullFlotPairs:"no"===this.opts.fill_style?this._getNoZeroFlotPairs:this._getMinFlotPairs,d=a.reduce(e,c,[],this)},e.ZeroFilled.prototype._getMinFlotPairs=function(a,b,c,d){var e,f,g,h;return c>0&&(g=d[c-1],h=this.interval.before(b),h>g&&a.push([h,0])),a.push([b,this._data[b]||0]),d.length>c&&(e=d[c+1],f=this.interval.after(b),e>f&&a.push([f,0])),a},e.ZeroFilled.prototype._getAllFlotPairs=function(a,b,c,d){var e,f;for(a.push([d[c],this._data[d[c]]||0]),e=d[c+1],f=this.interval.after(b);d.length>c&&e>f;f=this.interval.after(f))a.push([f,0]);return a},e.ZeroFilled.prototype._getNullFlotPairs=function(a,b,c,d){var e,f,g,h;return c>0&&(g=d[c-1],h=this.interval.before(b),h>g&&a.push([h,null])),a.push([b,this._data[b]||null]),d.length>c&&(e=d[c+1],f=this.interval.after(b),e>f&&a.push([f,null])),a},e.ZeroFilled.prototype._getNoZeroFlotPairs=function(a,b){return this._data[b]&&a.push([b,this._data[b]]),a},e}),function(a){function b(b){var f,g={icon:"icon-caret-up",size:20,width:19,height:10},h=[],i=!1;b.getEvents=function(){return h},b.hideEvents=function(b){a.each(h,function(a,c){k(c.level(),b)&&c.visual().getObject().hide()})},b.showEvents=function(c){b.hideEvents(),a.each(h,function(a,b){k(b.level(),c)||b.hide()}),j()},b.hooks.processOptions.push(function(a,b){null!=b.events.data&&(i=!0)}),b.hooks.draw.push(function(a){var b=a.getOptions(),c=a.getXAxes()[b.events.xaxis-1];if(i)if(h.length<1)if(_lastRange=c.max-c.min,b.events.clustering){var d=s(b.events.types,b.events.data,c.max-c.min);f=d.types,n(d.data)}else f=b.events.types,n(b.events.data);else l();j()});var j=function(){var c=b.getPlotOffset();c.left,b.width()-c.right,a.each(h,function(a,b){r(b.getOptions().min)&&!b.isHidden()?b.visual().draw():b.visual().getObject().hide()}),o(),p()},k=function(a,b){var c={};return b?(c.start=void 0==b.min?0:b.min,c.end=void 0==b.max?h.length-1:b.max):(c.start=0,c.end=h.length-1),a>=c.start&&a<=c.end?!0:!1},l=function(){var c,d,e=b.getPlotOffset(),f=b.getXAxes()[b.getOptions().events.xaxis-1];a.each(h,function(a,g){d=e.top+b.height()-g.visual().height(),c=f.p2c(g.getOptions().min)+e.left-g.visual().width()/2,g.visual().moveTo({top:d,left:c})})},m=function(b,c,d){var e=a('<div id="tooltip">');d?e.html(d.description).place_tt(b,c,{offset:10}):e.remove()},n=function(c){a.each(c,function(a,c){var e=null!=b.getOptions().events.levels&&f&&f[c.eventType]?f[c.eventType].level:0;if(e>b.getOptions().events.levels)throw"A type's level has exceeded the maximum. Level="+e+", Max levels:"+b.getOptions().events.levels;h.push(new d(c,q(c),e))}),h.sort(e)},o=function(){var b,c=[],d={},e=0;a.each(h,function(a,e){b&&(e.getOptions().min==b.getOptions().min?(d.min||(d.min=a),d.max=a):d.min&&(c.push(d),d={})),b=e}),d.min&&c.push(d),a.each(c,function(b,c){var d=h.splice(c.min-e,c.max-c.min+1);a.each(d,function(a,b){b.visual().clear()}),e+=c.max-c.min+1})},p=function(){var a,c,d=b.getXAxes()[b.getOptions().events.xaxis-1],e=0,f=-1;if(pright=b.width()-b.getPlotOffset().right,d.min&&d.max){a=d.max-d.min;for(var g=1;g<h.length;g++)c=h[g].getOptions().min-h[g-1].getOptions().min,c/a>.007?(f=-1,e=g):(f=g,g==h.length-1)}},q=function(d){var e,h,i,j,k,l,n,o=b.getPlaceholder(),p=b.getPlotOffset(),q=b.getXAxes()[b.getOptions().events.xaxis-1],r=b.getAxes();return r.yaxis&&r.yaxis.used&&(e=r.yaxis),r.yaxis2&&r.yaxis2.used&&(e=r.yaxis2),null!=f&&f[d.eventType]&&f[d.eventType].icon?(k=f[d.eventType].icon,l=f[d.eventType].level):(k=g,l=0),j=a('<i style="position:absolute" class="'+k.icon+'"></i>').appendTo(o),h=p.top+b.height()-k.size+1,i=q.p2c(d.min)+p.left-k.size/2,j.css({left:i+"px",top:h,color:k.color,"text-shadow":"1px 1px "+k.outline+", -1px -1px "+k.outline+", -1px 1px "+k.outline+", 1px -1px "+k.outline,"font-size":k.size+"px"}),j.hide(),j.data({event:d}),j.hover(function(){var c=a(this).offset();m(c.left+a(this).width()/2,c.top,a(this).data("event")),d.min!=d.max&&b.setSelection({xaxis:{from:d.min,to:d.max},yaxis:{from:e.min,to:e.max}})},function(){a("#tooltip").remove(),b.clearSelection()}),n=new c(j,function(a){a.show()},function(a){a.remove()},function(a,b){a.css({top:b.top,left:b.left})},i,h,j.width(),j.height())},r=function(a){var c=b.getXAxes()[b.getOptions().events.xaxis-1],d=c.p2c(a);return d>0&&d<c.p2c(c.max)},s=function(b,c,d){var e,f=[],g=[];return e=t(c),a.each(e.eventTypes,function(a,b){f.push(u(e.groupedEvents[b],1,d))}),a.each(f,function(b,c){a.each(c,function(a,b){var c={min:b[0].min,max:b[b.length-1].min,eventType:b[0].eventType+",cluster",title:"Cluster of: "+b[0].title,description:b[0].description+", Number of events in the cluster: "+b.length};g.push(c)})}),{types:b,data:g}},t=function(b){var c=[],d={};return a.each(b,function(a,b){d[b.eventType]||(d[b.eventType]=[],c.push(b.eventType)),d[b.eventType].push(b)}),{eventTypes:c,groupedEvents:d}},u=function(a,b,c){for(var d,e,f,g=[],h=0,i=1;i<a.length-1;i++)h+=a[i].min-a[i-1].min;e=h/(a.length-2),d=[a[0]];for(var i=1;i<a.length;i++){var j=a[i].min-a[i-1].min;f=j/c,j>e*b&&f>.05?(g.push(d),d=[a[i]]):d.push(a[i])}return g.push(d),g}}function c(a,b,c,d,e,f,g,h){var i=a,j=b,k=c,l=d,m={left:e,top:f},n=g,o=h;this.width=function(){return n},this.height=function(){return o},this.position=function(){return m},this.draw=function(){j(i)},this.clear=function(){k(i)},this.getObject=function(){return i},this.moveTo=function(a){m=a,l(i,m)}}function d(a,b,c){var d,e=a,f=b,g=c,h=!1;this.visual=function(){return f},this.level=function(){return g},this.getOptions=function(){return e},this.getParent=function(){return d},this.isHidden=function(){return h},this.hide=function(){h=!0},this.unhide=function(){h=!1}}function e(a,b){var c=a.getOptions(),d=b.getOptions();return c.min>d.min?1:c.min<d.min?-1:0}var f={events:{levels:null,data:null,types:null,xaxis:1,clustering:!1}};a.plot.plugins.push({init:b,options:f,name:"events",version:"0.20"})}(jQuery),define("jquery.flot.events",function(){}),function(a){function b(b){function c(a){o.active&&(j(a),b.getPlaceholder().trigger("plotselecting",[f()]))}function d(b){1==b.which&&(document.body.focus(),void 0!==document.onselectstart&&null==p.onselectstart&&(p.onselectstart=document.onselectstart,document.onselectstart=function(){return!1}),void 0!==document.ondrag&&null==p.ondrag&&(p.ondrag=document.ondrag,document.ondrag=function(){return!1}),i(o.first,b),o.active=!0,q=function(a){e(a)},a(document).one("mouseup",q))}function e(a){return q=null,void 0!==document.onselectstart&&(document.onselectstart=p.onselectstart),void 0!==document.ondrag&&(document.ondrag=p.ondrag),o.active=!1,j(a),n()?g():(b.getPlaceholder().trigger("plotunselected",[]),b.getPlaceholder().trigger("plotselecting",[null])),!1}function f(){if(!n())return null;if(!o.show)return null;var c={},d=o.first,e=o.second;return a.each(b.getAxes(),function(a,b){if(b.used){var f=b.c2p(d[b.direction]),g=b.c2p(e[b.direction]);c[a]={from:Math.min(f,g),to:Math.max(f,g)}}}),c}function g(){var a=f();b.getPlaceholder().trigger("plotselected",[a]),a.xaxis&&a.yaxis&&b.getPlaceholder().trigger("selected",[{x1:a.xaxis.from,y1:a.yaxis.from,x2:a.xaxis.to,y2:a.yaxis.to}])}function h(a,b,c){return a>b?a:b>c?c:b}function i(a,c){var d=b.getOptions(),e=b.getPlaceholder().offset(),f=b.getPlotOffset();a.x=h(0,c.pageX-e.left-f.left,b.width()),a.y=h(0,c.pageY-e.top-f.top,b.height()),"y"==d.selection.mode&&(a.x=a==o.first?0:b.width()),"x"==d.selection.mode&&(a.y=a==o.first?0:b.height())}function j(a){null!=a.pageX&&(i(o.second,a),n()?(o.show=!0,b.triggerRedrawOverlay()):k(!0))}function k(a){o.show&&(o.show=!1,b.triggerRedrawOverlay(),a||b.getPlaceholder().trigger("plotunselected",[]))}function l(a,c){var d,e,f,g,h=b.getAxes();for(var i in h)if(d=h[i],d.direction==c&&(g=c+d.n+"axis",a[g]||1!=d.n||(g=c+"axis"),a[g])){e=a[g].from,f=a[g].to;break}if(a[g]||(d="x"==c?b.getXAxes()[0]:b.getYAxes()[0],e=a[c+"1"],f=a[c+"2"]),null!=e&&null!=f&&e>f){var j=e;e=f,f=j}return{from:e,to:f,axis:d}}function m(a,c){var d,e=b.getOptions();"y"==e.selection.mode?(o.first.x=0,o.second.x=b.width()):(d=l(a,"x"),o.first.x=d.axis.p2c(d.from),o.second.x=d.axis.p2c(d.to)),"x"==e.selection.mode?(o.first.y=0,o.second.y=b.height()):(d=l(a,"y"),o.first.y=d.axis.p2c(d.from),o.second.y=d.axis.p2c(d.to)),o.show=!0,b.triggerRedrawOverlay(),!c&&n()&&g()}function n(){var a=b.getOptions().selection.minSize;return Math.abs(o.second.x-o.first.x)>=a&&Math.abs(o.second.y-o.first.y)>=a}var o={first:{x:-1,y:-1},second:{x:-1,y:-1},show:!1,active:!1},p={},q=null;b.clearSelection=k,b.setSelection=m,b.getSelection=f,b.hooks.bindEvents.push(function(a,b){var e=a.getOptions();null!=e.selection.mode&&(b.mousemove(c),b.mousedown(d))}),b.hooks.drawOverlay.push(function(b,c){if(o.show&&n()){var d=b.getPlotOffset(),e=b.getOptions();c.save(),c.translate(d.left,d.top);var f=a.color.parse(e.selection.color);c.strokeStyle=f.scale("a",.8).toString(),c.lineWidth=1,c.lineJoin=e.selection.shape,c.fillStyle=f.scale("a",.4).toString();var g=Math.min(o.first.x,o.second.x)+.5,h=Math.min(o.first.y,o.second.y)+.5,i=Math.abs(o.second.x-o.first.x)-1,j=Math.abs(o.second.y-o.first.y)-1;c.fillRect(g,h,i,j),c.strokeRect(g,h,i,j),c.restore()}}),b.hooks.shutdown.push(function(b,e){e.unbind("mousemove",c),e.unbind("mousedown",d),q&&a(document).unbind("mouseup",q)})}a.plot.plugins.push({init:b,options:{selection:{mode:null,color:"#e8cfac",shape:"round",minSize:5}},name:"selection",version:"1.1"})}(jQuery),define("jquery.flot.selection",function(){}),function(a){function b(a,b){return b*Math.floor(a/b)}function c(a,b,c,d){if("function"==typeof a.strftime)return a.strftime(b);var e=function(a,b){return a=""+a,b=""+(null==b?"0":b),1==a.length?b+a:a},f=[],g=!1,h=a.getHours(),i=12>h;null==c&&(c=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]),null==d&&(d=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]);var j;j=h>12?h-12:0==h?12:h;for(var k=0;k<b.length;++k){var l=b.charAt(k);if(g){switch(l){case"a":l=""+d[a.getDay()];break;case"b":l=""+c[a.getMonth()];break;case"d":l=e(a.getDate());break;case"e":l=e(a.getDate()," ");break;case"h":case"H":l=e(h);break;case"I":l=e(j);break;case"l":l=e(j," ");break;case"m":l=e(a.getMonth()+1);break;case"M":l=e(a.getMinutes());break;case"q":l=""+(Math.floor(a.getMonth()/3)+1);break;case"S":l=e(a.getSeconds());break;case"y":l=e(a.getFullYear()%100);break;case"Y":l=""+a.getFullYear();break;case"p":l=i?"am":"pm";break;case"P":l=i?"AM":"PM";break;case"w":l=""+a.getDay()}f.push(l),g=!1}else"%"==l?g=!0:f.push(l)}return f.join("")}function d(a){function b(a,b,c,d){a[b]=function(){return c[d].apply(c,arguments)}}var c={date:a};void 0!=a.strftime&&b(c,"strftime",a,"strftime"),b(c,"getTime",a,"getTime"),b(c,"setTime",a,"setTime");for(var d=["Date","Day","FullYear","Hours","Milliseconds","Minutes","Month","Seconds"],e=0;e<d.length;e++)b(c,"get"+d[e],a,"getUTC"+d[e]),b(c,"set"+d[e],a,"setUTC"+d[e]);return c}function e(a,b){if("browser"==b.timezone)return new Date(a);if(b.timezone&&"utc"!=b.timezone){if("undefined"!=typeof timezoneJS&&"undefined"!=typeof timezoneJS.Date){var c=new timezoneJS.Date;return c.setTimezone(b.timezone),c.setTime(a),c}return d(new Date(a))}return d(new Date(a))}function f(d){d.hooks.processOptions.push(function(d){a.each(d.getAxes(),function(a,d){var f=d.options;"time"==f.mode&&(d.tickGenerator=function(a){var c=[],d=e(a.min,f),g=0,i=f.tickSize&&"quarter"===f.tickSize[1]||f.minTickSize&&"quarter"===f.minTickSize[1]?k:j;null!=f.minTickSize&&(g="number"==typeof f.tickSize?f.tickSize:f.minTickSize[0]*h[f.minTickSize[1]]);for(var l=0;l<i.length-1&&!(a.delta<(i[l][0]*h[i[l][1]]+i[l+1][0]*h[i[l+1][1]])/2&&i[l][0]*h[i[l][1]]>=g);++l);var m=i[l][0],n=i[l][1];if("year"==n){if(null!=f.minTickSize&&"year"==f.minTickSize[1])m=Math.floor(f.minTickSize[0]);else{var o=Math.pow(10,Math.floor(Math.log(a.delta/h.year)/Math.LN10)),p=a.delta/h.year/o;m=1.5>p?1:3>p?2:7.5>p?5:10,m*=o}1>m&&(m=1)}a.tickSize=f.tickSize||[m,n];var q=a.tickSize[0];n=a.tickSize[1];var r=q*h[n];"second"==n?d.setSeconds(b(d.getSeconds(),q)):"minute"==n?d.setMinutes(b(d.getMinutes(),q)):"hour"==n?d.setHours(b(d.getHours(),q)):"month"==n?d.setMonth(b(d.getMonth(),q)):"quarter"==n?d.setMonth(3*b(d.getMonth()/3,q)):"year"==n&&d.setFullYear(b(d.getFullYear(),q)),d.setMilliseconds(0),r>=h.minute&&d.setSeconds(0),r>=h.hour&&d.setMinutes(0),r>=h.day&&d.setHours(0),r>=4*h.day&&d.setDate(1),r>=2*h.month&&d.setMonth(b(d.getMonth(),3)),r>=2*h.quarter&&d.setMonth(b(d.getMonth(),6)),r>=h.year&&d.setMonth(0);var s,t=0,u=Number.NaN;do if(s=u,u=d.getTime(),c.push(u),"month"==n||"quarter"==n)if(1>q){d.setDate(1);var v=d.getTime();d.setMonth(d.getMonth()+("quarter"==n?3:1));var w=d.getTime();d.setTime(u+t*h.hour+(w-v)*q),t=d.getHours(),d.setHours(0)}else d.setMonth(d.getMonth()+q*("quarter"==n?3:1));else"year"==n?d.setFullYear(d.getFullYear()+q):d.setTime(u+r);while(u<a.max&&u!=s);return c},d.tickFormatter=function(a,b){var d=e(a,b.options);if(null!=f.timeformat)return c(d,f.timeformat,f.monthNames,f.dayNames);var g,i=b.options.tickSize&&"quarter"==b.options.tickSize[1]||b.options.minTickSize&&"quarter"==b.options.minTickSize[1],j=b.tickSize[0]*h[b.tickSize[1]],k=b.max-b.min,l=f.twelveHourClock?" %p":"",m=f.twelveHourClock?"%I":"%H";g=j<h.minute?m+":%M:%S"+l:j<h.day?k<2*h.day?m+":%M"+l:"%b %d "+m+":%M"+l:j<h.month?"%b %d":i&&j<h.quarter||!i&&j<h.year?k<h.year?"%b":"%b %Y":i&&j<h.year?k<h.year?"Q%q":"Q%q %Y":"%Y";var n=c(d,g,f.monthNames,f.dayNames);return n})})})}var g={xaxis:{timezone:null,timeformat:null,twelveHourClock:!1,monthNames:null}},h={second:1e3,minute:6e4,hour:36e5,day:864e5,month:2592e6,quarter:7776e6,year:1e3*525949.2*60},i=[[1,"second"],[2,"second"],[5,"second"],[10,"second"],[30,"second"],[1,"minute"],[2,"minute"],[5,"minute"],[10,"minute"],[30,"minute"],[1,"hour"],[2,"hour"],[4,"hour"],[8,"hour"],[12,"hour"],[1,"day"],[2,"day"],[3,"day"],[.25,"month"],[.5,"month"],[1,"month"],[2,"month"]],j=i.concat([[3,"month"],[6,"month"],[1,"year"]]),k=i.concat([[1,"quarter"],[2,"quarter"],[1,"year"]]);a.plot.plugins.push({init:f,options:g,name:"time",version:"1.0"}),a.plot.formatDate=c}(jQuery),define("jquery.flot.time",function(){}),function(a){function b(a,b){return b*Math.floor(a/b)}function c(c){c.hooks.processDatapoints.push(function(c){a.each(c.getAxes(),function(a,c){var d=c.options;("byte"===d.mode||"byteRate"===d.mode)&&(c.tickGenerator=function(a){var c,e=[],f=2,g=a.delta,h=0,i=0,j=0;for("byteRate"===d.mode&&(a.rate=!0),a.tickDecimals="number"==typeof d.tickDecimals?d.tickDecimals:2;Math.abs(g)>=1024;)h++,g/=1024;for(;1024>=f&&!(f>=g);)f*=2;a.tickSize="undefined"!=typeof d.minTickSize&&f<d.minTickSize?d.minTickSize:f*Math.pow(1024,h),i=b(a.min,a.tickSize);do c=i+j++*a.tickSize,e.push(c);while(c<a.max);return e},c.tickFormatter=function(a,b){for(var c,d=0;Math.abs(a)>=1024;)d++,a/=1024;switch(d){case 0:c=" B";break;case 1:c=" KB";break;case 2:c=" MB";break;case 3:c=" GB";break;case 4:c=" TB";break;case 5:c=" PB";break;case 6:c=" EB";break;case 7:c=" ZB";break;case 8:c=" YB"}return"undefined"!=typeof b.rate&&(c+="/s"),a.toFixed(b.tickDecimals)+c})})})}var d={};a.plot.plugins.push({init:c,options:d,name:"byte",version:"0.1"})}(jQuery),define("jquery.flot.byte",function(){}),function(a){function b(a){function b(a,b){for(var c=null,d=0;d<b.length&&a!=b[d];++d)b[d].stack==a.stack&&(c=b[d]);return c}function c(a,c,d){if(null!=c.stack&&c.stack!==!1){var e=b(c,a.getData());if(e){for(var f,g,h,i,j,k,l,m,n=d.pointsize,o=d.points,p=e.datapoints.pointsize,q=e.datapoints.points,r=[],s=c.lines.show,t=c.bars.horizontal,u=n>2&&(t?d.format[2].x:d.format[2].y),v=s&&c.lines.steps,w=!0,x=t?1:0,y=t?0:1,z=0,A=0;;){if(z>=o.length)break;if(l=r.length,null==o[z]){for(m=0;n>m;++m)r.push(o[z+m]);z+=n}else if(A>=q.length){if(!s)for(m=0;n>m;++m)r.push(o[z+m]);z+=n}else if(null==q[A]){for(m=0;n>m;++m)r.push(null);w=!0,A+=p}else{if(f=o[z+x],g=o[z+y],i=q[A+x],j=q[A+y],k=0,f==i){for(m=0;n>m;++m)r.push(o[z+m]);r[l+y]+=j,k=j,z+=n,A+=p}else if(f>i){if(s&&z>0&&null!=o[z-n]){for(h=g+(o[z-n+y]-g)*(i-f)/(o[z-n+x]-f),r.push(i),r.push(h+j),m=2;n>m;++m)r.push(o[z+m]);k=j}A+=p}else{if(w&&s){z+=n;continue}for(m=0;n>m;++m)r.push(o[z+m]);s&&A>0&&null!=q[A-p]&&(k=j+(q[A-p+y]-j)*(f-i)/(q[A-p+x]-i)),r[l+y]+=k,z+=n}w=!1,l!=r.length&&u&&(r[l+2]+=k)}if(v&&l!=r.length&&l>0&&null!=r[l]&&r[l]!=r[l-n]&&r[l+1]!=r[l-n+1]){for(m=0;n>m;++m)r[l+n+m]=r[l+m];r[l+1]=r[l-n+1]}}d.points=r}}}a.hooks.processDatapoints.push(c)}var c={series:{stack:null}};a.plot.plugins.push({init:b,options:c,name:"stack",version:"1.2"})}(jQuery),define("jquery.flot.stack",function(){}),function(a){function b(a){function b(a,b,d){if(f||(f=!0,g=c(a.getData())),1==b.stackpercent){var e=d.length;b.percents=[];var h=0,i=1;b.bars&&b.bars.horizontal&&b.bars.horizontal===!0&&(h=1,i=0);for(var j=0;e>j;j++){var k=g[d[j][h]+""];k>0?b.percents.push(100*d[j][i]/k):b.percents.push(0)}}}function c(a){var b=a.length,c={};if(b>0)for(var d=0;b>d;d++)if(a[d].stackpercent){var e=0,f=1;a[d].bars&&a[d].bars.horizontal&&a[d].bars.horizontal===!0&&(e=1,f=0);for(var g=a[d].data.length,h=0;g>h;h++){var i=0;null!=a[d].data[h][1]&&(i=a[d].data[h][f]),c[a[d].data[h][e]+""]?c[a[d].data[h][e]+""]+=i:c[a[d].data[h][e]+""]=i}}return c}function d(a,b,d){if(b.stackpercent){f||(g=c(a.getData()));var h=[],i=0,j=1;b.bars&&b.bars.horizontal&&b.bars.horizontal===!0&&(i=1,j=0);for(var k=0;k<d.points.length;k+=3)e[d.points[k+i]]||(e[d.points[k+i]]=0),h[k+i]=d.points[k+i],h[k+j]=d.points[k+j]+e[d.points[k+i]],h[k+2]=e[d.points[k+i]],e[d.points[k+i]]+=d.points[k+j],g[h[k+i]+""]>0?(h[k+j]=100*h[k+j]/g[h[k+i]+""],h[k+2]=100*h[k+2]/g[h[k+i]+""]):(h[k+j]=0,h[k+2]=0);d.points=h}}var e={},f=!1,g={};a.hooks.processRawData.push(b),a.hooks.processDatapoints.push(d)}var c={series:{stackpercent:null}};a.plot.plugins.push({init:b,options:c,name:"stackpercent",version:"0.1"})}(jQuery),define("jquery.flot.stackpercent",function(){}),define("panels/histogram/module",["angular","app","jquery","underscore","kbn","moment","./timeSeries","jquery.flot","jquery.flot.events","jquery.flot.selection","jquery.flot.time","jquery.flot.byte","jquery.flot.stack","jquery.flot.stackpercent"],function(a,b,c,d,e,f,g){var h=a.module("kibana.panels.histogram",[]);b.useModule(h),h.controller("histogram",["$scope","querySrv","dashboard","filterSrv",function(b,c,h,i){b.panelMeta={modals:[{description:"Inspect",icon:"icon-info-sign",partial:"app/partials/inspector.html",show:b.panel.spyable}],editorTabs:[{title:"Style",src:"app/panels/histogram/styleEditor.html"},{title:"Queries",src:"app/panels/histogram/queriesEditor.html"}],status:"Stable",description:"A bucketed time series chart of the current query or queries. Uses the Elasticsearch date_histogram facet. If using time stamped indices this panel will query them sequentially to attempt to apply the lighest possible load to your Elasticsearch cluster"};var j={mode:"count",time_field:"@timestamp",value_field:null,"x-axis":!0,"y-axis":!0,scale:1,y_format:"none",grid:{max:null,min:0},queries:{mode:"all",ids:[]},annotate:{enable:!1,query:"*",size:20,field:"_type",sort:["_score","desc"]},auto_int:!0,resolution:100,interval:"5m",intervals:["auto","1s","1m","5m","10m","30m","1h","3h","12h","1d","1w","1y"],lines:!1,fill:0,linewidth:3,points:!1,pointradius:5,bars:!0,stack:!0,spyable:!0,zoomlinks:!0,options:!0,legend:!0,show_query:!0,interactive:!0,legend_counts:!0,timezone:"browser",percentage:!1,zerofill:!0,derivative:!1,tooltip:{value_type:"cumulative",query_as_alias:!0}};d.defaults(b.panel,j),d.defaults(b.panel.tooltip,j.tooltip),d.defaults(b.panel.annotate,j.annotate),d.defaults(b.panel.grid,j.grid),b.init=function(){b.options=!1,b.panel.tooltip.query_as_alias=!0,b.get_data()},b.set_interval=function(a){"auto"!==a?(b.panel.auto_int=!1,b.panel.interval=a):b.panel.auto_int=!0},b.interval_label=function(a){return b.panel.auto_int&&a===b.panel.interval?a+" (auto)":a},b.get_time_range=function(){var a=b.range=i.timeRange("last");return a},b.get_interval=function(){var a,c=b.panel.interval;return b.panel.auto_int&&(a=b.get_time_range(),a&&(c=e.secondsToHms(e.calculate_interval(a.from,a.to,b.panel.resolution,0)/1e3))),b.panel.interval=c||"10m",b.panel.interval},b.get_data=function(a,j,k){var l,m,n,o,p;if(d.isUndefined(j)&&(j=0),delete b.panel.error,0!==h.indices.length){if(l=b.get_time_range(),m=b.get_interval(l),b.panel.auto_int&&(b.panel.interval=e.secondsToHms(e.calculate_interval(l.from,l.to,b.panel.resolution,0)/1e3)),b.panelMeta.loading=!0,n=b.ejs.Request().indices(h.indices[j]),b.panel.queries.ids=c.idsByMode(b.panel.queries),o=c.getQueryObjs(b.panel.queries.ids),d.each(o,function(a){var e=b.ejs.FilteredQuery(c.toEjsObj(a),i.getBoolFilter(i.ids)),f=b.ejs.DateHistogramFacet(a.id);if("count"===b.panel.mode)f=f.field(b.panel.time_field).global(!0);else{if(d.isNull(b.panel.value_field))return b.panel.error="In "+b.panel.mode+" mode a field must be specified",void 0;f=f.keyField(b.panel.time_field).valueField(b.panel.value_field).global(!0)}f=f.interval(m).facetFilter(b.ejs.QueryFilter(e)),n=n.facet(f).size(b.panel.annotate.enable?b.panel.annotate.size:0)}),b.panel.annotate.enable){var q=b.ejs.FilteredQuery(b.ejs.QueryStringQuery(b.panel.annotate.query||"*"),i.getBoolFilter(i.idsByType("time")));n=n.query(q),n=n.sort([b.ejs.Sort(b.panel.annotate.sort[0]).order(b.panel.annotate.sort[1]),b.ejs.Sort(b.panel.time_field).desc()])}return b.populate_modal(n),p=n.doSearch(),p.then(function(c){if(b.panelMeta.loading=!1,0===j&&(b.legend=[],b.hits=0,a=[],b.annotations=[],k=b.query_id=(new Date).getTime()),!d.isUndefined(c.error))return b.panel.error=b.parse_error(c.error),void 0;if(b.query_id===k){var i,n,p=0;d.each(o,function(e){var f=c.facets[e.id];if(d.isUndefined(a[p])||0===j){var h={interval:m,start_date:l&&l.from,end_date:l&&l.to,fill_style:b.panel.derivative?"null":"minimal"};i=new g.ZeroFilled(h),n=0}else i=a[p].time_series,n=a[p].hits;d.each(f.entries,function(a){i.addValue(a.time,a[b.panel.mode]),n+=a.count,b.hits+=a.count}),b.legend[p]={query:e,hits:n},a[p]={info:e,time_series:i,hits:n},p++}),b.panel.annotate.enable&&(b.annotations=b.annotations.concat(d.map(c.hits.hits,function(a){var c=d.omit(a,"_source","sort","_score"),g=d.extend(e.flatten_json(a._source),c);return{min:a.sort[1],max:a.sort[1],eventType:"annotation",title:null,description:"<small><i class='icon-tag icon-flip-vertical'></i> "+g[b.panel.annotate.field]+"</small><br>"+f(a.sort[1]).format("YYYY-MM-DD HH:mm:ss"),score:a.sort[0]}})),b.annotations=d.sortBy(b.annotations,function(a){return a.score*("desc"===b.panel.annotate.sort[1]?-1:1)}),b.annotations=b.annotations.slice(0,b.panel.annotate.size)),b.$emit("render",a),j<h.indices.length-1&&b.get_data(a,j+1,k)}})}},b.zoom=function(a){var c=i.timeRange("last"),d=c.to.valueOf()-c.from.valueOf(),e=c.to.valueOf()-d/2,g=e+d*a/2,h=e-d*a/2;if(g>Date.now()&&c.to<Date.now()){var j=g-Date.now();h-=j,g=Date.now()}a>1&&i.removeByType("time"),i.set({type:"time",from:f.utc(h).toDate(),to:f.utc(g).toDate(),field:b.panel.time_field})},b.populate_modal=function(c){b.inspector=a.toJson(JSON.parse(c.toString()),!0)},b.set_refresh=function(a){b.refresh=a},b.close_edit=function(){b.refresh&&b.get_data(),b.refresh=!1,b.$emit("render")},b.render=function(){b.$emit("render")}}]),h.directive("histogramChart",["dashboard","filterSrv",function(b,g){return{restrict:"A",template:"<div></div>",link:function(b,h){function i(a){h.css({height:b.panel.height||b.row.height});try{d.each(a,function(a){a.label=a.info.alias,a.color=a.info.color})}catch(f){return}var g=e.interval_to_ms(b.panel.interval),i=b.panel.stack?!0:null;try{var k={legend:{show:!1},series:{stackpercent:b.panel.stack?b.panel.percentage:!1,stack:b.panel.percentage?null:i,lines:{show:b.panel.lines,fill:0===b.panel.fill?.001:b.panel.fill/10,lineWidth:b.panel.linewidth,steps:!1},bars:{show:b.panel.bars,fill:1,barWidth:g/1.5,zero:!1,lineWidth:0},points:{show:b.panel.points,fill:1,fillColor:!1,radius:b.panel.pointradius},shadowSize:1},yaxis:{show:b.panel["y-axis"],min:b.panel.grid.min,max:b.panel.percentage&&b.panel.stack?100:b.panel.grid.max},xaxis:{timezone:b.panel.timezone,show:b.panel["x-axis"],mode:"time",min:d.isUndefined(b.range.from)?null:b.range.from.getTime(),max:d.isUndefined(b.range.to)?null:b.range.to.getTime(),timeformat:j(b.panel.interval),label:"Datetime",ticks:h.width()/100},grid:{backgroundColor:null,borderWidth:0,hoverable:!0,color:"#c8c8c8"}};"bytes"===b.panel.y_format&&(k.yaxis.mode="byte"),"short"===b.panel.y_format&&(k.yaxis.tickFormatter=function(a){return e.shortFormat(a,0)}),b.panel.annotate.enable&&(k.events={levels:1,data:b.annotations,types:{annotation:{level:1,icon:{icon:"icon-tag icon-flip-vertical",size:20,color:"#222",outline:"#bbb"}}}}),b.panel.interactive&&(k.selection={mode:"x",color:"#666"});var o=[];a.length>1&&(o=Array.prototype.concat.apply([],d.map(a,function(a){return a.time_series.getOrderedTimes()})),o=d.uniq(o.sort(function(a,b){return a-b}),!0));for(var p=0;p<a.length;p++){var q=a[p].time_series.getFlotPairs(o);b.panel.derivative&&(q=n(q)),1!==b.panel.scale&&(q=l(q,b.panel.scale)),b.panel.scaleSeconds&&(q=m(q,b.panel.interval)),a[p].data=q}b.plot=c.plot(h,a,k)}catch(f){}}function j(a){var b=e.interval_to_seconds(a);return b>=2628e3?"%Y-%m":b>=86400?"%Y-%m-%d":b>=60?"%H:%M<br>%m-%d":"%H:%M:%S"}var k;b.$on("refresh",function(){b.get_data()}),b.$on("render",function(a,b){k=b||k,i(k)}),a.element(window).bind("resize",function(){i(k)});var l=function(a,b){return d.map(a,function(a){return[a[0],a[1]*b]})},m=function(a,b){return d.map(a,function(a){return[a[0],a[1]/e.interval_to_seconds(b)]})},n=function(a){return d.map(a,function(b,c){var d;return d=0===c||null===b[1]?[b[0],null]:null===a[c-1][1]?[b[0],null]:[b[0],b[1]-a[c-1][1]]})},o=c("<div>");h.bind("plothover",function(a,c,d){var g,h,i;d?(g=d.series.info.alias||b.panel.tooltip.query_as_alias?'<small style="font-size:0.9em;"><i class="icon-circle" style="color:'+d.series.color+';"></i>'+" "+(d.series.info.alias||d.series.info.query)+"</small><br>":e.query_color_dot(d.series.color,15)+" ",h=b.panel.stack&&"individual"===b.panel.tooltip.value_type?d.datapoint[1]-d.datapoint[2]:d.datapoint[1],"bytes"===b.panel.y_format&&(h=e.byteFormat(h,2)),"short"===b.panel.y_format&&(h=e.shortFormat(h,2)),i="browser"===b.panel.timezone?f(d.datapoint[0]).format("YYYY-MM-DD HH:mm:ss"):f.utc(d.datapoint[0]).format("YYYY-MM-DD HH:mm:ss"),o.html(g+h+" @ "+i).place_tt(c.pageX,c.pageY)):o.detach()}),h.bind("plotselected",function(a,c){g.set({type:"time",from:f.utc(c.xaxis.from).toDate(),to:f.utc(c.xaxis.to).toDate(),field:b.panel.time_field})})}}}])});