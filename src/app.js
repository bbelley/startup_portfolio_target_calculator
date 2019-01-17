import React from 'react';
import ReactDOM from 'react-dom';
import numeral from 'numeral';
import { Alert,Button,FormGroup,InputGroup,FormControl,Form,Col,ControlLabel } from 'react-bootstrap/lib';


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

        if (!amount || amount.match(/^\d{1,}?$/)) {
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
            <div align='center' style={{width: '100%'}} >
            { this.state.error && <Alert bsStyle="danger" >Please enter your Annual Income and Net Worth. </Alert> }
            <Form style={{width: '70%', maxWidth:'500px'}} horizontal id="cf-limit-calculator" onSubmit={this.handleSubmit} autoComplete="off" >
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={4}>Annual Income:</Col>
                    <InputGroup>
                            <InputGroup.Addon>$</InputGroup.Addon>
                            <FormControl 
                                type="text" 
                                name="salary" 
                                placeholder="Income e.g. $60,000 as 60000" 
                                autoFocus
                                value={this.state.salary} 
                                onChange={this.handleChange}
                            />
                            <InputGroup.Addon>.00</InputGroup.Addon>
                    </InputGroup>
                    <Col componentClass={ControlLabel} sm={4}>Net Worth:</Col>
                    <InputGroup> 
                            <InputGroup.Addon>$</InputGroup.Addon>
                                <FormControl 
                                    type="text" 
                                    name="netWorth" 
                                    placeholder="Net Worth - e.g. $100,000 as 100000" 
                                    value={this.state.netWorth} 
                                    onChange={this.handleChange}
                                />
                                <InputGroup.Addon>.00</InputGroup.Addon>  
                    </InputGroup>
                    <br />
                    <Button type="submit" bsStyle="primary">Calculate Your Limit</Button>
                </FormGroup>
            </Form>
            <br />
                { (!this.state.error && this.state.yourLimit) ? (<Alert bsStyle="success" style={{width: '90%', maxWidth:'500px'}} >Your 12-month Reg CF investment limit is: <br /><strong> {numeral(this.state.yourLimit).format('$0,0.00')} </strong> </Alert> ) : 'Enter values above and click "Calculate Limit"' }
                { this.state.isAccredited ? <Alert bsStyle="info" style={{width: '90%', maxWidth:'500px'}}>Note: you appear to meet the requirements for an Accredited Investor. However, per the JOBS Act Title III laws as of today, you are still limited to the 12-month limit for investing in all Reg CF (Title III) deals at the amount above.</Alert> : '' }
            </div>
        );
    }
}

ReactDOM.render(<RegCFLimitApp />,document.getElementById('app'));
