// Client ID and API key from the Developer Console
var CLIENT_ID = '686773253686-sfaav9jvk1i4l603k9c394d86tlorhoj.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCc_MmF8KxOgjJgkffQEhXKZiF68VPdV7Y';
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');
var getCalendarButton = document.getElementById('get-calendar-button');
var getAppointmentButton = document.getElementById('get-appointment-button');

var IS_FREE = true;
var HAS_PLAN = false;
var INTERVAL_MINUTE = 1;
var timeIndexArray = [];
var hasTimeIndexArray = false;

var planList = [];

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {

  CLIENT_ID = '686773253686-sfaav9jvk1i4l603k9c394d86tlorhoj.apps.googleusercontent.com';
  API_KEY = 'AIzaSyCc_MmF8KxOgjJgkffQEhXKZiF68VPdV7Y';
  // Array of API discovery doc URLs for APIs used by the quickstart
  DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
  authorizeButton = document.getElementById('authorize-button');
  signoutButton = document.getElementById('signout-button');
  getCalendarButton = document.getElementById('get-calendar-button');
  getAppointmentButton = document.getElementById('get-appointment-button');

  IS_FREE = true;
  HAS_PLAN = false;
  INTERVAL_MINUTE = 1;
  timeIndexArray = [];
  hasTimeIndexArray = false;
  planList = [];


  gapi.load('client:auth2', initClient);
}
/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}
/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    getCalendarButton.style.display = 'block';
    getAppointmentButton.style.display = 'block';
    // listUpcomingEvents();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    getCalendarButton.style.display = 'none';
    getAppointmentButton.style.display = 'none';
  }
}
/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}
/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}
/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(elementId,message) {
  var pre = document.getElementById(elementId);
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}
/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {

  var starDate = document.getElementById('start-date').value;
  var endDate = document.getElementById('end-date').value;

  var condition = getCondeition(starDate,endDate);

  if(starDate){
    condition.timeMin = (new Date(starDate)).toISOString();
  } else {
    condition.timeMin = (new Date()).toISOString();
  }
  if(endDate){
    var endTime = new Date(endDate);
    endTime = new Date(endTime.setHours(23));
    endTime = new Date(endTime.setMinutes(59));
    condition.timeMax = (endTime).toISOString();
  }

  gapi.client.calendar.events.list(condition).then(function(response) {
    // 前回分の除去
    var element = document.getElementById('plan-content');
    element.textContent = null;

    var events = response.result.items;
    if (events.length > 0) {

      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        var end = event.end.dateTime;

        if (!when) {
          when = event.start.date;
        }
        if (!end) {
          end = event.end.date;
        }

        var tempStart = formatDate(new Date(when),'mm月dd日');
        var tempEnd = formatDate(new Date(end),'mm月dd日');

        var whenStart = formatDate(new Date(when),'mm月dd日（ww）HH:MM');
        var whenEnd = '';
        if(tempStart === tempEnd){  // 開始日と終了日が同じ場合
          whenEnd = formatDate(new Date(end),'HH:MM');
        } else {
          whenEnd = formatDate(new Date(end),'mm月dd日（ww）HH:MM');
        }

        planList.push(
          {
            startDay: formatDate(new Date(when),'mm月dd日（ww）'),
            startTime:formatDate(new Date(when),'HH:MM'),
            endDay:formatDate(new Date(end),'mm月dd日（ww）'),
            endTime:formatDate(new Date(end),'HH:MM'),
          }
        );

        appendPre('plan-content', whenStart + ' ～ ' + whenEnd + '  '+ event.summary);
      }
    } else {
      appendPre('plan-content','予定を見つけられませんでした。');
    }
  });
}

// 検索条件を作成
function getCondeition(starDate,endDate){

  var condition = {
    'calendarId': 'primary',
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 1000,
    'orderBy': 'startTime'
  };

  if(starDate){
    condition.timeMin = (new Date(starDate)).toISOString();
  } else {
    condition.timeMin = (new Date()).toISOString();
  }
  if(endDate){
    var endTime = new Date(endDate);
    endTime = new Date(endTime.setHours(23));
    endTime = new Date(endTime.setMinutes(59));
    condition.timeMax = (endTime).toISOString();
  }
  return condition;
}

