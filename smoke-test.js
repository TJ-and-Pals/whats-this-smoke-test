'use strict';

// need to run smoke-test.js with argument of the dropbox location to "//Dropbox//tj-cdn"
var path_to_dropbox = process.argv[2];
console.log ("path to dropbox = "+path_to_dropbox);

const path = require("path");

const PATH_TO_WHATS_THIS ="/apps/whats-this/";
const CONFIG_FILEPATH="config/sections/";
const MEDIA_FILEPATH="media/";

const IMAGE_LOG="image.txt";
const ENGLISH_AUDIO_LOG="english.txt";
const ZULU_AUDIO_LOG="zulu.txt";

const filesToCheckArray = ["home-rr.json","family-rr.json","food-rr.json"];

const fs = require('fs');

var fullFilepathToWhatsThis = path_to_dropbox+PATH_TO_WHATS_THIS;

// locations to store the log files
var imageLogger = fs.createWriteStream(IMAGE_LOG);
var englishLogger = fs.createWriteStream(ENGLISH_AUDIO_LOG);
var zuluLogger = fs.createWriteStream(ZULU_AUDIO_LOG);

let runDate = Date();
imageLogger.write("Image Smoke Test run at "+runDate+"\n");
englishLogger.write("English Smoke Test run at "+runDate+"\n");
zuluLogger.write("Zulu Smoke Test run at "+runDate+"\n");

function checkForAssets (filename) {
	// search each section file for fileNames of the assets
	fs.readFile(fullFilepathToWhatsThis+CONFIG_FILEPATH+filename, (err, data) => {
		if (err) throw err;
		imageLogger.write("########"+filename+"########"+"\n");
		englishLogger.write("########"+filename+"########"+"\n");
		zuluLogger.write("########"+filename+"########"+"\n");
		let filesToCheck = JSON.parse(data);
		// console.log(filesToCheck);

		let fileSubstr = filename.substr(0, filename.indexOf("-"));
		for (var i in filesToCheck.items) {
			let name = filesToCheck.items[i].name;

			let imageFilename = fullFilepathToWhatsThis+MEDIA_FILEPATH+"image/"+fileSubstr+"/"+name+".jpg";
			let englishFilename = fullFilepathToWhatsThis+MEDIA_FILEPATH+"audio/english/"+fileSubstr+"/"+name+".mp3";
			let zuluFilename = fullFilepathToWhatsThis+MEDIA_FILEPATH+"audio/zulu/"+fileSubstr+"/"+name+".mp3";
			// console.log("name: "+englishFilename);
			
			// Does this fileName exist in the image directory
			fs.access(imageFilename, fs.F_OK, (err) => {
				if (err) {
					// console.log("image MISSING");
					imageLogger.write(filename+" "+name+" MISSING!\n");
				} else {
					//file exists
					// console.log("image exists");
					imageLogger.write("ok "+name+"\n");
				}
			})

			// Does this fileName exist in the english directory
			fs.access(englishFilename, fs.F_OK, (err) => {
				if (err) {
					// console.log("english MISSING");
					englishLogger.write("MISSING: "+name+"\n");
				} else {
					//file exists
					// console.log("english exists");
					englishLogger.write("ok "+name+"\n");
				}
			})

			// Does this fileName exist in the zulu directory
			fs.access(zuluFilename, fs.F_OK, (err) => {
				if (err) {
					// console.log("zulu MISSING");
					zuluLogger.write("MISSING: "+name+"\n");
				} else {
					//file exists
					// console.log("zulu exists");
					zuluLogger.write("ok "+name+"\n");
				}
			})
		}
	});
}

console.log ("about to print files to check");
for (var i in filesToCheckArray) {
	console.log ("filesToCheck: "+filesToCheckArray[i]);
	checkForAssets (filesToCheckArray[i]);
}

// checkForAssets (FILEPATH+CONFIG_FILEPATH+'home-rr.json');


	// image_logger.end();
	// english_logger.end();
	// zulu_logger.end();


console.log('This is after the read call');
