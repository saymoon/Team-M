import React, { Component } from 'react'
import PayrollContract from '../build/contracts/Payroll.json'
import getWeb3 from './utils/getWeb3'

import { Layout, Menu, Spin, Alert } from 'antd'

// import Accounts from './components/Accounts'
import Employer from './components/Employer'
import Employee from './components/Employee'

// import './css/oswald.css'
// import './css/open-sans.css'
// import './css/pure-min.css'
import 'antd/dist/antd.css'
import './App.css'

const { Header, Content, Footer } = Layout

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      mode: 'employer',
      account: [],
      payroll: null,
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const payroll = contract(PayrollContract)
    payroll.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    // var payrollInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({
        account: accounts[0]
      });
      payroll.deployed().then((instance) => {
        // payrollInstance = instance
        this.setState({
          payroll: instance
        });
      })
    })
  }

  onSelectAccount = (ev) => {
    this.setState({
      selectedAccount: ev.target.text
    });
  }

  onSelectTab = ({key}) => {
    this.setState({
      mode: key
    })
  }

  renderContent = () => {
    const { account, payroll, web3, mode } = this.state

    if (!payroll) {
      return <Spin tip="Loading..." />
    }

    switch(mode) {
      case 'employer':
        return <Employer account={account} payroll={payroll} web3={web3} />
      case 'employee':
        return <Employee account={account} payroll={payroll} web3={web3} />
      default:
        return <Alert message="请选择一个模式" type="info" showIcon />
    }
  }

  render() {
    return (
      <Layout>
        <Header className="header">
          <div className="logo">区块链员工系统</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['employer']}
            style={{ lineHeight: '64px' }}
            onSelect={this.onSelectTab}
          >
            <Menu.Item key="employer">雇主</Menu.Item>
            <Menu.Item key="employee">雇员</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Layout style={{ padding: '24px 0', background: '#fff', minHeight: '20px' }}>
            {this.renderContent()}
          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Payroll 区块炼干货铺
        </Footer>
      </Layout>
    )
  }
}

export default App
