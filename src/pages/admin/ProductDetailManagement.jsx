// src/pages/admin/ProductDetailManagement.jsx

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  sanPhamAdminAPI, 
  anhSPAPI, 
  bienTheAdminAPI,
  thongSoBienTheMauAPI,
  giaTriBienTheAPI,
  uploadAPI,
  thongSoMauAPI,
  giaTriThongSoAPI
} from '../../services/adminAPI';
import { loaiSanPhamAPI } from '../../services/api';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Upload,
  X,
  Save,
  Image as ImageIcon,
  Power
} from 'lucide-react';

const ProductDetailManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // File input refs
  const galleryFileInputRef = useRef(null);
  const variantFileInputRef = useRef(null);
  
  // Product data
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    Ten: '',
    MoTa: '',
    MaLoai: '',
    TinhTrangSanPham: 1
  });

  // Images
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState(['']);

  // Variants
  const [variants, setVariants] = useState([]);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [variantSpecs, setVariantSpecs] = useState([]);
  
  // Product Specs (Thông số kỹ thuật)
  const [productSpecs, setProductSpecs] = useState([]);
  const [productSpecValues, setProductSpecValues] = useState({});
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  
  // Variant form
  const [variantForm, setVariantForm] = useState({
    TenBienThe: '',
    SoLuongTonKho: 0,
    GiaTienBienThe: 0,
    DuongDanAnhBienThe: '',
    ThuTuHienThi: 1,
    TinhTrangHoatDong: 1,
    attributes: {}
  });

  useEffect(() => {
    if (id && id !== 'new') {
      fetchProductDetail();
    } else {
      fetchCategories();
      setLoading(false);
    }
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const [productRes, categoriesRes, imagesRes] = await Promise.all([
        sanPhamAdminAPI.getById(id),
        loaiSanPhamAPI.getAll(),
        anhSPAPI.getByProduct(id)
      ]);

      if (productRes.success) {
        const prod = productRes.data;
        setProduct(prod);
        setFormData({
          Ten: prod.Ten,
          MoTa: prod.MoTa || '',
          MaLoai: prod.MaLoai,
          TinhTrangSanPham: prod.TinhTrangSanPham
        });
        setVariants(prod.variants || []);
        
        // Load variant specs for this category
        if (prod.MaLoai) {
          const specsRes = await thongSoBienTheMauAPI.getByCategory(prod.MaLoai);
          if (specsRes.success) {
            // Dedupe at frontend as safety layer
            const uniqueSpecs = Array.from(
              new Map(
                specsRes.data.map(s => [s.MaThongSoBienTheMau, s])
              ).values()
            );
            setVariantSpecs(uniqueSpecs);
          }

          // Load product specs (ThongSoMau)
          const productSpecsRes = await thongSoMauAPI.getByCategory(prod.MaLoai);
          if (productSpecsRes.success) {
            setProductSpecs(productSpecsRes.data);
          }

          // Load existing spec values
          const specValuesRes = await giaTriThongSoAPI.getByProduct(id);
          if (specValuesRes.success) {
            // Dedupe by MaThongSoMau (take last value if duplicate)
            const valuesMap = {};
            specValuesRes.data.forEach(spec => {
              // Only set if not already exist or overwrite with latest
              if (!valuesMap[spec.MaThongSoMau] || 
                  spec.GiaTriHienThi !== valuesMap[spec.MaThongSoMau].giaTriHienThi) {
                valuesMap[spec.MaThongSoMau] = {
                  giaTriHienThi: spec.GiaTriHienThi,
                  giaTriNhap: spec.GiaTriNhap
                };
              }
            });
            setProductSpecValues(valuesMap);
          }
        }
      }

      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (imagesRes.success) setImages(imagesRes.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      alert('Lỗi tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await loaiSanPhamAPI.getAll();
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSaveProduct = async () => {
    if (!formData.Ten || !formData.MaLoai) {
      alert('Vui lòng nhập đầy đủ thông tin sản phẩm');
      return;
    }

    try {
      setSaving(true);
      let productId = id;

      if (id === 'new') {
        // Create new product
        const res = await sanPhamAdminAPI.create(formData);
        if (res.success) {
          productId = res.data.maSP;
          alert('Tạo sản phẩm thành công!');
          navigate(`/admin/products/${productId}`);
        }
      } else {
        // Update existing product
        const res = await sanPhamAdminAPI.update(id, formData);
        if (res.success) {
          alert('Cập nhật sản phẩm thành công!');
        }
      }

      // Save images
      for (const url of imageUrls) {
        if (url && url.trim()) {
          await anhSPAPI.create({
            maSP: productId,
            duongDanLuuAnh: url.trim(),
            thuTuHienThi: images.length + 1
          });
        }
      }

      fetchProductDetail();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteImage = async (maAnhSP) => {
    if (!confirm('⚠️ Xóa vĩnh viễn ảnh này? KHÔNG THỂ KHÔI PHỤC!')) return;
    try {
      await anhSPAPI.delete(maAnhSP);
      setImages(images.filter(img => img.MaAnhSP !== maAnhSP));
    } catch (err) {
      alert('Lỗi xóa ảnh: ' + err.message);
    }
  };

  const handleAddImageField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleRemoveImageField = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  // Upload gallery image
  const handleUploadGalleryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (id === 'new') {
      alert('Vui lòng lưu sản phẩm trước khi upload ảnh');
      return;
    }

    try {
      setUploading(true);
      const response = await uploadAPI.uploadAnhSanPham(file, id);
      if (response.success) {
        alert('Upload ảnh thành công!');
        // Refresh images
        const imagesRes = await anhSPAPI.getByProduct(id);
        if (imagesRes.success) setImages(imagesRes.data);
      }
    } catch (err) {
      alert('Lỗi upload: ' + err.message);
    } finally {
      setUploading(false);
      if (galleryFileInputRef.current) {
        galleryFileInputRef.current.value = '';
      }
    }
  };

  // Upload variant image
  const handleUploadVariantImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!editingVariant || !editingVariant.MaBienThe) {
      alert('Vui lòng lưu biến thể trước khi upload ảnh');
      return;
    }

    try {
      setUploading(true);
      const response = await uploadAPI.uploadAnhBienThe(file, editingVariant.MaBienThe);
      if (response.success) {
        alert('Upload ảnh biến thể thành công!');
        setVariantForm(prev => ({
          ...prev,
          DuongDanAnhBienThe: response.data.duongDanAnhBienThe
        }));
        // Refresh variants
        const productRes = await sanPhamAdminAPI.getById(id);
        if (productRes.success) {
          setVariants(productRes.data.variants || []);
        }
      }
    } catch (err) {
      alert('Lỗi upload: ' + err.message);
    } finally {
      setUploading(false);
      if (variantFileInputRef.current) {
        variantFileInputRef.current.value = '';
      }
    }
  };

  const handleOpenVariantModal = (variant = null) => {
    if (variant) {
      setEditingVariant(variant);
      setVariantForm({
        TenBienThe: variant.TenBienThe,
        SoLuongTonKho: variant.SoLuongTonKho,
        GiaTienBienThe: variant.GiaTienBienThe,
        DuongDanAnhBienThe: variant.DuongDanAnhBienThe || '',
        ThuTuHienThi: variant.ThuTuHienThi,
        TinhTrangHoatDong: variant.TinhTrangHoatDong,
        attributes: {}
      });
      
      // Load existing attribute values
      loadVariantAttributes(variant.MaBienThe);
    } else {
      setEditingVariant(null);
      setVariantForm({
        TenBienThe: '',
        SoLuongTonKho: 0,
        GiaTienBienThe: 0,
        DuongDanAnhBienThe: '',
        ThuTuHienThi: variants.length + 1,
        TinhTrangHoatDong: 1,
        attributes: {}
      });
    }
    setShowVariantModal(true);
  };

  const loadVariantAttributes = async (maBienThe) => {
    try {
      const res = await giaTriBienTheAPI.getByVariant(maBienThe);
      if (res.success) {
        const attrs = {};
        res.data.forEach(attr => {
          attrs[attr.MaThongSoBienTheMau] = {
            giaTriHienThi: attr.GiaTriHienThi,
            giaTriNhap: attr.GiaTriNhap
          };
        });
        setVariantForm(prev => ({ ...prev, attributes: attrs }));
      }
    } catch (err) {
      console.error('Error loading attributes:', err);
    }
  };

  const handleSaveVariant = async (e) => {
    e.preventDefault();
    
    if (!variantForm.TenBienThe || !variantForm.GiaTienBienThe) {
      alert('Vui lòng nhập đầy đủ thông tin biến thể');
      return;
    }

    try {
      const variantData = {
        maSP: id,
        tenBienThe: variantForm.TenBienThe,
        soLuongTonKho: variantForm.SoLuongTonKho,
        giaTienBienThe: variantForm.GiaTienBienThe,
        duongDanAnhBienThe: variantForm.DuongDanAnhBienThe,
        thuTuHienThi: variantForm.ThuTuHienThi,
        tinhTrangHoatDong: variantForm.TinhTrangHoatDong
      };

      let variantId;
      if (editingVariant) {
        await bienTheAdminAPI.update(editingVariant.MaBienThe, variantData);
        variantId = editingVariant.MaBienThe;
      } else {
        const res = await bienTheAdminAPI.create(variantData);
        variantId = res.data.maBienThe;
      }

      // Save attributes - use UPSERT to handle both create and update
      for (const [maThongSo, value] of Object.entries(variantForm.attributes)) {
        // Only save if at least one value is provided
        const giaTriHienThi = (value.giaTriHienThi || value.giaTriNhap || '').trim();
        const giaTriNhap = (value.giaTriNhap || value.giaTriHienThi || '').trim();
        
        if (giaTriHienThi && giaTriNhap) {
          await giaTriBienTheAPI.create({
            maBienThe: variantId,
            maThongSoBienTheMau: parseInt(maThongSo),
            giaTriHienThi: giaTriHienThi,
            giaTriNhap: giaTriNhap,
            thuTuHienThi: 1
          });
        }
      }

      alert(editingVariant ? 'Cập nhật biến thể thành công' : 'Thêm biến thể thành công');
      setShowVariantModal(false);
      fetchProductDetail();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDeleteVariant = async (maBienThe) => {
    if (!confirm('⚠️ Xóa vĩnh viễn biến thể này? KHÔNG THỂ KHÔI PHỤC!')) return;
    try {
      await bienTheAdminAPI.delete(maBienThe);
      fetchProductDetail();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleToggleVariantStatus = async (maBienThe, currentStatus) => {
    const action = currentStatus === 1 ? 'vô hiệu hóa' : 'kích hoạt';
    if (!confirm(`Bạn có chắc muốn ${action} biến thể này?`)) return;
    try {
      await bienTheAdminAPI.toggleStatus(maBienThe);
      alert(`${action.charAt(0).toUpperCase() + action.slice(1)} biến thể thành công!`);
      fetchProductDetail();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  // ==================== PRODUCT SPECS HANDLERS ====================
  const handleOpenSpecsModal = () => {
    if (id === 'new') {
      alert('Vui lòng lưu sản phẩm trước khi thêm thông số kỹ thuật');
      return;
    }
    if (!formData.MaLoai) {
      alert('Vui lòng chọn loại sản phẩm trước');
      return;
    }
    setShowSpecsModal(true);
  };

  const handleSpecValueChange = (maThongSoMau, field, value) => {
    setProductSpecValues(prev => ({
      ...prev,
      [maThongSoMau]: {
        ...prev[maThongSoMau],
        [field]: value
      }
    }));
  };

  const handleSaveSpecs = async () => {
    try {
      // Get unique entries only (dedupe by maThongSoMau)
      const uniqueEntries = new Map();
      Object.entries(productSpecValues).forEach(([maThongSoMau, values]) => {
        if (values.giaTriHienThi && values.giaTriNhap) {
          uniqueEntries.set(parseInt(maThongSoMau), values);
        }
      });

      // Save all unique spec values
      for (const [maThongSoMau, values] of uniqueEntries) {
        await giaTriThongSoAPI.upsert({
          maSP: id,
          maThongSoMau: maThongSoMau,
          giaTriHienThi: values.giaTriHienThi.trim(),
          giaTriNhap: values.giaTriNhap.trim()
        });
      }

      alert('Lưu thông số kỹ thuật thành công!');
      setShowSpecsModal(false);
      fetchProductDetail();
    } catch (err) {
      alert('Lỗi: ' + err.message);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {id === 'new' ? 'Thêm sản phẩm mới' : 'Chi tiết sản phẩm'}
            </h1>
            <p className="text-gray-600 mt-1">
              {id === 'new' ? 'Tạo sản phẩm mới cho cửa hàng' : `Mã SP: ${id}`}
            </p>
          </div>
        </div>
        <button
          onClick={handleSaveProduct}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Product Info */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Thông tin cơ bản</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.Ten}
                  onChange={(e) => setFormData({ ...formData, Ten: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  value={formData.MoTa}
                  onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại sản phẩm <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.MaLoai}
                  onChange={(e) => setFormData({ ...formData, MaLoai: e.target.value })}
                  required
                >
                  <option value="">Chọn loại</option>
                  {categories.map(cat => (
                    <option key={cat.MaLoai} value={cat.MaLoai}>
                      {cat.TenLoai}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.TinhTrangSanPham}
                  onChange={(e) => setFormData({ ...formData, TinhTrangSanPham: parseInt(e.target.value) })}
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Ngừng hoạt động</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Ảnh sản phẩm (Gallery)</h2>
              {id !== 'new' && (
                <>
                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUploadGalleryImage}
                    className="hidden"
                  />
                  <button
                    onClick={() => galleryFileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Đang upload...' : 'Upload ảnh'}
                  </button>
                </>
              )}
            </div>
            
            {/* Existing Images */}
            {images.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-3">
                {images.map((img) => (
                  <div key={img.MaAnhSP} className="relative group">
                    <img
                      src={img.DuongDanLuuAnh}
                      alt="Product"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleDeleteImage(img.MaAnhSP)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {id === 'new' && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Vui lòng lưu sản phẩm trước khi upload ảnh</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Variants & Specs */}
        <div className="space-y-6">
          {/* Product Specs Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Thông số kỹ thuật</h2>
              {id !== 'new' && formData.MaLoai && (
                <button
                  onClick={handleOpenSpecsModal}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="w-5 h-5" />
                  Thêm thông số
                </button>
              )}
            </div>

            {id === 'new' ? (
              <div className="text-center py-8 text-gray-500">
                <p>Vui lòng lưu sản phẩm trước</p>
              </div>
            ) : !formData.MaLoai ? (
              <div className="text-center py-8 text-gray-500">
                <p>Vui lòng chọn loại sản phẩm trước</p>
              </div>
            ) : Object.keys(productSpecValues).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Chưa có thông số kỹ thuật</p>
              </div>
            ) : (
              <div className="space-y-2">
                {productSpecs.map(spec => {
                  const value = productSpecValues[spec.MaThongSoMau];
                  if (!value) return null;
                  return (
                    <div key={spec.MaThongSoMau} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{spec.TenThongSo}:</span>
                      <span className="font-medium text-gray-900">
                        {value.giaTriHienThi}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Variants Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Biến thể sản phẩm</h2>
              {id !== 'new' && (
                <button
                  onClick={() => handleOpenVariantModal()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-5 h-5" />
                  Thêm biến thể
                </button>
              )}
            </div>

            {id === 'new' ? (
              <div className="text-center py-12 text-gray-500">
                <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p>Vui lòng lưu sản phẩm trước khi thêm biến thể</p>
              </div>
            ) : variants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Chưa có biến thể nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {variants.map((variant) => (
                  <div
                    key={variant.MaBienThe}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        {variant.DuongDanAnhBienThe && (
                          <img
                            src={variant.DuongDanAnhBienThe}
                            alt={variant.TenBienThe}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{variant.TenBienThe}</h3>
                          <div className="text-sm text-gray-600 mt-1">
                            <p>Giá: <span className="font-medium text-green-600">{formatCurrency(variant.GiaTienBienThe)}</span></p>
                            <p>Tồn kho: <span className={variant.SoLuongTonKho <= 10 ? 'text-red-600' : 'text-gray-900'}>{variant.SoLuongTonKho}</span></p>
                          </div>
                          <div className="mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${variant.TinhTrangHoatDong === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {variant.TinhTrangHoatDong === 1 ? 'Hoạt động' : 'Ngừng'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleVariantStatus(variant.MaBienThe, variant.TinhTrangHoatDong)}
                          className={`p-2 rounded-lg ${
                            variant.TinhTrangHoatDong === 1 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                          title={variant.TinhTrangHoatDong === 1 ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        >
                          <Power className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleOpenVariantModal(variant)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Chỉnh sửa"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVariant(variant.MaBienThe)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Variant Modal */}
      {showVariantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">
                {editingVariant ? 'Chỉnh sửa biến thể' : 'Thêm biến thể mới'}
              </h2>
              <button onClick={() => setShowVariantModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveVariant} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên biến thể <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={variantForm.TenBienThe}
                  onChange={(e) => setVariantForm({ ...variantForm, TenBienThe: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá tiền <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={variantForm.GiaTienBienThe}
                    onChange={(e) => setVariantForm({ ...variantForm, GiaTienBienThe: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tồn kho
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={variantForm.SoLuongTonKho}
                    onChange={(e) => setVariantForm({ ...variantForm, SoLuongTonKho: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh biến thể
                </label>
                
                {/* Preview current image */}
                {variantForm.DuongDanAnhBienThe && (
                  <div className="mb-2">
                    <img 
                      src={variantForm.DuongDanAnhBienThe} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
                
                {/* Upload button */}
                <div className="flex gap-2">
                  <input
                    ref={variantFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUploadVariantImage}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => variantFileInputRef.current?.click()}
                    disabled={uploading || !editingVariant}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Đang upload...' : 'Upload ảnh'}
                  </button>
                  {!editingVariant && (
                    <span className="text-xs text-gray-500 self-center">
                      (Vui lòng lưu biến thể trước)
                    </span>
                  )}
                </div>
              </div>

              {/* Variant Attributes */}
              {variantSpecs.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Thuộc tính biến thể</h3>
                  <div className="space-y-4">
                    {/* Deduplicate specs by MaThongSoBienTheMau */}
                    {Array.from(
                      new Map(
                        variantSpecs.map(spec => [spec.MaThongSoBienTheMau, spec])
                      ).values()
                    ).map((spec) => {
                      const isColorSpec = spec.TenThongSoBienThe.toLowerCase().includes('màu');
                      
                      return (
                        <div key={spec.MaThongSoBienTheMau}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {spec.TenThongSoBienThe} {spec.DonVi && `(${spec.DonVi})`}
                          </label>
                          
                          {isColorSpec ? (
                            // Color picker for color attributes (compact single line)
                            <div className="space-y-2">
                              <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-lg"
                                placeholder="Tên màu hiển thị (vd: Titan Sa Mạc)"
                                value={variantForm.attributes[spec.MaThongSoBienTheMau]?.giaTriHienThi || ''}
                                onChange={(e) => setVariantForm({
                                  ...variantForm,
                                  attributes: {
                                    ...variantForm.attributes,
                                    [spec.MaThongSoBienTheMau]: {
                                      ...variantForm.attributes[spec.MaThongSoBienTheMau],
                                      giaTriHienThi: e.target.value
                                    }
                                  }
                                })}
                              />
                              <div className="flex gap-2 items-center">
                                <input
                                  type="color"
                                  className="w-12 h-10 border rounded cursor-pointer"
                                  value={variantForm.attributes[spec.MaThongSoBienTheMau]?.giaTriNhap || '#000000'}
                                  onChange={(e) => setVariantForm({
                                    ...variantForm,
                                    attributes: {
                                      ...variantForm.attributes,
                                      [spec.MaThongSoBienTheMau]: {
                                        ...variantForm.attributes[spec.MaThongSoBienTheMau],
                                        giaTriNhap: e.target.value
                                      }
                                    }
                                  })}
                                />
                                <input
                                  type="text"
                                  className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm"
                                  placeholder="Mã hex (vd: #FF0000)"
                                  value={variantForm.attributes[spec.MaThongSoBienTheMau]?.giaTriNhap || ''}
                                  onChange={(e) => {
                                    let value = e.target.value.trim();
                                    if (value && !value.startsWith('#')) value = '#' + value;
                                    setVariantForm({
                                      ...variantForm,
                                      attributes: {
                                        ...variantForm.attributes,
                                        [spec.MaThongSoBienTheMau]: {
                                          ...variantForm.attributes[spec.MaThongSoBienTheMau],
                                          giaTriNhap: value
                                        }
                                      }
                                    });
                                  }}
                                  pattern="^#[0-9A-Fa-f]{6}$"
                                />
                                {variantForm.attributes[spec.MaThongSoBienTheMau]?.giaTriNhap && (
                                  <div 
                                    className="w-10 h-10 rounded border-2"
                                    style={{ backgroundColor: variantForm.attributes[spec.MaThongSoBienTheMau]?.giaTriNhap }}
                                    title="Preview"
                                  />
                                )}
                              </div>
                            </div>
                          ) : (
                            // Normal input for other attributes
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                className="px-4 py-2 border rounded-lg"
                                placeholder="Giá trị hiển thị (vd: 256 GB)"
                                value={variantForm.attributes[spec.MaThongSoBienTheMau]?.giaTriHienThi || ''}
                                onChange={(e) => setVariantForm({
                                  ...variantForm,
                                  attributes: {
                                    ...variantForm.attributes,
                                    [spec.MaThongSoBienTheMau]: {
                                      ...variantForm.attributes[spec.MaThongSoBienTheMau],
                                      giaTriHienThi: e.target.value
                                    }
                                  }
                                })}
                              />
                              <input
                                type="text"
                                className="px-4 py-2 border rounded-lg"
                                placeholder="Giá trị nhập (vd: 256)"
                                value={variantForm.attributes[spec.MaThongSoBienTheMau]?.giaTriNhap || ''}
                                onChange={(e) => setVariantForm({
                                  ...variantForm,
                                  attributes: {
                                    ...variantForm.attributes,
                                    [spec.MaThongSoBienTheMau]: {
                                      ...variantForm.attributes[spec.MaThongSoBienTheMau],
                                      giaTriNhap: e.target.value
                                    }
                                  }
                                })}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowVariantModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingVariant ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Specs Modal */}
      {showSpecsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Thông số kỹ thuật</h3>
                <button
                  onClick={() => setShowSpecsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Nhập thông tin kỹ thuật hiển thị cho khách hàng
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {productSpecs.map(spec => (
                  <div key={spec.MaThongSoMau} className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {spec.TenThongSo}
                      {spec.DonVi && <span className="text-gray-500 ml-1">({spec.DonVi})</span>}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder={`Giá trị hiển thị (vd: 6.1 ${spec.DonVi || ''})`}
                          value={productSpecValues[spec.MaThongSoMau]?.giaTriHienThi || ''}
                          onChange={(e) => handleSpecValueChange(spec.MaThongSoMau, 'giaTriHienThi', e.target.value)}
                        />
                        <span className="text-xs text-gray-500 mt-1 block">Hiển thị cho khách hàng</span>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="Giá trị nhập (vd: 6.1)"
                          value={productSpecValues[spec.MaThongSoMau]?.giaTriNhap || ''}
                          onChange={(e) => handleSpecValueChange(spec.MaThongSoMau, 'giaTriNhap', e.target.value)}
                        />
                        <span className="text-xs text-gray-500 mt-1 block">Dùng để so sánh/tìm kiếm</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowSpecsModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveSpecs}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Lưu thông số
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailManagement;
