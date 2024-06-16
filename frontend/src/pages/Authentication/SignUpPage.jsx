import React, { useContext } from 'react';
import { Container, Form, Button, FloatingLabel, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import signup_img from '../../assests/images/sign_up.jpg';
import AuthContext from '../../context/AuthContext';

const SignUpPage = () => {
    const { signUpUser } = useContext(AuthContext);

    return (
        <Container fluid className='d-flex justify-content-center my-2 align-items-center min-vh-100'>
            <Row className='d-flex justify-content-center align-items-center'>
                <Col lg={5} className='d-lg-block d-none'>
                    <img src={signup_img} alt="Login" className='img-fluid' />
                </Col>
                <Col lg={5} md={10}>
                    <Card className='shadow'>
                        <Card.Header className='p-4 text-center bg-custom d-flex flex-row justify-content-between'>
                            <div className='d-flex flex-row'>
                                <i className="bi bi-journals fs-4 fw-bold me-2"></i>
                                <h4 className='fs-3 fw-bolder'>LMS</h4>
                            </div>
                            <div className='d-flex flex-row'>
                                <i className="bi bi-person-lock fs-4 fw-bold me-2"></i>
                                <h3 className='fs-3 fw-bolder'>SIGN UP</h3>
                            </div>
                        </Card.Header>
                        <Card.Body className='p-5 pb-3'>
                            <Form onSubmit={signUpUser}>
                                <div>
                                    <Row>
                                        <Col lg={6} md={12}>
                                            <FloatingLabel controlId="floatingFirstName" label="First Name" className="mb-3">
                                                <Form.Control type="text" placeholder="First Name" name="first_name" required/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col lg={6} md={12}>
                                            <FloatingLabel controlId="floatingLastName" label="Last Name" className="mb-3">
                                                <Form.Control type="text" placeholder="Last Name" name="last_name"/>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                </div>
                                <FloatingLabel controlId="floatingUserName" label="User Name" className="mb-3">
                                    <Form.Control type="text" placeholder="UserName" name="username" required/>
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingEmail" label="Email Address" className="mb-3">
                                    <Form.Control type="email" placeholder="sample@lms.com" name="email" required/>
                                </FloatingLabel>
                                <div>
                                    <Row>
                                        <Col lg={6} md={12}>
                                            <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                                                <Form.Control type="password" placeholder="Password" name="password" required/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col lg={6} md={12}>
                                            <FloatingLabel controlId="floatingPassword2" label="Confirm Password">
                                                <Form.Control type="password" placeholder="Confirm Password" name="password2" required/>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                </div>
                                <Button className='w-100 mt-3 btn-custom' type="submit">Sign Up</Button>
                            </Form>
                        </Card.Body>
                        <Card.Footer className='text-center d-flex flex-column justify-content-center '>
                            <p>Already have an account?</p>
                            <Link className='text-decoration-none btn btn-outline-custom' to={"/signin"}>Sign In</Link>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SignUpPage;
