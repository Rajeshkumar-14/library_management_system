import React, { useContext } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import useFetchData from '../../hooks/useFetchData';
import AuthContext from '../../context/AuthContext';

const Insight = () => {
    const { pageLoading } = useContext(AuthContext);
    const { inSiteData } = useFetchData(pageLoading);
    console.log("inSiteData", inSiteData);

    const columns = [
        {
            name: 'Book Name',
            selector: row => row.bookName,
            sortable: true,
            center: true,
        },
        {
            name: 'Number Borrowed',
            selector: row => row.numBorrowed,
            sortable: true,
            center: true,

        },
    ];

    return (
        <Container className='bg-white shadow rounded-2'>
            <p className='fs-5 m-0 my-2 text-center'>INSIGHTS</p>
            <Row className='d-flex justify-content-center align-items-center bg-white shadow p-3 rounded-3'>
                <Col lg={4}>
                    <Card className='text-center mt-2 mt-lg-0'>
                        <Card.Header>
                            <Card.Title>Top Books of Week</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <DataTable
                                columns={columns}
                                data={inSiteData.topBooksWeek}
                                responsive
                                highlightOnHover
                                striped
                                customStyles={{
                                    table: {
                                        style: {
                                            maxHeight: '250px',
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
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className='text-center mt-2 mt-lg-0'>
                        <Card.Header>
                            <Card.Title>Top Books of Month</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <DataTable
                                columns={columns}
                                data={inSiteData.topBooksMonth}
                                responsive
                                highlightOnHover
                                striped
                                customStyles={{
                                    table: {
                                        style: {
                                            maxHeight: '250px',
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
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className='text-center mt-2 mt-lg-0'>
                        <Card.Header>
                            <Card.Title>Top Books of All Time</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <DataTable
                                columns={columns}
                                data={inSiteData.topBooksAllTime}
                                responsive
                                highlightOnHover
                                striped
                                customStyles={{
                                    table: {
                                        style: {
                                            maxHeight: '250px',
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
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Insight;
