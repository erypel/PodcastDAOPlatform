/**
 * http://usejsdoc.org/
 */
const CreateUser = document.querySelector('.CreateUser')
CreateUser.addEventListener('submit', (e) => {
  e.preventDefault()
  const username = CreateUser.querySelector('.username').value
  const email = CreateUser.querySelector('.email').value
  const password = CreateUser.querySelector('.password').value
  post('/createUser', { username, email, password }).then(function(res){
	  /*
		 * Authentication Responses An application should respond with a generic
		 * error message regardless of whether the user ID or password was
		 * incorrect. It should also give no indication to the status of an
		 * existing account.
		 * 
		 * Incorrect Response Examples "Login for User foo: invalid password"
		 * "Login failed, invalid user ID" "Login failed; account disabled"
		 * "Login failed; this user is not active" Correct Response Example
		 * "Login failed; Invalid userID or password" The correct response does
		 * not indicate if the user ID or password is the incorrect parameter
		 * and hence inferring a valid user ID.
		 * 
		 * Error Codes and URLs The application may return a different HTTP
		 * Error code depending on the authentication attempt response. It may
		 * respond with a 200 for a positive result and a 403 for a negative
		 * result. Even though a generic error page is shown to a user, the HTTP
		 * response code may differ which can leak information about whether the
		 * account is valid or not.
		 */
	  if(res.status == 200){
		  window.location.href = "http://localhost:3000/login"
	  }
	  else{
		  alert(res.statusText)
	  }
  })
})