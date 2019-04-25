from ethjsonrpc import EthJsonRpc
import time
import sys,traceback
import datetime
import glob


base_dir = '/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir + '28*')[0]
device_file = device_folder + '/w1_slave'


contract_address = '0x016D9579a34F7855D5A954d127469260e7F3A5a4'
machineID = 123

# Connect to Blockchain network  -- Ganache
# 
c = EthJsonRpc('192.168.1.4', 8101)
tempCount = 0
tempThreshold = 20 #Celcius
tempCountThreshold = 10
while True:
    f = open(device_file, 'r')
    lines = f.readlines()
    
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw()
equals_pos = lines[1].find('t=')
if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temperature = float(temp_string)/1000.0
print "Temp:", temperature, "C"
if(temperature>tempThreshold):
        tempCount = tempCount + 1
ts = int(time.time())
     	print ("ts: ", ts)
if(tempCount>tempCountThreshold):
        c.call_with_transaction(c.eth_coinbase(), contract_address, 'requestService(uint256,uint256,string)', [ts, machineID, 'High'])
        tempCount = 0
    time.sleep(1):
