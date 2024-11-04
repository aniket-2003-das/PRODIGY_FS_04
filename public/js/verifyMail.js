// Extracting the user ID from the URL query parameters
const id = window.location.search.split("?")[1].split("=")[1];

// Making a GET request to fetch user data based on the ID
axios.get(`/users/${id}`).then((response) => {
  // Checking if the user is verified
  if (response.data.cuser[0].verified) {
    // Updating the verification status element in the UI
    document.getElementById("verification-status").innerText =
      "Your Email has been verified";
  }
});
