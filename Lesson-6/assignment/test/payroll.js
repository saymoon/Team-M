var Payroll = artifacts.require("./Payroll.sol");

contract('Payroll', function(accounts) {

  it("should add and remove employee correctly", function() {
    var payroll;
    var account_boss = accounts[0];
    var account_employee = accounts[1];
    var timeout = function (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, 'done');
      });
    }

    return Payroll.deployed().then(function(instance) {
      payroll = instance;
      return payroll.addEmployee(account_employee, 2);
    }).then(function() {
      return payroll.checkEmployee(account_employee);
    }).then(function(result) {
      assert.equal(result[0].toString(), web3.toWei(2, 'ether'), "salary wasn't correct");
    }).then(function() {
      return payroll.removeEmployee(account_employee);
    }).then(function() {
      return payroll.checkEmployee(account_employee);
    }).then(function(result) {
      assert.equal(result[0].toString(), '0', "salary wasn't empty");
      assert.equal(result[1].toString(), '0', "lastPayday wasn't empty");
    }).then(function() {
      return payroll.addFund({from: account_boss, value: web3.toWei(20, 'ether')});
    }).then(function() {
      assert.equal(web3.eth.getBalance(payroll.address).toString(), web3.toWei(20, 'ether'), "contract balance wasn't correct");
    }).then(function() {
      return payroll.calculateRunway();
    }).then(function(runway) {
      assert.equal(runway.toNumber(), 10, "runway wasn't correct");
    }).then(function() {
      timeout(5000).then((value) => {
        console.log(payroll.checkEmployee(account_employee, {from: account_employee}));
        // payroll.getPaid({from: account_employee});
        // console.log(web3.eth.getBalance(account_employee));
        // assert.equal(2, 1, 'debug');
        // return payroll.getPaid({from: account_employee}).then(function() {
        //   assert.equal(web3.eth.getBalance(account_employee).toString(), web3.toWei(20, 'ether'), "employee balance wasn't correct");
        // });
      // }).then(function() {
      //   console.log(web3.eth.getBalance(account_employee));
      });
    });
  });
});