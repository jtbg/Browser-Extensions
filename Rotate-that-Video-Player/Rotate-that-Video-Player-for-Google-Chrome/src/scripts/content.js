//================================================
/*

Rotate that Video Player
Improve your video experience by effortlessly rotating your video clips by 90, 180, or 270 degrees.
Copyright (C) 2024 Stefan vd
www.stefanvd.net

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


To view a copy of this license, visit http://creativecommons.org/licenses/GPL/2.0/

*/
//================================================

function updateVideoStyle(response){
	var videorotate = response.rotate;
	var videotop = response.topposition;
	var videoleft = response.leftposition;
	var videoscale = response.scale;
	// console.log("videorotate", videorotate, "videotop", videotop, "videoleft", videoleft, "videoscale", videoscale);

	// Check if the class is already added to the document body head
	var styleElement = document.getElementById("stefanvdrotate-style");
	if(!styleElement){
		// If not added, create a new style element and add it to the head
		styleElement = document.createElement("style");
		styleElement.id = "stefanvdrotate-style";
		document.head.appendChild(styleElement);
	}

	// Generate CSS rule based on the current values
	const transformValue = `rotate(${videorotate}deg) scale(${videoscale / 100}) translate(${videotop}px, ${videoleft}px)`;
	var cssRule = ".stefanvdrotate { transform: " + transformValue + "; }";

	// Update the style element with the new CSS rule
	styleElement.innerHTML = cssRule;

	// Apply the class to the appropriate elements based on the URL
	if(window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
		if(document.getElementById("movie_player")){
			document.getElementById("movie_player").style.zIndex = 1001;
			document.getElementById("movie_player").style.position = "relative";
		}
		if(document.getElementById("player-api")){
			document.getElementById("player-api").style.cssText = "overflow:visible !important";
		}
		if(document.getElementById("player")){
			document.getElementById("player").classList.add("stefanvdrotate");
			document.getElementById("player").style.zIndex = 1001;
		}
	}else{
		if(document.getElementsByTagName("video")[0]){
			document.getElementsByTagName("video")[0].classList.add("stefanvdrotate");
		}
	}
}

function setvideorotate(){
	chrome.runtime.sendMessage({name: "getSetting", urlwebsite: location.host}, function(response){
		if(response.rotate != 0 || response.topposition != 0 || response.leftposition != 0 || response.scale != 100){
			updateVideoStyle(response);
		}
	});
}

// Initial invocation
setvideorotate();

function shortcutvideorotate(){
	chrome.runtime.sendMessage({name: "getSetting", urlwebsite: location.host}, function(response){
		updateVideoStyle(response);
	});
}

// Listen for messages
chrome.runtime.onMessage.addListener(function(msg){
	if(msg.text === "shortcutrotateclockwise"){
		// console.log("Rotate 90 degrees");
		rotateVideo(90);
	}else if(msg.text === "shortcutrotaterotatecounter"){
		// console.log("Rotate -90 degrees");
		rotateVideo(-90);
	}else if(msg.text === "shortcutrotaterotatereset"){
		// console.log("Rotate Reset");
		rotateVideo(0);
	}
});

function rotateVideo(degree){
	chrome.storage.sync.get([location.host], function(result){
		var currentRotation = result[location.host]["rotate"] || 0;
		var toposition = result[location.host]["topposition"] || 0;
		var leftposition = result[location.host]["leftposition"] || 0;
		var scale = result[location.host]["scale"] || 100;
		// console.log("degree=", degree);
		var newRotation;
		if(degree === 0 || (currentRotation + degree) % 360 === 0){
			newRotation = 0;
		}else{
			newRotation = (currentRotation + degree) % 360;
		}
		// console.log("newRotation=", newRotation);
		var newobject = {"rotate": newRotation, "topposition": toposition, "leftposition": leftposition, "scale": scale};
		chrome.storage.sync.set({[location.host]: newobject}, function(){
			shortcutvideorotate();
		});
	});
}