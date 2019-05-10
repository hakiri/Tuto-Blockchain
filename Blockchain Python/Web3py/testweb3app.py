from web3 import Web3
# the url is the link to my project in my profile on infura
# this need you to create a url to your own project on infura
infura_url_ropsten = 'https://ropsten.infura.io/v3/00919abdfabf4cecae37fe653ae1a9a1'
web3 = Web3(Web3.HTTPProvider(infura_url_ropsten))

web3.isConnected()
print(web3.eth.blockNumber)
# account 1 is my own account on metamask on ropsten
account1 = "0x80e9B8f891c326bc8c25dA59672DC5F363C4bC9A"
balance = web3.eth.getBalance(account1)
print(balance)

web3.fromWei(balance,'ether')
print(web3.fromWei(balance,'ether'))

