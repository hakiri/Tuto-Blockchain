from web3 import Web3
#infura_url_main = 'https://mainnet.infura.io/v3/00919abdfabf4cecae37fe653ae1a9a1'
infura_url_ropsten = "https://ropsten.infura.io/v3/00919abdfabf4cecae37fe653ae1a9a1"
#web3 = Web3(Web3.HTTPProvider(infura_url_main))
web3 = Web3(Web3.HTTPProvider(infura_url_ropsten))

web3.isConnected()
print(web3.eth.blockNumber)

account1 = "0x80e9B8f891c326bc8c25dA59672DC5F363C4bC9A"
balance = web3.eth.getBalance(account1)
print(balance)

web3.fromWei(balance,'ether')
print(web3.fromWei(balance,'ether'))

# >>> balance
# 1998950000000000000
#>>> web3.fromWei(balance,'ether')
#Decimal('1.99895')