this["SendHub"] = this["SendHub"] || {};
this["SendHub"]["tmpl"] = this["SendHub"]["tmpl"] || {};
this["SendHub"]["tmpl"]["app"] = this["SendHub"]["tmpl"]["app"] || {};
this["SendHub"]["tmpl"]["app"]["login"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div id=\"loginBox\" class=\"login animated bounceIn\">\n    <form id=\"loginForm\">\n    	<input required type=\"text\" name=\"number\" placeholder=\"Phone Number\" value=\"\" />\n    	<input required type=\"password\" name=\"apikey\" placeholder=\"API Key\" value=\"\" />\n    	<button id=\"login\">Login</button>\n    </form>\n</div>\n";
  },"useData":true});
this["SendHub"]["tmpl"]["app"]["main"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"contacts animated bounceInLeft\">\n    <h2>1. Select Contact</h2>\n    <div id=\"appContacts\"></div>\n    <div id=\"addBox\"></div>\n</div>\n<div class=\"sendbox animated bounceInRight\">\n    <h2>2. Send Message</h2>\n    <form id=\"sendMessageForm\">\n    	<textarea required name=\"message\" placeholder=\"Message\"></textarea>\n    	<button id=\"send\">Send</button>\n    </form>\n</div>\n";
  },"useData":true});
this["SendHub"]["tmpl"]["app"]["save"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<form id=\"saveContactForm\">\n    <input required type=\"text\" name=\"name\" placeholder=\"Name\"/>\n    <input required type=\"text\" name=\"number\" placeholder=\"Phone Number\"/>\n    <button id=\"save\">Add</button>\n</form>";
  },"useData":true});
this["SendHub"]["tmpl"]["contacts"] = this["SendHub"]["tmpl"]["contacts"] || {};
this["SendHub"]["tmpl"]["contacts"]["item"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing;
  return "		<li class=\"contact\" data-ref=\""
    + escapeExpression(lambda((data && data.index), depth0))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + ": "
    + escapeExpression(((helper = (helper = helpers.number || (depth0 != null ? depth0.number : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"number","hash":{},"data":data}) : helper)))
    + "</li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<ul class=\"contactList\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.contactList : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</ul>\n";
},"useData":true});