import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReviewsThunk, deleteReviewThunk } from '../../../../stores/thunks/orderThunks';
import DeleteConfirmModal from '../../components/DeleteConfirmModal/DeleteConfirmModal';
import './Reviews.css';

export default function Reviews() {
  const dispatch = useDispatch();
  const { reviews, reviewPagination, status } = useSelector(state => state.order);
  console.log('Reviews state:', { reviews, reviewPagination, status });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(getReviewsThunk({ page, search }));
  }, [dispatch, page, search]);

  const handleDelete = () => {
    dispatch(deleteReviewThunk(deletingId)).then(() => {
      dispatch(getReviewsThunk({ page, search }));
      setShowDeleteModal(false);
    });
  };

  return (
    <div className="container-fluid py-4 reviews-page">
      {/* Header */}
      <div className="mb-4">
        <h2 className="h3 fw-bold mb-1">Quản lý đánh giá</h2>
        <p className="text-muted mb-0">Danh sách đánh giá của người dùng</p>
      </div>

      {/* Search */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm theo nội dung đánh giá..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {status === 'loading' ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="fas fa-star-half-alt fs-1 mb-3 opacity-50"></i>
              <p>Chưa có đánh giá nào</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: 30 }}>#</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>Đánh giá</th>
                    <th>Bình luận</th>
                    <th>Ảnh</th>
                    <th>Ngày đánh giá</th>
                    <th className="text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r, index) => (
                    <tr key={r._id}>
                      <td>{(page - 1) * reviewPagination.limit + index + 1}</td>
                      <td>
                        <div className="fw-semibold">
                          {r.userId?.fullName || r.userId?.email}
                        </div>
                      </td>
                      <td>
                        {r.orderId?.items?.map((i, index) => (
                          <div key={index}>{i.serviceName}</div>
                        ))}
                      </td>
                      <td>
                        <span className="badge bg-warning text-dark">
                          {r.rating}/5
                        </span>
                      </td>
                      <td className="review-comment">
                        {r.comment}
                      </td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          {r.images?.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="review"
                              style={{ width: '36px', height: '36px' }}
                              className="review-img"
                            />
                          ))}
                        </div>
                      </td>
                      <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            setDeletingId(r._id);
                            setShowDeleteModal(true);
                          }}
                        >
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

      {/* Pagination */}
      {reviewPagination?.pages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">

            {/* Prev */}
            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(p => p - 1)}>
                &laquo;
              </button>
            </li>

            {/* Page numbers */}
            {[...Array(reviewPagination.pages)].map((_, i) => (
              <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            {/* Next */}
            <li className={`page-item ${page === reviewPagination.pages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(p => p + 1)}>
                &raquo;
              </button>
            </li>

          </ul>
        </nav>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          title="Xóa đánh giá"
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        >
          Bạn chắc chắn muốn xóa đánh giá của{' '}
          <strong>
            {reviews.find(r => r._id === deletingId)?.userId?.fullName ||
              reviews.find(r => r._id === deletingId)?.userId?.email}
          </strong>
          ?
        </DeleteConfirmModal>
      )}
    </div>
  );
}
