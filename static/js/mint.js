// 
(async function () {

    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
        window.web3 = new Web3(window.ethereum)
        let ethereum = window.ethereum
        try {
            const accounts = await window.web3.eth.getAccounts();
            if (accounts.length) {
                $("#Connect").hide()
                $(".info").show()
                $("#adress").text(accounts[0])
                $(".modal-container").hide()
                $(".overload").hide()
            }
        } catch {

        }
    }

    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable();
            const accounts = await window.web3.eth.getAccounts();
            const account = accounts[0];
            window.ethereum.on('accountsChanged', (accounts) => {
                console.log(accounts);
                $("#adress").text(accounts[0])
                // Handle the new accounts, or lack thereof.
                // "accounts" will always be an array, but it can be empty.
            });
    
            window.ethereum.on('chainChanged', (chainId) => {
                if (chainId != '0x1') {
                    $("#adress").text('Wrong Network')
                } else {
                    connectWallet()
                }
                // Handle the new chain.
                // Correctly handling chain changes can be complicated.
                // We recommend reloading the page unless you have good reason not to.
                // window.location.reload();
            });
            if (window.ethereum.selectedAddress) {
                $("#Connect").hide()
                $(".info").show()
                $("#adress").text(account)
            }
            return account;
        } else {
            alert("Please install MetaMask wallet to continue");
        }
    }

    // 
    async function mintNFT() {
        const account = await connectWallet();
        const ethereumNetwork = window.ethereum.networkVersion;
        window.ethereum
            .request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: "0x1" }], // 
            })
            .then(async () => {
                const contractAddress = "0xf8ed926d17cd428d88d3d6bcf2d39db2bbeca231"; // 
                const contractABI = [
                    {
                        "constant": false,
                        "inputs": [
                            { "internalType": "uint256", "name": "amount", "type": "uint256" }
                        ],
                        "name": "mint",
                        "payable": true,
                        "stateMutability": "payable",
                        "type": "function"
                    },
                ]; // 
                const contract = new web3.eth.Contract(contractABI, contractAddress);
                let count = $("[name='count']")[0].value
                const data = contract.methods.mint(count).encodeABI();
                const gasPrice = await web3.eth.getGasPrice();
                // const gasLimit = 300000;
                const transactionParameters = {
                    from: account,
                    to: contractAddress,
                    gasPrice: gasPrice,
                    // gasLimit: gasLimit,
                    data: data,
                    value: web3.utils.toWei(count * 0.0069 + '', 'ether')
                };
                web3.eth.sendTransaction(transactionParameters, function (error, hash) {
                    if (!error) {
                        console.log(`Transaction hash: ${hash}`);
                        // alert(`Transaction sent with hash: ${hash}`);
                    } else {
                        // alert(`Error: ${error.message}`);
                    }
                });
            })
            .catch((error) => {
                console.error(error);
                // 
            });

    }

    $("#Connect").click(async (e) => {
        $(".modal-container").show()
        $(".overload").show()
    })
    $("#Mint").click(async (e) => {
        const account = await connectWallet();

        if (account) {
            await mintNFT()
        }
    })

    $(".overload").click(() => {
        $(".modal-container").hide()
        $(".overload").hide()
    })

    $(".eQmgRH").click(async () => {
        const account = await connectWallet();
        if (account) {
            $("#Connect").hide()
            $(".info").show()
            $("#adress").text(account)
            $(".modal-container").hide()
            $(".overload").hide()
        }
    })

    // $("#logout").click(async (e) => {
    //     const ethereum = window.ethereum;

    //     if (ethereum) {
    //         ethereum
    //             .send('wallet_requestPermissions', [{ eth_accounts: {} }])
    //             .then(() => {
    //                 ethereum.send('wallet_requestShutdown');
    //                 $(".info").hide()
    //                 $("#Connect").show()
    //                 $("#adress").text()
    //             });
    //     }
    // })

    // connectWallet()
})()


