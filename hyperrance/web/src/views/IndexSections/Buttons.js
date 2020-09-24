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
  Badge,
  Button,
  Card,
  CardBody,
  CardImg,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

class BasicElements extends React.Component {
  render() {
    return (
      <>
          <section className="section section-lg pt-lg-5 mt--200">
            <Container>
              <Row className="justify-content-center">
                <Col lg="12">
                  <Row className="row-grid">
                    <Col lg="4">
                      <Card className="card-lift--hover shadow border-0">
                        <CardBody className="py-5">
                          <div className="icon icon-shape icon-shape-primary rounded-circle mb-4">
                            <i className="ni ni-single-02" />
                          </div>
                          <h6 className="text-primary text-uppercase">
                            Customer
                          </h6>
                          <p className="description mt-3">
                            ผู้ซื้อประกัน สามารถเลือกประกันที่ผู้ขายประกันจัดตั้งโปรโมชั่น และทำการซื้อได้ เมื่อถึงเวลาที่ต้องรับเงินค่าประกัน สามารถรับได้ทันที
                          </p>
                          <Button
                            className="mt-4"
                            color="primary"
                            href="/customer-page"
                          >
                            Try Now 
                          </Button>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col lg="4">
                      <Card className="card-lift--hover shadow border-0">
                        <CardBody className="py-5">
                          <div className="icon icon-shape icon-shape-success rounded-circle mb-4">
                            <i className="ni ni-single-copy-04" />
                          </div>
                          <h6 className="text-success text-uppercase">
                            Insurance
                          </h6>
                          <p className="description mt-3">
                            ผู้ขายประกัน สามารถทำสัญญาประกันและแก้ไขสัญญาประกันที่เคยทำได้ โดยสามารถดูประกันการรับเงินค่ารักษาได้
                          </p>
                          <Button
                            className="mt-4"
                            color="success"
                            href="/insurance-page"
                          >
                            Try Now
                          </Button>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col lg="4">
                      <Card className="card-lift--hover shadow border-0">
                        <CardBody className="py-5">
                          <div className="icon icon-shape icon-shape-warning rounded-circle mb-4">
                            <i className="ni ni-istanbul" />
                          </div>
                          <h6 className="text-warning text-uppercase">
                            Hospital
                          </h6>
                          <p className="description mt-3">
                            โรงพยาบาลเป็นผู้ดำเนินการเรื่องการเบิกจ่าย เมื่อผู้ซื้อประกันดำเนินการรักษาตรงตามข้อกำหนดสามารถเบิกค่ารักษาได้ทันที
                          </p>
                          <Button
                            className="mt-4"
                            color="warning"
                            href="/hospital-page"
                          >
                            Try Now
                          </Button>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </section>
      </>
    );
  }
}

export default BasicElements;
