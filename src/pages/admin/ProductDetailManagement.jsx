// src/pages/admin/ProductDetailManagement.jsx

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  sanPhamAdminAPI,
  anhSPAPI,
  bienTheAdminAPI,
  thongSoBienTheMauAPI,
  giaTriThongSoAPI,
  uploadAPI,
  thongSoMauAPI,
  
} from "../../services/adminAPI";
import { loaiSanPhamAPI } from "../../services/api";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Save,
  Image as ImageIcon,
  Power,
  Edit, 
} from "lucide-react";

// Import 2 Modal mới
import VariantModal from "../../components/admin/VariantModal";
import SpecsModal from "../../components/admin/SpecsModal";

const ProductDetailManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const galleryFileInputRef = useRef(null);

  // Data state
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    Ten: "",
    MoTa: "",
    MaLoai: "",
    TinhTrangSanPham: 1,
  });
  const [images, setImages] = useState([]);

  // Variants & Specs Data
  const [variants, setVariants] = useState([]);
  const [variantSpecs, setVariantSpecs] = useState([]); // List thuộc tính mẫu cho biến thể
  const [productSpecs, setProductSpecs] = useState([]); // List thông số kỹ thuật mẫu
  const [productSpecValues, setProductSpecValues] = useState({}); // Giá trị thông số

  // Modal Control State
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [showSpecsModal, setShowSpecsModal] = useState(false);

  useEffect(() => {
    if (id) fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const [productRes, categoriesRes, imagesRes] = await Promise.all([
        sanPhamAdminAPI.getById(id),
        loaiSanPhamAPI.getAll(),
        anhSPAPI.getByProduct(id),
      ]);

      if (productRes.success) {
        const prod = productRes.data;
        setProduct(prod);
        setFormData({
          Ten: prod.Ten,
          MoTa: prod.MoTa || "",
          MaLoai: prod.MaLoai,
          TinhTrangSanPham: prod.TinhTrangSanPham,
        });
        setVariants(prod.variants || []);

        // Load cấu hình nếu có MaLoai
        if (prod.MaLoai) {
          // 1. Thuộc tính biến thể (Màu, ROM...)
          const vSpecsRes = await thongSoBienTheMauAPI.getByCategory(
            prod.MaLoai
          );
          if (vSpecsRes.success) {
            // Deduplicate
            const unique = Array.from(
              new Map(
                vSpecsRes.data.map((s) => [s.MaThongSoBienTheMau, s])
              ).values()
            );
            setVariantSpecs(unique);
          }

          // 2. Thông số kỹ thuật (Màn hình, Pin...)
          const pSpecsRes = await thongSoMauAPI.getByCategory(prod.MaLoai);
          if (pSpecsRes.success) setProductSpecs(pSpecsRes.data);

          // 3. Giá trị thông số đã điền
          const valsRes = await giaTriThongSoAPI.getByProduct(id);
          if (valsRes.success) {
            const map = {};
            valsRes.data.forEach((v) => {
              map[v.MaThongSoMau] = {
                giaTriHienThi: v.GiaTriHienThi,
                giaTriNhap: v.GiaTriNhap,
              };
            });
            setProductSpecValues(map);
          }
        }
      }
      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (imagesRes.success) setImages(imagesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers: Product Basic ---
  const handleSaveProduct = async () => {
    try {
      setSaving(true);
      await sanPhamAdminAPI.update(id, formData);
      alert("Cập nhật thành công!");
      fetchProductDetail();
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Handlers: Gallery ---
  const handleUploadGallery = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      await uploadAPI.uploadAnhSanPham(file, id);
      alert("Upload ảnh thành công!");
      const res = await anhSPAPI.getByProduct(id);
      if (res.success) setImages(res.data);
    } catch (err) {
      alert("Lỗi upload: " + err.message);
    } finally {
      setUploading(false);
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async (maAnh) => {
    if (!confirm("Xóa ảnh này?")) return;
    try {
      await anhSPAPI.delete(maAnh);
      setImages(images.filter((img) => img.MaAnhSP !== maAnh));
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  // --- Handlers: Variants Actions (Delete/Toggle) ---
  const handleDeleteVariant = async (maBienThe) => {
    if (!confirm("Xóa vĩnh viễn biến thể này?")) return;
    try {
      await bienTheAdminAPI.delete(maBienThe);
      fetchProductDetail();
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleToggleVariant = async (maBienThe) => {
    if (!confirm("Đổi trạng thái biến thể?")) return;
    try {
      await bienTheAdminAPI.toggleStatus(maBienThe);
      fetchProductDetail();
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  // --- Helper: Open Modals ---
  const openVariantModal = (variant = null) => {
    setEditingVariant(variant);
    setShowVariantModal(true);
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val || 0);

  if (loading) return <div className="p-10 text-center">Đang tải...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/products")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Chi tiết sản phẩm
            </h1>
            <p className="text-gray-600 mt-1">Mã SP: {id}</p>
          </div>
        </div>
        <button
          onClick={handleSaveProduct}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Info Form */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">Thông tin cơ bản</h2>
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên sản phẩm
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.Ten}
                onChange={(e) =>
                  setFormData({ ...formData, Ten: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <textarea
                rows="4"
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.MoTa}
                onChange={(e) =>
                  setFormData({ ...formData, MoTa: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Loại sản phẩm
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.MaLoai}
                onChange={(e) =>
                  setFormData({ ...formData, MaLoai: e.target.value })
                }
              >
                <option value="">Chọn loại</option>
                {categories.map((c) => (
                  <option key={c.MaLoai} value={c.MaLoai}>
                    {c.TenLoai}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Trạng thái
              </label>
              <select
                className="w-full px-4 py-2 border rounded-lg"
                value={formData.TinhTrangSanPham}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    TinhTrangSanPham: parseInt(e.target.value),
                  })
                }
              >
                <option value={1}>Hoạt động</option>
                <option value={0}>Ngừng hoạt động</option>
              </select>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ảnh sản phẩm</h2>
              <div>
                <input
                  ref={galleryFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadGallery}
                  className="hidden"
                />
                <button
                  onClick={() => galleryFileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" /> Upload
                </button>
              </div>
            </div>
            {images.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {images.map((img) => (
                  <div key={img.MaAnhSP} className="relative group">
                    <img
                      src={img.DuongDanLuuAnh}
                      className="w-full h-32 object-cover rounded-lg"
                      alt="prod"
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
            ) : (
              <p className="text-center text-gray-500 py-8">Chưa có ảnh nào.</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Specs */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Thông số kỹ thuật</h2>
              {formData.MaLoai && (
                <button
                  onClick={() => setShowSpecsModal(true)}
                  className="flex gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Edit className="w-5 h-5" /> Cập nhật
                </button>
              )}
            </div>
            {Object.keys(productSpecValues).length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Chưa có thông số.
              </p>
            ) : (
              <div className="space-y-2">
                {productSpecs.map((spec) => {
                  const val = productSpecValues[spec.MaThongSoMau];
                  if (!val) return null;
                  return (
                    <div
                      key={spec.MaThongSoMau}
                      className="flex justify-between py-2 border-b last:border-0"
                    >
                      <span className="text-gray-600">{spec.TenThongSo}:</span>
                      <span className="font-medium text-gray-900">
                        {val.giaTriHienThi}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Variants */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Biến thể</h2>
              <button
                onClick={() => openVariantModal(null)}
                className="flex gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-5 h-5" /> Thêm biến thể
              </button>
            </div>

            {variants.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Chưa có biến thể.
              </p>
            ) : (
              <div className="space-y-3">
                {variants.map((variant) => (
                  <div
                    key={variant.MaBienThe}
                    className="border p-4 rounded-lg hover:bg-gray-50 flex justify-between items-start"
                  >
                    <div className="flex gap-4">
                      {variant.DuongDanAnhBienThe && (
                        <img
                          src={variant.DuongDanAnhBienThe}
                          className="w-16 h-16 object-cover rounded-lg"
                          alt={variant.TenBienThe}
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{variant.TenBienThe}</h3>
                        <div className="text-sm text-gray-600">
                          <p>
                            Giá:{" "}
                            <span className="font-medium text-green-600">
                              {formatCurrency(variant.GiaTienBienThe)}
                            </span>
                          </p>
                          <p>
                            Kho:{" "}
                            <span
                              className={
                                variant.SoLuongTonKho <= 10
                                  ? "text-red-600"
                                  : ""
                              }
                            >
                              {variant.SoLuongTonKho}
                            </span>
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                            variant.TinhTrangHoatDong === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {variant.TinhTrangHoatDong === 1
                            ? "Hoạt động"
                            : "Ngừng"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleVariant(variant.MaBienThe)}
                        className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg"
                      >
                        <Power className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openVariantModal(variant)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-5 h-5" />{" "}
                        {/* <--- Đã đổi icon thành Edit */}
                      </button>
                      <button
                        onClick={() => handleDeleteVariant(variant.MaBienThe)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render Modals */}
      <VariantModal
        isOpen={showVariantModal}
        onClose={() => setShowVariantModal(false)}
        productId={id}
        variant={editingVariant}
        variantSpecs={variantSpecs}
        onSuccess={fetchProductDetail}
      />

      <SpecsModal
        isOpen={showSpecsModal}
        onClose={() => setShowSpecsModal(false)}
        productId={id}
        specsList={productSpecs}
        existingValues={productSpecValues}
        onSuccess={fetchProductDetail}
      />
    </div>
  );
};

export default ProductDetailManagement;
