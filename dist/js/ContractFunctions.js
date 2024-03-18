const contractAddress = "0xa261192B9f5DAED05e681a1c9548e9652EFeD8C8";
const currentPath = window.location.pathname;

async function fetchABI() {
    const response = await fetch('/dist/js/abi.json');
    const abi = await response.json();
    return abi;
}

async function fetcherc20ABI() {
    const response = await fetch('/dist/js/erc20ABI.json');
    const erc20ABI = await response.json();
    return erc20ABI;
}

async function checkUserRegistration(address) {
    try {
        const abi = await fetchABI();
        const contract = new web3.eth.Contract(abi, contractAddress);
        const registered = await contract.methods.isUserRegistered(address).call();
        const walletInfo = document.getElementById('walletInfo');
        const registrationStatus = document.getElementById('registrationStatus');

        walletInfo.classList.remove('hidden');
        document.getElementById('walletAddress').textContent = `Connected: ${address}`;

        if (registered) {
            registrationStatus.textContent = 'Registered User';
            document.getElementById('proceedBtn').classList.remove('hidden');
        } else {
            registrationStatus.textContent = 'You are not registered.';
            document.getElementById('proceedBtn').classList.add('hidden');
            document.getElementById('signupBtn').classList.remove('hidden');
        }
        document.getElementById('loginBtn').classList.add('hidden');
    } catch (error) {
        console.error('Error checking user registration:', error);
        // Handle the error, possibly by showing an error message to the user
        const registrationStatus = document.getElementById('registrationStatus');
        registrationStatus.textContent = 'Error checking registration status. Please try again later.';
        // Optionally, hide both buttons if an error occurs
        document.getElementById('proceedBtn').classList.add('hidden');
        document.getElementById('signupBtn').classList.add('hidden');
    }
}

