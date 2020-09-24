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
// nodejs library that concatenates classes
import classnames from "classnames";

// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardImg,
  CardTitle, 
  CardText,
  FormGroup,
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
import CardsFooter from "components/Footers/CardsFooter.js";

// index page sections
import Download from "../IndexSections/Download.js";

class Customer extends React.Component {
  items = []
  
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
	this.load_data()
  }
  
  async load_data(){
	console.log("load url");
	await fetch('http://164.115.33.55:3345/api/queryAllContractInsurance', {
	method: 'GET'
	  }).then(res => res.json())
	  .then(response => 
	  {
		  console.log( JSON.stringify(response["response"].toString()) ,"response")
		var result = JSON.parse(response['response'])
		console.log(result)
		this.items = result
		this.forceUpdate()
	  })
	  .catch(error => console.error('Error:', error));
	console.log("load url again");	
  }
  
  buy_item(item){
	console.log({
			key:this.props.match.params,
			object:item
		});
	fetch('http://164.115.33.55:3345/api/createCustomerInsurance', {
		method: 'POST', 
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify({
			key:this.props.match.params.username,
			object:item
		})
	})
    .then(response => response.json())
    .then(response => {alert("ซื้อประกันเสร็จสิ้น")})
	.catch(error => {console.error('Error:', error);alert("เกิดข้อผิดพลาด"+error)});
  }
  
  render() {
	console.log(this.items , "after")
    return (
      <>
        <DemoNavbar />
        <main ref="main">
          <div className="position-relative">
            {/* shape Hero */}
            <section className="section section-lg section-shaped pb-10">
              <div className="shape shape-style-1 shape-default">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <Container className="py-lg-md d-flex">
                <div className="col px-0">
                  <Row>
                    <Col lg="6">
                      <h1 className="display-3 text-white">
                        A Purchase System {" "}
                      </h1>
                      <p className="lead text-white">
                        ระบบซื้อประกันต่างๆประกัน สำหรับลูกค้าหรือผู้ซื้อประกัน เมื่อถึงเวลาที่ต้องรับเงินค่าประกัน สามารถรับได้ทันที
                      </p>
                      
                    </Col>
                  </Row>
                </div>
              </Container>
              {/* SVG separator */}
              <div className="separator separator-bottom separator-skew">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 2560 100"
                  x="0"
                  y="0"
                >
                  <polygon
                    className="fill-white"
                    points="2560 0 2560 100 0 100"
                  />
                </svg>
              </div>
            </section>
            {/* 1st Hero Variation */}
          </div>
          <section className="section section-lg pt-lg-12 mt--100">
		  <Container className="mb-5">
            {/* Inputs */}
            <h3 className="h4 text-success font-weight-bold mb-4">ประกันภัย</h3>
			<Row>
            {this.items.map(item => {
				console.log("???");
				return ([<Col lg ="6" sm="12">
					<Card body>
					  <CardTitle>{item.Record.name}</CardTitle>
					  <CardText>{item.Record.detail}</CardText>
					  <Button color="success" onClick ={e => this.buy_item(item.Record) }>ซื้อเลย ราคา {item.Record.price}</Button>
					</Card>
				  </Col>])
			})}
			</Row>
          </Container>
          </section>
        </main>
        <CardsFooter />
      </>
    );
  }
}

export default Customer;
