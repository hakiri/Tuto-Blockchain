var Maintenance = artifacts.require("./Maintenance.sol");
module.exports = function(deployer) {
  deployer.deploy(Maintenance, {gas: 2900000});
};
