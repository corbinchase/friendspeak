
window.fbAsyncInit = function() {
    FB.init({
        appId      : '1565760477011269',
        cookie     : true,  // enable cookies to allow the server to access the session BASE.HTML
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.3' 
    });
    FB.Event.subscribe('auth.login', function (response) {
        window.location = "http://friendspeak.io";
    });

    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            statusChangeCallback(response);
        } 
        else {
            window.location = "http://friendspeak.io/logout/";
        } 
    });

    function statusChangeCallback(response) {
        // defines current login status of the person
        if (response.status === 'connected') {
            FB.api(
                "/me?fields=taggable_friends,friends",
                function (response) {
                    if (response && !response.error) {
                        // Start: menu bar
                        var myFriendsArray = [];
                        var numberOfFriendsApp = response.friends.data.length;
                        var friendsApp = response.friends.data;
                        var profileFriendsApp = document.getElementById("profileFriendsApp");
                        var myFriends = "";

                        for (var i = 0; i < numberOfFriendsApp; i++) {
                            myFriends += "<li><a href='/profile/" + friendsApp[i].id + "/'>" + friendsApp[i].name + "</a></li>";
                            myFriendsArray.push(friendsApp[i].name);
                        }

                        var numberOfTaggableFriends = response.taggable_friends.data.length;
                        var data = response.taggable_friends.data;
                        var profileTaggableFriends = document.getElementById("profileTaggableFriends");
                        var taggableFriends = "";

                        for (var i = 0; i < numberOfTaggableFriends; i++) {
                            if (myFriendsArray.indexOf(data[i].name) > -1) {
                                //take out of taggable friends
                            } 
                            else {
                                taggableFriends += "<li><p id='sendInviteButton' style='margin:0;'>" + data[i].name + "</p></li>";
                            }
                        }

                        $(document).on("click", "#sendInviteButton", function() {
                            FB.ui({
                                app_id: '1565760477011269',
                                method: 'send',
                                link: 'http://friendspeak.io',
                            });
                        });

                        profileFriendsApp.innerHTML = myFriends;
                        profileTaggableFriends.innerHTML = taggableFriends;
                        console.log(profileFriendsApp);
                        console.log(profileTaggableFriends);
                        // End: menu bar
                    }
                    else {
                        console.log('error:'+JSON.stringify(response.error));
                    }
                }
            );
        }
        else {
            // The person is not logged into Facebook; unsure if logged into app or not.
            console.log('user not logged into FB or app');
        }
    }
};
