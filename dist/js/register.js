let web3;

document.addEventListener('DOMContentLoaded', (event) => {
    const params = new URLSearchParams(window.location.search);
    const sponsorId = params.get('ref');
    // Validate that the sponsorId is exactly 6 digits
    if (sponsorId && /^\d{6}$/.test(sponsorId)) {
      // Set the sponsor ID to the input field
      document.getElementById('sponsorID').value = sponsorId;
    }

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
        const disconnectBtn = document.getElementById('disconnectBtn');
        disconnectBtn.classList.remove('hidden');
        const register_frm = document.getElementById('register_frm');
        register_frm.classList.remove('hidden');
        
        walletInfo.classList.remove('hidden');
        document.getElementById('connectBtn').classList.add('hidden');

        const registerBtn = document.getElementById('registerBtn');
        registerBtn.classList.remove('hidden');

        const LoginBtn = document.getElementById('LoginBtn');
        LoginBtn.classList.remove('hidden');
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
            walletInfo.classList.remove('hidden');

            const register_frm = document.getElementById('register_frm');
            register_frm.classList.remove('hidden');

            const registerBtn = document.getElementById('registerBtn');
            registerBtn.classList.remove('hidden');

            document.getElementById('connectBtn').classList.add('hidden');
            
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
            console.log('Connected to MetaMask.');

            // Close the modal
            modal.style.display = 'none';

            // Update wallet information
            const walletInfo = document.getElementById('walletInfo');
            walletInfo.classList.remove('hidden');

            const register_frm = document.getElementById('register_frm');
            register_frm.classList.remove('hidden');

            const registerBtn = document.getElementById('registerBtn');
            registerBtn.classList.remove('hidden');

            document.getElementById('connectBtn').classList.add('hidden');
            
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
            console.log('Connected to MetaMask.');

            // Close the modal
            modal.style.display = 'none';

            // Update wallet information
            const walletInfo = document.getElementById('walletInfo');
            walletInfo.classList.remove('hidden');

            const register_frm = document.getElementById('register_frm');
            register_frm.classList.remove('hidden');

            const registerBtn = document.getElementById('registerBtn');
            registerBtn.classList.remove('hidden');

            document.getElementById('connectBtn').classList.add('hidden');
            
        } catch (error) {
            console.error('User denied account access to MetaMask or an error occurred:', error);
        }
    } else {
        alert('Please install TokenPocket or Supported Wallet!');
    }
}



// Logic for disconnecting the wallet
function disconnectWallet() {
    document.getElementById('walletInfo').classList.add('hidden');
    document.getElementById('connectBtn').classList.remove('hidden');
    const register_frm = document.getElementById('register_frm');
    register_frm.classList.add('hidden');
}

function proceedToDashboard() {
    window.location.href = '/dashboard'; 
}

function proceedToLogin() {
    window.location.href = '/login'; 
}
