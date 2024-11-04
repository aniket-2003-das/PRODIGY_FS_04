// DOM elements
const signupform = document.getElementById("signup-form");
const loginform = document.getElementById("login-form");
const verifystatus = document.getElementById("verification-status");

// Event listener for signup form submission
if (signupform) {
  signupform.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Get form input values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPass = document.getElementById("confirmPassword").value;
    try {
      // Send signup request to the server
      const result = await axios.post("/users/signup", {
        userName: name,
        userEmail: email,
        password: password,
        passwordConfirm: confirmPass,
      });
      // Alert success message and redirect to verification page
      alert(result.data.Message);
      window.location.href = `/verifyfirst?id=${result.data.newUser._id}`;
    } catch (err) {
      // Alert error message if signup fails
      alert(err.response.data.message);
    }
  });
}

// Event listener for login form submission
if (loginform) {
  loginform.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Get form input values
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      // Send login request to the server
      const result = await axios.post("/users/login", {
        userEmail: email,
        password: password,
      });
      // Alert success message and redirect to home page
      alert(result.data.status);
      window.location.href = `/home?id=${result.data.user._id}`;
    } catch (err) {
      // Alert error message if login fails
      alert(err.response.data.message);
    }
  });
}
