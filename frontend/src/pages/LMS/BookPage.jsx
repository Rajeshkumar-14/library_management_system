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
import { Container, Row, Col, Form, InputGroup, Card, Table, Modal, Button, FloatingLabel } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
// Components
import DashBoardCard from '../../components/DashBoardCard';
// utils
import { formatDate } from '../../utils/FormatDate';

const BookPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pageLoading, user } = useContext(AuthContext);
    const { createBook, updateBook, deleteBook } = useContext(ManagementContext);
    const { fetchBookData, fetchBook, bookDashboardData, books, categorys, error } = useFetchData(pageLoading);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [recentBooks, setRecentBooks] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        setFilteredBooks(books);
        setRecentBooks(getRecentBooks(books));
    }, [books]);

    useEffect(() => {
        if (location.state?.openCreateModal) {
            setShowCreateModal(true);
            navigate(location.pathname, { replace: true, state: {} }); // Clear state after setting modal to show
        }
    }, [location.state, navigate, location.pathname]);

    const handleCreateSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('created_by', user.id);
        formData.set('is_best_selling', formData.get('is_best_selling') === 'on' ? 'True' : 'False');

        try {
            let response = await createBook(formData);
            if (response.status === 201) {
                await fetchBookData();
                await fetchBook();
                toast.success('Book created successfully!');
                setShowCreateModal(false);
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            toast.error('Failed to create book.');
        }
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('created_by', user.id);

        formData.append('name', selectedBook.name);
        formData.append('author', selectedBook.author);
        formData.append('quantity', selectedBook.quantity);
        formData.append('category', selectedBook.category);
        formData.append('is_best_selling', selectedBook.is_best_selling ? 'True' : 'False');

        const fileInput = event.target.elements.image;
        if (fileInput.files && fileInput.files.length > 0) {
            formData.append('image', fileInput.files[0]);
        } else {
            formData.append('image', selectedBook.image);
        }

        try {
            const bookId = selectedBook.id;
            let response = await updateBook(bookId, formData);
            if (response.status === 200) {
                await fetchBookData();
                await fetchBook();
                toast.success('Book data updated successfully!');
                handleCloseEditModal();
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
            toast.error('Failed to update book data.');
        }
    };

    const handleDelete = async (bookId) => {
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
                    let response = await deleteBook(bookId);
                    if (response.status === 200) {
                        await fetchBookData();
                        await fetchBook();
                        toast.success('Book deleted successfully!');
                    }
                } catch (error) {
                    console.error("Error deleting the book:", error);
                    toast.error('Failed to delete book.');
                }
            }
        });
    };

    const handleFilter = (event) => {
        const query = event.target.value.toLowerCase();
        const filtered = books.filter(book => book.name.toLowerCase().includes(query));
        setFilteredBooks(filtered);
    };

    const getRecentBooks = (books) => {
        return books
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
    };


    const handleViewBook = (book) => {
        setSelectedBook(book);
        setShowViewModal(true);
    };

    const handleEditBook = (book) => {
        setSelectedBook(book);
        setShowEditModal(true);
    };

    const handleCreateBook = () => {
        const fetchCategory = async () => {
            try {
                await fetchCategory();
                console.log("fetching books...");
            } catch (error) {
                console.log(error);
            }
        }
        setShowCreateModal(true);
    };

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setSelectedBook(null);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedBook(null);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setSelectedBook(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const columns = [
        {
            name: 'Book ID',
            selector: row => row.id,
            sortable: true,
            center: "true",
        },
        {
            name: 'Image',
            selector: row => <img src={row.image} alt={row.name} width={60} />,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            center: "true",
        },
        {
            name: 'Author',
            selector: row => row.author,
            sortable: true,
            center: "true",
        },
        {
            name: 'Is Best Selling',
            selector: row => row.is_best_selling ? 'Yes' : 'No',
            sortable: true,
            center: "true",
        },
        {
            name: 'Quantity',
            selector: row => row.quantity,
            sortable: true,
            center: "true",
        },
        {
            name: 'Action',
            center: "true",
            cell: row => (
                <div className="btn-group w-100" role="group">
                    <button type="button" onClick={() => handleViewBook(row)} className="btn btn-info me-1"><i className="bi bi-eye-fill"></i></button>
                    <button type="button" onClick={() => handleEditBook(row)} className="btn btn-warning me-1"><i className="bi bi-pencil-square"></i></button>
                    <button type="button" onClick={() => handleDelete(row.id)} className="btn btn-danger"><i className="bi bi-trash3-fill"></i></button>
                </div>
            ),
        },
    ];

    return (
        <Container fluid className='content-container pb-3 w-100 m-0 px-0'>
            {categorys && categorys.length > 0 ? (
                <Container fluid className='m-0 p-0 d-flex justify-content-center flex-wrap'>
                    {books.length > 0 ? (
                        <>
                            <Row className="shadow rounded mx-2 mt-2">
                                <Row className="text-center">
                                    <p className='fs-4'>BOOK DASHBOARD</p>
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
                            <Row className="mt-4 w-100 ">
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
                                                    data={filteredBooks}
                                                    pagination
                                                    responsive
                                                    highlightOnHover
                                                    striped
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
                                </Col>
                                <Col lg={3} className="recent-books  mt-3 mt-lg-0">
                                    <Card className='pb-0'>
                                        <Card.Header className='d-flex justify-content-between'>
                                            <button type='button' onClick={handleCreateBook} className='btn btn-success px-3 w-100 py-1'>
                                                <i className="bi bi-journal-plus fs-5 me-2"></i> New Book
                                            </button>
                                        </Card.Header>
                                        <Card.Body className='pb-1'>
                                            <h5 className='text-center'>Recent Books</h5>
                                            <hr />
                                            <Table responsive striped bordered>
                                                <thead className='text-center'>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {recentBooks.map(book => (
                                                        <tr key={book.id}>
                                                            <td>
                                                                <span className=''>{book.name.slice(0, 15)}</span>
                                                            </td>
                                                            <td>
                                                                <span>{formatDate(book.created_at)}</span>
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
                                    <h4>Create Your First Book</h4>
                                    <button type='button' onClick={handleCreateBook} className='btn btn-primary w-100 px-3 py-1 mt-4'>
                                        <i className="bi bi-journal-plus fs-5 me-2"></i> Create Book
                                    </button>
                                </div>
                            </div>
                    )}
                </Container>
            ) : (
                <div className='d-flex justify-content-center mt-lg-5 mt-2 '>
                    <div className='text-center bg-dark text-light p-5 w-75 rounded-5'>
                        <h4>Create a Category before Creating a Book</h4>
                    </div>
                </div>
            )}

            {/* View Book Modal */}
            <Modal show={showViewModal} onHide={handleCloseViewModal}>
                <Modal.Header closeButton>
                    <Modal.Title>View Book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBook && (
                        <div className="card shadow" >
                            <img src={selectedBook.image} alt={selectedBook.name} className="card-img-top object-fit-cover" width={450} height={400}  />
                            <div className="card-body">
                                <div>
                                <div className="card-header text-center fw-bold">
                                    {selectedBook.name}
                                </div>
                                    <table className='table table-hover table-bordered'>
                                        <tbody>
                                            <tr>
                                                <td className='fw-bold'>Book Id</td>
                                                <td className='text-center'>{selectedBook.id}</td>
                                            </tr>
                                            <tr>
                                                <td className='fw-bold'>Book Author</td>
                                                <td className='text-center text-capitalize'>{selectedBook.author}</td>
                                            </tr>
                                            <tr>
                                                <td className='fw-bold'>Book Quantity</td>
                                                <td className='text-center'>{selectedBook.quantity}</td>
                                            </tr>
                                            <tr>
                                                <td className='fw-bold'>Is Best Selling</td>
                                                <td className='text-center text-capitalize'>{selectedBook.is_best_selling ? 'Yes' : 'No'}</td>
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
                    <Modal.Title>Create Book</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCreateSubmit}>
                    <Modal.Body>
                        <FloatingLabel controlId="floatingSelect" label="Category Name" className='mb-3'>
                            <Form.Select name='category' required>
                                {categorys.map((category, index) => (
                                    <option key={index} value={category.id}>{category.name}</option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInputName" label="Name" className="mb-3">
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder='Book Name'
                                required
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInputAuthor" label="Author" className="mb-3">
                            <Form.Control
                                type="text"
                                name="author"
                                placeholder='Author Name'
                                required
                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingInputQuantity" label="Quantity" className="mb-3">
                            <Form.Control
                                type="number"
                                name="quantity"
                                placeholder='Quantity'
                                inputMode='numeric'
                                pattern="[0-9]*"
                                required
                            />
                        </FloatingLabel>
                        <div className='border py-2 px-3 rounded mb-3'>
                            <Form.Group controlId="formFile">
                                <Form.Label>Upload Book Image</Form.Label>
                                <Form.Control type="file" name='image' />
                            </Form.Group>
                        </div>
                        <div className='border py-2 px-3 rounded mb-3'>
                            <Form.Group>
                                <Form.Check
                                    type="checkbox"
                                    name="is_best_selling"
                                    label="Best Selling"
                                />
                            </Form.Group>
                        </div>

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
                        {selectedBook && (
                            <>
                                <FloatingLabel controlId="floatingInput" label="Name" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={selectedBook.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingInput" label="Author" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="author"
                                        value={selectedBook.author}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingInput" label="Quantity" className="mb-3">
                                    <Form.Control
                                        type="number"
                                        name="quantity"
                                        value={selectedBook.quantity}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingSelect" label="Select Category" className="mb-3">
                                    <Form.Select
                                        name="category"
                                        value={selectedBook.category}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option>Choose...</option>
                                        {categorys.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </Form.Select>
                                </FloatingLabel>

                                <div className='border py-2 px-3 rounded mb-3'>
                                    <Form.Check
                                        type="checkbox"
                                        id="is_best_selling"
                                        name="is_best_selling"
                                        checked={selectedBook.is_best_selling}
                                        onChange={handleInputChange}
                                        label="Is Best Selling"
                                    />
                                </div>

                                <div className='border py-2 px-3 rounded mb-3'>
                                    <Form.Group controlId="formFile">
                                        <Form.Label>Upload Book Image</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="image"
                                            accept="image/*"
                                            required
                                        />
                                    </Form.Group>
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
    );
};

export default BookPage;
