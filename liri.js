require("dotenv").config();
var fs = require("fs"); //reads and writes files
var keys = require("./keys.js");
var Twitter = require("twitter");
var spotify = require("spotify");

var liriCommand = process.argv[2];

switch (liriCommand) {
  case "my-tweets":
    myTweets();
    break;
  case "spotify-this-song":
    spotifyThisSong();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  // Instructions displayed in terminal to the user
  default:
    console.log(
      "\n" +
        "Try typing one of the following commands after 'node liri.js' : " +
        "\n" +
        "1. my-tweets 'any twitter name' " +
        "\n" +
        "2. spotify-this-song 'any song name' " +
        "\n" +
        "3. movie-this 'any movie name' " +
        "\n" +
        "4. do-what-it-says." +
        "\n" +
        "Be sure to put the movie or song name in quotation marks if it's more than one word."
    );
}

function myTweets() {
  var username = "jesus";
  params = { screen_name: username };

  var client = new Twitter(keys.twitter);
  client.get("statuses/user_timeline", params, function(error, data, response) {
    if (error) throw error;
    if (!error) {
      console.log(
        "tweets from @" + data[0].user.screen_name + ":\n ------------------"
      );
      for (var i = 0; i < 5; i++) {
        //console.log(response); // Show the full response in the terminal
        var twitterResults =
          "@" +
          data[i].user.screen_name +
          ": " +
          data[i].text +
          "\r\n" +
          data[i].created_at +
          "\n\n";
        console.log(twitterResults);
      }
    }
  });
}

function spotifyThisSong() {
  //display spotify song requested
  var spotify = new Spotify(keys.spotify);
  spotify.search({ type: "track", query: "dancing in the moonlight" }, function(
    err,
    data
  ) {
    if (err) {
      console.log("Error occurred: " + err);
      return;
    } else {
      console.log(data);
    }
  });
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (!error) {
      doWhatItSaysResults = data.split(",");
      spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
    } else {
      console.log("Error occurred" + error);
    }
  });
}
