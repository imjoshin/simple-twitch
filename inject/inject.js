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

  if(localStorage.getItem("chatWidth") === null) localStorage["chatWidth"] = 250;
  if(localStorage.getItem("chatFontSize") === null) localStorage["chatFontSize"] = 8;
  if(localStorage.getItem("enabled") === null) localStorage["enabled"] = "true";

  localStorage["enabled"] = "true";
  var enabled = (localStorage["enabled"] == "true");
  var chatWidth = localStorage["chatWidth"];
  var chatFontSize = localStorage["chatFontSize"];

  //preset settings
  settingsHeight = (enabled? 180 : 40);

  //conditions
  settingsShown = false;

  console.log("localStorage:\n\tenabled: " + enabled + "\n\tchatWidth: " + chatWidth + "\n\tchatFontSize: " + chatFontSize);

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
      injectPopup();
    }
  }

  function injectPopup(){
    var buttonStyle = "width:20px; height: 20px; position: relative; top: 5px;";
    var button = "<input type='image' src='http://joshjohnson.io/images/simple-twitch.png' class='settingsButton' style='" + buttonStyle + "'/>";
    $(".chat-buttons-container").append(button);

    console.log("INJECTING POPUP");
    var settingsStyle = `
      height: ` + settingsHeight + `px;
      width: ` + $(".chat-room").width() + `px;
      z-index: 99;
      background-color: #000000;
      color: #ffffff;
      position: absolute;
      bottom: -` + (settingsHeight + 50) + `px;`;
    var settings = `
    <div id='settings' style='` + settingsStyle + `'>
      Enabled: <input class="enabled" type='checkbox'><br/>
      Chat Font Size: <label class='chatFontSizeNum'>0</label><br/>
      <input class='chatFontSizeRange' type='range' min='6' max='20'><br/>
      Chat Width: <label class='chatWidthNum'>0</label><br/>
      <input class='chatWidthRange' type='range' min='100' max='500'>
    </div>`;

    if(!enabled){

    }
    $("#right_col").append(settings);
    $(".chatFontSizeNum").text(localStorage["chatFontSize"]);
    $(".chatFontSizeRange").val(localStorage["chatFontSize"]);
    $(".chatWidthNum").text(localStorage["chatWidth"]);
    $(".chatWidthRange").val(localStorage["chatWidth"]);
    console.log("Appended settings: \n\t\t\t" + settings);

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
    if(!settingsShown){
      $(".rightcol-content").animate({height: "-=" + (settingsHeight + 50)}, 300);
      $("#settings").animate({bottom: "+=" + (settingsHeight + 50)}, 300);
    }else{
      $(".rightcol-content").animate({height: "+=" + (settingsHeight + 50)}, 300);
      $("#settings").animate({bottom: "-=" + (settingsHeight + 50)}, 300);
    }
    settingsShown = !settingsShown;
  });

  $(document).on("change", ".chatFontSizeRange", function(){
    localStorage["chatFontSize"] = $(".chatFontSizeRange").val();
    chatFontSize = parseInt(localStorage["chatFontSize"]);
    $(".chatFontSizeNum").text(chatFontSize);
    $(".chat-line").attr("style", $(".chat-line").attr("style") + "; " + "font-size: " + chatFontSize + "px;");
    $(".emoticon").attr("style", $(".emoticon").attr("style") + "; " + "height: " + (chatFontSize + 7) + "px; margin: " + (chatFontSize - 7) + "px;");
  });

  $(document).on("change", ".chatWidthRange", function(){
    localStorage["chatWidthSize"] = $(".chatWidthRange").val();
    chatWidth = parseInt(localStorage["chatWidthSize"]);
    $(".chatWidthNum").text(chatWidth);
    $("#main_col").css({"margin-right": chatWidth + "px"});
    $(".tse-scroll-content").css({"width": chatWidth + "px"});
    $(".dynamic-player").css({"width": ($(window).width() - chatWidth) + "px"});
    $("#right_col").css({"width": chatWidth + "px"});
    $(".chat-room").css({"width": chatWidth + "px"});
    $(".chat-interface").css({"width": chatWidth + "px"});
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
