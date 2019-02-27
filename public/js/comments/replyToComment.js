function openCollapsableComment(el) {
	// open up the reply form underneath the comment actions
	let coll = document.getElementsByClassName("comment-actions")
	let i

	for (i = 0; i < coll.length; i++) {
		coll[i].addEventListener("click", function() {
			this.classList.toggle("active");
		    let content = this.nextElementSibling
		    if (content.style.maxHeight){
		    	el.innerText = 'Reply'
		    	content.style.maxHeight = null
		    }
		    else {
		    	el.innerText = 'Nevermind'
		    	content.style.maxHeight = content.scrollHeight + "px"
		    } 
		  });
		}
}