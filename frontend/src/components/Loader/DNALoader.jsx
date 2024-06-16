import React from 'react';
import { DNA } from 'react-loader-spinner';
import './loader.css';

const DNALoader = () => {
    return (
        <div className="loader-container">
            <DNA
                visible={true}
                height="250"
                width="250"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
            />
        </div>
    );
};

export default DNALoader;
