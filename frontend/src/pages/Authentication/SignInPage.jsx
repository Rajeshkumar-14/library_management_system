import React, { useContext } from 'react'
import { Container, Form, Button, FloatingLabel, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import signin_img from '../../assests/images/sign_in.jpg';
import AuthContext from '../../context/AuthContext';
const SignInPage = () => {
    let { signInUser } = useContext(AuthContext)

    return (
        <Container fluid className='d-flex justify-content-center align-items-center my-2 min-vh-100'>
            <Row className='d-flex justify-content-center align-items-center w-100'>
                <Col lg={5} className='d-lg-block d-none'>
                    <img src={signin_img} alt="Login" className='img-fluid' />
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
                                <h3 className='fs-3 fw-bolder'>SIGN IN</h3>
                            </div>
                        </Card.Header>
                        <Card.Body className='p-5 pb-3'>
                            <Form onSubmit={signInUser}>
                                <FloatingLabel
                                    controlId="floatingInput"
                                    label="User Name"
                                    className="mb-3">
                                    <Form.Control type="text" placeholder="UserName" name="username" required />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingPassword" label="Password">
                                    <Form.Control type="password" placeholder="Password" name="password" required />
                                </FloatingLabel>
                                <Button variant='custom' className='w-100 mt-3' type="submit">Login</Button>
                            </Form>
                            <div className="mt-3 text-end">
                                <Link className='text-decoration-none ' to={"/forgot-password"}>Forgot Password ?</Link>
                            </div>
                        </Card.Body>
                        <Card.Footer className='text-center d-flex flex-column justify-content-center '>
                            <p>Don't have an account?</p>
                            <Link className='text-decoration-none btn btn-outline-custom' to={"/signup"}>Sign Up</Link>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default SignInPage