async function isUserRegistered(address) {
    try {
        const abi = await fetchABI();
        const contract = new web3.eth.Contract(abi, contractAddress);
        console.log('Checking if user is registered...'); // Debugging output
        const registered = await contract.methods.isUserRegistered(address).call();
        console.log('Registration status:', registered); // Debugging output
        return registered;
    } catch (error) {
        console.error('Error checking if user is registered:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

async function fetchAccountDetails(userAddress) {
    try {
        const abi = await fetchABI();
        const contract = new web3.eth.Contract(abi, contractAddress);
        const details = await contract.methods.getAccountDetails(userAddress).call();
        const shortenedAddress = shortenAddress(userAddress);

        safeSetTextContent('connected_wallet', shortenedAddress);

        // Assign the details to the corresponding elements using safeSetTextContent
        safeSetTextContent('userID', details.userID);
        updateUserIDs(details.userID);
        setGlobalUserID(details.userID);

        safeSetTextContent('sponsorID', details.sponsorID);
        safeSetTextContent('totalDirects', details.totalDirects);
        safeSetTextContent('totalIndirects', details.totalIndirects);
        // safeSetTextContent('isRegistered', details.isRegistered ? 'Yes' : 'No');
        safeSetTextContent('currentUserRank', details.rank);
        safeSetTextContent('totalTeamVolume', details.totalTeamVolume);
        safeSetTextContent('selfBusiness', details.selfBusiness);
        safeSetTextContent('totalWithdrawals', details.totalWithdrawals);
        safeSetTextContent('totalMatchingBonus', web3.utils.fromWei(details.totalMatchingBonus.toString(), 'ether'));

        if (currentPath.endsWith('dashboard/')) {
            fetchDirectCommissions(userAddress);
            fetchIndirectCommissions(userAddress);
            fetchTotalCommissions(userAddress);
            fetchTotalPaidMembers(userAddress);
        }

        if (currentPath.endsWith('buy-packages/')) {
            fetchAndRenderPackages();
        }

        if (currentPath.endsWith('direct_members/') || currentPath.endsWith('indirect_members/')) {
            createMembersTable(userAddress, 1, 20);
        }

        if (currentPath.endsWith('Packages_Report/') || currentPath.endsWith('packages_report/')) {
            createUserPackagesTable(userAddress, 1, 20);
        }

        if (currentPath.endsWith('dashboard/direct_commissions/') || currentPath.endsWith('dashboard/Direct_Commissions/')) {
            createDirectCommissionsTable(userAddress, 1, 20);
        } 
        
        if (currentPath.endsWith('indirect_commissions/') || currentPath.endsWith('Indirect_Commissions/')) {
            createInDirectCommissionsTable(userAddress, 1, 20);
        }

        if (currentPath.endsWith('/matching_bonus/') || currentPath.endsWith('/Matching_Bonus/')) {
            createMatchingBonusTable(userAddress, 1, 20);
        }

        
        console.log(currentPath);
    } catch (error) {
        console.error('Error fetching account details:', error);
        showAlert('Error fetching account details. Please try again later.', 'error');
        window.location.href = '/login';
    }
}

function safeSetTextContent(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

async function fetchDirectCommissions(userAddress) {
    const abi = await fetchABI();
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {
        const directCommissions = await contract.methods.getDirectCommissionsDetails(userAddress).call();
        
        let totalAmountInWei = directCommissions.reduce((acc, commission) => {
            return acc + BigInt(commission[0]);
        }, BigInt(0));

        let totalAmountInEther = web3.utils.fromWei(totalAmountInWei.toString(), 'ether');

        let directCommissionTotal = parseFloat(totalAmountInEther).toFixed(2);
        document.getElementById('directCommissionTotal').textContent = directCommissionTotal;
        console.log('Total Direct:', directCommissionTotal);        
    } catch (error) {
        console.error('Error fetching direct commissions:', error);
    }
}

async function fetchIndirectCommissions(userAddress) {
    const abi = await fetchABI();
    const contract = new web3.eth.Contract(abi, contractAddress);

    try {
        const indirectCommissions = await contract.methods.getIndirectCommissionsDetails(userAddress).call();
        
        // Sum the amounts from the indirectCommissions array
        let totalAmountInWei = indirectCommissions.reduce((acc, commission) => {
            return acc + BigInt(commission[0]); // Assuming commission[0] contains the amount in Wei
        }, BigInt(0)); // Use BigInt for large number arithmetic

        // Convert the total amount from Wei to Ether
        let totalAmountInEther = web3.utils.fromWei(totalAmountInWei.toString(), 'ether');

        // Optionally, format the total amount for readability
        let indirectCommissionTotal = parseFloat(totalAmountInEther).toFixed(2); // Keep two decimal places
        console.log('Total InDirect:', indirectCommissionTotal);
        document.getElementById('indirectCommissionTotal').textContent = indirectCommissionTotal;        
    } catch (error) {
        console.error('Error fetching direct commissions:', error);
    }
    
}

async function fetchTotalCommissions(userAddress) {
    const abi = await fetchABI();
    const contract = new web3.eth.Contract(abi, contractAddress);

    try {
        // Fetch direct commissions
        const directCommissions = await contract.methods.getDirectCommissionsDetails(userAddress).call();
        const directCommissionTotal = directCommissions.reduce((acc, commission) => {
            return acc + BigInt(commission.amount); // assuming commission amount is at index 'amount'
        }, BigInt(0));

        // Fetch indirect commissions
        const indirectCommissions = await contract.methods.getIndirectCommissionsDetails(userAddress).call();
        const indirectCommissionTotal = indirectCommissions.reduce((acc, commission) => {
            return acc + BigInt(commission.amount); // assuming commission amount is at index 'amount'
        }, BigInt(0));

        // Fetch matching bonuses
        const accountDetails = await contract.methods.getAccountDetails(userAddress).call();
        const totalMatchingBonus = web3.utils.fromWei(accountDetails.totalMatchingBonus.toString(), 'ether');

        // Convert total direct and indirect commissions to Ether
        const totalCommissionsInWei = directCommissionTotal + indirectCommissionTotal;
        const totalCommissionsInEther = web3.utils.fromWei(totalCommissionsInWei.toString(), 'ether');

        // Convert strings to numbers to perform addition
        const totalCommissions = parseFloat(totalCommissionsInEther);
        const totalBonuses = parseFloat(totalMatchingBonus);

        // Calculate total income
        const totalIncome = totalCommissions + totalBonuses;
        const totalIncomeRounded = totalIncome.toFixed(2); // rounded to 2 decimal places

        console.log('Total Income Today:', totalIncomeRounded);
        document.getElementById('totalIncomeToday').textContent = totalIncomeRounded;
    } catch (error) {
        console.error('Error fetching commissions:', error);
    }
}

async function fetchTotalPaidMembers(userAddress) {
    const abi = await fetchABI();
    const contract = new web3.eth.Contract(abi, contractAddress);
    let totalPaidMembers = 0;

    try {
        const directPaidMembers = await contract.methods.getDirectMemberDetails(userAddress).call();
        const paidDirectMembersCount = directPaidMembers.filter(member => member.isPaidMember).length;

        const indirectPaidMembers = await contract.methods.getIndirectMemberDetails(userAddress).call();
        const paidIndirectMembersCount = indirectPaidMembers.filter(member => member.isPaidMember).length;

        totalPaidMembers = paidDirectMembersCount + paidIndirectMembersCount;

        displayTotalPaidMembersCount(totalPaidMembers, 'totalPaidMembersCount');
    } catch (error) {
        console.error('Error fetching paid members:', error);
    }
}

function displayTotalPaidMembersCount(count, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = `${count}`; // Display the total count
}

async function fetchAndRenderPackages() {
    try {
        showLoading();
        const abi = await fetchABI();
        const contract = new web3.eth.Contract(abi, contractAddress);
        const packages = await contract.methods.getAllPackages().call();

        const container = document.getElementById('packages-wrapper');
        container.innerHTML = ''; // Clear existing content
        
        let row = createRow(); // Create the first row
        container.appendChild(row);
        let packagesInCurrentRow = 0;

        packages.forEach((pkg, index) => {
            const [packageId, amount, days, percentage, isActive] = pkg;
            if (isActive) {
                if (packagesInCurrentRow === 4) { // Start a new row after 4 packages
                    row = createRow();
                    container.appendChild(row);
                    packagesInCurrentRow = 0;
                }

                const packageElement = document.createElement('div');
                packageElement.className = 'custom-package-card'; // Use new class for package cards
                packageElement.innerHTML = `
                    <div class="custom-card box">
                        <i data-lucide="package-icon-${index}" class="block w-12 h-12 text-primary mx-auto"></i>
                        <div class="text-xl font-medium text-center mt-10">Package ${packageId}</div>
                        <div class="text-slate-600 dark:text-slate-500 text-center mt-5">${days} Days <span class="mx-1">•</span> ${percentage}% Returns</div>
                        <div class="text-5xl font-semibold text-center mt-8">$${amount}</div>
                        <button type="button" onclick="buyPackage(${packageId},${amount})" class="btn btn-primary shadow-md mr-2 mt-6">PURCHASE NOW</button>
                    </div>
                `;
                row.appendChild(packageElement);
                packagesInCurrentRow++;
            }
        });
    } catch (error) {
        console.error('Error fetching packages:', error);
    } finally {
        hideLoading();
    }
}

// Helper function to create a new row
function createRow() {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'custom-flex-row mt-8 mb-2'; // Use new class for row
    return rowDiv;
}

async function buyPackage(packageId, amount) {
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];  // Assuming the first account is the user's account
    if (!userAddress) {
        alert('User account not found. Please make sure you are connected to a web3 wallet.');
        return;
    }

    const abi = await fetchABI();
    const contract = new web3.eth.Contract(abi, contractAddress);
    const erc20ABI = await fetcherc20ABI();
    try {
        showLoading();
        const tokenAddress = await getTokenAddress();
        const tokenContract = new web3.eth.Contract(erc20ABI, tokenAddress);
        
        // Determine the required token amount for the given packageId
        // This requires a contract method that returns the price for the given packageId, adjust as necessary
        const packagePrice = amount;
        
        // Check current token allowance
        const currentAllowance = await tokenContract.methods.allowance(userAddress, contractAddress).call();
        
        if (BigInt(currentAllowance) < BigInt(packagePrice)) {
            // If allowance is less than the package price, request approval for the exact package amount or more
            showAlert('Requesting token approval...', 'success');
            await requestTokenApproval(userAddress);
            showAlert('Token approval successful.', 'success');
        }

        // Proceed with purchasing the package
        showAlert('Purchasing package...', 'success');
        await contract.methods.purchasePackage(packageId).send({ from: userAddress });
        showAlert('Package purchased successfully.', 'success');
        // Optionally, update the UI or notify the user of the successful purchase
    } catch (error) {
        showAlert('Purchase Failed!', 'error');                
    } finally{
        hideLoading();
    }
}

async function requestTokenApproval(userAddress) {
    const erc20ABI = await fetcherc20ABI();
    const maxUint256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    try {
        const tokenAddress = await getTokenAddress();  // Retrieve the token contract address

        // Create a new contract instance for the token using its ABI and address
        const tokenContract = new web3.eth.Contract(erc20ABI, tokenAddress);

        // Request approval to spend the tokens by calling the `approve` function
        await tokenContract.methods.approve(contractAddress, maxUint256).send({ from: userAddress });

        showAlert('Token approval successful','success');
    } catch (error) {
        console.error('Error in requesting unlimited token approval:', error);
    }
}

async function getTokenAddress() {
    const abi = await fetchABI();
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {
        return await contract.methods.token().call();
    } catch (error) {
        console.error('Error getting token address:', error);
    }
}

async function fetchUserId(userAddress) {
    const abi = await fetchABI();
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {
        const accountDetails = await contract.methods.getAccountDetails(userAddress).call();
        // Assuming accountDetails[0] is the userID
        const userID = accountDetails.userID;
        return userID;
    } catch (error) {
        console.error('Error fetching referrer user ID:', error);
        return ''; // Return an empty string or some default value in case of an error
    }
}

// Function to fetch direct member details
async function fetchDirectMemberDetails(userAddress) {
    const abi = await fetchABI();
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {
        const directMembers = await contract.methods.getDirectMemberDetails(userAddress).call();
        //console.log(directMembers);
        // Proceed to process this data and display it in a table
        //createTable(directMembers);
        return directMembers;
    } catch(error) {
        console.error('Error fetching direct member details:', error);
    }
}

// Function to fetch Indirect member details
async function fetchInDirectMemberDetails(userAddress) {
    const abi = await fetchABI();
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {
        const IndirectMembers = await contract.methods.getIndirectMemberDetails(userAddress).call();
        //console.log(directMembers);
        // Proceed to process this data and display it in a table
        //createTable(directMembers);
        return IndirectMembers;
    } catch(error) {
        console.error('Error fetching Indirect member details:', error);
    }
}

async function createMembersTable(userAddress, currentPage = 1, recordsPerPage = 20) {
    showLoading();
    try {
        const memberType = document.querySelector('[data-member-type]').dataset.memberType;

        let membersToDisplay, tbody, totalRecords;
        const directMembers = await fetchDirectMemberDetails(userAddress);
        const indirectMembers = await fetchInDirectMemberDetails(userAddress); // Check this
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        
        if (memberType === 'direct') {
            membersToDisplay = directMembers.slice(startIndex, endIndex);
            tbody = document.getElementById('directUsersTable');
            totalRecords = directMembers.length;
        } else if (memberType === 'indirect') {
            membersToDisplay = indirectMembers.slice(startIndex, endIndex);
            tbody = document.getElementById('IndirectUsersTable');
            totalRecords = indirectMembers.length;
        }

        tbody.innerHTML = ''; // Clear existing rows

        // Iterate through each member to create and append rows
        for (let i = 0; i < membersToDisplay.length; i++) {
            const member = membersToDisplay[i];
            const referrerUserId = await fetchUserId(member.referrer); // Fetch the referrer's user ID

            // Create a new row
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${startIndex + i + 1}</td> <!-- S.No -->
                <td>${member.id}</td> <!-- User ID -->
                <td>${referrerUserId}</td> <!-- Sponsor ID -->
                <td>${member.totalDirects}</td> <!-- Total Directs -->
                <td>${member.totalIndirects}</td> <!-- Total Indirects -->
                <td>${member.totalTeamVolume}</td> <!-- Total Team Volume -->
                <td>${member.selfBusiness}</td> <!-- Self Business -->
                <td>${member.rank}</td> <!-- Status -->
                <td class="${member.isPaidMember ? 'text-success' : 'text-danger'}">${member.isPaidMember ? 'Active' : 'Inactive'}</td> <!-- Is Active -->
            `;
        }

        // Call function to update pagination links
        updatePaginationLinks(totalRecords, currentPage, recordsPerPage);
    } catch (error) {
        console.error('Error processing direct members:', error);
    } finally {
        hideLoading(); // Hide the loading indicator after the data has been fetched and processed, or an error has occurred
    }
}

function updatePaginationLinks(totalRecords, currentPage, recordsPerPage) {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const paginationContainer = document.querySelector('.pagination ul');
    paginationContainer.innerHTML = ''; // Clear existing pagination links

    // Generate "Previous" link
    paginationContainer.innerHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="${currentPage > 1 ? `changePage(${currentPage - 1})` : `return false;`}">&lsaquo;</a>
    </li>`;

    // Always include the first page
    if (currentPage > 3) {
        paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(1)">1</a></li>`;
        if (currentPage > 4) {
            paginationContainer.innerHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    // One page before the current page
    if (currentPage > 2) {
        paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${currentPage - 1})">${currentPage - 1}</a></li>`;
    }

    // The current page
    paginationContainer.innerHTML += `<li class="page-item active"><span class="page-link">${currentPage}</span></li>`;

    // One page after the current page
    if (currentPage < totalPages - 1) {
        paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${currentPage + 1})">${currentPage + 1}</a></li>`;
    }

    // Always include the last page
    if (currentPage < totalPages - 2) {
        if (currentPage < totalPages - 3) {
            paginationContainer.innerHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a></li>`;
    }

    // Generate "Next" link
    paginationContainer.innerHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="${currentPage < totalPages ? `changePage(${currentPage + 1})` : `return false;`}">&rsaquo;</a>
    </li>`;
}

// Function to handle page change
async function changePage(page) {
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];

    if(currentPath.endsWith('packages_report/')){
        createUserPackagesTable(userAddress, page, parseInt(document.getElementById('Packagerecords-per-page').value, 10));   
    }

    if (currentPath.endsWith('direct_members/') || currentPath.endsWith('indirect_members/')) {
        createMembersTable(userAddress, page, parseInt(document.getElementById('records-per-page').value, 10));
    }

}

if (currentPath.endsWith('direct_members/') || currentPath.endsWith('indirect_members/')) {
    // Event listener for records-per-page selection change
    document.getElementById('records-per-page').addEventListener('change', function() {
        // Re-fetch and display the first page of data with the new records per page
        changePage(1);
    });
}

if (currentPath.endsWith('packages_report/')) {
    document.getElementById('Packagerecords-per-page').addEventListener('change', function() {
        changePage(1);
    });
}

// Function to display user package details
async function fetchUserPackages(userAddress) {
    const abi = await fetchABI(); // Ensure this function is defined and returns the ABI
    const contract = new web3.eth.Contract(abi, contractAddress); // Ensure contractAddress is defined
    try {
        const userPackages = await contract.methods.getUserInvestments(userAddress).call();
        return userPackages; // Return the data for use in your app
    } catch (error) {
        console.error('Error fetching user packages:', error);
        return []; // Return an empty array in case of an error
    }
}

async function createUserPackagesTable(userAddress, currentPage = 1, recordsPerPage = 20) {
    showLoading();
    try {
        const userPackages = await fetchUserPackages(userAddress);
        const totalRecords = userPackages.length;
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = Math.min(startIndex + recordsPerPage, totalRecords);
    
        const tbody = document.getElementById('PackageReportTable'); // Ensure this ID matches your table's body ID
        tbody.innerHTML = ''; // Clear the table body to repopulate
    
        // Iterate through the userPackages to populate the table
        for (let i = startIndex; i < endIndex; i++) {
            const pkg = userPackages[i];
            const row = tbody.insertRow();
    
            const startDate = new Date(parseInt(pkg.startTime) * 1000).toLocaleString();
            const endDate = new Date(parseInt(pkg.endTime) * 1000).toLocaleString();
            const isWithdrawnText = pkg.isWithdrawn ? 'Yes' : 'No';
            const withdrawalClass = pkg.isWithdrawn ? 'text-success' : 'text-warning'; // Consider "text-warning" for pending
            
            let statusText = 'Running';
            let statusClass = 'text-success';
            
            const now = new Date();
            const endTime = new Date(parseInt(pkg.endTime) * 1000);

            if (pkg.isWithdrawn) {
                statusText = 'Withdrawn';
                statusClass = 'text-danger';
            } else if (now > endTime) {
                statusText = 'Finished';
                statusClass = 'text-info'; // Use a different class for finished status if you like
            }
    
            const amountInvested = parseFloat(pkg.amountInvested).toFixed(2); // Ensure formatting to 2 decimal places
            const totalReturnPercentage = parseFloat(pkg.returnPercentage).toFixed(2); // Same for return percentage
    
            // Assuming withdrawReturns function is correctly implemented
            row.innerHTML = `
                <td>${i + 1}</td>
                <td onclick="copyToClipboard('${pkg.id}')" style="cursor:pointer;">${pkg.id}</td>
                <td>$${amountInvested}</td>
                <td>$${pkg.totalReturn}</td>
                <td>${startDate}</td>
                <td>${endDate}</td>
                <td>${totalReturnPercentage}%</td>
                <td class="${withdrawalClass}">${isWithdrawnText}</td>
                <td class="${statusClass}">${statusText}</td>
                <td><button class="btn btn-primary" onclick='withdrawReturns("${pkg.packageId}", "${pkg.id}", "${userAddress}")'>Withdraw</button></td>
            `;
        }

        // Update pagination links
        updatePaginationLinks(totalRecords, currentPage, recordsPerPage, createUserPackagesTable, userAddress);
    } catch (error) {
        console.error('Error creating user packages table:', error);
    } finally {
        hideLoading(); // Hide the loading indicator
    }
}

async function withdrawReturns(packageId, investmentId, userAddress) {
    const abi = await fetchABI();
    const contract = new web3.eth.Contract(abi, contractAddress);

    showLoading();

    try {
        const { isValid, isWithdrawn, canWithdraw } = await contract.methods
            .isInvestmentValidAndNotWithdrawn(userAddress, packageId, investmentId)
            .call();

        if (!isValid) {
            showAlert("Invalid package ID or investment ID.", 'error');
            return;
        }
        if (isWithdrawn) {
            showAlert("Investment already withdrawn.", 'error');
            return;
        }
        if (!canWithdraw) {
            showAlert("Withdrawal is locked until Package Ends.", 'error');
            return;
        }

        const receipt = await contract.methods.withdrawReturns(packageId, investmentId).send({ from: userAddress });
        showAlert('Withdraw successful!', 'success');
        console.log(receipt);
    } catch (error) {
        console.error('Error withdrawing returns:', error);
        showAlert('Error withdrawing returns', 'error');
    } finally {
        hideLoading();
    }
}


async function createDirectCommissionsTable(userAddress, currentPage = 1, recordsPerPage = 10) {
    showLoading();
    try {
        let directCommissions = await fetchDirectCommissionsDetails(userAddress);
        directCommissions = directCommissions.slice().sort((a, b) => b.timestamp - a.timestamp);
        const totalRecords = directCommissions.length;
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = Math.min(startIndex + recordsPerPage, totalRecords);
        const tbody = document.getElementById('directCommissionTable');
        tbody.innerHTML = '';
        for (let i = startIndex; i < endIndex; i++) {
            const commission = directCommissions[i];
            const userId = await fetchUserId(commission.fromUser);
            const readableAmount = web3.utils.fromWei(commission.amount, 'ether');
            const date = new Date(parseInt(commission.timestamp) * 1000).toLocaleString();
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${totalRecords - i}</td>
                <td>${userId}</td>
                <td>$${parseFloat(readableAmount).toFixed(2)}</td>
                <td>${date}</td>
            `;
        }
        updatePaginationLinks(totalRecords, currentPage, recordsPerPage, createUserPackagesTable, userAddress);
    } catch (error) {
        console.error('Error creating direct commissions table:', error);
    } finally {
        hideLoading();
    }
}


async function fetchDirectCommissionsDetails(userAddress) {
    const abi = await fetchABI();
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {
        const directCommissions = await contract.methods.getDirectCommissionsDetails(userAddress).call();
        console.log(directCommissions);
        return directCommissions;        
    } catch (error) {
        console.error('Error fetching direct commissions:', error);
    }
}


async function fetchInDirectCommissionsDetails(userAddress) {
    const abi = await fetchABI();
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {
        const IndirectCommissions = await contract.methods.getIndirectCommissionsDetails(userAddress).call();
        return IndirectCommissions;
    } catch (error) {
        console.error('Error fetching direct commissions:', error);
    }
}


async function createInDirectCommissionsTable(userAddress, currentPage = 1, recordsPerPage = 20) {
    showLoading();
    try {
        let IndirectCommissions = await fetchInDirectCommissionsDetails(userAddress);
        IndirectCommissions = IndirectCommissions.slice().sort((a, b) => b.timestamp - a.timestamp);

        const totalRecords = IndirectCommissions.length;
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = Math.min(startIndex + recordsPerPage, totalRecords);

        const tbody = document.getElementById('indirectCommissionTable')
        tbody.innerHTML = '';

        for (let i = startIndex; i < endIndex; i++) {
            const commission = IndirectCommissions[i];
            const userId = await fetchUserId(commission.fromUser);
            const readableAmount = web3.utils.fromWei(commission.amount, 'ether');
            const date = new Date(parseInt(commission.timestamp) * 1000).toLocaleString();

            const row = tbody.insertRow();
            const serialNumber = totalRecords - (startIndex + i);
            row.innerHTML = `
                <td>${serialNumber}</td>
                <td>${userId}</td>
                <td>$${parseFloat(readableAmount).toFixed(2)}</td>
                <td>${date}</td>
            `;
        }

        updatePaginationLinks(totalRecords, currentPage, recordsPerPage, createInDirectCommissionsTable, userAddress); // Make sure to pass the correct callback
    } catch (error) {
        console.error('Error creating indirect commissions table:', error);
    } finally {
        hideLoading(); // Hide the loading indicator
    }
}


async function fetchMatchingBonusDetails(userAddress) {
    const abi = await fetchABI();
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {
        const MatchingBonusRecords = await contract.methods.getMatchingBonusRecords(userAddress).call();
        //console.log(MatchingBonusRecords);
        return MatchingBonusRecords;        
    } catch (error) {
        console.error('Error fetching direct commissions:', error);
    }
}

async function createMatchingBonusTable(userAddress, currentPage = 1, recordsPerPage = 20) {
    showLoading();
    try {
        let MatchingBonus = await fetchMatchingBonusDetails(userAddress);
        MatchingBonus = MatchingBonus.slice().sort((a, b) => b.timestamp - a.timestamp);
        const totalRecords = MatchingBonus.length;
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = Math.min(startIndex + recordsPerPage, totalRecords);

        const tbody = document.getElementById('matchingBonusTable');
        tbody.innerHTML = ''; 

        for (let i = startIndex; i < endIndex; i++) {
            const commission = MatchingBonus[i];
            const userId = await fetchUserId(commission.fromUser);
            const readableAmount = web3.utils.fromWei(commission.amount, 'ether');
            const date = new Date(parseInt(commission.timestamp) * 1000).toLocaleString();

            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${totalRecords - i}</td>
                <td>${userId}</td>
                <td>$${parseFloat(readableAmount).toFixed(2)}</td>
                <td>${date}</td>
            `;
        }

        updatePaginationLinks(totalRecords, currentPage, recordsPerPage, createUserPackagesTable, userAddress);
    } catch (error) {
        console.error('Error creating matching bonus table:', error);
    } finally {
        hideLoading(); // Hide the loading indicator
    }
}

