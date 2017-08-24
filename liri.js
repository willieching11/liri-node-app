var keys = require('./keys.js');
var twitterKeys = keys.twitterKeys;

var fs = require("fs");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var spotifyKeys = keys.spotifyKeys;
var request = require('request');

var data = {
	command: process.argv[2],
	info: process.argv[3],

	'my_tweets': function() {
		var client = new Twitter(twitterKeys);

		var params = {screen_name: 'willieching11', count: 20};

		client.get('statuses/user_timeline', params, function(error, tweets, response) {
			if (error) {
				return console.log(error);
			}
			var outputStr = '------------------------\n' +
							'User Tweets:\n' + 
							'------------------------\n\n';
			for (var i = 0; i < tweets.length; i++) {
				outputStr += 'Created on: ' + tweets[i].created_at + '\n' + 
							 'Tweet content: ' + tweets[i].text + '\n' +
							 '------------------------\n';
			}
			console.log(outputStr);
			fs.appendFile("log.txt", outputStr, function(err) {
				if(err) {
					return console.log(err);
				}
				console.log("The file was updated");
			}); 
		});
	},

	'spotify_this_song': function() {
		var spotify = new Spotify(spotifyKeys);
		if (!data.info) {
			spotify.search({ type: 'track', query: 'The Sign' }, function(err, data) {
				if (err) {
				return console.log('Error occurred: ' + err);
				}
				var outputStr = '------------------------\n' +
								'Song Info:\n' + 
								'------------------------\n\n' +
								'Artist: ' + data.tracks.items[12].artists[0].name + '\n' + 
								'Song Name: ' + data.tracks.items[12].name + '\n' +
								'Preview Link: ' + data.tracks.items[12].external_urls.spotify + '\n' +
								'Album: ' + data.tracks.items[12].album.name + '\n' +
								'------------------------\n';
				console.log(outputStr);
				fs.appendFile("log.txt", outputStr, function(err) {
					if(err) {
						return console.log(err);
					}
					console.log("The file was updated");
				});  
			});
		} else {	 
			spotify.search({ type: 'track', query: data.info }, function(err, data) {
				if (err) {
				return console.log('Error occurred: ' + err);
				}
				var outputStr = '------------------------\n' +
								'Song Info:\n' + 
								'------------------------\n\n' +
								'Artist: ' + data.tracks.items[0].artists[0].name + '\n' + 
								'Song Name: ' + data.tracks.items[0].name + '\n' +
								'Preview Link: ' + data.tracks.items[0].external_urls.spotify + '\n' +
								'Album: ' + data.tracks.items[0].album.name + '\n' +
								'------------------------\n';
				console.log(outputStr);
				fs.appendFile("log.txt", outputStr, function(err) {
					if(err) {
						return console.log(err);
					}
					console.log("The file was updated");
				});  
			});
		}
	},

	'movie_this': function() {
		var search;
		if (!data.info) {
			search = 'Mr. Nobody';
		} else {
			search = data.info;
		}
		// Replace spaces with '+' for the query string
		search = search.split(' ').join('+');
		var queryStr = 'http://www.omdbapi.com/?apikey=40e9cece&t=' + search + '&plot=short&tomatoes=true';
		request(queryStr, function(error, response, body) {
			// If the request was successful...
			var data = JSON.parse(body);
			if (!error && response.statusCode === 200) {
				// Then log the body from the site!
				var outputStr = '------------------------\n' +
								'Movie Info:\n' + 
								'------------------------\n\n' +
								'Title: ' + data.Title + '\n' + 
								'Year: ' + data.Year + '\n' +
								'IMDB Rating: ' + data.Ratings[0].Value + '\n' +
								'Rotten Tomatoes Rating: ' + data.Ratings[1].Value + '\n' +
								'Country: ' + data.Country + '\n' +
								'Language: ' + data.Language + '\n' +
								'Plot: ' + data.Plot + '\n' +
								'Actors: ' + data.Actors + '\n' +
								'------------------------\n';
				console.log(outputStr);
				fs.appendFile("log.txt", outputStr, function(err) {
					if(err) {
						return console.log(err);
					}
					console.log("The file was updated");
				}); 
			}
		});
	},

	'do_what_it_says': function() {
		fs.readFile("random.txt", "utf-8", function(err, data1) {
			if (err) {
				return console.log(err);
			}
			var dataArray = data1.split(",");
			data.command = dataArray[0].trim();
			data.info = dataArray[1].trim();;
			switch(data.command) {
				case 'my-tweets':
					data.my_tweets(); 
					break;

				case 'spotify-this-song':
					data.spotify_this_song();
					break;

				case 'movie-this':
					data.movie_this();
					break;
			}
		});
	}
}


if (data.command === "my-tweets") {
	data.my_tweets();
}

if (data.command === "spotify-this-song") {
	data.spotify_this_song();
}

if (data.command === "movie-this") {
	data.movie_this();
}

if (data.command === "do-what-it-says") {
	data.do_what_it_says();
}