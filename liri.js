require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var liriCommand = process.argv[2]; //"my-tweets", "movie-this" etc
var searchTerm = ""; //holds song/twitter username/movie etc

//put search term together in one string to use in other functions
for (var i = 3; i < process.argv.length; i++) {
  if (i > 3 && i < process.argv.length) {
    searchTerm += " " + process.argv[i];
  } else {
    searchTerm += process.argv[i];
  }
}

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
        "Sorry, I couldn't understand that\n \n" +
        "Try typing one of the following commands after 'node liri.js' : " +
        "\n" +
        "1. my-tweets <twitter username> " +
        "\n" +
        "2. spotify-this-song <song name> " +
        "\n" +
        "3. movie-this <movie name> " +
        "\n" +
        "4. do-what-it-says" +
        "\n"
    );
}

function myTweets() {
  if (!searchTerm) {
    var username = "jesus";
  } else {
    var username = searchTerm;
  }
  params = { screen_name: username };

  var client = new Twitter(keys.twitter);
  client.get("statuses/user_timeline", params, function(error, data, response) {
    if (error) throw error;
    if (!error) {
      console.log(
        "\nTweets from @" + data[0].user.screen_name + ":\n ------------------"
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
          "\n";
        console.log(twitterResults);
      }
    }
  });
}

function spotifyThisSong() {
  var spotifyKeys = keys.spotify; //these vars are only needed here
  var spotify = new Spotify(spotifyKeys);

  song = searchTerm;
  if (!song) {
    song = "I Saw the Sign";
  }
  //   display spotify song requested
  spotify.search({ type: "track", query: song }, function(err, data) {
    if (!err) {
      var songData = data.tracks.items;
      console.log("\nSong: " + songData[0].name);
      console.log("Artist: " + songData[0].artists[0].name);
      console.log("Album: " + songData[0].album.name);
      console.log("URL: " + songData[0].preview_url + "\n");
    } else {
      return console.log("Error occurred: " + err);
    }
  });
}

//   var spotify = new Spotify({
//     id: keys.spotify.id,
//     secret: keys.spotify.secret,
//   });
//   spotify.search({ type: "track", query: "dancing in the moonlight" }, function(
//     err,
//     data
//   ) {
//     if (err) {
//       logOutput.error(err);
//       return;
//     }
//     console.log(data);
//   });
// }

function movieThis() {
  // Create an empty variable for holding the movie name
  var movieName = searchTerm;

  if (!movieName) {
    movieName = "Mr. Nobody";
  }
  //replace spaces with + for the queryURL
  movieName = movieName.split(" ").join("+");

  // Then run a request to the OMDB API with the movie specified
  var queryUrl =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      console.log(
        JSON.parse(body).Title +
          "\nRelease year: " +
          JSON.parse(body).Year +
          "\nIMDB rating: " +
          JSON.parse(body).Ratings[0].Value +
          "\nRotten Tomato rating: " +
          JSON.parse(body).Ratings[1].Value +
          "\nCountry Produced in: " +
          JSON.parse(body).Country +
          "\nLanguage: " +
          JSON.parse(body).Language +
          "\n\n" +
          JSON.parse(body).Plot +
          "\n\nActors: " +
          JSON.parse(body).Actors
      );
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
