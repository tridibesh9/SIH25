const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CarbonMarketplaceModule", (m) => {
  const carbonMarketplace = m.contract("CarbonMarketplace", []);

  return { carbonMarketplace };
});