function getAppointment(){
  // 前回分の除去
  var element = document.getElementById('candidate-content');
  element.textContent = null;

  var candidate = generateTerm();
  candidate = pickupDate(candidate);
  getFreeTime(candidate);
  //console.log(JSON.stringify(candidate));
}

// 調整対象となる日を取得する
// キー：日、時間ごとの予定有無JSON
function generateTerm(){

  var TWO_WEEK = 14;

  var starDate = document.getElementById('start-date').value;
  var endDate = document.getElementById('end-date').value;

  starDate = starDate? new Date(starDate) : new Date();
  endDate = endDate? new Date(endDate) : new Date(new Date().setDate(new Date().getDate() + TWO_WEEK));

  // 開始日から終了日までの日数を計算
  var term = endDate.getTime() -starDate.getTime();
  term = Math.ceil(term / 1000 / 60 / 60 /24); // ミリ秒 → 日

  var candidate = {};
  for (var i = 0; i <= term; i++){
    var tempDate = new Date().setDate(starDate.getDate() + i);
    var key = formatDate(tempDate,'mm月dd日（ww）');

    candidate[key]=generateTime();  // キー：日付、値：予定を入れる候補となる時間
  }


  return candidate;
}

// 調整対象となる時間を取得する
// キー：時刻、値：予定有無 のJSON を作成する
// 時刻の開始～終了まで、INTERVAL_MINUTE単位で刻む
function generateTime(){

  var count_per_hour = 60 / INTERVAL_MINUTE;

  var startTime = 9;
  var endTime = 20;

  var candidate = {};
  for (var i = startTime; i < endTime; i++){  // 「XX時YY分」のXX時
    var hour = ('0' + i.toString()).slice(-2);
    candidate[ hour + ':00'] = IS_FREE;
    pushTimeIndexArray(hour + ':00');

    for (var j = INTERVAL_MINUTE; j < INTERVAL_MINUTE * count_per_hour ; j=j+INTERVAL_MINUTE){ // 「XX時YY分」のYY分
      var minute = ('0' + j.toString()).slice(-2);

      candidate[ hour + ':' + minute] = IS_FREE;
      pushTimeIndexArray(hour + ':' + minute);
    }
  }

  candidate[(endTime).toString() + ':00' ] = IS_FREE;
  pushTimeIndexArray((endTime).toString() + ':00');

  hasTimeIndexArray = true;
  return candidate;
}

function pushTimeIndexArray(value){
  if (! hasTimeIndexArray ){
    timeIndexArray.push(value);
  }
}

// 候補日から予定を入れれるものをピックアップ
function pickupDate(candidate){

  var tagertDay ;
  var time ;
  var timeIndex = 0;
  var timeMargin = document.getElementById("time-margin").value;
  var timeAdjuster = timeMargin / INTERVAL_MINUTE; // 前後何分の余裕が

  // planListでぐるぐる回す
  for(var i = 0; i < planList.length ; i++ ){
    var plan = planList[i];
    var isStarted = false;

    if(plan.startDay == plan.endDay){ // 日をまたがない予定
      tagertDay = candidate[plan.startDay];
      timeIndex = 0;
      for (time in tagertDay) {
        if (time == plan.startTime) { // 予定開始
          tagertDay[time] = HAS_PLAN;
          tagertDay = adjustSchedule(tagertDay,timeIndex,timeAdjuster,true);
          isStarted = true;
        } else if(time == plan.endTime) { // 予定終了
          tagertDay[time] = HAS_PLAN;
          tagertDay = adjustSchedule(tagertDay,timeIndex,timeAdjuster,false);
          isStarted = false;
        } else if(isStarted ){ // 開始と終了の間
          tagertDay[time] = HAS_PLAN;
        }
        timeIndex += 1;
      }
    } else { // 日をまたぐ場合
      for (var day in candidate) {
        if(plan.startDay == day){
          tagertDay = candidate[plan.startDay];
          timeIndex = 0;
          for (time in tagertDay) {
            if (time == plan.startTime) {
              tagertDay[time] = HAS_PLAN;
              tagertDay = adjustSchedule(tagertDay,timeIndex,timeAdjuster,true);
              isStarted = true;
            } else if(isStarted){
              tagertDay[time] = HAS_PLAN;
            }
            timeIndex += 1;
          }
        } else if(plan.endDay == day){
          tagertDay = candidate[plan.endDay];
          timeIndex = 0;
          for (time in tagertDay) {
            if(time == plan.endTime) {
              tagertDay[time] = HAS_PLAN;
              tagertDay = adjustSchedule(tagertDay,timeIndex,timeAdjuster,false);
              isStarted = false;
            } else if(isStarted ){
              tagertDay[time] = HAS_PLAN;
            }
            timeIndex += 1;
          }
        } else if(isStarted){ // 開始と終了の間の日
          tagertDay = candidate[day];
          timeIndex = 0;
          for (time in tagertDay) {
            tagertDay[time] = HAS_PLAN;
            timeIndex += 1;
          }
        }
      }
    }

  }
  return candidate;
}

