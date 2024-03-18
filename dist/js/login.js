let web3;

document.addEventListener('DOMContentLoaded', (event) => {

    // Check for Ethereum provider
    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
        // Use MetaMask's provider
        web3 = new Web3(window.ethereum || window.web3.currentProvider);
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', function (accounts) {
            console.log('Account changed:', accounts[0]);
            window.location.reload();
        });

        // Immediately check if the wallet is connected and if the user is registered
        checkIfWalletIsConnected();
    } else {
        alert('Wallet is not detected. Please install MetaMask or use a browser with an Ethereum wallet.');
    }
});

async function checkIfWalletIsConnected() {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
        // An account is connected
        console.log('Wallet is connected:', accounts[0]);
        await checkUserRegistration(accounts[0]);
    } else {
        console.log('No wallet connected.');
    }
}

async function connectMetaMask() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected to MetaMask.');

            // Close the modal
            modal.style.display = 'none';

            // Update wallet information
            const walletInfo = document.getElementById('walletInfo');
            const proceedBtn = document.getElementById('proceedBtn');
            const signupBtn = document.getElementById('signupBtn');

            walletInfo.classList.remove('hidden');
            document.getElementById('walletAddress').textContent = `Connected: ${accounts[0]}`;
            document.getElementById('loginBtn').classList.add('hidden');

            try {
                // Check if the user is registered in the smart contract
                const registered = await isUserRegistered(accounts[0]);
                if (registered) {
                    proceedBtn.classList.remove('hidden');
                    signupBtn.classList.add('hidden');
                    console.log('User is registered.');
                } else {
                    // Hide the proceed button and show the sign-up button
                    proceedBtn.classList.add('hidden');
                    signupBtn.classList.remove('hidden');
                    console.log('User is not registered.');
                }
            } catch (error) {
                // Handle any errors that occurred during registration check
                console.error('Registration check failed:', error);
            }
            
        } catch (error) {
            console.error('User denied account access to MetaMask or an error occurred:', error);
        }
    } else {
        alert('Please install MetaMask!');
    }
}

async function connectTrustWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected to Trustwallet.');

            // Close the modal
            modal.style.display = 'none';

            // Update wallet information
            const walletInfo = document.getElementById('walletInfo');
            const proceedBtn = document.getElementById('proceedBtn');
            const signupBtn = document.getElementById('signupBtn');

            walletInfo.classList.remove('hidden');
            document.getElementById('walletAddress').textContent = `Connected: ${accounts[0]}`;
            document.getElementById('loginBtn').classList.add('hidden');

            try {
                // Check if the user is registered in the smart contract
                const registered = await isUserRegistered(accounts[0]);
                if (registered) {
                    proceedBtn.classList.remove('hidden');
                    signupBtn.classList.add('hidden');
                    console.log('User is registered.');
                } else {
                    // Hide the proceed button and show the sign-up button
                    proceedBtn.classList.add('hidden');
                    signupBtn.classList.remove('hidden');
                    console.log('User is not registered.');
                }
            } catch (error) {
                // Handle any errors that occurred during registration check
                console.error('Registration check failed:', error);
            }
            
        } catch (error) {
            console.error('User denied account access to MetaMask or an error occurred:', error);
        }
    } else {
        alert('Please install Trustwallet or Supported Wallet!');
    }
}


async function connectTokenPocket() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected to TokenPocket.');

            // Close the modal
            modal.style.display = 'none';

            // Update wallet information
            const walletInfo = document.getElementById('walletInfo');
            const proceedBtn = document.getElementById('proceedBtn');
            const signupBtn = document.getElementById('signupBtn');

            walletInfo.classList.remove('hidden');
            document.getElementById('walletAddress').textContent = `Connected: ${accounts[0]}`;
            document.getElementById('loginBtn').classList.add('hidden');

            try {
                // Check if the user is registered in the smart contract
                const registered = await isUserRegistered(accounts[0]);
                if (registered) {
                    proceedBtn.classList.remove('hidden');
                    signupBtn.classList.add('hidden');
                    console.log('User is registered.');
                } else {
                    // Hide the proceed button and show the sign-up button
                    proceedBtn.classList.add('hidden');
                    signupBtn.classList.remove('hidden');
                    console.log('User is not registered.');
                }
            } catch (error) {
                // Handle any errors that occurred during registration check
                console.error('Registration check failed:', error);
            }
            
        } catch (error) {
            console.error('User denied account access to MetaMask or an error occurred:', error);
        }
    } else {
        alert('Please install TokenPocket or Supported Wallet!');
    }
}



// Logic for disconnecting the wallet
function disconnectWallet() {
    // Perform wallet disconnection logic if necessary

    // Hide wallet info and show login button
    document.getElementById('walletInfo').classList.add('hidden');
    document.getElementById('loginBtn').classList.remove('hidden');
}

function proceedToDashboard() {
    window.location.href = '/dashboard'; 
}

function proceedToRegister() {
    window.location.href = '/register'; 
}
