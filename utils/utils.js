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

// functions for authentication and login. maybe these belong in a different file
function validatePassword(password){
	/*
	 * OWASP defines a strong password as:
	 * 
	 * 1) Password Length Minimum length should be enforced by the application
	 * Passwords shorter than 10 characters are considered weak Typical maximum
	 * password length is 128 characters Passphrases shorter than 20 characters
	 * are usually considered weak if they only consist of lower case latin
	 * characters 2) Password Complexity The application should enforce password
	 * complexity rules to discourage easy passwords Password mechanisms should
	 * allow virtually any character the user can type including spaces
	 * Passwords should be case sensitive An example of basic complexity
	 * checking would be: password must contain 3/4 of the following rules: at
	 * least 1 uppercase character (A-Z) at least 1 lowercase character (a-z) at
	 * least 1 digit (0-9) at least 1 special character at least 10 characters
	 * at most 128 characters not more than 2 identicaly characters in a row
	 * (e.g., 111 not allowed)
	 */
	
	/*
	 * This regex enforces these rules: 1) At least one uppercase english letter
	 * [A-Z] 2) At least one lowercase english letter [a-z] 3) At least one
	 * digit [0-9] 4) At least one special character [#?!@$% ^&*-] 5) Minimum
	 * length 10, maximum length 128
	 */
	let regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{10,128}$/
	let result = regex.test(password)
	if(!result){
		// build error message
		let message = "Your password does not meet the following requirement(s):"
		let upperCaseRegex = /^.*[A-Z].*$/
		let lowerCaseRegex = /^.*[a-z].*$/ 
		let digitRegex = /^.*[0-9].*$/ 
		let specialCharRegex = /^.*[#?!@$% ^&*-].*$/ 
	    if(!upperCaseRegex.test(password)){
	    	message += ' At least one upper case english letter [A-Z].'
	    }
		if(!lowerCaseRegex.test(password)){
			message += ' At least one lower case english letter [a-z].'
		}
		if(!digitRegex.test(password)){
			message += ' At least one digit [0-9].'
		}
		if(!specialCharRegex.test(password)){
			message += ' At lease one special character [#?!@$ %^&*-].'
		}
		if(password.length < 10 || password.length > 128){
			message += ' A password length between 10 and 128 characters.'
		}
		return {success: false, message: message}
	}
	else{
		return {success: true}
	}
}

/**
 * we want to store encrypted passwords in the DB Accept a salt and only
 * generate one if none is supplied
 * 
 * @param {password:MISSING,salt:utils.randomString()}
 * @returns
 */
function saltHashPassword ({
	  password,
	  salt = randomString()
	}) {
	  const hash = crypto
	    .createHmac('sha512', salt)
	    .update(password)
	  return {
	    salt,
	    hash: hash.digest('hex')
	  }
	}

module.exports = {
		randomString,
		getPathToFileStore,
		createFileName,
		constructPathToAdvertisementOnFileStore,
		uploadAd,
		validatePassword
	}