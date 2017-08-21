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
			});
		}
	},

	'move_this': function() {

	},

	'do_what_it_says': function() {

	}
}


if (data.command === "my-tweets") {
	data.my_tweets();
}

if (data.command === "spotify-this-song") {
	data.spotify_this_song();
}

if (data.command === "move-this") {
	data.move_this();
}

if (data.command === "do-what-it-says") {
	data.do_what_it_says();
}