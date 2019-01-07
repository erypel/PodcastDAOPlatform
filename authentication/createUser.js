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
	  if(res.status == 200) window.location.href = "http://localhost:3000/login"
  })
})