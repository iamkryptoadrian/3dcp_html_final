document.addEventListener('DOMContentLoaded', async () => {
    // Check if Web3 is injected (MetaMask or any other wallet is installed)
    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
        // Use the injected provider (MetaMask, Trust Wallet, etc.)
        web3 = new Web3(window.ethereum || window.web3.currentProvider);

        // Fetch the accounts from the wallet
        try {
            const accounts = await web3.eth.getAccounts();

            // If there are accounts available, use the first one to fetch account details
            if (accounts.length > 0) {
                console.log('Wallet is connected:', accounts[0]);
                await fetchAccountDetails(accounts[0]);
            } else {
                showAlert('No wallet connected.', 'error');
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error fetching accounts:', error);
            showAlert('Error fetching accounts. Please connect your wallet.', 'error');
        }
    } else {
        console.log('Wallet is not detected. Please install MetaMask or use a browser with an Ethereum wallet.');
        showAlert('Wallet is not detected. Please install MetaMask or use a browser with an Ethereum wallet.', 'error');
    }

    // Listen for account changes
    window.ethereum.on('accountsChanged', function (accounts) {
        console.log('Account changed:', accounts[0]);
        window.location.reload();
    });
    
});


function shortenAddress(address) {
    const start = address.slice(0, 6); // Take the first 6 characters
    const end = address.slice(-6); // Take the last 4 characters
    return `${start}...${end}`; // Combine them with an ellipsis in the middle
}

function Dashboardlogout () {
    window.location.href = '/login'; 
}

function updateUserIDs(userID) {
    const userIDElements = document.querySelectorAll('.user-id-display');
    userIDElements.forEach(element => {
      element.textContent = userID;
    });
}

var globalUserID;

function setGlobalUserID(userID) {
  globalUserID = userID;
  updateReferralLinks(); // Call the function to update referral links whenever the user ID changes
}

function updateReferralLinks() {
    var userID = globalUserID;
    if (userID) {
      var host = window.location.origin;
      var referralLink = host + '/register/?ref=' + userID;
  
      // Set the referral link in the input fields
      const referralElement = document.getElementById('referral_link');
      const referralElement1 = document.getElementById('referral_link1');
      if (referralElement) referralElement.value = referralLink;
      if (referralElement1) referralElement1.value = referralLink;
    }
}

// Function to copy the referral link to the clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Copying to clipboard was successful!');
        alert('Link Copied');
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}

const copyreferralElement = document.getElementById('copyReferralLink');
const copyreferralElement1 = document.getElementById('copyReferralLink1');
// Event listener for the 'Copy' button click
if (copyreferralElement) {
    document.getElementById('copyReferralLink').addEventListener('click', function() {
        var referralLink = document.getElementById('referral_link').value;
        copyToClipboard(referralLink);
    });
}else {
    //make nothing
}