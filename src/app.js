import React from 'react';
import ReactDOM from 'react-dom';
import numeral from 'numeral';
import { Alert,Button,FormGroup,InputGroup,FormControl,Form,Col,ControlLabel,Radio } from 'react-bootstrap/lib';


class IRRApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invTime: '',
            desiredMult: '',
            desiredIRR: '',
            calcIRR: false,
            calcMult: false,
            chooseIRR: true,
            chooseMult: false,
            error: ''
        };
        
        this.handleChange = this.handleChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
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
    handleRadioChange(event) {
        this.setState({
            chooseIRR: !this.state.chooseIRR,
            chooseMult: !this.state.chooseMult,
            calcIRR: false,
            calcMult: false,
            desiredMult: '',
            desiredIRR: ''
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        
        if (this.state.chooseIRR) {
            let yourMult = +this.state.desiredMult;
            let yourTime = +this.state.invTime;

            //Calculate IRR 
            //Equation: IRR=(return_mult)^(1/time)-1
            let yourIRR = Math.pow(yourMult,(1/yourTime))-1;
            
            this.setState(() => {
                return {
                    calcIRR: yourIRR*100
                };
            });

            //Error Check
            if (!this.state.desiredMult || !this.state.invTime) {
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
        } else {
            let yourIRR = +this.state.desiredIRR;
            let yourTime = +this.state.invTime;

            //Calculate Exit Multiple 
            //Equation: (IRR+1)^t=return_mult
            let yourMult = Math.pow((yourIRR/100+1),yourTime);
            
            this.setState(() => {
                return {
                    calcMult: yourMult
                };
            });

            //Error Check
            if (!this.state.desiredIRR || !this.state.invTime) {
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
        };

        
    }   
    render() {
        return (
            <div align='center' style={{width: '100%'}} >
            { this.state.error && <Alert bsStyle="danger" >Please enter both fields before calculating. </Alert> }
            <Form style={{width: '70%', maxWidth:'300px'}} horizontal id="irr-calc" onSubmit={this.handleSubmit} autoComplete="off" >
                <FormGroup>     
                    <Radio
                        name="radioGroup" 
                        //inline 
                        id="chooseIRR"
                        defaultChecked={true}
                        onChange={this.handleRadioChange}
                    >         
                        Calculate IRR
                    </Radio>     
                    
                    <Radio 
                        name="radioGroup" 
                        //inline 
                        id="chooseMult" 
                        onChange={this.handleRadioChange}
                    >         
                        Calculate Exit/Return Multiple
                    </Radio>     

                </FormGroup>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={7}>Exit/Return Multiple:</Col>
                    <InputGroup> 
                                <FormControl 
                                    type="text" 
                                    name="desiredMult" 
                                    placeholder="e.g 3.60"
                                    autoFocus 
                                    value={this.state.desiredMult} 
                                    onChange={this.handleChange}
                                    disabled={this.state.chooseMult}
                                /> 
                                <InputGroup.Addon>X</InputGroup.Addon>
                    </InputGroup>
                    <Col componentClass={ControlLabel} sm={7}>IRR: </Col>
                    <InputGroup>
                            <FormControl 
                                type="text" 
                                name="desiredIRR" 
                                placeholder="IRR" 
                                value={this.state.desiredIRR} 
                                onChange={this.handleChange}
                                disabled={this.state.chooseIRR}
                            />
                            <InputGroup.Addon>%</InputGroup.Addon>
                    </InputGroup>
                    <Col componentClass={ControlLabel} sm={7}>Time (years): </Col>
                    <InputGroup>
                            <FormControl 
                                type="text" 
                                name="invTime" 
                                placeholder="Years" 
                                value={this.state.invTime} 
                                onChange={this.handleChange}
                            />
                            <InputGroup.Addon>years</InputGroup.Addon>
                    </InputGroup>
                    <br />
                    <Button type="submit" bsStyle="primary">Calculate { (this.state.chooseMult) ? "Return Multiple" : "IRR" }</Button>
                </FormGroup>
            </Form>
            <br />
                { (!this.state.error && this.state.calcIRR) ? (<Alert bsStyle="success" style={{width: '90%', maxWidth:'500px'}} >IRR =  <br /><strong> {numeral(this.state.calcIRR).format('0.00')}% </strong> </Alert> ) : 'Enter values above and click "Calculate"' }
                { (!this.state.error && this.state.calcMult) ? (<Alert bsStyle="success" style={{width: '90%', maxWidth:'500px'}} >Exit/Return Multiple =  <br /><strong> {numeral(this.state.calcMult).format('0.00')} X </strong> </Alert> ) : '' }
            </div>
        );
    }
}

ReactDOM.render(<IRRApp />,document.getElementById('app'));
