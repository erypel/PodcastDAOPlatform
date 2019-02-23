/**
 * The truffle config file
 * 
 * from `project directory`\voting, run `truffle.cmd develop` to start truffle
 * run `compile` to compile it to bytecode first for the EVM to execute
 */
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    }
  }
}