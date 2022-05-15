import Web3 from 'web3';

const donate = async (currentAddress: string, amount: string) => {
    if (window.ethereum) {
        try {
            const web3 = await new Web3(window.ethereum as any);
            await web3.eth.sendTransaction({
                from: currentAddress,
                to: '0xEb0452B3cFE9a57236Df9170028E9a005a4b5227',
                value: web3.utils.toWei(amount, "ether")
            });
            return Promise.resolve();
        } catch (error) {
            console.log('errr', error);
            return Promise.reject(`donate: ${JSON.stringify(error)}`);
        }
    }
}

export {
    donate,
}
