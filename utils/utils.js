/**
 * http://usejsdoc.org/
 */
const crypto = require('crypto')
const fs = require('fs'); //use the file system so we can save files

function randomString(){
	return crypto.randomBytes(4).toString('hex')
}

function getPathToFileStore(){
	return 'http:/localhost:8080/uploads'
}

function createFileName(name, mimetype){
	let extension = '.error'
	if(mimetype === 'audio/wav')
		extension = '.wav'
	else if(mimetype === 'audio/mp3')
		extension = '.mp3'
	return name + extension
}

function constructPathToAdvertisementOnFileStore(userID){
	// each user will have a folder in the filestore to store their files
	return 'advertisements/' + userID + '/' 
}

//TODO a lot of this can probably be consolidate with functionality for podcast uploads
function saveAdToFileStore(file, userID, adName){
	let bufDataFile = Buffer.from(file.data, "utf-8");
	let pathInFileStore = utils.constructPathToAdvertisementOnFileStore(userID)
	let fileName = utils.createFileName(adName, file.mimetype)
	let target_path = utils.getPathToFileStore() + pathInFileStore
	
	// create the directory if it doesn't exist
	fs.mkdir(target_path, function(err){
		if(!err || err && err.code === 'EEXIST') {} //ignore, directory exists alread
		else console.log(err)
	})
	// append file name to path
	target_path += fileName
	
	fs.writeFile(target_path, bufDataFile,  function(err) {
		if (err) {
			return console.error(err);
		}
		else {
			console.log("Data written successfully !");
		}  
   })
   // return the path to the file in the filestore
   return pathInFileStore + fileName
}

function uploadAd(req, res){
	let file
	if(!req.files){
		console.log("File not found");
		return;
	}
	
	file = req.files.fileUpload
	let userID = req.user.id
	let adName = req.body.adName
	
	return saveAdToFileStore(file, userID, adName)
}

module.exports = {
		randomString,
		getPathToFileStore,
		createFileName,
		constructPathToAdvertisementOnFileStore,
		uploadAd
	}