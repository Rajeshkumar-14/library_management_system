import React, { useContext, useState, useEffect } from 'react';
import { Container, Form, Button, FloatingLabel, Card, Row, Col } from 'react-bootstrap';
import update_profile_img from '../../assests/images/update_profile.jpg';
import AuthContext from '../../context/AuthContext';
import { Link } from 'react-router-dom'

const EditUserProfilePage = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        id: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                id: user.id || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData.username, formData.first_name, formData.last_name, formData.email, formData.id);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <Container fluid className='d-flex flex-column m-3 mx-lg-0 px-0 w-100'>
            <Row className='d-flex justify-content-center align-items-center w-100'>
                <Col lg={5} className='d-lg-block d-none'>
                    <img src={update_profile_img} alt="Update Profile" className='img-fluid' />
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
                                <h3 className='fs-3 fw-bolder'>EDIT USER PROFILE</h3>
                            </div>
                        </Card.Header>
                        <Card.Body className='p-5 pb-3'>
                            <Form onSubmit={handleSubmit}>
                                <Form.Control type="hidden" name='id' value={formData.id} />

                                <FloatingLabel controlId="floatingInput" label="User Name" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="User Name"
                                        name='username'
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingFirstName" label="First Name" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="First Name"
                                        name='first_name'
                                        value={formData.first_name}
                                        onChange={handleChange}
                                    />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingEmail" label="Email address" className="mb-3">
                                    <Form.Control
                                        type="email"
                                        placeholder="sample@lms.com"
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingLastName" label="Last Name" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Last Name"
                                        name='last_name'
                                        value={formData.last_name}
                                        onChange={handleChange}
                                    />
                                </FloatingLabel>
                            </Form>
                        </Card.Body>
                        <Card.Footer className='text-center d-flex flex-row justify-content-between px-5 py-3 '>
                            <Link className='text-decoration-none btn btn-secondary' to={"/user-profile"}>Cancel</Link>
                            <button onClick={handleSubmit} className='btn btn-custom' type="submit">UPDATE</button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default EditUserProfilePage;
