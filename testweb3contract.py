from web3 import Web3
import json

# url to ganache blockchain
ganache_url = "http://127.0.0.1:7545"

# connect to local blokchchain
web3 = Web3(Web3.HTTPProvider(ganache_url))

#Check if it is connected (should see true)
print(web3.isConnected()) # should see true
print(web3.eth.blockNumber) # should see 0

# Need two ganache accounts 
account_1 = "0x336128282fb144d8CedcB6B053c2A2e161d040c8"
account_2 = "0xB51b607A224060027572D7Ef3dff5cE59ef6ab34"

#First account Private Key from ganache account to send crypto currency 
# To Allow sending Ether from account 1 to account 2
private_key = "d56211d872791ce8874a7800fde1dddd46aeabdb61b0f507ba17e7a08dab3f81"

# Get the transaction nonce
nonce = web3.eth.getTransactionCount(account_1)

# Build a transaction : 
# A dictionnary contains all the transactions information

tx = {
    'nonce':nonce,
    'to': account_2, # Account we will a transaction to -- From account will be signed  
    'value': web3.toWei(1,'ether'), # Actual amount of Ether will send to account_2
    'gas': 2000000, # gas limit to pay the transaction fees when sending it -- needed by miners to validate the transaction
    'gasPrice': web3.toWei('50','gwei'), #
}

# Need to sign a transaction before sending
signed_tx = web3.eth.account.signTransaction(tx,private_key)
# Send transaction 
# web3.eth.sendRawTransaction(signed_tx.rawTransaction)
# Send signed transaction and get tx_hash
tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
# Get transaction hash
print(tx_hash)

# convert tx_hash to hexadecimal format
# As you execute the python script you send 1 Ether from account_1 to account_2
# You can see the results on Ganache, too !! 

print(web3.toHex(tx_hash))
print("see Accounts on Ganache GUI \n")
print("see Trnasctions on Ganache GUI \n")    
