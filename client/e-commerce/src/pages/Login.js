
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import AppNavBar from '../components/AppNavBar.js';
import Swal2 from 'sweetalert2';
import UserContext from '../UserContext.js';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword1] = useState('');

	const navigate = useNavigate();

	const { user, setUser } = useContext(UserContext);

	const [isDisabled, setIsDisabled] = useState(true);

	const retrieveUserDetails = (token) => {
		fetch(`${process.env.REACT_APP_API_URL}/users/userDetails`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`
			},
		})
			.then(result => result.json())
			.then(data => {
				console.log(data)
				setUser({
					id: data._id,
					isAdmin: data.isAdmin
				});
			})
	}

	useEffect(() => {
		if (email !== '' && password !== '') {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [email, password]);

	function login(event) {
		event.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password
			}),
		})
			.then(result => result.json())
			.then(data => {
				if (data === false) {
					Swal2.fire({
						title: 'Authentication failed!',
						icon: 'error',
						text: 'Check your login details and try again!'
					})
				} else {

					localStorage.setItem('token', data.auth);

					retrieveUserDetails(data.auth)

					Swal2.fire({
						title: 'Login Successful',
						icon: 'success',
						text: 'Welcome to ASTER soda!'
					})

					navigate('/')
				}
			})
	}

	return user.id === null ? (
		<div style={{ backgroundColor: "black", minHeight: '100vh' }}>
			<AppNavBar />
			<Container>
				<Row>
					<Col className='col-6 mx-auto'>
						<h1 className='text-center mt-5' style={{ color: "white" }}>Login</h1>
						<Form onSubmit={event => login(event)}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label style={{ color: "white" }}>Email address</Form.Label>
								<Form.Control type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="Enter email" />
							</Form.Group>

							<Form.Group className="mb-3" controlId="formBasicPassword1">
								<Form.Label style={{ color: "white" }}>Password</Form.Label>
								<Form.Control type="password" value={password} onChange={event => setPassword1(event.target.value)} placeholder="Password" />
							</Form.Group>

							<p style={{ color: "white" }}>No Account yet? <Link to='/register'>Create an account.</Link></p>

							<Button variant="light" type="submit" disabled={isDisabled}>
								Login
							</Button>
						</Form>
					</Col>
				</Row>
			</Container>
		</div>
	) : (

		<Navigate to='/notFound' />

	)
}