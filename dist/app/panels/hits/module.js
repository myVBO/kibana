/*! kibana - v3.0.0m3pre - 2013-09-20
 * Copyright (c) 2013 Rashid Khan; Licensed Apache License */

define("panels/hits/module",["angular","app","underscore","jquery","kbn","jquery.flot","jquery.flot.pie"],function(a,b,c,d,e){var f=a.module("kibana.panels.hits",[]);b.useModule(f),f.controller("hits",["$scope","querySrv","dashboard","filterSrv",function(b,d,e,f){b.panelMeta={modals:[{description:"Inspect",icon:"icon-info-sign",partial:"app/partials/inspector.html",show:b.panel.spyable}],editorTabs:[{title:"Queries",src:"app/partials/querySelect.html"}],status:"Stable",description:"The total hits for a query or set of queries. Can be a pie chart, bar chart, list, or absolute total of all queries combined"};var g={queries:{mode:"all",ids:[]},style:{"font-size":"10pt"},arrangement:"horizontal",chart:"bar",counter_pos:"above",donut:!1,tilt:!1,labels:!0,spyable:!0};c.defaults(b.panel,g),b.init=function(){b.hits=0,b.$on("refresh",function(){b.get_data()}),b.get_data()},b.get_data=function(g,h){if(delete b.panel.error,b.panelMeta.loading=!0,0!==e.indices.length){var i=c.isUndefined(g)?0:g,j=b.ejs.Request().indices(e.indices[i]);b.panel.queries.ids=d.idsByMode(b.panel.queries),c.each(b.panel.queries.ids,function(a){var c=b.ejs.FilteredQuery(d.getEjsObj(a),f.getBoolFilter(f.ids));j=j.facet(b.ejs.QueryFacet(a).query(c)).size(0)}),b.inspector=a.toJson(JSON.parse(j.toString()),!0);var k=j.doSearch();k.then(function(a){if(b.panelMeta.loading=!1,0===i&&(b.hits=0,b.data=[],h=b.query_id=(new Date).getTime()),!c.isUndefined(a.error))return b.panel.error=b.parse_error(a.error),void 0;var f=c.map(c.keys(a.facets),function(a){return parseInt(a,10)});if(b.query_id===h&&c.intersection(f,b.panel.queries.ids).length===b.panel.queries.ids.length){var g=0;c.each(b.panel.queries.ids,function(e){var f=a.facets[e],h=c.isUndefined(b.data[g])||0===i?f.count:b.data[g].hits+f.count;b.hits+=f.count,b.data[g]={info:d.list[e],id:e,hits:h,data:[[g,h]]},g++}),b.$emit("render"),i<e.indices.length-1&&b.get_data(i+1,h)}})}},b.set_refresh=function(a){b.refresh=a},b.close_edit=function(){b.refresh&&b.get_data(),b.refresh=!1,b.$emit("render")}}]),f.directive("hitsChart",["querySrv",function(b){return{restrict:"A",link:function(f,g){function h(){g.css({height:f.panel.height||f.row.height});try{c.each(f.data,function(a){a.label=a.info.alias,a.color=a.info.color})}catch(a){return}try{"bar"===f.panel.chart&&(f.plot=d.plot(g,f.data,{legend:{show:!1},series:{lines:{show:!1},bars:{show:!0,fill:1,barWidth:.8,horizontal:!1},shadowSize:1},yaxis:{show:!0,min:0,color:"#c8c8c8"},xaxis:{show:!1},grid:{borderWidth:0,borderColor:"#eee",color:"#eee",hoverable:!0},colors:b.colors})),"pie"===f.panel.chart&&(f.plot=d.plot(g,f.data,{legend:{show:!1},series:{pie:{innerRadius:f.panel.donut?.4:0,tilt:f.panel.tilt?.45:1,radius:1,show:!0,combine:{color:"#999",label:"The Rest"},stroke:{width:0},label:{show:f.panel.labels,radius:2/3,formatter:function(a,b){return"<div ng-click=\"build_search(panel.query.field,'"+a+"')"+' "style="font-size:8pt;text-align:center;padding:2px;color:white;">'+a+"<br/>"+Math.round(b.percent)+"%</div>"},threshold:.1}}},grid:{hoverable:!0,clickable:!0},colors:b.colors}))}catch(a){g.text(a)}}f.$on("render",function(){h()}),a.element(window).bind("resize",function(){h()});var i=d("<div>");g.bind("plothover",function(a,b,c){if(c){var d="bar"===f.panel.chart?c.datapoint[1]:c.datapoint[1][0][1];i.html(e.query_color_dot(c.series.color,20)+" "+d.toFixed(0)).place_tt(b.pageX,b.pageY)}else i.remove()})}}}])});