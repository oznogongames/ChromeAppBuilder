﻿const ChromeAppBrowserPrefix = "ChromeApp_Browser_";

var ChromeHelper = {
	ToCsString : function (str) {
		if (typeof str === 'object') {
			str = JSON.stringify(str);
		}
		var buffer = _malloc(lengthBytesUTF8(str) + 1);
		writeStringToMemory(str, buffer);
		return buffer;
	},
	ToJsString : function (ptr) {
		return Pointer_stringify(ptr);
	},
	ToJsObject : function (ptr) {
		var str = Pointer_stringify(ptr);
		try {
			return JSON.parse(str);
		} catch (e) {
			return null;
		}
	},
	FreeMemory : function (ptr) {
		_free(ptr);
	}
};

var ChromeBridgeBrowserPlugin = {
	openTab : function (urlPtr) {
		var url = ChromeHelper.ToJsString(urlPtr);
		chrome.browser.openTab({
			'url' : url
		});
	}
};

function MergePlugins(plugins, prefixes) {
	if (!Array.isArray(plugins)) {
		plugins = [plugins];
	}
	if (!Array.isArray(prefixes)) {
		prefixes = [prefixes];
	}
	for (var i = 0; i < plugins.length; i++) {
		//keys
		for (var key in plugins[i]) {
			if (plugins[i].hasOwnProperty(key)) {
				plugins[i][prefixes[i] + key] = plugins[i][key];
				delete plugins[i][key];
			}
		}
		//helper
		plugins[i].$ChromeHelper = ChromeHelper;
		autoAddDeps(plugins[i], '$ChromeHelper');
		//merge
		mergeInto(LibraryManager.library, plugins[i]);
	}
}

MergePlugins(ChromeBridgeBrowserPlugin, ChromeAppBrowserPrefix);
