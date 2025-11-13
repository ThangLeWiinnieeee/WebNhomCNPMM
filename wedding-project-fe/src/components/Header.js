import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/userSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // xóa profile/token
    navigate('/login'); // chuyển sang trang đăng nhập
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
      <Container>
        <Navbar.Brand href="#">WeddingApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="#">Trang chủ</Nav.Link>
            <Nav.Link href="#">Hồ sơ</Nav.Link>
            <Nav.Link href="#">Sự kiện</Nav.Link>
            <Button 
              variant="outline-danger" 
              className="ms-2"
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;