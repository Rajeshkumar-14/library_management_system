import React, { useContext, useState, useEffect } from 'react';
// Styles
import './LMS-style.css';
// Packages
import { ToastContainer, toast } from 'react-toastify';
import { Container, Row, Col, Form, InputGroup, Card, Table, Modal, Button, FloatingLabel } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
// Contexts
import AuthContext from '../../context/AuthContext';
import ManagementContext from '../../context/ManagementContext';
// Custom Hooks
import useFetchData from '../../hooks/useFetchData';
// utils
import { formatDate } from '../../utils/FormatDate';

const CategoryPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pageLoading, user } = useContext(AuthContext);
    const { createCategory, updateCategory, deleteCategory } = useContext(ManagementContext);
    const { fetchCategory, categorys, error } = useFetchData(pageLoading);

    const [filteredCategories, setFilteredCategories] = useState([]);
    const [recentCategories, setRecentCategories] = useState([]);

    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        setFilteredCategories(categorys);
        setRecentCategories(getRecentCategories(categorys));
    }, [categorys]);

    useEffect(() => {
        if (location.state?.openCreateModal) {
            setShowCreateModal(true);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname]);

    const handleCreateSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('created_by', user.id);

        try {
            let response = await createCategory(formData);
            if (response.status === 201) {
                await fetchCategory();
                toast.success('Category created successfully!');
                setShowCreateModal(false);
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            toast.error('Failed to create Category.');
        }
    };
    const handleEditSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('created_by', user.id);

        formData.append('name', selectedCategory.name);

        try {
            const categoryID = selectedCategory.id;
            let response = await updateCategory(categoryID, formData);
            if (response.status === 200) {
                await fetchCategory();
                toast.success('Category data updated successfully!');
                handleCloseEditModal();
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            toast.error('Failed to update Category data.');
        }
    };
    const handleDelete = async (categoryID) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    let response = await deleteCategory(categoryID);
                    if (response.status === 200) {
                        await fetchCategory();
                        toast.success('Category deleted successfully!');
                    }
                } catch (error) {
                    console.error("Error deleting the Category:", error);
                    toast.error('Failed to delete Category.');
                }
            }
        });
    };

    const handleFilter = (event) => {
        const query = event.target.value.toLowerCase();
        const filtered = categorys.filter(category => category.name.toLowerCase().includes(query));
        setFilteredCategories(filtered);
    };

    const getRecentCategories = (category) => {
        return category
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
    };

    // Modal Handling
    const handleViewCategory = (category) => {
        setSelectedCategory(category);
        setShowViewModal(true);
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setShowEditModal(true);
    };

    const handleCreateCategory = () => {
        setShowCreateModal(true);
    };

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setSelectedCategory(null);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedCategory(null);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedCategory(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const columns = [
        {
            name: 'Category ID',
            selector: row => row.id,
            sortable: true,
            center: "true",
            width: '20%',
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            center: "true",
        },
        {
            name: 'Action',
            center: "true",
            cell: row => (
                <div className="btn-group w-100" role="group">
                    <button type="button" onClick={() => handleViewCategory(row)} className="btn btn-info me-1"><i className="bi bi-eye-fill"></i></button>
                    <button type="button" onClick={() => handleEditCategory(row)} className="btn btn-warning me-1"><i className="bi bi-pencil-square"></i></button>
                    <button type="button" onClick={() => handleDelete(row.id)} className="btn btn-danger"><i className="bi bi-trash3-fill"></i></button>
                </div>
            ),
        },
    ];

    return (
        <Container fluid className='content-container pb-3 w-100 m-0 px-0'>
            {categorys.length > 0 ? (
                <Container fluid className='m-0 p-0 d-flex justify-content-center flex-wrap'>
                    <Row className="shadow rounded mx-2 mt-2 w-100">
                        <Row className="text-center">
                            <p className='fs-4'>CATEGORY DASHBOARD</p>
                        </Row>
                        <hr />
                        {pageLoading && <p>Loading...</p>}
                        {error && <p>{error}</p>}
                        <Row className="dashboard text-center p-3 d-flex justify-content-center">
                            <div className=' bg-warning p-3 rounded w-50'>
                                <h3 className='p-0 m-0'>TOTAL CATEGORIES : <span className='fw-bold'>{categorys.length}</span> </h3>
                            </div>
                        </Row>
                    </Row>
                    <Row className="mt-4 w-100 d-flex justify-content-evenly">
                        <Col lg={7}>
                            <Card>
                                <Card.Header className='py-3 px-4 text-center d-flex flex-row justify-content-between'>
                                    <div className='d-flex flex-row'>
                                        <i className="bi bi-journals fs-4 fw-bold me-2"></i>
                                        <h4 className='fs-3 fw-bolder'>LMS</h4>
                                    </div>
                                    <div className='d-flex flex-row'>
                                        <InputGroup>
                                            <InputGroup.Text id="basic-addon1"><i className="bi bi-search"></i></InputGroup.Text>
                                            <Form.Control type="search" placeholder="Search" name="search" onChange={handleFilter} />
                                        </InputGroup>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="table-responsive">
                                        <DataTable
                                            columns={columns}
                                            data={filteredCategories}
                                            pagination
                                            responsive
                                            highlightOnHover
                                            striped
                                            customStyles={{
                                                table: {
                                                    style: {
                                                        minHeight: 'auto',
                                                        maxHeight: '400px',
                                                        overflowY: 'auto',
                                                    }
                                                },
                                                headRow: {
                                                    style: {
                                                        fontWeight: 'bold',
                                                        fontSize: '12px',
                                                    }
                                                },
                                                cells: {
                                                    style: {
                                                        paddingLeft: '8px',
                                                        paddingRight: '8px',
                                                    },
                                                },
                                            }}
                                            paginationRowsPerPageOptions={[5, 10, 25, 50]}
                                            paginationPerPage={5}
                                            fixedHeader
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4} className="recent-Category mt-3 mt-lg-0">
                            <Card className='pb-0'>
                                <Card.Header className='d-flex justify-content-between'>
                                    <button type='button' onClick={handleCreateCategory} className='btn btn-success px-3 w-100 py-1'>
                                        <i className="bi bi-journal-plus fs-5 me-2"></i> New Category
                                    </button>
                                </Card.Header>
                                <Card.Body className='pb-1'>
                                    <h5 className='text-center'>Recent Categorys</h5>
                                    <hr />
                                    <Table responsive striped bordered className='text-center' hover>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {recentCategories.map(category => (
                                                <tr key={category.id}>
                                                    <td>
                                                        <span className=''>{category.name}</span>
                                                    </td>
                                                    <td>
                                                        <span>{formatDate(category.created_at)}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            ) : (
                    <div className='d-flex justify-content-center mt-lg-5 mt-2 '>
                        <div className='text-center bg-dark text-light p-5 w-75 rounded-5'>
                            <h4>Create Your First Category</h4>
                            <button type='button' onClick={handleCreateCategory} className='btn btn-primary w-100 px-3 py-1 mt-4'>
                                <i className="bi bi-journal-plus fs-5 me-2"></i> Create Category
                            </button>
                        </div>
                    </div>
            )}

            {/* View Book Modal */}
            <Modal show={showViewModal} onHide={handleCloseViewModal}>
                <Modal.Header closeButton>
                    <Modal.Title>View Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCategory && (
                        <div>
                            <p><strong>Name:</strong> {selectedCategory.name}</p>
                            <p><strong>Created At:</strong> {formatDate(selectedCategory.created_at)}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseViewModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Create Book Modal */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Create Category</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreateSubmit}>
                    <Modal.Body>
                        <FloatingLabel controlId="floatingInputName" label="Category Name" className="mb-3">
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder='Category Name'
                                required
                            />
                        </FloatingLabel>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseCreateModal}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal.Body>
                </Form>
            </Modal>
            {/* Edit Book Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Book</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleEditSubmit}>
                    <Modal.Body>
                        {selectedCategory && (
                            <>
                                <FloatingLabel controlId="floatingInput" label="Category Name" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={selectedCategory.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>

                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseEditModal}>
                                        Close
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        Save Changes
                                    </Button>
                                </Modal.Footer>
                            </>
                        )}
                    </Modal.Body>
                </Form>
            </Modal>

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
    )
}

export default CategoryPage
