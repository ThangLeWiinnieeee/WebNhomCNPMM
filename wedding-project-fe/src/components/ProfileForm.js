import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../features/userSlice';
import { Form, Button, Row, Col } from 'react-bootstrap';

const ProfileForm = ({ userId, onClose }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.user);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    bio: ''
  });

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(updateUserProfile({ id: userId, data: formData }));
    if (onClose) onClose(); // đóng form sau khi update
  };

  return (
    <Form onSubmit={handleSubmit} className="card shadow-sm p-4 mb-5">
      <h4 className="mb-4">Edit Profile</h4>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" value={formData.name || ''} onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" value={formData.email || ''} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Phone</Form.Label>
            <Form.Control name="phone" value={formData.phone || ''} onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Avatar URL</Form.Label>
            <Form.Control name="avatar" value={formData.avatar || ''} onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Label>Bio</Form.Label>
        <Form.Control as="textarea" rows={3} name="bio" value={formData.bio || ''} onChange={handleChange} />
      </Form.Group>
      <div className="d-flex justify-content-end">
        <Button variant="secondary" className="me-2" onClick={onClose}>Cancel</Button>
        <Button variant="primary" type="submit">Save & Close</Button>
      </div>
    </Form>
  );
};

export default ProfileForm;