import json
import web3

from web3 import Web3 
from solc import compile_source
from web3.contract import ConciseContract


# url to ganache blockchain
ganache_url = "http://127.0.0.1:7545"

# connect to local blokchchain
web3 = Web3(Web3.HTTPProvider(ganache_url))

#Check if it is connected (should see true)
print(web3.isConnected())  # should see true
print(web3.eth.blockNumber)  # should see 0

# Use default account [0] provided by  Ganache to send transactions

web3.eth.defaultAccount = web3.eth.accounts[0]

# Read contract source code
f = open("HelloWorld.sol", "r")
contract_source_code = f.read()
f.close()
print(contract_source_code)

# Compile Solidity Contract Source code -- Works better on Linux Machine 
# compiled_sol = compile_source(contract_source_code)  # Compiled source code
# contract_interface = compiled_sol['<stdin>:Greeter']
# Greeter = w3.eth.contract(abi=contract_interface['abi'], bytecode=contract_interface['bin'])

abi = json.loads('[{"constant": false, "inputs": [], "name":"kill", "outputs":[], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant": false, "inputs": [{"name": "_greeting", "type": "string"}], "name": "setGreetings", "outputs": [], "payable":false, "stateMutability":"nonpayable", "type":"function"}, {"constant": true, "inputs": [], "name":"greet", "outputs":[{"name": "", "type": "string"}], "payable": false, "stateMutability": "view", "type": "function"}, {"inputs": [], "payable":false, "stateMutability":"nonpayable", "type":"constructor"}]')
# Contract Address from Remix 
address_remix = "0xc248b77a1bde9585c63e5a492627d3fd44c4786e"


# Will convert an upper or lowercase Ethereum address to a checksum address.
# Will Convert Low case to upper case
address = Web3.toChecksumAddress(address_remix)

# Print Contract ABI in JSON format
print("ABI JSON Format ",abi)
print("Address of the smart contract : ",address)

# Returns True if the value is one of the recognized address formats.
print("recognized address formats : ", Web3.isAddress(address))

# Returns True if the value is a valid EIP55 checksummed address
print("valid EIP55 checksummed address : ", Web3.isChecksumAddress(address))

contract = web3.eth.contract(address=address,abi=abi)

# Call contract function 
print(contract.functions.greet().call())

# Display the default greeting from the contract
print('Default contract greeting: {}'.format(
    contract.functions.greet().call()
))

print('Setting the greeting to New String message Message...')
tx_hash = contract.functions.setGreetings('Formation Blockchain UTICA').transact()
print('tx_hash : ',tx_hash)

# Wait for transaction to be mined...
web3.eth.waitForTransactionReceipt(tx_hash)


print('Print the newley sent message from the contract ...')
print('New message : {}'.format(
    contract.functions.greet().call()
))
"""
print('Kill message : {}'.format(
    contract.functions.kill().call()
))

print('New message after killing contrat : {}'.format(
    contract.functions.greet().call()
))
"""
# When issuing a lot of reads, try this more concise reader:
# reader = ConciseContract(contract)
# assert reader.greet() == "Akram Hakiri"


