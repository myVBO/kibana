/*! kibana - v3.0.0milestone4 - 2013-10-21
 * Copyright (c) 2013 Rashid Khan; Licensed Apache License */

define("panels/terms/module",["angular","app","underscore","jquery","kbn"],function(a,b,c,d,e){var f=a.module("kibana.panels.terms",[]);b.useModule(f),f.controller("terms",["$scope","querySrv","dashboard","filterSrv",function(b,d,e,f){b.panelMeta={modals:[{description:"Inspect",icon:"icon-info-sign",partial:"app/partials/inspector.html",show:b.panel.spyable}],editorTabs:[{title:"Queries",src:"app/partials/querySelect.html"}],status:"Beta",description:"Displays the results of an elasticsearch facet as a pie chart, bar chart, or a table"};var g={queries:{mode:"all",ids:[]},field:"_type",exclude:[],missing:!0,other:!0,size:10,order:"count",style:{"font-size":"10pt"},donut:!1,tilt:!1,labels:!0,arrangement:"horizontal",chart:"bar",counter_pos:"above",spyable:!0};c.defaults(b.panel,g),b.init=function(){b.hits=0,b.$on("refresh",function(){b.get_data()}),b.get_data()},b.get_data=function(){if(0!==e.indices.length){b.panelMeta.loading=!0;var g,h,i;g=b.ejs.Request().indices(e.indices),b.panel.queries.ids=d.idsByMode(b.panel.queries),i=b.ejs.BoolQuery(),c.each(b.panel.queries.ids,function(a){i=i.should(d.getEjsObj(a))}),g=g.facet(b.ejs.TermsFacet("terms").field(b.panel.field).size(b.panel.size).order(b.panel.order).exclude(b.panel.exclude).facetFilter(b.ejs.QueryFilter(b.ejs.FilteredQuery(i,f.getBoolFilter(f.ids))))).size(0),b.inspector=a.toJson(JSON.parse(g.toString()),!0),h=g.doSearch(),h.then(function(a){var d=0;b.panelMeta.loading=!1,b.hits=a.hits.total,b.data=[],c.each(a.facets.terms.terms,function(a){var c={label:a.term,data:[[d,a.count]],actions:!0};b.data.push(c),d+=1}),b.data.push({label:"Missing field",data:[[d,a.facets.terms.missing]],meta:"missing",color:"#aaa",opacity:0}),b.data.push({label:"Other values",data:[[d+1,a.facets.terms.other]],meta:"other",color:"#444"}),b.$emit("render")})}},b.build_search=function(a,d){if(c.isUndefined(a.meta))f.set({type:"terms",field:b.panel.field,value:a.label,mandate:d?"mustNot":"must"});else{if("missing"!==a.meta)return;f.set({type:"exists",field:b.panel.field,mandate:d?"must":"mustNot"})}},b.set_refresh=function(a){b.refresh=a},b.close_edit=function(){b.refresh&&b.get_data(),b.refresh=!1,b.$emit("render")},b.showMeta=function(a){return c.isUndefined(a.meta)?!0:"other"!==a.meta||b.panel.other?"missing"!==a.meta||b.panel.missing?!0:!1:!1}}]),f.directive("termsChart",["querySrv",function(b){return{restrict:"A",link:function(f,g){function h(){var a,e;g.css({height:f.panel.height||f.row.height}),e=c.clone(f.data),e=f.panel.missing?e:c.without(e,c.findWhere(e,{meta:"missing"})),e=f.panel.other?e:c.without(e,c.findWhere(e,{meta:"other"})),require(["jquery.flot.pie"],function(){try{if("bar"===f.panel.chart&&(a=d.plot(g,e,{legend:{show:!1},series:{lines:{show:!1},bars:{show:!0,fill:1,barWidth:.8,horizontal:!1},shadowSize:1},yaxis:{show:!0,min:0,color:"#c8c8c8"},xaxis:{show:!1},grid:{borderWidth:0,borderColor:"#eee",color:"#eee",hoverable:!0,clickable:!0},colors:b.colors})),"pie"===f.panel.chart){var c=function(a,b){return"<div ng-click=\"build_search(panel.field,'"+a+"')"+' "style="font-size:8pt;text-align:center;padding:2px;color:white;">'+a+"<br/>"+Math.round(b.percent)+"%</div>"};a=d.plot(g,e,{legend:{show:!1},series:{pie:{innerRadius:f.panel.donut?.4:0,tilt:f.panel.tilt?.45:1,radius:1,show:!0,combine:{color:"#999",label:"The Rest"},stroke:{width:0},label:{show:f.panel.labels,radius:2/3,formatter:c,threshold:.1}}},grid:{hoverable:!0,clickable:!0},colors:b.colors})}g.is(":visible")&&setTimeout(function(){f.legend=a.getData(),f.$$phase||f.$apply()})}catch(h){g.text(h)}})}f.$on("render",function(){h()}),a.element(window).bind("resize",function(){h()}),g.bind("plotclick",function(a,b,c){c&&f.build_search(f.data[c.seriesIndex])});var i=d("<div>");g.bind("plothover",function(a,b,c){if(c){var d="bar"===f.panel.chart?c.datapoint[1]:c.datapoint[1][0][1];i.html(e.query_color_dot(c.series.color,20)+" "+c.series.label+" ("+d.toFixed(0)+")").place_tt(b.pageX,b.pageY)}else i.remove()})}}}])});