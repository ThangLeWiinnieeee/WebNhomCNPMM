import react from 'react';
import './authLayout.css';

const authLayout = ({children}) => {
    return (
        <div className="auth-layout-container">
            <div className="auth-card">
                {children}
            </div>
        </div>
    );
}

export default authLayout;