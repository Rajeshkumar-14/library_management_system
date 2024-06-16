import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row, Tab, Nav, Card, InputGroup, Form, Modal, Button } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

// Contexts
import AuthContext from '../../context/AuthContext';
// Custom Hooks
import useFetchData from '../../hooks/useFetchData';
// Utils
import { formatDate } from '../../utils/FormatDate';

const HistoryPage = () => {
    const { pageLoading, user } = useContext(AuthContext);
    const { books, members, management, error } = useFetchData(pageLoading);
    const [activeTab, setActiveTab] = useState('all');
    const [filteredAllRecords, setFilteredAllRecords] = useState([]);
    const [filteredIssuedRecords, setFilteredIssuedRecords] = useState([]);
    const [filteredReturnedRecords, setFilteredReturnedRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);


    useEffect(() => {
        if (Array.isArray(management)) {
            const sortedManagement = management.slice().sort((a, b) => b.id - a.id);
            setFilteredAllRecords(sortedManagement);
            setFilteredIssuedRecords(sortedManagement.filter(book => !book.is_returned));
            setFilteredReturnedRecords(sortedManagement.filter(book => book.is_returned));
        }
    }, [management]);


    const handleTabClick = (eventKey) => {
        setActiveTab(eventKey);
    }

    const handleFilter = (event, filterFunction, setFilteredRecords) => {
        const query = event.target.value.toLowerCase();
        const filtered = filterFunction(management).filter(record =>
            record.book_name.toLowerCase().includes(query) ||
            record.user_name.toLowerCase().includes(query)
        );
        setFilteredRecords(filtered);
    }

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

    const columns = [
        {
            name: 'Record ID',
            selector: row => row.id,
            sortable: true,
            center: true,
        },
        {
            name: 'User Name',
            selector: row => row.user_name,
            center: true,
            sortable: true,
        },
        {
            name: 'Book Name',
            selector: row => row.book_name,
            sortable: true,
            center: true,

        },
        {
            name: 'Issued Date',
            selector: row => formatDate(row.issued_date),
            sortable: true,
            center: true,

        },
        {
            name: 'Return Date',
            selector: row => row.return_date ? formatDate(row.return_date) : 'Not Returned',
            sortable: true,
            center: true,
        },
        {
            name: 'Action',
            center: true,
            cell: row => (
                <button type="button" onClick={() => handleViewRecord(row)} className="btn btn-info w-50"><i className="bi bi-eye-fill"></i></button>
            ),
        },
    ];

    return (
        <Container fluid>
            {management.length > 0 ? (
                <>
                    <Row className='p-3 bg-white shadow text-center'>
                        <h3>HISTORY PAGE</h3>
                    </Row>
                    <Row className='w-100 my-3'>
                        <Card className='p-3'>
                            <Tab.Container id="left-tabs-example" defaultActiveKey="all">
                                <Nav variant="pills" justified fill>
                                    <Nav.Item className='text-center fs-5 flex-fill' onClick={() => handleTabClick('all')}>
                                        <Nav.Link eventKey="all">All</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className='text-center fs-5 flex-fill' onClick={() => handleTabClick('issued')}>
                                        <Nav.Link eventKey="issued">Issued</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className='text-center fs-5 flex-fill' onClick={() => handleTabClick('returned')}>
                                        <Nav.Link eventKey="returned">Returned</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content className='border-top  mt-3'>
                                    <Tab.Pane eventKey="all" className='p-2'>
                                        <Card>
                                            <Card.Header className='py-3 px-4 text-center d-flex flex-row justify-content-between'>
                                                <div className='d-flex flex-row'>
                                                    <i className="bi bi-journals fs-4 fw-bold me-2"></i>
                                                    <h4 className='fs-3 fw-bolder'>LMS</h4>
                                                </div>
                                                <div className='d-flex flex-row'>
                                                    <InputGroup>
                                                        <InputGroup.Text id="basic-addon1"><i className="bi bi-search"></i></InputGroup.Text>
                                                        <Form.Control type="search" placeholder="Search" name="search" onChange={(e) => handleFilter(e, () => management, setFilteredAllRecords)} />
                                                    </InputGroup>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="table-responsive">
                                                    <DataTable
                                                        columns={columns}
                                                        data={filteredAllRecords}
                                                        pagination
                                                        responsive
                                                        highlightOnHover
                                                        striped
                                                        theme='solarized'
                                                        customStyles={{
                                                            table: {
                                                                style: {
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
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="issued" className='p-2'>
                                        <Card>
                                            <Card.Header className='py-3 px-4 text-center d-flex flex-row justify-content-between'>
                                                <div className='d-flex flex-row'>
                                                    <i className="bi bi-journals fs-4 fw-bold me-2"></i>
                                                    <h4 className='fs-3 fw-bolder'>LMS</h4>
                                                </div>
                                                <div className='d-flex flex-row'>
                                                    <InputGroup>
                                                        <InputGroup.Text id="basic-addon1"><i className="bi bi-search"></i></InputGroup.Text>
                                                        <Form.Control type="search" placeholder="Search" name="search" onChange={(e) => handleFilter(e, (data) => data.filter(book => !book.is_returned), setFilteredIssuedRecords)} />
                                                    </InputGroup>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="table-responsive">
                                                    <DataTable
                                                        columns={columns}
                                                        data={filteredIssuedRecords}
                                                        pagination
                                                        responsive
                                                        highlightOnHover
                                                        striped
                                                        theme='solarized'
                                                        customStyles={{
                                                            table: {
                                                                style: {
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
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="returned" className='p-2'>
                                        <Card>
                                            <Card.Header className='py-3 px-4 text-center d-flex flex-row justify-content-between'>
                                                <div className='d-flex flex-row'>
                                                    <i className="bi bi-journals fs-4 fw-bold me-2"></i>
                                                    <h4 className='fs-3 fw-bolder'>LMS</h4>
                                                </div>
                                                <div className='d-flex flex-row'>
                                                    <InputGroup>
                                                        <InputGroup.Text id="basic-addon1"><i className="bi bi-search"></i></InputGroup.Text>
                                                        <Form.Control type="search" placeholder="Search" name="search" onChange={(e) => handleFilter(e, (data) => data.filter(book => book.is_returned), setFilteredReturnedRecords)} />
                                                    </InputGroup>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="table-responsive">
                                                    <DataTable
                                                        columns={columns}
                                                        data={filteredReturnedRecords}
                                                        pagination
                                                        responsive
                                                        highlightOnHover
                                                        striped
                                                        theme='solarized'
                                                        customStyles={{
                                                            table: {
                                                                style: {
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
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </Card>
                    </Row>
                </>
            ) : (
                    <div className='d-flex justify-content-center mt-lg-5 mt-2 w-100'>
                        <div className='text-center bg-dark text-light p-5 w-75 rounded-5'>
                            <h4>No Records Found</h4>
                        </div>
                    </div>
            )}
            {/* View Record Modal */}
            <Modal show={showViewModal} onHide={handleCloseViewModal} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>View Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRecord && selectedRecord.bookDetails && (
                        <div className="card shadow">
                            <img src={selectedRecord.bookDetails.image} alt={selectedRecord.book_name} className="card-img-top object-fit-cover" width={450} height={400} />
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
                                            {selectedRecord.return_date && (
                                                <tr>
                                                    <td className='fw-bold'>Returned Date</td>
                                                    <td className='text-center'>{selectedRecord.return_date}</td>
                                                </tr>
                                            )}
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
        </Container>
    )
}

export default HistoryPage;
