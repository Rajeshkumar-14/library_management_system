import React, { useContext, useState, useEffect } from 'react';
// Styles
import './LMS-style.css';
// Packages
import { ToastContainer, toast } from 'react-toastify';
import { Container, Row, Col, Form, InputGroup, Card, Table, Modal, Button, FloatingLabel } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';

// Contexts
import AuthContext from '../../context/AuthContext';
import ManagementContext from '../../context/ManagementContext';
// Custom Hooks
import useFetchData from '../../hooks/useFetchData';
// utils
import { formatDate } from '../../utils/FormatDate';
import DashboardCard from '../../components/DashBoardCard';
const MemberPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pageLoading, user } = useContext(AuthContext);
    const { createMember, updateMember, deleteMember } = useContext(ManagementContext);
    const { fetchMember, fetchMemberData, memberDashboardData, error, members, planChoices, genderChoices } = useFetchData(pageLoading);

    const [filteredMembers, setFilteredMembers] = useState([]);
    const [recentMembers, setRecentMembers] = useState([]);

    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        setFilteredMembers(members);
        setRecentMembers(getRecentMembers(members));
    }, [members]);

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
        formData.set('is_active', 'True');

        try {
            let response = await createMember(formData);
            if (response.status === 201) {
                await fetchMemberData();
                await fetchMember();
                toast.success('Member created successfully!');
                setShowCreateModal(false);
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            if (error.response && error.response.data) {
                const { data } = error.response;
                const { name, email, phone_number, address } = data;
                if (name && name.length > 0) {
                    toast.error(capitalizeFirstLetter(name[0]));
                }
                if (email && email.length > 0) {
                    toast.error(capitalizeFirstLetter(email[0]));
                }
                if (phone_number && phone_number.length > 0) {
                    toast.error(capitalizeFirstLetter(phone_number[0]));
                }
                if (address && address.length > 0) {
                    toast.error(capitalizeFirstLetter(address[0]));
                }
            } else {
                toast.error('Failed to create Member.'); // Generic error message
            }
        }
    };
    const handleEditSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('created_by', user.id);

        formData.append('name', selectedMember.name);
        formData.append('email', selectedMember.email);
        formData.append('phone_number', selectedMember.phone_number);
        formData.append('plan', selectedMember.plan);
        formData.append('gender', selectedMember.gender);
        formData.append('is_active', selectedMember.is_active ? 'True' : 'False');



        try {
            const memberID = selectedMember.id;
            let response = await updateMember(memberID, formData);
            if (response.status === 200) {
                await fetchMemberData();
                await fetchMember();
                toast.success('Member data updated successfully!');
                handleCloseEditModal();
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            toast.error('Failed to update Member data.');
        }
    };

    const handleDelete = async (MemberId) => {
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
                    let response = await deleteMember(MemberId);
                    if (response.status === 200) {
                        await fetchMemberData();
                        await fetchMember();
                        toast.success('Member deleted successfully!');
                    }
                } catch (error) {
                    console.error("Error deleting the Member:", error);
                    toast.error('Failed to delete Member.');
                }
            }
        });
    };

    // Function to capitalize the first letter of a string
    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const handleFilter = (event) => {
        const query = event.target.value.toLowerCase();
        const filtered = members.filter(member => member.name.toLowerCase().includes(query));
        setFilteredMembers(filtered);
    };

    const getRecentMembers = (member) => {
        return member
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
    };

    // Modal Handling
    const handleViewMember = (member) => {
        setSelectedMember(member);
        setShowViewModal(true);
    };

    const handleEditMember = (member) => {
        console.log(member);
        setSelectedMember(member);
        setShowEditModal(true);
    };

    const handleCreateMember = () => {
        setShowCreateModal(true);
    };

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setSelectedMember(null);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedMember(null);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setSelectedMember(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    const columns = [
        {
            name: 'Member ID',
            selector: row => row.id,
            sortable: true,
            center: "true",
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            center: "true",
        },
        {
            name: 'Plan',
            selector: row => row.plan,
            sortable: true,
            center: "true",
        },
        {
            name: 'Is Active',
            selector: row => row.is_active ? 'Yes' : 'No',
            sortable: true,
            center: "true",
        },
        {
            name: 'Un Paid Fine',
            selector: row => row.unpaid_fine,
            sortable: true,
            center: "true",
        },
        {
            name: 'Action',
            center: "true",
            cell: row => (
                <div className="btn-group w-100" role="group">
                    <button type="button" onClick={() => handleViewMember(row)} className="btn btn-info me-1"><i className="bi bi-eye-fill"></i></button>
                    <button type="button" onClick={() => handleEditMember(row)} className="btn btn-warning me-1"><i className="bi bi-pencil-square"></i></button>
                    <button type="button" onClick={() => handleDelete(row.id)} className="btn btn-danger"><i className="bi bi-trash3-fill"></i></button>
                </div>
            ),
        },
    ];
    return (
        <Container fluid className='content-container pb-3 w-100 m-0 px-0'>
            {members.length > 0 ? (
                <>
                    <Container fluid className='m-0 p-0 d-flex justify-content-center flex-wrap'>
                        <Row className="shadow rounded mx-2 mt-2">
                            <Row className="text-center">
                                <p className='fs-4'>MEMBER DASHBOARD</p>
                            </Row>
                            <hr />
                            {pageLoading && <p>Loading...</p>}
                            {error && <p>{error}</p>}
                            <Row className="w-100 dashboard">
                                {!pageLoading && !error && memberDashboardData.map((data, index) => (
                                    <DashboardCard
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
                                                data={filteredMembers}
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
                            <Col lg={3} className="recent-members  mt-3 mt-lg-0">
                                <Card className='pb-0'>
                                    <Card.Header className='d-flex justify-content-between'>
                                        <button type='button' onClick={handleCreateMember} className='btn btn-success px-3 w-100 py-1'>
                                            <i className="bi bi-journal-plus fs-5 me-2"></i> New Member
                                        </button>
                                    </Card.Header>
                                    <Card.Body className='pb-1'>
                                        <h5 className='text-center'>Recent Member</h5>
                                        <hr />
                                        <Table responsive striped bordered>
                                            <thead className='text-center'>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {recentMembers.map(member => (
                                                    <tr key={member.id}>
                                                        <td>
                                                            <span className=''>{member.name.slice(0, 15)}</span>
                                                        </td>
                                                        <td>
                                                            <span>{formatDate(member.created_at)}</span>
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
                </>
            ) : (
                    <div className='d-flex justify-content-center mt-lg-5 mt-2 '>
                        <div className='text-center bg-dark text-light p-5 w-75 rounded-5'>
                            <h4>Add Your First Member</h4>
                            <button type='button' onClick={handleCreateMember} className='btn btn-primary w-100 px-3 py-1 mt-4'>
                                <i className="bi bi-journal-plus fs-5 me-2"></i> Add New Member
                            </button>
                        </div>
                    </div>
            )}
            {/* View Book Modal */}
            <Modal show={showViewModal} onHide={handleCloseViewModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Member Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMember && (
                        <div className="card shadow" >
                            <div className="card-header">
                                <h5 className="card-title">{selectedMember.name} - <span className='badge bg-warning text-black'>{selectedMember.plan}</span></h5>
                            </div>
                            <div className="card-body">
                                <div>
                                    <table className='table table-hover table-bordered table-striped-columns'>
                                        <tbody>
                                            <tr>
                                                <td className='fw-bold'>Member Id</td>
                                                <td className='text-center'>{selectedMember.id}</td>
                                            </tr>
                                            <tr>
                                                <td className='fw-bold'>Email Address</td>
                                                <td className='text-center text-capitalize'>{selectedMember.email}</td>
                                            </tr>
                                            <tr>
                                                <td className='fw-bold'>Phone Number</td>
                                                <td className='text-center'>{selectedMember.phone_number}</td>
                                            </tr>
                                            <tr>
                                                <td className='fw-bold'>Gender</td>
                                                <td className='text-center text-capitalize'>{selectedMember.gender}</td>
                                            </tr>
                                            <tr>
                                                <td className='fw-bold'>Phone Number</td>
                                                <td className='text-center'>{selectedMember.phone_number}</td>
                                            </tr>
                                            <tr>
                                                <td className='fw-bold'>Is Active Member?</td>
                                                <td className='text-center text-capitalize'>{selectedMember.is_active ? 'Yes' : 'No'}</td>
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

            {/* Create Member Modal */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Create Member</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreateSubmit}>
                    <Modal.Body>
                        <FloatingLabel controlId="floatingInputName" label="Name" className="mb-3">
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder='Name'
                                required
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInputEmail" label="Email" className="mb-3">
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder='Email'
                                required
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInputPhoneNumber" label="Phone Number" className="mb-3">
                            <Form.Control
                                type="text"
                                name="phone_number"
                                placeholder='Phone Number'
                                required
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInputAddress" label="Address" className="mb-3">
                            <Form.Control
                                type="text"
                                name="address"
                                placeholder='Address'
                                required
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingSelectGender" label="Gender" className="mb-3">
                            <Form.Select name='gender' required>
                                <option value="">Select Gender</option>
                                {genderChoices.map((gender, index) => (
                                    <option key={index} value={gender[0]}>{gender[1]}</option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingSelectPlan" label="Plan" className="mb-3">
                            <Form.Select name='plan' required>
                                <option value="">Select Plan</option>
                                {planChoices.map((plan, index) => (
                                    <option key={index} value={plan[0]}>{plan[1]}</option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseCreateModal}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            {/* Edit Member Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Member</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleEditSubmit}>
                    <Modal.Body>
                        {selectedMember && (
                            <>
                                <FloatingLabel controlId="floatingInputName" label="Name" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={selectedMember.name}
                                        onChange={handleInputChange}
                                        placeholder='Name'
                                        required
                                    />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingInputEmail" label="Email" className="mb-3">
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={selectedMember.email}
                                        onChange={handleInputChange}
                                        placeholder='Email'
                                        required
                                    />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingInputPhoneNumber" label="Phone Number" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="phone_number"
                                        value={selectedMember.phone_number}
                                        onChange={handleInputChange}
                                        placeholder='Phone Number'
                                        required
                                    />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingInputAddress" label="Address" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        value={selectedMember.address}
                                        onChange={handleInputChange}
                                        placeholder='Address'
                                        required
                                    />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingSelectGender" label="Gender" className="mb-3">
                                    <Form.Select name='gender' required
                                        value={selectedMember.gender}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Gender</option>
                                        {genderChoices.map((gender, index) => (
                                            <option key={index} value={gender[0]}>{gender[1]}</option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingSelectPlan" label="Plan" className="mb-3">
                                    <Form.Select name='plan' required
                                        value={selectedMember.plan}
                                        onChange={handleInputChange}>
                                        <option value="">Select Plan</option>
                                        {planChoices.map((plan, index) => (
                                            <option key={index} value={plan[0]}>{plan[1]}</option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>
                                <div className='border py-2 px-3 rounded mb-3'>
                                    <Form.Check
                                        type="checkbox"
                                        id="is_active"
                                        name="is_active"
                                        checked={selectedMember.is_active}
                                        onChange={handleInputChange}
                                        label="Is Active ?"
                                    />
                                </div>
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

export default MemberPage
