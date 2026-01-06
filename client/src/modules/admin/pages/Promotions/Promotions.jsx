import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import api from '../../../../api/axiosConfig';
import './Promotions.css';

/* =======================
   ZOD VALIDATION
======================= */
const promotionSchema = z.object({
  code: z.string()
    .min(3, 'Mã giảm giá phải có ít nhất 3 ký tự')
    .max(50, 'Mã giảm giá không được quá 50 ký tự')
    .trim(),

  discount: z.coerce.number()
    .min(1, 'Giảm tối thiểu 1%')
    .max(100, 'Giảm tối đa 100%'),

  expiryDate: z.string()
    .min(1, 'Vui lòng chọn hạn sử dụng'),

  type: z.string(),
  userId: z.string().nullable(),

  quantity: z.coerce.number()
    .min(1, 'Số lượng tối thiểu là 1'),
});

/* =======================
   COMPONENT
======================= */
const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingPromotion, setEditingPromotion] = useState(null);
  const [deletingPromotion, setDeletingPromotion] = useState(null);

  /* PAGINATION */
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  /* FORM */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      code: '',
      discount: 3,
      expiryDate: '',
      type: 'review-reward',
      userId: null,
      quantity: 1
    }
  });

  /* FETCH PROMOTIONS */
  const fetchPromotions = async (pageNumber = page) => {
    try {
      setLoading(true);
      const res = await api.get('/admin/promotions', {
        params: { page: pageNumber, limit }
      });

      setPromotions(res.promotions || []);
      setTotalPages(res.pagination.pages || 1);
    } catch {
      toast.error('Không tải được danh sách khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions(page);
  }, [page]);

  /* MODAL HANDLERS */
  const openCreateModal = () => {
    setEditingPromotion(null);
    reset({
      code: '',
      discount: 3,
      expiryDate: '',
      type: 'review-reward',
      userId: null,
      quantity: 1
    });
    setShowModal(true);
  };

  const openEditModal = (promotion) => {
    setEditingPromotion(promotion);
    reset({
      code: promotion.code,
      discount: promotion.discount,
      expiryDate: promotion.expiryDate?.slice(0, 10),
      type: promotion.type,
      userId: promotion.userId || null,
      quantity: promotion.quantity || 1
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPromotion(null);
    reset();
  };

  /* SUBMIT */
  const onSubmit = async (data) => {
    try {
      if (editingPromotion) {
        await api.put(`/admin/promotions/${editingPromotion._id}`, data);
        toast.success('Cập nhật khuyến mãi thành công');
      } else {
        await api.post('/admin/promotions', data);
        toast.success('Tạo khuyến mãi thành công');
      }

      closeModal();
      fetchPromotions(page);
    } catch (err) {
      toast.error(err.message || 'Có lỗi xảy ra');
    }
  };

  /* DELETE */
  const openDeleteModal = (promotion) => {
    setDeletingPromotion(promotion);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeletingPromotion(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/promotions/${deletingPromotion._id}`);
      toast.success('Xóa khuyến mãi thành công');
      closeDeleteModal();
      fetchPromotions(page);
    } catch {
      toast.error('Xóa thất bại');
    }
  };

  const formatDateVN = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN'); // dd/MM/yyyy
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 fw-bold mb-1">Quản lý Khuyến mãi</h2>
          <p className="text-muted mb-0">Danh sách mã giảm giá trong hệ thống</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <i className="fas fa-plus me-2"></i>Thêm khuyến mãi
        </button>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>Chưa có khuyến mãi nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: 30 }}>#</th>
                    <th>Mã</th>
                    <th>Giảm</th>
                    <th>Số lượng</th>
                    <th>Đối tượng</th>
                    <th>HSD</th>
                    <th className="text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((p, index) => (
                    <tr key={p._id}>
                      <td className="fw-semibold">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td>{p.code}</td>
                      <td>{p.discount}%</td>
                      <td>{p.quantity}</td>
                      <td>{p.userId ? 'Cá nhân' : 'Toàn bộ'}</td>
                      <td>{formatDateVN(p.expiryDate)}</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(p)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => openDeleteModal(p)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(p => p - 1)}>
                &laquo;
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(p => p + 1)}>
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingPromotion ? 'Cập nhật khuyến mãi' : 'Thêm khuyến mãi'}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>

                <div className="modal-body">
                  {/* CODE */}
                  <div className="mb-3">
                    <label className="form-label">Mã</label>
                    <input
                      type="text"
                      className={`form-control ${editingPromotion ? 'bg-light' : ''}`}
                      readOnly={!!editingPromotion}
                      {...register('code')}
                    />
                    {errors.code && <small className="text-danger">{errors.code.message}</small>}
                  </div>

                  {/* DISCOUNT */}
                  <div className="mb-3">
                    <label className="form-label">Giảm (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      min={1}
                      max={100}
                      step={1}
                      onKeyDown={(e) => {
                        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        const paste = e.clipboardData.getData('text');
                        if (!/^\d+$/.test(paste)) {
                          e.preventDefault();
                        }
                      }}
                      {...register('discount', { valueAsNumber: true })}
                    />
                  </div>

                  {/* QUANTITY */}
                  <div className="mb-3">
                    <label className="form-label">Số lượng</label>
                    <input
                      type="number"
                      className="form-control"
                      min={1}
                      step={1}
                      onKeyDown={(e) => {
                        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        const paste = e.clipboardData.getData('text');
                        if (!/^\d+$/.test(paste)) {
                          e.preventDefault();
                        }
                      }}
                      {...register('quantity', { valueAsNumber: true })}
                    />
                  </div>

                  {/* EXPIRY */}
                  <div className="mb-3">
                    <label className="form-label">Hạn sử dụng</label>
                    <input
                      type="date"
                      className="form-control"
                      min={new Date().toISOString().split('T')[0]}
                      {...register('expiryDate')}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingPromotion ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác nhận xóa</h5>
                <button className="btn-close" onClick={closeDeleteModal}></button>
              </div>
              <div className="modal-body">
                Bạn có chắc muốn xóa mã <strong>{deletingPromotion?.code}</strong>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeDeleteModal}>
                  Hủy
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;
