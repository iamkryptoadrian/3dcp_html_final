const contractAddress = "0xa261192B9f5DAED05e681a1c9548e9652EFeD8C8";

async function fetchABI() {
    const response = await fetch('../dist/js/abi.json');
    const abi = await response.json();
    return abi;
}

(async function() {
    const contractABI = await fetchABI();
    contract = new web3.eth.Contract(contractABI, contractAddress);
    // Additional code that depends on `contract` can go here
})();


// This function is called when the "Register Now" button is clicked
async function proceedToUserRegistration() {
    const sponsorIdInput = document.getElementById('sponsorID');
    const sponsorId = sponsorIdInput.value;
    if (!sponsorId) {
      showAlert('Please enter a sponsor ID.', 'error');
      return;
    }
    
    showLoading(); // Show the loading GIF

    try {
      const accounts = await web3.eth.getAccounts();
      const userAddress = accounts[0];      

      // Check if the user is already registered
      const isRegistered = await contract.methods.isUserRegistered(userAddress).call();
      if (isRegistered) {
        hideLoading();
        showAlert('You are already registered. Please Login to your account', 'error');
        return;
      }

      // Get the sponsor's address from the sponsor ID
      const sponsorAddress = await contract.methods.userIdToAddress(sponsorId).call();
      
      if (sponsorAddress === '0x0000000000000000000000000000000000000000' || sponsorAddress === userAddress) {
        hideLoading();
        showAlert('Invalid sponsor ID', 'error');
        return;
      }
      
      // Call the `registerUser` function of the smart contract
      const receipt = await contract.methods.registerUser(sponsorId).send({ from: userAddress });
      hideLoading(); // Hide the loading GIF after the transaction is complete
      showAlert('User registered successfully!', 'success');
    } catch (error) {
      hideLoading(); // Ensure we hide the loading GIF in case of error
      showAlert('Registration failed:' + error, 'error');
    }
}
