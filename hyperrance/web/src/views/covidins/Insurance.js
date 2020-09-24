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

class Insurance extends React.Component {
  list_insurance = []
  items = []
  cost_targle = []
  index_ins = 0
  index_edit = -999
  
   constructor(props) {
    super(props);
    this.state = {name: '',detail:'',price:''};

    this.nameChange = this.nameChange.bind(this);
    this.detailChange = this.detailChange.bind(this);
    this.priceChange = this.priceChange.bind(this);
  }

  nameChange(event) {
    this.setState({name: event.target.value});
  }

  detailChange(event) {
    this.setState({detail: event.target.value});
  }

  priceChange(event) {
    this.setState({price: event.target.value});
  }
	
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
  reset_data(){
    this.setState({name: ""});
    this.setState({detail: ""});
    this.setState({price: ""});
	  this.index_edit = -999
		//this.forceUpdate()
  }
  setData(items){
	  this.index_edit = items['Key']
    this.setState({name: items.Record.name});
    this.setState({detail: items.Record.detail});
    this.setState({price: items.Record.price});
	console.log(items,{
			key:this.index_edit,
			name:this.state.name,
			detail:this.state.detail,
			price:this.state.price
		});
  }
  create_data(){
	console.log({
			key:"CI"+(parseInt(this.index_ins)+1),
			name:this.state.name,
			detail:this.state.detail,
			price:this.state.price
		});
	fetch('http://164.115.33.55:3345/api/createContractInsurance', {
		method: 'POST', 
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify({
			key:"CI"+(parseInt(this.index_ins)+1),
			name:this.state.name,
			detail:this.state.detail,
			price:this.state.price
		})
	})
	.then(response => response.json())
	.then(response => {
		alert("เพิ่มสัญญาประกันภัยเสร็จสิ้น");
		this.load_data()
	})
	.catch(error => {console.error('Error:', error);alert("เกิดข้อผิดพลาด"+error)});
  }
  Update_data(){
	console.log(123,{
			key:this.index_edit,
			name:this.state.name,
			detail:this.state.detail,
			price:this.state.price
		});
	fetch('http://164.115.33.55:3345/api/createContractInsurance', {
		method: 'POST', 
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify({
			key:this.index_edit,
			name:this.state.name,
			detail:this.state.detail,
			price:this.state.price
		})
	})
	.then(response => response.json())
	.then(response => {
		alert("เพิ่มสัญญาประกันภัยเสร็จสิ้น");
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
                        A Insurance System {" "}
                      </h1>
                      <p className="lead text-white">
                        เมนูปรับแต่งประกันภัย
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
						
				<Col sm ="12">
					<FormGroup className="mb-3">
					  <InputGroup className="input-group-alternative">
						<InputGroupAddon addonType="prepend">
						  <InputGroupText>
							<i className="ni ni-single-02" />
						  </InputGroupText>
						</InputGroupAddon>
						<Input placeholder="Name" type="text" value={this.state.name} onChange={this.nameChange} />
					  </InputGroup>
					</FormGroup>
				</Col>
				<Col sm ="12">
					<FormGroup className="mb-3">
					  <InputGroup className="input-group-alternative">
						<InputGroupAddon addonType="prepend">
						  <InputGroupText>
							<i className="ni ni-single-02" />
						  </InputGroupText>
						</InputGroupAddon>
						<Input placeholder="Detail" type="text" value={this.state.detail} onChange={this.detailChange} />
					  </InputGroup>
					</FormGroup>
				</Col>
				<Col sm ="12">
					<FormGroup className="mb-3">
					  <InputGroup className="input-group-alternative">
						<InputGroupAddon addonType="prepend">
						  <InputGroupText>
							<i className="ni ni-single-02" />
						  </InputGroupText>
						</InputGroupAddon>
						<Input placeholder="Price" type="text" value={this.state.price} onChange={this.priceChange} />
					  </InputGroup>
					</FormGroup>
				</Col>
				<Col sm ="12">
				{
					this.index_edit == -999 ?
						(<div className="text-center mb-3" >
						  <Button
							color="primary"
							type="button"
							 onClick={e => this.create_data()}
						  >
							สร้างสัญญาประกันภัย
						  </Button>
						</div>)
					:
						(<div className="text-center mb-3" >
						  <Button
							color="primary"
							type="button"
							 onClick={e => this.Update_data()}
						  >
							แก้ไขสัญญาประกันภัย
						  </Button>
						  <Button
							color="warning"
							type="button"
							 onClick={e => this.reset_data()}
						  >
							ยกเลิกการแก้ไข
						  </Button>
						</div>)

					
				}
				</Col>
			</Row>
			<Row>
            {this.items.map(item => {
				this.index_ins = item.Key.replace(/\D/g, "")
				return ([<Col lg ="6" sm="12">
					<Card body className="mb-3">
					  <CardTitle>ชื่อประกัน : {item.Record.name}</CardTitle>
					  <CardText>รายละเอียดประกันภัย : {item.Record.detail}</CardText>
					  <CardText>ราคา : {item.Record.price}</CardText>
					  <Button color="success" onClick ={e => this.setData(item) }>แก้ไขสัญญา</Button>
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

export default Insurance;
