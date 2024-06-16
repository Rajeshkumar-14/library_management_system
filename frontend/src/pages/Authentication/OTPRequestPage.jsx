import React, {useContext} from 'react'
import { Container, Form, Button, FloatingLabel, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import otp_request_img from '../../assests/images/request_otp.jpg';
import AuthContext from '../../context/AuthContext';

const OTPRequestPage = () => {

    const { requestOTP } = useContext(AuthContext)

    return (
        <Container fluid className='d-flex justify-content-center my-2 align-items-center min-vh-100'>
            <Row className='d-flex justify-content-center align-items-center w-100'>
                <Col lg={5} className='d-lg-block d-none'>
                    <img src={otp_request_img} alt="OTP Request" className='img-fluid' />
                </Col>
                <Col lg={5} md={10}>
                    <Card className='shadow'>
                        <Card.Header className='p-3 text-center bg-custom d-flex flex-row justify-content-between'>
                            <div className='d-flex flex-row'>
                                <i className="bi bi-journals fs-5 fw-bold me-2"></i>
                                <h4 className='fs-4 fw-bolder'>LMS</h4>
                            </div>
                            <div className='d-flex flex-row'>
                                <i className="bi bi-envelope-plus fs-5 fw-bold me-2"></i>
                                <h3 className='fs-4 fw-bolder'>FORGOT PASSWORD</h3>
                            </div>
                        </Card.Header>
                        <Card.Body className='p-4 py-5 pb-3'>
                            <Row>
                                <div className="col-12  text-center">
                                    <h2>Forgot your password?</h2>
                                    <p className='otp-info-text'>Change your password in three easy steps. This will help you to secure your password!</p>
                                    <hr />
                                    <ol className="list-unstyled text-start">
                                        <li><span className="text-primary otp-info-text me-2">
                                            1. </span><span className='otp-info-text'>Enter your email address below.</span>
                                        </li>
                                        <li><span className="text-primary otp-info-text me-2">
                                            2. </span><span className='otp-info-text'>Our system will send you a OTP.</span>
                                        </li>
                                        <li><span className="text-primary otp-info-text me-2">
                                            3. </span><span className='otp-info-text'>Enter the OTP and Other credientials.</span>
                                        </li>
                                    </ol>
                                    <hr />
                                </div>
                            </Row>
                            <Row>
                                <Form onSubmit={requestOTP}>
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Enter Your Email"
                                        className="mb-3">
                                        <Form.Control type="email" placeholder="sample@lms.com" name="email" required />
                                    </FloatingLabel>
                                    <Button className='w-100 mt-3' variant='outline-custom' type="submit">Request OTP</Button>
                                </Form>
                            </Row>
                        </Card.Body>
                        <Card.Footer className='text-center d-flex flex-column justify-content-center '>
                            <p>Back to Sign In</p>
                            <Link className='text-decoration-none btn btn-custom' to={"/signin"}>Sign In</Link>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default OTPRequestPage
