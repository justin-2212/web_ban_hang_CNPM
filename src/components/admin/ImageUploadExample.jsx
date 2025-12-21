// src/components/admin/ImageUploadExample.jsx
// 📚 ĐÂY LÀ FILE EXAMPLE - SỬ DỤNG TRONG ADMIN UPLOAD COMPONENT

import { useState } from 'react';
import { uploadAPI } from '../../services/api.js';

/**
 * Component upload ảnh sản phẩm (AnhSP)
 */
export const UploadAnhSanPhamExample = ({ maSP, onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.image.files[0];

    if (!file) {
      setError('Vui lòng chọn ảnh');
      return;
    }

    if (!maSP) {
      setError('Thiếu maSP');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const thuTuHienThi = parseInt(e.target.thuTuHienThi?.value || 0);
      const result = await uploadAPI.uploadAnhSanPham(file, maSP, thuTuHienThi);

      // ✅ Response thành công
      console.log('Upload thành công:', result.data);
      
      // Gọi callback nếu có
      if (onUploadSuccess) {
        onUploadSuccess(result.data);
      }

      // Reset form
      e.target.reset();
      setPreview(null);
    } catch (err) {
      setError(err.message || 'Lỗi khi upload ảnh');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-4">Upload Ảnh Sản Phẩm (AnhSP)</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        {/* Preview */}
        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded"
            />
          </div>
        )}

        {/* File input */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="block w-full text-sm border rounded p-2"
        />

        {/* Thứ tự hiển thị */}
        <input
          type="number"
          name="thuTuHienThi"
          placeholder="Thứ tự hiển thị"
          defaultValue={0}
          className="block w-full px-3 py-2 border rounded"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Đang upload...' : 'Upload Ảnh'}
        </button>
      </form>
    </div>
  );
};

/**
 * Component upload ảnh biến thể (BienThe)
 */
export const UploadAnhBienTheExample = ({ maBienThe, onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.image.files[0];

    if (!file) {
      setError('Vui lòng chọn ảnh');
      return;
    }

    if (!maBienThe) {
      setError('Thiếu maBienThe');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await uploadAPI.uploadAnhBienThe(file, maBienThe);

      console.log('Upload biến thể thành công:', result.data);

      if (onUploadSuccess) {
        onUploadSuccess(result.data);
      }

      e.target.reset();
      setPreview(null);
    } catch (err) {
      setError(err.message || 'Lỗi khi upload ảnh');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-4">Upload Ảnh Biến Thể (BienThe)</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        {/* Preview */}
        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded"
            />
          </div>
        )}

        {/* File input */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="block w-full text-sm border rounded p-2"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Đang upload...' : 'Upload Ảnh'}
        </button>
      </form>
    </div>
  );
};

/**
 * Component upload nhiều ảnh cùng lúc
 */
export const UploadMultipleImagesExample = ({ maSP, onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      setError('Tối đa 10 ảnh');
      return;
    }

    setSelectedFiles(files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
    setError(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setError('Vui lòng chọn ít nhất 1 ảnh');
      return;
    }

    if (!maSP) {
      setError('Thiếu maSP');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await uploadAPI.uploadMultipleImages(selectedFiles, maSP);

      console.log('Upload nhiều ảnh thành công:', result.data);

      if (onUploadSuccess) {
        onUploadSuccess(result.data);
      }

      e.target.reset();
      setPreviews([]);
      setSelectedFiles([]);
    } catch (err) {
      setError(err.message || 'Lỗi khi upload ảnh');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-4">Upload Nhiều Ảnh ({selectedFiles.length} ảnh)</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        {/* Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {previews.map((preview, idx) => (
              <img
                key={idx}
                src={preview}
                alt={`Preview ${idx}`}
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        )}

        {/* Multiple file input */}
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm border rounded p-2"
        />

        <p className="text-sm text-gray-600">Tối đa 10 ảnh, dung lượng mỗi ảnh ≤ 5MB</p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Đang upload...' : `Upload ${selectedFiles.length} Ảnh`}
        </button>
      </form>
    </div>
  );
};
