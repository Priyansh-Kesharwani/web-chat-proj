// Get DOM elements
const signInForm = document.querySelector('.right');
const emailInput = document.querySelector('input[name="email"]');
const passwordInput = document.querySelector('input[name="password"]');
const errorText = document.getElementById('valid');

// Event listener for form submit
signInForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent form submission

  // Get form data
  const email = emailInput.value;
  const password = passwordInput.value;

  // Validate form data
  if (!email || !password) {
    errorText.textContent = 'Please fill in all fields.';
    return;
  }

  // Send form data to server for signin
  const response = await fetch('https://web-chat-project2.herokuapp.com/routes/users/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  // Check response status
  if (response.ok) {
    window.location.href = '/dashboard'; // Redirect to dashboard on successful signin
  } else {
    const data = await response.json();
    errorText.textContent = data.error || 'Sign in failed. Please try again.';
  }
});
