 const signupFormHandler = async (event) => {
    event.preventDefault();
  
    const name = document.querySelector('#name-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
  
    if (name && password) {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        body: JSON.stringify({ name, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/login');
        alert("You have successfully signed up! Please log in.")
    } else {
        alert(response.statusText);
      }
    }
  };
  

  
  document
    .querySelector('.signup-form')
    .addEventListener('submit', signupFormHandler);
  