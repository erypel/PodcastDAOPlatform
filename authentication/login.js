/**
 * http://usejsdoc.org/
 */

// TODO add logging
/*
 * Enable logging and monitoring of authentication functions to detect attacks /
 * failures on a real time basis
 * 
 * Ensure that all failures are logged and reviewed Ensure that all password
 * failures are logged and reviewed Ensure that all account lockouts are logged
 * and reviewed
 */

const Login = document.querySelector('.Login')
Login.addEventListener('submit', (e) => {
  e.preventDefault()
  const username = Login.querySelector('.username').value
  const password = Login.querySelector('.password').value
  post('/login', { username, password })
    .then(({ status, statusText }) => {
    	// TODO error messages should be appropriate
      if (status === 200) window.location.href = "http://localhost:3000/dashboard"
      else alert(statusText)
    })
})