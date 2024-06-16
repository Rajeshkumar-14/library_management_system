import React, { useContext, useState, useEffect } from 'react';
// Styles
import './LMS-style.css';
// Contexts
import AuthContext from '../../context/AuthContext';
import ManagementContext from '../../context/ManagementContext';
// Custom Hooks
import useFetchData from '../../hooks/useFetchData';
// Packages
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, InputGroup, Card, Table, Modal, Button, FloatingLabel, Tab, Nav } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
// Components
import DashBoardCard from '../../components/DashBoardCard';
// Utils
import { formatDate } from '../../utils/FormatDate';

const IssuePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pageLoading, user } = useContext(AuthContext);
    const { createManagement, updateManagement, deleteManagement } = useContext(ManagementContext);

    const { bookDashboardData, fetchBookData, fetchManagement, books, members, management, error } = useFetchData(pageLoading);

    const [issuedBooks, setIssuedBooks] = useState([]);
    const [overDueBooks, setOverDueBooks] = useState([]);
    const [filteredIssuedBooks, setFilteredIssuedBooks] = useState([]);
    const [filteredOverdueBooks, setFilteredOverdueBooks] = useState([]);

    const [recentlyIssued, setRecentlyIssued] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Set Data for Table
    useEffect(() => {
        if (Array.isArray(management)) {
            setRecentlyIssued(getRecentlyIssued(management));
        }
    }, [management]);
    useEffect(() => {
        setFilteredIssuedBooks(issuedBooks);
    }, [issuedBooks]);

    useEffect(() => {
        setFilteredOverdueBooks(overDueBooks);
    }, [overDueBooks]);
    useEffect(() => {
        if (location.state?.openCreateModal) {
            setShowCreateModal(true);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname]);

    useEffect(() => {
        if (Array.isArray(management)) {
            const today = new Date();

            // Initialize arrays to collect issued and overdue books
            let issued = [];
            let overdue = [];

            management.forEach(management => {
                const issuedDate = new Date(management.issued_date);
                const timeDifference = today - issuedDate;
                const daysDifference = timeDifference / (1000 * 3600 * 24);

                if (!management.is_returned && !management.late_fee_paid) {
                    if (daysDifference > 30) {
                        overdue.push(management);
                    } else {
                        issued.push(management);
                    }
                }
            });

            issued.sort((a, b) => b.id - a.id);
            overdue.sort((a, b) => b.id - a.id);

            // Update state with sorted arrays
            setIssuedBooks(issued);
            setOverDueBooks(overdue);
        }
    }, [management]);



    // Handle create management
    const handleCreateSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('created_by', user.id);

        formData.append('book', formData.get('book_name'));
        formData.append('user', formData.get('user_name'));
        console.log(formData);

        try {
            let response = await createManagement(formData);
            if (response.status === 201) {
                await fetchManagement();
                await fetchBookData();
                toast.success('Record created successfully!');
                setShowCreateModal(false);
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            toast.error('Failed to create record.');
        }
    };
    // Edit Management Record
    const handleEditSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('created_by', user.id);

        formData.append('id', selectedRecord.id);
        formData.append('book', selectedRecord.bookDetails.id);
        formData.append('user', selectedRecord.memberDetails.id);
        formData.append('is_returned', selectedRecord.is_returned ? 'True' : 'False');
        formData.append('late_fee_paid', selectedRecord.late_fee_paid ? 'True' : 'False');
        console.log(formData);

        try {
            let response = await updateManagement(selectedRecord.id, formData);
            if (response.status === 200) {
                await fetchManagement();
                await fetchBookData();
                toast.success('Record updated successfully!');
                setShowEditModal(false);
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            toast.error('Failed to update record.');
        }
    };

    // Delete Management Record
    const handleDelete = async (recordId) => {
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
                    let response = await deleteManagement(recordId);
                    if (response.status === 200) {
                        await fetchManagement();
                        await fetchBookData();
                        toast.success('Record deleted successfully!');
                    }
                } catch (error) {
                    console.error("Error deleting the Record:", error);
                    toast.error('Failed to delete Record.');
                }
            }
        });
    };
    const getRecentlyIssued = (records) => {
        return records
            .sort((a, b) => b.id - a.id)// Sort by created_at in descending order
            .slice(0, 5); // Get the first 5 records after sorting
    };

    const handleFilterIssued = (event) => {
        const query = event.target.value.toLowerCase();
        const filtered = issuedBooks.filter(record =>
            record.book_name.toLowerCase().includes(query) ||
            record.user_name.toLowerCase().includes(query)
        );
        setFilteredIssuedBooks(filtered);
    };

    const handleFilterOverdue = (event) => {
        const query = event.target.value.toLowerCase();
        const filtered = overDueBooks.filter(record =>
            record.book_name.toLowerCase().includes(query) ||
            record.user_name.toLowerCase().includes(query)
        );
        setFilteredOverdueBooks(filtered);
    };


    // Modal Management
    const handleCreateManagement = () => {
        setShowCreateModal(true);
    };
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };
    const handleEditRecord = (record) => {
        const bookDetails = books.find(book => book.id === record.book);
        const memberDetails = members.find(member => member.id === record.user);

        if (bookDetails && memberDetails) {
            setSelectedRecord({ ...record, bookDetails, memberDetails });
        }
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedRecord(null);
    };

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setSelectedRecord(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };



    const handleViewRecord = (record) => {
        const bookDetails = books.find(book => book.id === record.book);
        const memberDetails = members.find(member => member.id === record.user);

        if (bookDetails && memberDetails) {
            setSelectedRecord({ ...record, bookDetails, memberDetails });
        }

        setShowViewModal(true);
    };

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setSelectedRecord(null);
    };

    const returnColumn = [
        {
            name: 'Issue Id',
            selector: row => row.id,
            sortable: true,
            center: "true",
        },
        {
            name: 'Book Name',
            selector: row => row.book_name,
        },
        {
            name: 'Member Name',
            selector: row => row.user_name,
            sortable: true,
            center: "true",
        },
        {
            name: 'Issue Date',
            selector: row => row.issued_date,
            sortable: true,
            center: "true",
        },
        {
            name: 'Action',
            center: "true",
            cell: row => (
                <div className="btn-group w-100" role="group">
                    <button type="button" onClick={() => handleViewRecord(row)} className="btn btn-info me-1"><i className="bi bi-eye-fill"></i></button>
                    <button type="button" onClick={() => handleEditRecord(row)} className="btn btn-warning me-1"><i className="bi bi-pencil-square"></i></button>
                    <button type="button" onClick={() => handleDelete(row.id)} className="btn btn-danger"><i className="bi bi-trash3-fill"></i></button>
                </div>
            ),
        },
        {
            name: 'Book ID',
            selector: row => row.book,
            omit: true,
        },
        {
            name: 'User ID',
            selector: row => row.user,
            omit: true,
        },
    ];

    const overDueColumn = [
        {
            name: 'Issue Id',
            selector: row => row.id,
            sortable: true,
            center: "true",
        },
        {
            name: 'Book Name',
            selector: row => row.book_name,
        },
        {
            name: 'Member Name',
            selector: row => row.user_name,
            sortable: true,
            center: "true",
        },
        {
            name: 'Issue Date',
            selector: row => row.issued_date,
            sortable: true,
            center: "true",
        },
        {
            name: 'Late Fee',
            selector: row => row.late_fee,
            sortable: true,
            center: "true",
        },
        {
            name: 'Action',
            center: "true",
            cell: row => (
                <div className="btn-group w-100" role="group">
                    <button type="button" onClick={() => handleViewRecord(row)} className="btn btn-info me-1"><i className="bi bi-eye-fill"></i></button>
                    <button type="button" onClick={() => handleEditRecord(row)} className="btn btn-warning me-1"><i className="bi bi-pencil-square"></i></button>
                    <button type="button" onClick={() => handleDelete(row.id)} className="btn btn-danger"><i className="bi bi-trash3-fill"></i></button>
                </div>
            ),
        },
        {
            name: 'Book ID',
            selector: row => row.book,
            omit: true,
        },
        {
            name: 'User ID',
            selector: row => row.user,
            omit: true,
        },
    ];

    return (
        <Container fluid className='content-container pb-3 w-100 m-0 px-0'>

            <Container fluid className='m-0 p-0 d-flex justify-content-center flex-wrap'>
                {books.length > 0 && members.length > 0 ? (
                    <>
                        <Row className="shadow rounded mx-2 mt-2">
                            <Row className="text-center">
                                <p className='fs-4'>Issued/Borrow DASHBOARD</p>
                            </Row>
                            <hr />
                            {pageLoading && <p>Loading...</p>}
                            {error && <p>{error}</p>}
                            <Row className="w-100 dashboard">
                                {!pageLoading && !error && bookDashboardData.map((data, index) => (
                                    <DashBoardCard
                                        key={index}
                                        bgClass={data.bgClass}
                                        img_name={data.img_name}
                                        total={data.total}
                                        text={data.text}
                                        className={'col-12 col-sm-6 col-md-4 col-lg-3 p-3'}
                                    />
                                ))}
                            </Row>
                        </Row>
                        <Row className="mt-4 w-100">
                            <Col lg={9}>
                                {/* Tab 1 for return */}

                                <Tab.Container id="left-tabs-example" defaultActiveKey="return">
                                    <Nav variant="tabs" className="d-flex justify-content-between flex-fill">
                                        <Nav.Item className='w-50 text-center fw-bold fs-5'>
                                            <Nav.Link eventKey="return">Return</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className='w-50 text-center fw-bold fs-5'>
                                            <Nav.Link eventKey="overdue">OverDue</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Tab.Content className='border'>
                                        <Tab.Pane eventKey="return" className='p-2'>
                                            <Card>
                                                <Card.Header className='py-3 px-4 text-center d-flex flex-row justify-content-between'>
                                                    <div className='d-flex flex-row'>
                                                        <i className="bi bi-journals fs-4 fw-bold me-2"></i>
                                                        <h4 className='fs-3 fw-bolder'>LMS</h4>
                                                    </div>
                                                    <div className='d-flex flex-row'>
                                                        <InputGroup>
                                                            <InputGroup.Text id="basic-addon1"><i className="bi bi-search"></i></InputGroup.Text>
                                                            <Form.Control type="search" placeholder="Search" name="search" onChange={handleFilterIssued} />
                                                        </InputGroup>
                                                    </div>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div className="table-responsive">
                                                        <DataTable
                                                            columns={returnColumn}
                                                            data={filteredIssuedBooks}
                                                            pagination
                                                            responsive
                                                            highlightOnHover
                                                            striped
                                                            theme='solarized'
                                                            customStyles={{
                                                                table: {
                                                                    style: {
                                                                        maxHeight: '300px',
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
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="overdue" className='p-2'>
                                            <Card>
                                                <Card.Header className='py-3 px-4 text-center d-flex flex-row justify-content-between'>
                                                    <div className='d-flex flex-row'>
                                                        <i className="bi bi-journals fs-4 fw-bold me-2"></i>
                                                        <h4 className='fs-3 fw-bolder'>LMS</h4>
                                                    </div>
                                                    <div className='d-flex flex-row'>
                                                        <InputGroup>
                                                            <InputGroup.Text id="basic-addon1"><i className="bi bi-search"></i></InputGroup.Text>
                                                            <Form.Control type="search" placeholder="Search" name="search" onChange={handleFilterOverdue} />
                                                        </InputGroup>
                                                    </div>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div className="table-responsive">
                                                        <DataTable
                                                            columns={overDueColumn}
                                                            data={filteredOverdueBooks}
                                                            pagination
                                                            responsive
                                                            highlightOnHover
                                                            striped
                                                            theme='solarized'
                                                            customStyles={{
                                                                table: {
                                                                    style: {
                                                                        maxHeight: '300px',
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
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>


                            </Col>
                            <Col lg={3} className="recent-records  mt-3 mt-lg-0">
                                <Card className='pb-0'>
                                    <Card.Header className='d-flex justify-content-between'>
                                        <button type='button' className='btn btn-success px-3 w-100 py-1' onClick={handleCreateManagement}>
                                            <i className="bi bi-journal-plus fs-5 me-2"></i> New Record
                                        </button>
                                    </Card.Header>
                                    <Card.Body className='pb-1'>
                                        <h5 className='text-center'>Recent Records</h5>
                                        <hr />
                                        <Table responsive striped bordered>
                                            <thead className='text-center'>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentlyIssued.map(book => (
                                                    <tr key={book.id}>
                                                        <td>
                                                            <span className=''>{book.book_name.slice(0, 15)}</span>
                                                        </td>
                                                        <td>
                                                            <span>{formatDate(book.issued_date)}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                ): (

                        <div className='d-flex justify-content-center mt-lg-5 mt-2 w-100'>
                            <div className='text-center bg-dark text-light p-5 w-75 rounded-5'>
                                {
                                    books.length === 0 && members.length === 0 ? (
                                        <h4>Please Create a Book and member to Issue Book</h4>
                                    ) : books.length > 0 && members.length === 0 ? (
                                        <h4>Please Create a member to Issue Book</h4>
                                    ) : books.length === 0 && members.length > 0 ? (
                                        <h4>Please Create a Book to Create a Record</h4>
                                    ) : null
                                }
                            </div>
                        </div>

                )}
                {/* View Book Modal */}
                <Modal show={showViewModal} onHide={handleCloseViewModal} size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title>View Book</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedRecord && selectedRecord.bookDetails && (
                            <div className="card shadow">
                                <img src={selectedRecord.bookDetails.image} alt={selectedRecord.book_name} className="card-img-top object-fit-cover" width={450} height={400}  />
                                <div className="card-body">
                                    <div>
                                        <table className='table table-hover table-bordered'>
                                            <tbody>
                                                <tr>
                                                    <td className='fw-bold'>Issue Id</td>
                                                    <td className='text-center'>{selectedRecord.id}</td>
                                                </tr>
                                                <tr>
                                                    <td className='fw-bold'>Book Name</td>
                                                    <td className='text-center'>
                                                        {selectedRecord.book_name}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className='fw-bold'>Member Name</td>
                                                    <td className='text-center text-capitalize'>
                                                        {selectedRecord.user_name}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className='fw-bold'>Issue Date</td>
                                                    <td className='text-center'>{selectedRecord.issued_date}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
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
                        <Modal.Title>Create New Record</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleCreateSubmit}>
                        <Modal.Body>
                            <FloatingLabel controlId="floatingSelect" label="Book Name" className='mb-3'>
                                <Form.Select name='book_name' required>
                                    {books.map((book, index) => (
                                        <option key={index} value={book.id}>{book.name}</option>
                                    ))}
                                </Form.Select>
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingSelect" label="Member Name" className='mb-3'>
                                <Form.Select name='user_name' required>
                                    {members.map((member, index) => (
                                        member.is_active ? (
                                            member.unpaid_fine == 0 ? (
                                                <option key={index} value={member.id}>{member.name}</option>
                                            ) : (
                                                <option className='text-danger' key={index} value={member.id} disabled>{member.name} (Fine Pending)</option>
                                            )
                                        ) : (
                                            <option className='text-warning' key={index} value={member.id} disabled>{member.name} (Inactive)</option>
                                        )
                                    ))}
                                </Form.Select>

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

                <Modal show={showEditModal} onHide={handleCloseEditModal} size='lg'>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Borrow Record</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleEditSubmit}>
                        <Modal.Body>
                            {selectedRecord && (
                                <>
                                    <FloatingLabel controlId="floatingInput" label="Book Name" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            name="book_name"
                                            value={selectedRecord.book_name}
                                            onChange={handleInputChange}
                                            required
                                            readOnly
                                            disabled
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel controlId="floatingInput" label="Member Name" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            readOnly
                                            disabled
                                            name="user_name"
                                            value={selectedRecord.user_name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </FloatingLabel>
                                    <FloatingLabel controlId="floatingInput" label="Issued Date" className="mb-3">
                                        <Form.Control
                                            type="date"
                                            readOnly
                                            disabled
                                            name="issued_date"
                                            value={selectedRecord.issued_date}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </FloatingLabel>
                                    {selectedRecord.late_fee > 0 && (
                                        <FloatingLabel controlId="floatingInput" label="Late fee" className="mb-3">
                                            <Form.Control
                                                type="number"
                                                name="late_fee"
                                                value={selectedRecord.late_fee}
                                                onChange={handleInputChange}
                                            />
                                        </FloatingLabel>
                                    )}
                                    <div className='border py-2 px-3 rounded mb-3'>
                                        <Form.Check
                                            type="checkbox"
                                            id="is_returned"
                                            name="is_returned"
                                            checked={selectedRecord.is_returned}
                                            onChange={handleInputChange}
                                            label="Is Returned"
                                        />
                                    </div>
                                    {selectedRecord.late_fee > 0 && (
                                        <div className='border py-2 px-3 rounded mb-3'>
                                            <Form.Check
                                                type="checkbox"
                                                id="late_fee_paid"
                                                name="late_fee_paid"
                                                checked={selectedRecord.late_fee_paid}
                                                onChange={handleInputChange}
                                                label="Is Late Fee Paid"
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseEditModal}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">
                                Save Changes
                            </Button>
                        </Modal.Footer>
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
        </Container>
    );
}

export default IssuePage;
