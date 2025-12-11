import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { uploadImageThunk, uploadAvatarThunk } from '../thunks/uploadThunks';

/**
 * Custom hook for handling image uploads
 * @param {Object} options - Configuration options
 * @param {string} options.type - Upload type: 'image' or 'avatar'
 * @param {Function} options.onSuccess - Callback when upload succeeds
 * @param {Function} options.onError - Callback when upload fails
 * @returns {Object} Upload state and methods
 */
export const useUpload = (options = {}) => {
  const { type = 'image', onSuccess, onError } = options;
  const dispatch = useDispatch();
  
  const [uploadState, setUploadState] = useState({
    uploading: false,
    selectedFile: null,
    previewUrl: null,
    error: null,
    uploadedUrl: null
  });

  /**
   * Validate file type and size
   */
  const validateFile = useCallback((file) => {
    if (!file) {
      return 'Vui lòng chọn file ảnh';
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF, WEBP)';
    }

    if (file.size > 5 * 1024 * 1024) {
      return 'Kích thước ảnh không được vượt quá 5MB';
    }

    return null;
  }, []);

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback((file) => {
    const error = validateFile(file);
    
    if (error) {
      toast.error(error);
      setUploadState(prev => ({
        ...prev,
        error,
        selectedFile: null,
        previewUrl: null
      }));
      return false;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadState(prev => ({
        ...prev,
        selectedFile: file,
        previewUrl: reader.result,
        error: null
      }));
    };
    reader.readAsDataURL(file);

    return true;
  }, [validateFile]);

  /**
   * Handle file input change event
   */
  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  /**
   * Upload the selected file
   */
  const uploadFile = useCallback(async () => {
    if (!uploadState.selectedFile) {
      toast.error('Vui lòng chọn file ảnh');
      return null;
    }

    try {
      setUploadState(prev => ({ ...prev, uploading: true, error: null }));

      const thunk = type === 'avatar' ? uploadAvatarThunk : uploadImageThunk;
      const result = await dispatch(thunk(uploadState.selectedFile)).unwrap();

      const uploadedUrl = typeof result === 'string' ? result : result.avatar || result.url;

      setUploadState(prev => ({
        ...prev,
        uploading: false,
        uploadedUrl,
        selectedFile: null
      }));

      toast.success('Tải ảnh lên thành công!');
      
      if (onSuccess) {
        onSuccess(uploadedUrl, result);
      }

      return uploadedUrl;
    } catch (error) {
      setUploadState(prev => ({
        ...prev,
        uploading: false,
        error: error || 'Lỗi khi tải ảnh lên'
      }));

      toast.error(error || 'Lỗi khi tải ảnh lên');
      
      if (onError) {
        onError(error);
      }

      return null;
    }
  }, [dispatch, uploadState.selectedFile, type, onSuccess, onError]);

  /**
   * Clear selected file and preview
   */
  const clearFile = useCallback(() => {
    setUploadState({
      uploading: false,
      selectedFile: null,
      previewUrl: null,
      error: null,
      uploadedUrl: null
    });
  }, []);

  /**
   * Set preview URL directly (useful for existing images)
   */
  const setPreviewUrl = useCallback((url) => {
    setUploadState(prev => ({
      ...prev,
      previewUrl: url
    }));
  }, []);

  return {
    // State
    uploading: uploadState.uploading,
    selectedFile: uploadState.selectedFile,
    previewUrl: uploadState.previewUrl,
    error: uploadState.error,
    uploadedUrl: uploadState.uploadedUrl,
    
    // Methods
    handleFileSelect,
    handleFileChange,
    uploadFile,
    clearFile,
    setPreviewUrl,
    validateFile
  };
};
