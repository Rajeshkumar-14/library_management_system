import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// Contexts
import AuthContext from '../../context/AuthContext';
// Custom Hooks
import useFetchData from '../../hooks/useFetchData';
const QuickActions = () => {
    const navigate = useNavigate();
    const { pageLoading, user } = useContext(AuthContext);
    const { categorys, error } = useFetchData(pageLoading);


    const handleCreateBookClick = () => {
        if (categorys.length > 0) {
            navigate('/books', { state: { openCreateModal: true } });
        } else {
            toast.error('Please create a Category first');
        }
    };
    const handleCreateCategoryClick = () => {
        navigate('/category', { state: { openCreateModal: true } });
    };
    const handleCreateMemberClick = () => {
        navigate('/members', { state: { openCreateModal: true } });
    };
    const handleCreateRecordClick = () => {
        navigate('/records', { state: { openCreateModal: true } });
    };

    return (
        <Container fluid className='bg-white shadow w-75  my-3 rounded-2'>
            <Row className='card'>
                <div className="card-header d-flex justify-content-center align-items-center">
                    <Col lg={3} className='d-flex justify-content-center'>
                        <p className='fs-5 badge bg-primary m-0'>QUICK ACTIONS</p>
                    </Col>
                </div>
                <div className="card-body d-flex justify-content-evenly align-content-center align-items-center gap-3 gap-lg-0 p-3">
                    <Col lg={9} className='d-flex justify-content-end align-items-center flex-wrap gap-3 flex-grow'>
                        <Button variant='warning' className='flex-fill' onClick={handleCreateCategoryClick}>Create Category</Button>
                        <Button variant='primary' className='flex-fill' onClick={handleCreateBookClick}>Create Book</Button>
                        <Button variant='secondary' className='flex-fill' onClick={handleCreateMemberClick}>Create Member</Button>
                        <Button variant='custom' className='flex-fill' onClick={handleCreateRecordClick}>Create Record</Button>
                    </Col>
                </div>
            </Row>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition:Bounce />
        </Container>
    );
};

export default QuickActions;
