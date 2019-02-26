const userStore = require('../authentication/userStore')

function buildCommentSectionDataObject(comments){
	return new Promise(function(resolve, reject){
		if(comments.length === 0){
			resolve([])
		}
		let commentSectionDataObject = []
		let replies = []
		let promiseChain = Promise.resolve()
		let currentComment;
		for(let i = 0; i < comments.length; i++){
			let commentObj = {}
			currentComment = comments[i]
			let userID = currentComment.commenter_id
			//TODO could use a hashtable here to prevent repeat lookups on repeat commenters
			const makeNextPromise = (currentComment) => () => {
				let username = ''
					userStore.getUsername(userID).then(result => {
						username = result[0].username
						commentObj.commenter = username
						commentObj.message = currentComment.comment
						commentObj.id = currentComment.id
						commentObj.replyTo = currentComment.comment_id // the id of the comment this is a reply to
						commentObj.depth = currentComment.depth
						if(commentObj.replyTo === -1) {
							commentSectionDataObject.push(commentObj)
						}
						else{
							replies.push(commentObj)
						}
						//TODO commentSectionDataObject will eventually need to be sorted
						if(i === comments.length - 1){
							if(replies.length === 0){
								console.log('commentSectionDataObject', commentSectionDataObject)
								resolve(commentSectionDataObject)
							}
							for(let j = 0; j < replies.length; j++){
								let currReply = replies[j]
								//TODO this should be a hash instead of a bunch of nested loops. will fix on the refactor
								for(let k = 0; k < commentSectionDataObject.length; k++){
									if(commentSectionDataObject[k].id === currReply.replyTo){
										commentSectionDataObject.splice(k+1, 0, currReply)
										break
									}
								}
								if(j === replies.length -1){
									console.log('commentSectionDataObject', commentSectionDataObject)
									resolve(commentSectionDataObject)
								}
							}
						}
					})
			}
			promiseChain = promiseChain.then(makeNextPromise(currentComment))
		}
	})
}

module.exports = {
		buildCommentSectionDataObject
}
