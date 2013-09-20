<<<<<<< HEAD
/*! kibana - v3.0.0m3pre - 2013-09-20
=======
/*! kibana - v3.0.0m3pre - 2013-09-18
>>>>>>> 3446c24f3a651098f0a16ece681e0509f89dd22f
 * Copyright (c) 2013 Rashid Khan; Licensed Apache License */

define(["module"],function(a){var b=a.config&&a.config()||{};return{load:function(a,c,d){var e=c.toUrl(a);c(["text!"+a],function(a){b.registerTemplate&&b.registerTemplate(e,a),d(a)})}}});