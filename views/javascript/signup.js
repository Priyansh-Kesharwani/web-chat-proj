// Get DOM elements
const signUpForm = document.querySelector('.right');
const userNameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('pass');
const errorText = document.getElementById('valid');

// Event listener for form submit
signUpForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent form submission

  // Get form data
  const userName = userNameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  // Validate form data
  if (!userName || !email || !password) {
    errorText.textContent = 'Please fill in all fields.';
    return;
  }

  // Send form data to server for signup
  const response = await fetch('https://web-chat-project2.herokuapp.com/routes/users/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, email, password })
  });

  // Check response status
  if (response.ok) {
    window.location.href = '/signin'; // Redirect to signin page on successful signup
  } else {
    const data = await response.json();
    errorText.textContent = data.error || 'Sign up failed. Please try again.';
  }
});
