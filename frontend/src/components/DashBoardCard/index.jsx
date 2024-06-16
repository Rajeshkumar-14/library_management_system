// DashboardCard.js
import React from 'react';

import book_icon from '../../assests/icons/book_icon.png';
import issued_icon from '../../assests/icons/issued_icon.png';
import members_icon from '../../assests/icons/members_icon.png';
import normal_user_icon from '../../assests/icons/normal_user_icon.png';
import premium_user_icon from '../../assests/icons/premium_user_icon.png';
import student_icon from '../../assests/icons/student_icon.png';
import returned_icon from '../../assests/icons/returned_icon.png';
import not_returned_icon from '../../assests/icons/not_returned_icon.png';

const iconMap = {
    book_icon,
    issued_icon,
    members_icon,
    normal_user_icon,
    premium_user_icon,
    student_icon,
    returned_icon,
    not_returned_icon
};
console.log(iconMap);
const DashboardCard = ({ bgClass, img_name, total, text }) => {
    const icon_img = iconMap[img_name];

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-3">
            <div className={`${bgClass} d-flex justify-content-between rounded-4 py-4 px-5 align-items-center border border-secondary shadow-sm`}>
                <div>
                    <h2 className='dashboard-total-text'>{total}</h2>
                    <span className='dashboard-text'>{text}</span>
                </div>
                <img src={icon_img} alt={text} />
            </div>
        </div>
    );
};

export default DashboardCard;
