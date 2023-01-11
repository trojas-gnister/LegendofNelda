 const signupFormHandler = async (event) => {
  event.preventDefault();
  try {
    const name = document.querySelector('#name-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
  

    if (!name || !password) {
      alert("You must provide a username and password.");
      return;
    }

    const response = await fetch("/api/users/signup", {
      method: "POST",
      body: JSON.stringify({ name, password }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      alert("Failed to sign up.");
      return;
    }

    // go to home page
    document.location.replace("/");
  } catch (error) {
    console.log(error);
  }
};
  
  document
    .querySelector('.signup-form')
    .addEventListener('submit', signupFormHandler);
  