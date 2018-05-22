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
    // listUpcomingEvents();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    getCalendarButton.style.display = 'none';
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
function appendPre(message) {
  var pre = document.getElementById('content');
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

  var condition = {
    'calendarId': 'primary',
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 100,
    'orderBy': 'startTime'
  };

  if(starDate){
    condition.timeMin = (new Date(starDate)).toISOString();
  } else {
    condition.timeMin = (new Date()).toISOString();
  }
  if(endDate){
    condition.timeMax = (new Date(endDate)).toISOString();
  }

  gapi.client.calendar.events.list(condition).then(function(response) {
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
        when = formatDate(new Date(when),'mm月dd日（ww）HH:MM');
        if(tempStart === tempEnd){  // 開始日と終了日が同じ場合
          end = formatDate(new Date(end),'HH:MM');
        } else {
          end = formatDate(new Date(end),'mm月dd日（ww）HH:MM');
        }

        appendPre( when + ' ～ ' + end + '  '+ event.summary);
      }
    } else {
      appendPre('予定を見つけられませんでした。');
    }
  });
}
