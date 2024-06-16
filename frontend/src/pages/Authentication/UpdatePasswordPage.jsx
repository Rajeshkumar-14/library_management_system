import React, { useContext } from 'react'
import { Container, Form, Button, FloatingLabel, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import update_password_img from '../../assests/images/update_password.jpg';
import AuthContext from '../../context/AuthContext';

import SideBar from '../../components/SideBar';
import HeaderNav from '../../components/Header';
import NavigationBar from '../../components/NavBar';
const UpdatePasswordPage = () => {
    const { updatePassword } = useContext(AuthContext);
    return (
        <Container fluid className='d-flex flex-column my-2  mx-0 px-0 w-100  justify-content-center align-items-center'>
            <Row className='d-flex justify-content-center align-items-center w-100'>
                <Col lg={5} className='d-lg-block d-none'>
                    <img src={update_password_img} alt="Login" className='img-fluid' />
                </Col>
                <Col lg={5} md={10}>
                    <Card className='shadow'>
                        <Form onSubmit={updatePassword}>
                            <Card.Header className='p-4 text-center bg-custom d-flex flex-row justify-content-between'>
                                <div className='d-flex flex-row'>
                                    <i className="bi bi-journals fs-4 fw-bold me-2"></i>
                                    <h4 className='fs-3 fw-bolder'>LMS</h4>
                                </div>
                                <div className='d-flex flex-row'>
                                    <i className="bi bi-person-lock fs-4 fw-bold me-2"></i>
                                    <h3 className='fs-3 fw-bolder'>UPDATE PASSWORD</h3>
                                </div>
                            </Card.Header>
                            <Card.Body className='p-5 pb-3'>
                                <FloatingLabel className='mb-3' controlId="floatingOldPassword" label="Old Password">
                                    <Form.Control type="password" placeholder="Old Password" name="old_password" required />
                                </FloatingLabel>
                                <FloatingLabel className='mb-3' controlId="floatingNewPassword" label="New Password">
                                    <Form.Control type="password" placeholder="New Password" name="new_password" required />
                                </FloatingLabel>
                                <FloatingLabel className='mb-3' controlId="floatingConfirmPassword" label="Confirm Password">
                                    <Form.Control type="password" placeholder="Confirm Password" name="confirm_password" required />
                                </FloatingLabel>
                            </Card.Body>
                            <Card.Footer className='text-center d-flex flex-row justify-content-between '>
                                <Link className='text-decoration-none btn btn-secondary w-25' to={"/user-profile"}>Cancel</Link>
                                <Button variant="custom" className='btn w-25' type="submit">UPDATE</Button>
                            </Card.Footer>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default UpdatePasswordPage
