import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { 
  fetchCategoriesThunk, 
  createCategoryThunk, 
  updateCategoryThunk, 
  deleteCategoryThunk,
  toggleCategoryStatusThunk 
} from '../thunks/categoryThunks';
import { useNotifications } from '../../contexts/NotificationContext';

/**
 * Custom hook for managing categories (Admin)
 * @returns {Object} Categories state and methods
 */
export const useCategories = () => {
  const dispatch = useDispatch();
  const { addNotification } = useNotifications();
  
  const [state, setState] = useState({
    categories: [],
    loading: true,
    error: null,
    editingCategory: null,
    deletingCategory: null
  });

  /**
   * Fetch all categories
   */
  const fetchCategories = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const result = await dispatch(fetchCategoriesThunk()).unwrap();
      setState(prev => ({ 
        ...prev, 
        categories: result, 
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error || 'Lỗi khi tải danh mục', 
        loading: false 
      }));
      toast.error(error || 'Lỗi khi tải danh mục');
    }
  }, [dispatch]);

  /**
   * Create new category
   */
  const createCategory = useCallback(async (categoryData) => {
    try {
      await dispatch(createCategoryThunk(categoryData)).unwrap();
      
      toast.success('Tạo danh mục thành công');
      addNotification({
        type: 'create',
        message: 'Tạo danh mục mới',
        details: `Đã tạo danh mục "${categoryData.name}" thành công`
      });
      
      // Refresh categories list
      await fetchCategories();
      
      return true;
    } catch (error) {
      toast.error(error || 'Lỗi khi tạo danh mục');
      return false;
    }
  }, [dispatch, addNotification, fetchCategories]);

  /**
   * Update category
   */
  const updateCategory = useCallback(async (categoryId, categoryData) => {
    try {
      await dispatch(updateCategoryThunk({ categoryId, categoryData })).unwrap();
      
      toast.success('Cập nhật danh mục thành công');
      addNotification({
        type: 'update',
        message: 'Cập nhật danh mục',
        details: `Đã cập nhật danh mục "${categoryData.name}"`
      });
      
      // Refresh categories list
      await fetchCategories();
      
      return true;
    } catch (error) {
      toast.error(error || 'Lỗi khi cập nhật danh mục');
      return false;
    }
  }, [dispatch, addNotification, fetchCategories]);

  /**
   * Delete category
   */
  const deleteCategory = useCallback(async (category) => {
    try {
      await dispatch(deleteCategoryThunk(category._id)).unwrap();
      
      toast.success('Xóa danh mục thành công');
      addNotification({
        type: 'delete',
        message: 'Xóa danh mục',
        details: `Đã xóa danh mục "${category.name}"`
      });
      
      // Refresh categories list
      await fetchCategories();
      
      return true;
    } catch (error) {
      toast.error(error || 'Lỗi khi xóa danh mục');
      return false;
    }
  }, [dispatch, addNotification, fetchCategories]);

  /**
   * Toggle category active status
   */
  const toggleCategoryStatus = useCallback(async (category) => {
    try {
      const newIsActive = !category.isActive;
      await dispatch(toggleCategoryStatusThunk({ 
        categoryId: category._id, 
        isActive: newIsActive 
      })).unwrap();
      
      const newStatus = newIsActive ? 'hoạt động' : 'tạm ngưng';
      toast.success(`Đã chuyển danh mục sang trạng thái ${newStatus}`);
      
      addNotification({
        type: 'toggle',
        message: 'Thay đổi trạng thái danh mục',
        details: `Đã chuyển danh mục "${category.name}" sang trạng thái ${newStatus}`
      });
      
      // Refresh categories list
      await fetchCategories();
      
      return true;
    } catch (error) {
      toast.error(error || 'Lỗi khi cập nhật trạng thái danh mục');
      return false;
    }
  }, [dispatch, addNotification, fetchCategories]);

  /**
   * Set category being edited
   */
  const setEditingCategory = useCallback((category) => {
    setState(prev => ({ ...prev, editingCategory: category }));
  }, []);

  /**
   * Set category being deleted
   */
  const setDeletingCategory = useCallback((category) => {
    setState(prev => ({ ...prev, deletingCategory: category }));
  }, []);

  /**
   * Clear editing/deleting state
   */
  const clearSelection = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      editingCategory: null, 
      deletingCategory: null 
    }));
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    // State
    categories: state.categories,
    loading: state.loading,
    error: state.error,
    editingCategory: state.editingCategory,
    deletingCategory: state.deletingCategory,
    
    // Methods
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    setEditingCategory,
    setDeletingCategory,
    clearSelection
  };
};
