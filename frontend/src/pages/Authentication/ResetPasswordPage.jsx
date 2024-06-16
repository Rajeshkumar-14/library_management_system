import React, { createRef, useContext, useState } from 'react';
import { Container, Form, Button, FloatingLabel, Card, Row, Col } from 'react-bootstrap';
import verify_otp from '../../assests/images/verify_otp.jpg';
import './Authentication.css';
import AuthContext from '../../context/AuthContext';

function ResetPasswordPage() {
    const { resetPassword } = useContext(AuthContext);
    const inputRefs = Array.from({ length: 6 }, () => createRef());
    const [otp, setOtp] = useState(Array(6).fill(""));

    const handleInputChange = (index, event) => {
        const value = event.target.value;
        if (/^\d$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < inputRefs.length - 1) {
                inputRefs[index + 1].current.focus();
            }
        } else {
            event.target.value = '';
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && !event.target.value && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const otpString = otp.join("");
        resetPassword(event, otpString);
    };

    return (
        <Container fluid className='d-flex justify-content-center my-2 align-items-center min-vh-100'>
            <Row className='d-flex justify-content-center align-items-center w-100'>
                <Col lg={5} className='d-lg-block d-none'>
                    <img src={verify_otp} alt="Reset Password" className='img-fluid' />
                </Col>
                <Col lg={5} md={10}>
                    <Card className='shadow'>
                        <Card.Header className='p-3 text-center bg-custom d-flex flex-row justify-content-between'>
                            <div className='d-flex flex-row'>
                                <i className="bi bi-journals fs-5 fw-bold me-2"></i>
                                <h4 className='fs-4 fw-bolder'>LMS</h4>
                            </div>
                            <div className='d-flex flex-row'>
                                <i className="bi bi-shield-lock fs-5 fw-bold me-2"></i>
                                <h3 className='fs-4 fw-bolder'>CONFIRM PASSWORD</h3>
                            </div>
                        </Card.Header>
                        <Card.Body className='p-5'>
                            <Form onSubmit={handleSubmit}>
                                <div className='bg-white border p-1 py-2 rounded-2 mb-3 text-center'>
                                    <Form.Label>Enter OTP</Form.Label>
                                    <div className="otp-input-container mb-3">
                                        {inputRefs.map((ref, index) => (
                                            <Form.Control
                                                key={index}
                                                type="text"
                                                maxLength="1"
                                                className="otp-input text-center"
                                                onChange={(e) => handleInputChange(index, e)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                ref={ref}
                                                inputMode="numeric"
                                                pattern="\d*"
                                                name={`otp-${index}`} required
                                            />
                                        ))}
                                    </div>
                                </div>
                                <FloatingLabel controlId="floatingEmail" label="Enter Your Email" className="mb-3">
                                    <Form.Control type="email" placeholder="sample@lms.com" name="email" required />
                                </FloatingLabel>
                                <Row>
                                    <Col>
                                        <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                                            <Form.Control type="password" placeholder="Password" name="new_password" required />
                                        </FloatingLabel>
                                    </Col>
                                    <Col>
                                        <FloatingLabel controlId="floatingPassword2" label="Confirm Password" className="mb-3">
                                            <Form.Control type="password" placeholder="Confirm Password" name="confirm_password" required />
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                                <Button variant='custom' className='w-100 mt-3' type="submit">Reset Password</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ResetPasswordPage;
