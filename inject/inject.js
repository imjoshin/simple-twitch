
$(document).ready(function(){

  if(localStorage.getItem("enabled") === null) localStorage["enabled"] = "true";
  if(localStorage.getItem("chatLocation") === null) localStorage["chatLocation"] = "r";
  if(localStorage.getItem("chatWidth") === null) localStorage["chatWidth"] = 250;
  if(localStorage.getItem("chatFontSize") === null) localStorage["chatFontSize"] = 10;

  var enabled = (localStorage["enabled"] == "true");
  var chatLocation = localStorage["chatLocation"];
  var chatWidth = localStorage["chatWidth"];
  var chatFontSize = localStorage["chatFontSize"];

  //preset settings
  settingsHeight = (enabled ? 160 : 30);

  //conditions
  settingsShown = false;

  //CSS to inject
  var css = {
    //left section
    "#left_col": "display: none;",
    //video and stats display
    "#main_col": "margin-left: " + (chatLocation == "r" ? 0 : chatWidth) + "px; margin-right: " + (chatLocation == "r" ? chatWidth : 0) + "px; background-color: #000000;",
    "#right_col": "width: " + chatWidth + "px;" + (chatLocation == "r" ? "" : " left: 0px;"),
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
    "#right_close": "display: none;",
    ".chat-room": "width: " + chatWidth + "px; top: 0px;",
    ".chat-interface": "width: " + chatWidth + "px; height: 90px; background-color: #000000; padding: 7px 10px 5px;",
    ".chat_text_input": "color: #ffffff; background-color: #222222",
    ".chat-header": "display: none;",
    ".chat-display": "padding: 10px;",
    ".chat-messages": "bottom: 90px; background-color: #000000;",
    ".chat-lines": "font-size: " + chatFontSize + "px; background-color: #000000; color: #ffffff;",
    ".chat-line": "padding: 0; line-height: 17px",
    ".emoticon": "height: 15px; margin: " + (chatFontSize - 8) + "px;",
    //sendchat stuff
    ".textarea-contain": "margin-bottom: 3px;",

    //SMALL FIXES
    ".theatre-button": "display: none;",
    ".js-options": "display: none;"

  };

  //check for video and chat elements, then inject
  var checkTimer = setInterval(checkInjectReady, 1000);
  function checkInjectReady () {
    if ($(".dynamic-player").length && $(".chat-lines").length) {
      clearInterval(checkTimer);
      localStorage["showingVideo"] = "true";
      if(enabled) injectCSS();
      injectPopup();
    }
  }

  var checkProfileTimer = setInterval(checkProfileReady, 1000);
  function checkProfileReady () {
    if ($(".profile-name").length) {
      if(localStorage["showingVideo"] == "true"){
        clearInterval(checkProfileTimer);
        localStorage["showingVideo"] = "false";
        //window.location = window.location + "/profile";
        location.reload(true);
      }
    }
  }

  function injectPopup(){
    //inject button on chat bar
    var buttonStyle = "width:20px; height: 20px; position: relative; left: 15px; top: 5px;";
    var button = "<input type='image' title='Simple Twitch' src='http://joshjohnson.io/images/simple-twitch.png' class='settingsButton' style='" + buttonStyle + "'/>";
    $(".chat-buttons-container").append(button);

    var checkStyle = `
      position: relative;
      top: 2px;
      margin-bottom: 10px;
    `;
    var labelStyle = `
      display: inline;
    `;
    var selectStyle = `
      display: inline;
      font-size: 10px;
      margin-bottom: 10px;
    `;
    var settingsStyle = `
      height: ` + settingsHeight + `px;
      width: ` + (enabled ? localStorage["chatWidth"] : $("#right_col").width()) + `px;
      z-index: 99;
      padding: 0;
      background-color: #000000;
      color: #ffffff;
      position: absolute;
      text-align: center;
      bottom: -` + (settingsHeight) + `px;`;
    var settings = `
    <div class='settings' style='` + settingsStyle + `'>
      Enabled: <input class="enabled" style='` + checkStyle + `' type='checkbox'><br/>
      Chat Location: <select class="chatLocation" style='` + selectStyle + `'><option value="r">Right</option><option value="l">Left</option></select><br/>
      Chat Font Size: <label class='chatFontSizeNum' style='` + labelStyle + `'>0</label><br/>
      <input class='chatFontSizeRange' type='range' min='4' max='20'><br/>
      Chat Width: <label class='chatWidthNum' style='` + labelStyle + `'>0</label><br/>
      <input class='chatWidthRange' type='range' min='175' max='500'>
    </div>`;

    //if not enabled, only show checkbox
    if(!enabled){
      settingsStyle += `
        background-color: #F2F2F2;
        color: #6441A5;
      `;
      settings = `
      <div class='settings' style='` + settingsStyle + `'>
        Enabled: <input class="enabled" type='checkbox'>
      </div>`;
    }

    //set settings values
    $("#right_col").append(settings);
    $(".chatFontSizeNum").text(localStorage["chatFontSize"]);
    $(".chatFontSizeRange").val(localStorage["chatFontSize"]);
    $(".chatWidthNum").text(localStorage["chatWidth"]);
    $(".chatWidthRange").val(localStorage["chatWidth"]);

    if(enabled) $(".enabled").prop("checked", true);
    $(".chatLocation").val(chatLocation);
  }

  function injectCSS() {
    //set each css value
    $.each(css, function(k, v){
      $(k).attr("style", $(k).attr("style") + "; " + v);
    });

    //small fixes
    $("a[title='Viewer List']").hide();
    $("span[original-title='Total Views']").hide();
    $("span[original-title='Followers']").hide();
  }

  //settings button click
  $(".chat-buttons-container").delegate(".settingsButton", "click", function(){
    if(!settingsShown){
      $(".rightcol-content").animate({height: "-=" + (settingsHeight)}, 300);
      $(".settings").animate({bottom: "+=" + (settingsHeight)}, 300);
    }else{
      $(".rightcol-content").animate({height: "+=" + (settingsHeight)}, 300);
      $(".settings").animate({bottom: "-=" + (settingsHeight)}, 300);
    }
    settingsShown = !settingsShown;
  });

  //enabled checkbox change
  $(document).on("change", ".enabled", function(){
    localStorage["enabled"] = ($(this).prop("checked") == true) ? "true" : "false";
    if(enabled != localStorage["enabled"]){
      alert("In order for this change to take place, you must refresh the page.");
    }
  });

  //chat location change
  $(document).on("change", ".chatLocation", function(){
    localStorage["chatLocation"] = $(".chatLocation").val();
    chatLocation = localStorage["chatLocation"];
    $("#main_col").css({"margin-left": (chatLocation == "r" ? 0 : localStorage["chatWidth"]) + "px", "margin-right": (chatLocation == "r" ? localStorage["chatWidth"] : 0) + "px"});
    $("#right_col").css({"left": (chatLocation == "r" ? "auto" : "0px"), "right": (chatLocation == "r" ? "0px" : "auto")});
  });

  //font range change
  $(document).on("change", ".chatFontSizeRange", function(){
    localStorage["chatFontSize"] = $(".chatFontSizeRange").val();
    chatFontSize = parseInt(localStorage["chatFontSize"]);
    $(".chatFontSizeNum").text(chatFontSize);
    $(".chat-line").css({"font-size": chatFontSize + "px", "line-height": (chatFontSize + 7 + (chatFontSize / 4)) + "px"});
    $(".emoticon").css({"height": (chatFontSize + 7) + "px", "margin": (chatFontSize - 8) + "px"});
  });

  //width range change
  $(document).on("change", ".chatWidthRange", function(){
    localStorage["chatWidth"] = $(".chatWidthRange").val();
    chatWidth = parseInt(localStorage["chatWidth"]);
    $(".chatWidthNum").text(chatWidth);
    $("#main_col").css({"margin-left": (localStorage["chatLocation"] == "r" ? 0 : chatWidth) + "px", "margin-right": (localStorage["chatLocation"] == "r" ? chatWidth : 0) + "px"});
    $(".tse-scroll-content").css({"width": chatWidth + "px"});
    $(".dynamic-player").css({"width": ($(window).width() - chatWidth) + "px"});
    $("#right_col").css({"width": chatWidth + "px"});
    $(".chat-room").css({"width": chatWidth + "px"});
    $(".chat-interface").css({"width": chatWidth + "px"});
    $(".settings").css({"width": chatWidth + "px"});

    var newStyle = "width: " + ($(window).width() - chatWidth) + "px !important; height: " + ($(window).height() - 30) + "px !important;";
    $(".dynamic-player").attr("style", $(".dynamic-player").attr("style") + "; " + newStyle);
  });

  //new chat message received
  $(".chat-lines").bind("DOMSubtreeModified",function(){
    if(enabled){
      $(".chat-line:not([data-changed])").attr("style", $(".chat-line").attr("style") + "; " + "padding: 0; line-height: " + (parseInt(localStorage["chatFontSize"]) + 7 + (parseInt(localStorage["chatFontSize"]) / 4)) + "px").attr("data-changed", "1");
      $(".emoticon:not([data-changed])").attr("style", $(".emoticon").attr("style") + "; " + "height: " + (parseInt(localStorage.getItem("chatFontSize")) + 7) + "px; margin: 0px;").attr("data-changed", "1");
    }
  });

  //resize video on window resize
  $(window).on("resize", function(){
    if(enabled){
      var newStyle = "width: " + ($(window).width() - chatWidth) + "px !important; height: " + ($(window).height() - 30) + "px !important;";
      $(".dynamic-player").attr("style", $(".dynamic-player").attr("style") + "; " + newStyle);

      $(".rightcol-content").css({"height": $(window).height() - (settingsShown ? settingsHeight : 0)});
    }
  });

});
