import React from 'react';
import ReactDOM from 'react-dom';
import numeral from 'numeral';
import { Alert, Button, FormGroup, InputGroup, FormControl, Form, Col, ControlLabel } from 'react-bootstrap/lib';

class PortfolioApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invTime: '',
            desiredIRR: '',
            failureRate: '',
            indivIRR: '',
            indivReturn: '',
            portReturn: false,
            error: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        const amount = event.target.value;

        if (!amount || amount.match(/^\d{1,}\.?\d{0,2}?$/)) {
            this.setState({
                [event.target.name]: event.target.value
            });
        };
    }
    handleSubmit(event) {
        event.preventDefault();

        //Error Check
        if (!this.state.desiredIRR || !this.state.invTime || !this.state.failureRate) {
            //Return error state
            this.setState(() => {
                return {
                    error: true,
                    portReturn: false
                };
            });
        } else {
            //Do Calculations for Portfolio

            let yourIRR = +this.state.desiredIRR;
            let yourFailure = +this.state.failureRate;
            let yourTime = +this.state.invTime;

            let portMult = Math.pow((1 + yourIRR / 100), yourTime);
            let indivMult = portMult / (1 - yourFailure / 100);
            let indivRate = Math.pow(indivMult, (1 / yourTime)) - 1;

            this.setState(() => {
                return {
                    error: '',
                    indivReturn: indivMult,
                    indivIRR: indivRate * 100,
                    portReturn: portMult
                };
            });
        };

    }
    render() {
        return (
            <div align='center' style={{ width: '100%' }} >
                {this.state.error && <Alert bsStyle="danger" >Please enter all three input fields before calculating. </Alert>}
                <Form style={{ width: '70%', maxWidth: '500px' }} horizontal id="portfolio-calc" onSubmit={this.handleSubmit} autoComplete="off" >
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={7}>Target Portfolio IRR: </Col>
                        <InputGroup>
                            <FormControl
                                type="text"
                                name="desiredIRR"
                                placeholder="IRR"
                                value={this.state.desiredIRR}
                                onChange={this.handleChange}
                            />
                            <InputGroup.Addon>%</InputGroup.Addon>
                        </InputGroup>
                        <Col componentClass={ControlLabel} sm={7}>Time Horizon: </Col>
                        <InputGroup>
                            <FormControl
                                type="text"
                                name="invTime"
                                placeholder="Time"
                                value={this.state.invTime}
                                onChange={this.handleChange}
                            />
                            <InputGroup.Addon>years</InputGroup.Addon>
                        </InputGroup>
                        <Col componentClass={ControlLabel} sm={7}>Failure Rate: </Col>
                        <InputGroup>
                            <FormControl
                                type="text"
                                name="failureRate"
                                placeholder="0-100%"
                                value={this.state.failureRate}
                                onChange={this.handleChange}
                            />
                            <InputGroup.Addon>%</InputGroup.Addon>
                        </InputGroup>
                        <br />
                        <Button type="submit" bsStyle="primary">Calculate</Button>
                    </FormGroup>
                </Form>
                <br />
                {(!this.state.error && this.state.portReturn) ? (
                    <div>
                        <Alert bsStyle="success" style={{ width: '90%', maxWidth: '500px' }} >Average Return Multiple for Non-Failed Investments =  <br /><strong> {numeral(this.state.indivReturn).format('0.00')} X <br />{numeral(this.state.indivIRR).format('0.00')}% IRR (each)</strong>  </Alert>
                        <Alert bsStyle="success" style={{ width: '90%', maxWidth: '500px' }} >Overall Portfolio Return Multiple =  <br /><strong> {numeral(this.state.portReturn).format('0.00')} X </strong> </Alert>
                    </div>
                )
                    : 'Enter values above and click "Calculate"'
                }
            </div>
        );
    }
}

ReactDOM.render(<PortfolioApp />, document.getElementById('PortfolioApp'));
