import React from 'react';
import ResetPassword from '../components/Reset';

const Reset = props => {
    return (
        <div>
            <ResetPassword resetToken={props.query.resetToken} />
        </div>
    );
};

export default Reset;
