import React, { useState, useEffect } from 'react'; // Added useState import
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link  } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { login } from '../actions/authActions'; // Import login action

function Login() {
    const { isAuthenticated } = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(formData));
    };
    
    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="text-center mb-4">Login</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">
                                        Login
                                    </button>
                                    <p className="mt-3 text-center">
                                    If you are not registered?{' '} please {' '} 
                                    <Link to="/register" className="text-primary">
                                        Register
                                    </Link>
                                </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;