// 前後の時刻を予定アリにする
function adjustSchedule(tagertDay,timeIndex,timeAdjuster,isPrev){
  if(isPrev){  // 指定された分だけ、前の時間を予定アリにする
    for(var i=timeAdjuster; 0<=i; i--){
      if(0<=timeIndex-i){
        tagertDay[timeIndexArray[(timeIndex-i)]] = HAS_PLAN;
      }
    }
  } else { // 指定された分だけ、後の時間を予定アリにする
    for(var j=1; j<timeAdjuster; j++){
      if(timeIndex+j < timeIndexArray.length){
        tagertDay[timeIndexArray[(timeIndex+j)]] = HAS_PLAN;
      }
    }
    if(timeAdjuster === 0){ // 前後0分なら、13:01 ~ とかってなってまう、、、
      tagertDay[timeIndexArray[timeIndex]] = IS_FREE;
    }
  }

  return tagertDay;
}

// 連続して間空いてたらOK
function getFreeTime(candidate){

  var lastTimeIsFree = null;

  var blockTime = document.getElementById("block-time").value;
  blockTime = blockTime / INTERVAL_MINUTE; // 何分以上のまとまった時間がいるか？
  var timeIndex = 0;

  var startTimeArray = [];
  var endTimeArray = [];

  for (var day in candidate) {
    timeIndex = 0;
    for (var time in candidate[day]) {

      if(!lastTimeIsFree) lastTimeIsFree = HAS_PLAN;

      if(candidate[day][time] == IS_FREE && lastTimeIsFree == HAS_PLAN ){ // 「予定あり」から「なし」に変わったとき(つまり空き時間の開始)
        if(hasBlockTIme(candidate[day],timeIndex,blockTime,true)){
            console.log('** 0 ' + day.toString()  + time.toString());
            startTimeArray.push( day.toString()  + time.toString());
        }
      } else if(candidate[day][time] == HAS_PLAN && lastTimeIsFree == IS_FREE){ // 「予定なし」から「あり」に変わったとき(つまり空き時間の終了)
        if(hasBlockTIme(candidate[day],timeIndex,blockTime,false)){
            console.log('**+1 ' + day.toString()  + time.toString());
            endTimeArray.push( time.toString());
        }
      }

      lastTimeIsFree = candidate[day][time];
      timeIndex += 1;
    }

    if(lastTimeIsFree) {
        console.log('***1 ' + day.toString()  + time.toString());
        endTimeArray.push( time.toString());
        lastTimeIsFree = null;
    }

  }

  for (var i = 0; i < startTimeArray.length; i++ ) {
    appendPre('candidate-content', startTimeArray[i] + ' ～ ' + endTimeArray[i]);
  }

}

function hasBlockTIme(tagertDay,timeIndex,blockTime,isPrev){
  if(isPrev){
    if( timeIndexArray.length < timeIndex+blockTime ){ // まとまった時間を確保したら残業！！！
      return false;
    }
    for(var i=blockTime; 0<=i; i--){
      if (tagertDay[timeIndexArray[(timeIndex+i)]] == HAS_PLAN){  // まとまった時間内に予定がある場合
        return false;
      }
    }
    return true; //連続して予定を確保できた
    
  } else {
    if(timeIndex-blockTime < 0){ // まとまった時間を確保したら早出
      return false;
    }
    for(var j=blockTime; 0<j; j--){
      if(tagertDay[timeIndexArray[(timeIndex-j)]] == HAS_PLAN){   // まとまった時間内に予定がある場合
        return false;
      }
    }

    return true; //連続して予定を確保できた
  }
}
