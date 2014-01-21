/*  
	@Version 1.0	
	Debugging javascript file to be included at build time when render type is = to debug.
	These functions can be called from Awesomium and values can be returned.
*/

var JsInterface;

(function () {

	var obj = {
		
		isIde: false,
		isFlash: false,	
		logScroll: false,
		sheet: {},
			
		setIsIde: function () {
		
			obj.isIde = true;
			trace('Rapidity IDE is loaded.');
		
		},
		
		setIsFlash: function () {
		
			obj.isFlash = true;
		
		},	
		
		getRules: function (){
	
			var r, rules = new Array(), i;
									
			try
				{					
																								
						r = obj.sheet.cssRules;											
						
						if(r){				
						
							trace('Rules: ' + r.length + ' in main style sheet.');											
						
							for(i = 0; i < r.length; i++){
									
								rules.push({selector : r[i].selectorText, ruleIndex : i});			
										
							}																					
							
						}							
								
					return rules;
					
				}
			catch(err)
				{		
					trace(err.message);
					return false;
				}
	
		},		
				
		setRuleCSS: function (index, text, append) {
			
			// Set css text for style.
		
			var r = obj.sheet.cssRules[index];	
			
			if(r) {
			
				if(append) {
					r.style.cssText += ';' + text;
				}else {
					r.style.cssText = text;
				}
				
			
			}						
		
			trace(text);
		
		},
		
		setScrollLogging:  function (e) {
	
			obj.logScroll = e;
	
			if(e) {
				trace("Scroll logging ON.");
			}else{
				trace("Scroll logging OFF.");
			}
			
		},
		
		setTitle: function(text) {
		
			document.title = text;
		
		},
		
		setInnerText: function(id, text) {
		
			var el = document.getElementById(id), key;
			
			if(el != undefined){
				
				key = ('innerText' in el)? 'innerText' : 'textContent';
				el[key] = text;				
				trace(id + ' innerText changed to ' + text + '.');
				
			}else{
				trace('Id not found: ' + id);
			}
		
		},	

		setInnerHTML: function(id, html) {
		
			var el = document.getElementById(id);
			
			if(el != undefined){
				
				el.innerHTML = text;				
				trace(id + ' innerHTML changed to ' + html + '.');
				
			}else{
				trace('Id not found: ' + id);
			}
		
		},
		
		setAttribute: function(id, attr, value) {
		
			setProperty(id, attr, value);
		
		},
 		
		test: function() {
		
			alert('JsInterface is live.');
		
		},
	
		appendElement: function(html, parentId, refId) {

			// Create a temp element to host the new html.
			var div = document.createElement('div');
			div.innerHTML = html;    

			// Get the node to append to.
			var targetNode = document.getElementById(parentId);
			
			if(targetNode == undefined) {	
				trace('Target node with the id of <' + parentId + '> could not be found.');
				trace('Refresh the page to see new elements.');
				JsInterface.refreshNeeded();		
				return;
			}
			
			try
			  {
				var newNode = div.childNodes[0];
				if(refId == '') {
					targetNode.appendChild(newNode);
					trace('Appended ' + newNode.id + ' to ' + targetNode.id + '.');			
				} else {
					var refNode = document.getElementById(refId);
					targetNode.insertBefore(newNode, refNode);
					trace('Added ' + newNode.id + ' to ' + targetNode.id + ' before ' + refNode.id + '.');
				}		
			  }
			catch(err)
			  {
				trace('Could not append node. Refresh the page to see new elements.');
				trace(err.message);	 
				JsInterface.refreshNeeded();				
			  }
			
		},
	
		moveElement: function (parentId, srcId, targetId) {

			var src = $(srcId);
			var parent = $(parentId);	
			
			if(src == undefined){
				trace('Source node with the id of <' + srcId + '> could not be found.');
				JsInterface.refreshNeeded();			
				return;	
			}
			
			if(parent == undefined){
				trace('Source node with the id of <' + parentId + '> could not be found.');
				JsInterface.refreshNeeded();		
				return;	
			}
			
			try
			  {
				if(targetId == '') {
					parent.appendChild(src);
					trace('Appended ' + src.id + ' to ' + parent.id + '.');			
				} else {
					var target = $(targetId);	
					if(target != undefined) {
						parent.insertBefore(src, target);
						trace('Moved ' + src.id + ' to ' + parent.id + ' before ' + target.id + '.');			
					}else{
						trace('Could not get target node <' + targetId + '>. Refresh the page to see current layout.');
						JsInterface.refreshNeeded();		
					}
				}		
			  }
			catch(err)
			  {
				trace('Could not move node. Refresh the page to see new elements.');
				trace(err.message);
				JsInterface.refreshNeeded();		
			  }	
		
	},
		
		removeElement: function(id) {

			var el = $(id);
			
			if(el != undefined){
				el.parentNode.removeChild(el);
				trace(id + ' removed from DOM.');
			}else{
				trace('Id not found: ' + id);
				JsCallbacks.refreshNeeded();		
			}
			
		},	
	
		toggleScroll: function (h, v) {

			var body = document.getElementById("DEBUG_Body");
	
			trace('toggleScroll: ' + h + ' ' + v);
			
			// Hide if true.
			if(h==true){
				document.body.style.overflowX = "hidden";
				// body.style.overflowX = 'hidden';
			}else{
				// body.style.overflowX = 'auto';
				document.body.style.overflowX = "auto";
			}
			
			if(v==true){
				document.body.style.overflowY = "hidden";
				// body.style.overflowY = 'hidden';
			}else{
				document.body.style.overflowY = "auto";
				// body.style.overflowY = 'auto';
			}	

			var y = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
			window.scrollTo(0,1);
			window.scrollTo(0,-1);
		
		},

		addClass: function (id, className) {
		
			var el = $(id);
			
			if(el != undefined) {

				el.className = el.className + ' ' + className;
				
			}

		},
		
		setClassList: function (id, classString) {
		
			var el = document.getElementById(id);
			
			if(el != undefined) {

				el.className = classString;
				
			}

		},		
		
		removeClass: function (id, className) {
		
			var el = document.getElementById(id);
			
			if(el != undefined) {
				
				// https://developer.mozilla.org/en-US/docs/Web/API/Element.classList
				// May not work in all browsers. < IE10
				// el.classList.remove(className);
								
				el.className = el.className.replace(new RegExp('(?:^|\\s)' + className + '(?!\\S)') ,'');		
				
			}
		
		},
		
		updateStyles: function(rules) {
			
			var i = 0, r, rs = obj.sheet.cssRules;						
			
			for(i = 0; i < rules.length; i++) {
			
				r = rules[i];				
				rs[r.index].style[r.name] = r.value;
				trace(rs[r.index]);
			}	
		
		},
				
		appendStyle: function(selector){
				
			var sheet = obj.sheet;	
				
			try
			  {
			  							
					if(sheet.addRule) {
					
						sheet.addRule(selector, ''); // IE
						
					} else if(sheet.insertRule) {
						
						sheet.insertRule(selector, sheet.cssRules.length); // !IE
						
					}
					
					trace('Appended Rule: ' + selector);
					return sheet.cssRules.length - 1;

			  }
			catch(err)
			  {
					return -1;
			  }			
		
		},	
		
		getElementBounds: function(id) {
		
			var el = $(id), r;
			
			if(el) {								
				
				if (el.offsetParent) {
									
					r = el.getBoundingClientRect();					
					JsCallbacks.elementBoundsCallback(r.left, r.top, r.right, r.bottom, el.clientWidth, el.clientHeight);			
					
				}	
					
			}									
		
		},
		
		toggleScroll: function (h, v) {

			var body = $("DEBUG_Body");
			
			trace('toggleScroll: ' + h + ' ' + v);
			
			// Hide if true.
			if(h==true){
				document.body.style.overflowX = "hidden";
				// body.style.overflowX = 'hidden';
			}else{
				// body.style.overflowX = 'auto';
				document.body.style.overflowX = "auto";
			}
			
			if(v==true){
				document.body.style.overflowY = "hidden";
				// body.style.overflowY = 'hidden';
			}else{
				document.body.style.overflowY = "auto";
				// body.style.overflowY = 'auto';
			}	

			var y = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
			window.scrollTo(0,1);
			window.scrollTo(0,-1);
		}		
		
	};	
		
	function setProperty(id, key, value) {

		var el = document.getElementById(id), key;
			
		if(el != undefined){
			
			if(key == "readonly") {
				el.readOnly = (value == "readonly") ? true : false;
				value = el.readOnly;
				
			}else if(key == "maxlength") {
				el.maxLength = value;
				
			}else if(key == "contenteditable") {
				el.contentEditable = (value == 'true') ? true : false;				
				value = el.contentEditable;
				
			}else if(key == "draggable") {
				// May need to modify. Does not work in Awesonium but may work in browser.
				el.draggable = (value == 'true') ? true : false;
				value = el.draggable;
				
			}else if(key == "spellcheck") {	
				el.spellcheck = (value == 'true') ? true : false;				
				value = el.spellcheck;
								
			}else if(key == "style") {
				el.style.cssText = value;			
			
			}else {
				el[key] = value;
				
			}
			
			trace(id + "'s " + key + " changed to '" + value + "'.");
				
		}else{
			trace('Id not found: ' + id);
		}
		
	}
	
	function trace(msg) {
	
		if(obj.isIde) {
			console.log(msg);
		}	
	
	}		

	function $(id) {
	
		return document.getElementById(id);
	
	}
	
	function _undefined(o) {
	
		var u = (typeof o === 'undefined')
	
		return u;
		
	}
	
	function hasObject(o) {
		
		if(!_undefined(o)) {return true;}	
		
		return (o != null);
		
	}
	
	function bindEvents() {
		
		var id = '', body = document.getElementsByTagName('body')[0] || '';
			
		window.onresize = function() {
						
			if(JsInterface.logScroll) {
				
				trace(window.innerWidth + ', ' + window.innerHeight);
					
			}
				
		}				
			
		if(body != '') {
			
			body.onclick = function(e) {
				
				JsCallbacks.elementClicked(e.target.id, e.target.tagName);
				
			}

			body.onkeydown = function(e) {			
			
				JsCallbacks.bodyKeyDown(e.keyCode);
				
				if(e.keyCode == 113 && id != '') {
				
					JsCallbacks.activateElement(id);
					
				}
				
			}
			
			body.onkeyup = function(e) {	
			
				JsCallbacks.bodyKeyUp(e.keyCode);
				
			}		

			document.onmouseover = function(e) {			
				
				id = e.target.id;
				JsCallbacks.bodyMouseOver(e.target.tagName.toLowerCase(), id);
				
			}

			document.onmousemove = function(e) {									
			
				JsCallbacks.bodyMouseMove(e.x, e.y);
				
			}			
			
		}		
				
		// Let IDE know we are loaded.
		if(!_undefined(JsCallbacks)){JsCallbacks.loaded();}
	
	}
	
	JsInterface = obj;
	
	if(_undefined(RapidityIDE)){
		obj.isIde = false;
		window.RapidityIDE = {};
		RapidityIDE.loaded = false;
	}else{	
		obj.isIde = true;
		obj.sheet = document.getElementById("DEBUG_STYLESHEET");
		// If there are no styles there will be no style sheet. Check that here.
		obj.sheet = (obj.sheet == null) ? null : obj.sheet.sheet;
		RapidityIDE.loaded = true;
		RapidityIDE.ready(!(_undefined(JsInterface)) && !(JsInterface === null));
		bindEvents();
		trace('Enviroment: Rapidity IDE');
	}		
	
})();


