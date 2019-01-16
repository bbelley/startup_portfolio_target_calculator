import React from 'react';
import ReactDOM from 'react-dom';
import numeral from 'numeral';


class RegCFLimitApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            salary: '',
            netWorth: '',
            yourLimit: '',
            isAccredited: false,
            error: ''
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        const amount = event.target.value;

        if (!amount || amount.match(/^\d{1,}(\.\d{0,2})?$/)) {
            this.setState({
                [event.target.name]: event.target.value
            });
        };
    }
    handleSubmit(event) {
        event.preventDefault();
      
        let invNW = +this.state.netWorth;
        let invSalary = +this.state.salary;
        let invLimit = 0;

        //Check and display Accredited Investor status
        if (invNW>=1000000 || invSalary>=200000) {
            this.setState(() => ({isAccredited: true}));
        } else {
            this.setState(() => ({isAccredited: false}));
        };

        const secLimit = 107000; //Used in the limit calculations - may change each year

        //Calculate Reg CF 12-month Limit
        if (invNW>=secLimit && invSalary>=secLimit) {
            invLimit = Math.min(.05*invNW,.05*invSalary,107000);
           
        } else {
            invLimit = Math.max(
                2200,
                Math.min(.05*invNW,.05*invSalary)
            );
        }

        this.setState(() => {
            return {
                yourLimit: invLimit
            };
        });

        //Error Check
        if (!this.state.netWorth || !this.state.salary) {
            //Return error state
            this.setState(() => {
                return {
                    error: true
                };
            });
        } else {
            this.setState(() => {
                return {
                    error: ''
                };
            });
        };
    }   
    render() {
        return (
            <div>
            <font color="red">{ this.state.error && 'Please enter both your Salary and Net Worth.' }</font>
            <form id="cf-limit-calculator" onSubmit={this.handleSubmit} autoComplete="off" >
                <p>Salary:<input 
                    type="text" 
                    name="salary" 
                    placeholder="e.g. $60,000 as 60000" 
                    autoFocus
                    value={this.state.salary} 
                    onChange={this.handleChange}
                    step='100' />
                </p>
                <p>Net Worth:<input 
                    type="text" 
                    name="netWorth" 
                    placeholder="e.g. $100,000 as 100000" 
                    value={this.state.netWorth} 
                    onChange={this.handleChange}
                    step='100' /></p>
                <button type="submit">Calculate Limit</button>
            </form>
            <p>
                <strong>
                    { this.state.yourLimit ? ('Your annual Reg CF investment limit is: ' + numeral(this.state.yourLimit).format('$0,0.00')) : 'Enter values (no commas or $ signs) and click "Calculate Limit"' }
                </strong>
            </p>
            <p>
                { this.state.isAccredited ? 'Note: you appear to meet the requirements for an Accredited Investor. However, per the JOBS Act Title III laws as of today, you are still limited to the 12-month limit for investing in all Reg CF (Title III) deals at the amount above.' : '' }
            </p>
            </div>
        );
    }
}

ReactDOM.render(<RegCFLimitApp />,document.getElementById('app'));
