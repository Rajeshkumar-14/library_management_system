import React, { useContext, useEffect } from 'react';
import { Container, Form, Card, Row, Col, FloatingLabel } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import view_profile_img from '../../assests/images/view_profile.jpg';
import AuthContext from '../../context/AuthContext';

const UserProfilePage = () => {
    const { user, fetchUserData, pageLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleUpdateProfile = async () => {
        navigate('/edit-user-profile');
    };
    useEffect(() => {
        if (!user) {
            fetchUserData();
        }
    }, []);

    if (pageLoading) {
        return <p>Loading...</p>;
    }

    return (
        <Container fluid className='d-flex flex-column my-2 mx-0 px-0 w-100 justify-content-center align-items-center'>
            <Row className='d-flex justify-content-center align-items-center w-100'>
                <Col lg={5} className='d-lg-block d-none'>
                    <img src={view_profile_img} alt="Login" className='img-fluid' />
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
                                <h3 className='fs-3 fw-bolder'>USER PROFILE</h3>
                            </div>
                        </Card.Header>
                        <Card.Body className='p-5 pb-3'>
                            <Form>
                                <FloatingLabel className="mb-3" controlId="formUsername" label="User Name">
                                    <Form.Control type="text" placeholder="User Name" name='username' disabled value={user?.username} />
                                </FloatingLabel>
                                <FloatingLabel className="mb-3" controlId="formFirstName" label="First Name">
                                    <Form.Control type="text" placeholder="First Name" name='first_name' disabled value={user?.first_name} />
                                </FloatingLabel>
                                <FloatingLabel className="mb-3" controlId="formLastName" label="Last Name">
                                    <Form.Control type="text" placeholder="Last Name" name='last_name' disabled value={user.last_name ? user.last_name : "null"} />
                                </FloatingLabel>
                                <FloatingLabel className="mb-3" controlId="formEmail" label="Email Address">
                                    <Form.Control type="email" placeholder="sample@lms.com" name='email' disabled value={user?.email} />
                                </FloatingLabel>
                            </Form>
                        </Card.Body>
                        <Card.Footer className='text-center d-flex flex-row justify-content-between px-5 py-3'>
                            <Link to={'/update-password'} className='btn text-decoration-none btn-danger'>UPDATE PASSWORD</Link>
                            <button onClick={handleUpdateProfile} className='btn btn-custom'>UPDATE PROFILE</button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfilePage;
