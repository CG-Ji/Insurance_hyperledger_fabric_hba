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

class Hospital extends React.Component {
  list_insurance = []
  items = []
  cost_targle = []
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }
  
  async load_data(){
	console.log("load url",this.key_target);
	await 
	fetch('http://164.115.33.55:3345/api/queryCustomer', {
		method: 'POST', 
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify({
			key:this.key_target,
		})
	}).then(res => res.json())
	  .then(response => 
	  {
		  console.log( JSON.stringify(response["response"].toString()) ,"response")
		var result = JSON.parse(response['response'])
		console.log(result)
		this.items = result
		this.list_insurance = this.items.insurance;
		this.forceUpdate()
	  })
	  .catch(error => console.error('Error:', error));
	console.log("load url again");	
  }
  
  buy_item(item,index){
	item.price -= this.cost_targle[index]
	console.log({
			key:this.key_target,
			object:item
		},this.cost_targle[index],item.price);
	fetch('http://164.115.33.55:3345/api/updateCustomerInsurance', {
		method: 'POST', 
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify({
			key:this.key_target,
			object:item,
			index:index
		})
	})
	.then(response => response.json())
	.then(response => {
		alert("ยื่นเรื่องการเคลมเสร็จสิ้น");
		this.load_data()
	})
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
                        A Claim System {" "}
                      </h1>
                      <p className="lead text-white">
                        เมนูดำเนินการเรื่องการเบิกจ่าย เมื่อผู้ซื้อประกันดำเนินการรักษาตรงตามข้อกำหนด
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
				<Col lg="9" sm ="12">
					<FormGroup className="mb-3">
					  <InputGroup className="input-group-alternative">
						<InputGroupAddon addonType="prepend">
						  <InputGroupText>
							<i className="ni ni-single-02" />
						  </InputGroupText>
						</InputGroupAddon>
						<Input placeholder="Username" type="text" 
						  onChange={e => this.key_target = e.target.value}/>
					  </InputGroup>
					</FormGroup>
				</Col>
				<Col lg="3" sm ="12">
					<div className="text-center">
					  <Button
						color="primary"
						type="button"
						 onClick={e => this.load_data()}
					  >
						Search Now
					  </Button>
					</div>
				</Col>
			</Row>
			<Row>
            {this.list_insurance.map((item,index) => {
				var object_result = JSON.parse(item);
				return ([<Col lg ="6" sm="12">
					<Card body>
					  <CardTitle>{object_result.name}</CardTitle>
					  <CardText>ชื่อประกันภัย : {object_result.detail}</CardText>
					  <CardText>ยอดคงเหลือ : {object_result.price}</CardText>
					    <FormGroup className="mb-3">
						  <InputGroup className="input-group-alternative">
							<InputGroupAddon addonType="prepend">
							  <InputGroupText>
							  {index}
							  </InputGroupText>
							</InputGroupAddon>
							<Input placeholder="ค่าใช้จ่ายที่ต้องการเคลม" type="text" 
							  onChange={e => this.cost_targle[index] = e.target.value}/>
						  </InputGroup>
						</FormGroup>
					  <Button color="success" onClick ={e => this.buy_item(object_result,index) }>ยื่นเรื่องการเคลมประกัน </Button>
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

export default Hospital;
