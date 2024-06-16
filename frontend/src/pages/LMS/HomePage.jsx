import React, { useContext, useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import DashBoardCard from '../../components/DashBoardCard';
import AuthContext from '../../context/AuthContext';
import './LMS-style.css';
import useFetchData from '../../hooks/useFetchData';
import QuickLink from '../../components/QuickLink/QuickLink';
import Insight from '../../components/Insight/Insight';

const HomePage = () => {
    const { pageLoading } = useContext(AuthContext);
    const { dashboardData} = useFetchData(pageLoading);
    const [error, setError] = useState(null);

    return (
        <Container fluid className='content-container py-3 w-100'>
            <Container fluid>
                <Row className="shadow rounded mx-2 mt-2">
                    <Row className="text-center">
                        <p className='fs-4'>HOME DASHBOARD</p>
                    </Row>
                    <hr />
                    {pageLoading && <p>Loading...</p>}
                    {error && <p>{error}</p>}
                    <Row className="w-100 dashboard">
                        {!pageLoading && !error && dashboardData.map((data, index) => (
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
                <Row>
                    <QuickLink />
                </Row>
                <Row>
                    <Insight />
                </Row>
            </Container>
        </Container>
    );
};

export default HomePage;
