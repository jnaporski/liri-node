require("dotenv").config();

const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var specification = process.argv[3];

switch(command) {
    case "concert-this":
      console.log("Search Results: ");
      bandsInTown(specification)
      break;

    case "spotify-this-song":
      console.log("Search Results: ");
      spotifySearch(specification);
      break;

    case "movie-this":
      console.log("Search Results: ")
      movieSearch(specification);
      break;

    case "do-what-it-says":
      doWhatItSays();
      break;
    
    default:
      console.log("Hello! Please enter in concert-this, spotify-this-song, movie-this, or do-what-it-says, after node liri.js, to search for what you are looking for. After entering in the commands, type the name/title of what you want to search for.");
}


function bandsInTown(artists) {
    var mainURL = "https://rest.bandsintown.com/artists/";
    var app_id = "/events?app_id=codingbootcamp";
    var req = mainURL + artists + app_id;

    axios.get(req)
    .then(function(response) {
        var info = response.data[0];
        if(info != null) {
            console.log("\nVenue: " + info.venue.name);
            console.log("\nLocation: " + info.venue.city + ", " + info.venue.region);
            console.log("\nDate: " + moment(info.datetime).format("L"));
        }
    })
    .catch(function(error){
        console.log("error");
    })
}


function spotifySearch(song) {
    spotify
        .search({type: "track", query: song})
        .then(function(response){
            var trackList = response.tracks;
            var info = trackList.items;

            for(var i = 0; i < info.length; i++) {
                console.log("\nArtist Name(s): ");

                for(var j = 0; j < info[i].artists.length; j++) {
                    console.log(" " + info[i].artists[j].name);
                };

                console.log("\nAlbum Name: " + info[i].album.name);
                console.log("\nSong Name: " + info[i].name);
                console.log("\nPreview Link: " + info[i].preview_url);
                console.log("\n-------------------------------------\n")
            }
        });
}


function movieSearch(title) {
    var mainURL = "http://www.omdbapi.com/";
    var apikey = "?apikey=trilogy&";

    if(title == null){title = "Mr.Nobody"
        console.log("\nIf you haven't watched Mr. Nobody, then you should: <http://www.imdb.com/title/tt0485947/>");
        console.log("It's on Netflix!")};
    var request = mainURL + apikey + "t=" + title;

    axios.get(request)
    .then(function(response){
        var info = response.data;

        console.log("\nMovie Title: " + info.Title);
        console.log("\nRelease Year: " + info.Year);
        console.log("\nIMDB Rating: " + info.Ratings[0].Value);
        console.log("\nRotten Tomatoes: " + info.Ratings[1].Value);
        console.log("\nCountry of Origin: " + info.Country);
        console.log("\nLanguage: " + info.Language);
        console.log("\nMovie Plot: " + info.Plot);
        console.log("\nActors/Actresses: " + info.Actors);
    })
}
//do-what-it-says
function doWhatItSays(){
  fs.readFile("random.txt", "UTF8", function(err, data){
      if(err) {
          console.log(err)
      };
    var dataInfo = data.split(",");
      spotifySearch(dataInfo[1]);
 });
}