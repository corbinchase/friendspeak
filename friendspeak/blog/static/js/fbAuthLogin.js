function statusChangeCallback(response) {
    var sendResponse = response;
    if (response.status === 'connected') {
        var userID = sendResponse.authResponse.userID;
        userInformation(userID);
    } 
    else {
        FB.login(function(response) {
            console.log('user logged out rerequest');
        }, {scope: 'user_birthday,user_about_me,user_location,user_friends',
            auth_type: 'rerequest'
        }); 
    }
} 
  
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : '1565760477011269',
        cookie     : true,  
        xfbml      : true,  
        version    : 'v2.3' 
    });
    FB.Event.subscribe('auth.login', function (response) {
        window.location = "http://friendspeak.io";
    });

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });  
};

//load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=1565760477011269";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk')); 

function newLoginDialog() {
    FB.login(function(response) {
        console.log('granted scopes:'+authResponse.grantedScopes);
    }, {scope: 'user_birthday,user_about_me,user_location,user_friends',
        auth_type: 'rerequest',
        return_scopes: true
    });
}

function userInformation(userID) {
    var userLocale = "en_US";
    var userDisplayName = "";
    var permissionDeclinedCount;

    FB.api(
        '/me?fields=permissions,name,locale,birthday,picture,email,bio,location',
        function (response) {
            if (response && !response.error) {
                permissionDeclinedCount = 0;
                var permissionsArray = response.permissions.data;
               
                function inPermissions(arr) {
                    for (var i=0; i<arr.length; i++) {
                        if (arr[i]["status"] == "declined") {
                            permissionDeclinedCount++; 
                        }
                    }
                    if (permissionDeclinedCount >= 1) {
                        console.log('permission declined count:'+permissionDeclinedCount);
                    
                        window.alert("Hi "+userDisplayName+", unfortunately we cannot log you in without gaining a little information about you so your friends know who their posting/talking to. "+
                    "\n\nWe require your friend list (to display a list of friends that you can post to), email address (for user identification in our database), birthday (to calculate your age [actual month/day is not displayed]), current city (so your friends know where you are), and personal description (as a template to start with that you can later change)"+
                    "\n\nWe will now log you out; when you log back in you will be prompted for permissions and we hope you understand why this information is necessary!");
                    
                        FB.logout(function(response) {
                            //FB.logout will log the user out of both your site and Facebook. You will need to have a valid access token for the user in order to call the function. (check)
                            //Calling FB.logout will also invalidate the access token that you have for the user, unless you have extended the access token. More info on how to extend the access token here. (maybe need to convert to extended?)
                        });
                        newLoginDialog(); 

                    }
                    if (response.status == 'connected') {
                        window.location = "http://friendspeak.io";
                    }
                }  
                inPermissions(permissionsArray);
                
                if (permissionDeclinedCount == 0) {
                    var profName = response.name;
                    var profLocale = response.locale;
                    var profAge;
                    var profPicture = "https://graph.facebook.com/" + userID + "/picture?width=200";
                    var profEmail = response.email;
                    var profBio = response.bio;
                    if (response.location != 'undefined' && response.location != 'unknown') {
                        var profLocation = response.location;
                    }
                    else {
                            var profLocation = "unknown";
                    }
                    
                    function agefinding() {
                        var birthDay = response.birthday;
                        var DOB = new Date(birthDay);
                        var today = new Date();
                        var ageCalc = today.getTime() - DOB.getTime();
                        ageCalc = Math.floor(ageCalc / (1000 * 60 * 60 * 24 * 365.25));
                        return ageCalc;
                    }                  
                    if (response.birthday != 'undefined') {
                        profAge = agefinding();
                    }
                    else {
                        profAge = 'unknown';
                        console.log('cant find age');
                    }             
                    document.getElementById("profileName").value = profName;
                    document.getElementById("profileLocale").value = profLocale;
                    document.getElementById("profileAge").value = profAge;
                    document.getElementById("profilePicture").value = profPicture;
                    document.getElementById("profileEmail").value = profEmail;
                    document.getElementById("profileBio").value = profBio;
                    document.getElementById("profileLocation").value = profLocation;
                    document.getElementById("profileUserID").value = userID;         //userID
                    document.getElementById("password").value = "X8zMuJi0t48QM7V69WB8gh93X3D0Orwoajhfgoiug9024hoianp809a5D8JyedEVpngabcefghijklmnopqrstuvwxyzABCDYt0Lj77X4OZ5oyWL2vUcmyFflcq0G6XSSQWgpve2HZWZtAzUM4slk2";    //super secret password key
                    document.getElementById('loginForm').submit();
                }
                else {
                    console.log('declined permissions count:'+permissionDeclinedCount);
                }
            }
            else {
                console.log('error: permissions retrieval::'+JSON.stringify(response));
            }
        }
    );
}
