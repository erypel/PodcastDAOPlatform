/**
 * http://usejsdoc.org/
 */
// TODO want to prevent brute force login attempts
/*
 * If an attacker is able to guess passwords without the account becoming
 * disabled due to failed authentication attempts, the attacker has an
 * opportunity to continue with a brute force attack until the account is
 * compromised. Automating brute-force/password guessing attacks on web
 * applications is a trivial challenge. Password lockout mechanisms should be
 * employed that lock out an account if more than a preset number of
 * unsuccessful login attempts are made. Password lockout mechanisms have a
 * logical weakness. An attacker that undertakes a large number of
 * authentication attempts on known account names can produce a result that
 * locks out entire blocks of user accounts. Given that the intent of a password
 * lockout system is to protect from brute-force attacks, a sensible strategy is
 * to lockout accounts for a period of time (e.g., 20 minutes). This
 * significantly slows down attackers, while allowing the accounts to reopen
 * automatically for legitimate users.
 * 
 * Also, multi-factor authentication is a very powerful deterrent when trying to
 * prevent brute force attacks since the credentials are a moving target. When
 * multi-factor is implemented and active, account lockout may no longer be
 * necessary.
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
    .then(({ status }) => {
    	// TODO error messages should be appropriate
      if (status === 200) window.location.href = "http://localhost:3000/dashboard"
      else alert('login failed')
    })
})