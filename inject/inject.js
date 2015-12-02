/*chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

	}
	}, 10);
});
*/
$(document).ready(function(){
  //window.addEventListener ("load", myMain, false);
  var jsInitChecktimer = setInterval(checkForJS_Finish, 1000);

  if(localStorage["chatWidth"] === null) localStorage["chatWidth"] = 250;
  if(localStorage["chatFontSize"] === null) localStorage["chatFontSize"] = 8;
  if(localStorage["enabled"] === null) localStorage["enabled"] = "true";

  localStorage["enabled"] = "true";
  var enabled = (localStorage["enabled"] == "true");
  var chatWidth = localStorage["chatWidth"];
  var chatFontSize = localStorage["chatFontSize"];

  var css = {
    //left section
    "#left_col": "display: none;",
    //video and stats display
    "#main_col": "margin-left: 0px; margin-right: " + chatWidth + "px; background-color: #000000;",
    ".tse-scroll-content": "width: " + chatWidth + "px; overflow: hidden;",
    "#main_col .tse-scrollbar": "display: none !important;",
    //video title and user info
    "#broadcast-meta": "margin: 0px;",
    //video title and user info
    "#info": "background-color: #000000;",
    //video title
    ".editable": "height: 0px;",
    ".title": "display:none;",
    //video logo
    ".profile-link": "right: 0px;",
    //channel container
    "#channel": "padding: 0px;",
    //channel information under video
    "#channel_panels": "display: none;",
    //buttons and channel stats under video
    ".stats-and-actions": "padding: 0",

    //video
    ".dynamic-player": "width: " + ($(window).width() - chatWidth) + "px !important; height: " + ($(window).height() - 30) + "px !important;",

    //CHAT STUFF
    "#right_col": "width: " + chatWidth + "px;",
    "#right_close": "display: none;",
    ".chat-room": "width: " + chatWidth + "px; top: 0px;",
    ".chat-interface": "width: " + chatWidth + "px; height: 90px; background-color: #000000; padding: 0 10px 5px;",
    ".chat_text_input": "color: #ffffff; background-color: #222222",
    ".chat-header": "display: none;",
    ".chat-display": "padding: 10px;",
    ".chat-messages": "bottom: 90px; background-color: #000000;",
    ".chat-lines": "font-size: " + chatFontSize + "px; background-color: #000000; color: #ffffff;",
    ".chat-line": "padding: 0; line-height: 17px",
    ".emoticon": "height: 15px; margin: -8px;",
    //sendchat stuff
    ".textarea-contain": "margin-bottom: 3px;",

    //SMALL FIXES
    ".theatre-button": "display: none;",
    ".js-options": "display: none;"

  };

  function checkForJS_Finish () {
    if ($(".dynamic-player").length) {
      clearInterval(jsInitChecktimer);
      if(enabled) injectCSS();
      //injectPopup();
    }
  }

  function injectPopup(){
    var buttonStyle = "width:20px; height: 20px; position: relative; top: 5px;";
    var button = "<input type='image' src='http://joshjohnson.io/images/simple-twitch.png' class='settingsButton' style='" + buttonStyle + "'/>"
    $(".chat-buttons-container").append(button);

    console.log("INJECTING POPUP");
    var popupStyle = "z-index: 99; background-color: #000000; color: #ffffff;"
    var popup = `
    <div id='settingsDialog' style='" + popupStyle + "'>
      Chat Font Size: <label id='chatFontSizeNum'>0</label><br/>
      <input id='chatFontSizeRange' type='range' min='6' max='20'><br/>
      Chat Width: <label id='chatWidthNum'>0</label><br/>
      <input id='chatWidthRange' type='range' min='100' max='500'>

    </div>`;
    $(".app-main").append(popup);

    $( '#settingsDialog' ).dialog({
  		title: 'Simple Twitch Settings',
  		width: 500,
  		height: 400,
  		autoOpen: false,
  		position: {
  			my: "center",
  			at: "center",
  			of: window
  		},
  		show: {
  			effect: "fadeIn",
  			duration: 200
  		},
  		hide: {
  			effect: "fadeOut",
  			duration: 200
  		},
  		open:  function(e, ui) {

      },
  		close: function (e, ui) {

  		}
  	});
  }
  function injectCSS() {
    console.log("INJECTING CSS");
    $.each(css, function(k, v){
      //console.log(k + ": " + v);
      $(k).attr("style", $(k).attr("style") + "; " + v);
    });

    //small fixes
    $("a[title='Viewer List']").hide();
    $("span[original-title='Total Views']").hide();
    $("span[original-title='Followers']").hide();

  }

  $(".chat-buttons-container").delegate(".settingsButton", "click", function(){
    console.log("pressed");
    $('#settingsDialog').dialog("open");
    $("#settingsDialog").zIndex(9999);
  });

  $(".chat-lines").bind("DOMSubtreeModified",function(){
    if(enabled){
      $(".chat-line:not([data-changed])").attr("style", $(".chat-line").attr("style") + "; " + "padding: 0; line-height: 17px").attr("data-changed", "1");
      $(".emoticon:not([data-changed])").attr("style", $(".emoticon").attr("style") + "; " + "height: " + (parseInt(localStorage.getItem("chatFontSize")) + 7) + "px; margin: 0px;").attr("data-changed", "1");
    }
  });

  $(window).on("resize", function(){
    if(enabled){
      var newStyle = "width: " + ($(window).width() - chatWidth) + "px !important; height: " + ($(window).height() - 30) + "px !important;";
      $(".dynamic-player").attr("style", $(".dynamic-player").attr("style") + "; " + newStyle);
    }
  });

  $(window).on('hashchange', function(e){
      location.reload();
  });
});
