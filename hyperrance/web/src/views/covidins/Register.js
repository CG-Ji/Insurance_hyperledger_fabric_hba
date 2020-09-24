/*!

=========================================================
* Argon Design System React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/ 
import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";

class Register extends React.Component {
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }
  
  async load_data(){
	console.log("load url ");
	await fetch('http://164.115.33.55:3345/api/createCustomer', {
		method: 'POST', 
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify({
			username:this.username,
			passwd:this.passwd,
			firstname:this.firstname,
			lastname:this.lastname,
			cardid:this.cardid
		})
	})
    .then(response => response.json())
    .then(response => {this.props.history.push(`/customer-page`)})
	.catch(error => {console.error('Error:', error);alert("เกิดข้อผิดพลาด"+error)});
	// fetch('http://164.115.33.55:3345/api/queryAllContractInsurance', {
	// method: 'GET'
	  // }).then(res => res.json())
	  // .then(response => console.log('Success:', JSON.stringify(response)))
	  // .catch(error => console.error('Error:', error));
	console.log("load url again");	
  }
  render() {
    return (
      <>
        <DemoNavbar />
        <main ref="main">
          <section className="section section-shaped section-lg">
            <div className="shape shape-style-1 bg-gradient-default">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <Container className="pt-lg-7">
              <Row className="justify-content-center">
                <Col lg="5">
                  <Card className="bg-secondary shadow border-0">
                    <CardBody className="px-lg-5 py-lg-5">
                      <Form role="form">
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-single-02" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="Name" type="text" 
							  onChange={e => this.username = e.target.value}/>
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-lock-circle-open" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              placeholder="Password"
                              type="password"
                              autoComplete="off"
							  onChange={e => this.passwd = e.target.value}
                            />
                          </InputGroup>
                        </FormGroup>
						
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-single-copy-04" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="FirstName" type="text" 
							  onChange={e => this.firstname = e.target.value}/>
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-single-copy-04" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="LastName" type="text" 
							  onChange={e => this.lastname = e.target.value}/>
                          </InputGroup>
                        </FormGroup>
                        <FormGroup>
                          <InputGroup className="input-group-alternative mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-hat-3" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="Card-ID" type="text" 
							  onChange={e => this.cardid = e.target.value}/>
                          </InputGroup>
                        </FormGroup>
                        <div className="text-center">
                          <Button
                            className="mt-4"
                            color="primary"
                            type="button"
							onClick={e => this.load_data()}
                          >
                            Create account
                          </Button>
                        </div>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>
        </main>
      </>
    );
  }
}

export default Register;
