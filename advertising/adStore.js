/**
 * http://usejsdoc.org/
 */
const knex = require('knex')(require('../knexfile'))
const fs = require('fs'); //use the file system so we can save files
const utils = require('../utils/utils')

function constructPathToPodcastOnFileStore(userID){
	// each user will have a folder in the filestore to store their files
	return 'advertisements/' + userID + '/' 
}

function createFileName(adName, mimetype){
	let extension = '.error'
	if(mimetype === 'audio/wav')
		extension = '.wav'
	else if(mimetype === 'audio/mp3')
		extension = '.mp3'
	return adName + extension
}

function saveAdToFileStore(file, userID, adName){
	let bufDataFile = Buffer.from(file.data, "utf-8");
	let pathInFileStore = constructPathToPodcastOnFileStore(userID)
	let fileName = createFileName(adName, file.mimetype)
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

function saveAdToDB(req, res, {ad_name, description, owner_id}) {
	//appendToRSS({episode_name, description, owner_id})
	let path = uploadAd(req, res)
	return knex('advertisement').insert({
		ad_name,
		description,
		path,
		owner_id
	}, 'id').then((result) => {
        return { success: true, id: result[0], path: path }
      })
}

module.exports = {
	saveAdToDB
}