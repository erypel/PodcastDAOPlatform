/**
 * http://usejsdoc.org/
 */
const Login = document.querySelector('.Login')
Login.addEventListener('submit', (e) => {
  e.preventDefault()
  const username = Login.querySelector('.username').value
  const password = Login.querySelector('.password').value
  post('/login', { username, password })
    .then(({ status }) => {
      if (status === 200) window.location.href = "http://localhost:3000/dashboard"
      else alert('login failed')
    })
})