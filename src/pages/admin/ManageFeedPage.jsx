import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card, CardBody, Typography, Button, Input, Textarea,
    Select, Option, Dialog, DialogHeader, DialogBody, DialogFooter,
    Chip, Tooltip, IconButton, Avatar, Spinner
} from "@material-tailwind/react";
import {
    PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon,
    EyeIcon, InformationCircleIcon, PhotoIcon
} from "@heroicons/react/24/solid";
import PostService from "../../services/postService";
import { toast } from "react-toastify";

const ManageFeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentPost, setCurrentPost] = useState({
        id: "",
        title_postingan: "",
        Thumbnail_postingan: "",
        deskripsi_postingan: "",
        text_postingan: "",
        kategori: "",
        keyword: "",
    });
    const [showFullDescription, setShowFullDescription] = useState({});
    const [imagePreview, setImagePreview] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    // Fetch posts dengan search dan pagination
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await PostService.getPosts(searchTerm);
            setPosts(data.data || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast.error("Gagal memuat postingan");
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchPosts();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    // Modal handlers
    const handleOpen = () => {
        setOpen(!open);
        if (!open) {
            setIsEdit(false);
            setCurrentPost({
                id: "",
                title_postingan: "",
                Thumbnail_postingan: "",
                deskripsi_postingan: "",
                text_postingan: "",
                kategori: "",
                keyword: "",
            });
            setImagePreview("");
            setImageFile(null);
        }
    };

    const handleEdit = (post) => {
        setCurrentPost(post);
        setImagePreview(post.Thumbnail_postingan || "");
        setIsEdit(true);
        setOpen(true);
    };

    // CRUD Operations
    const handleDeleteClick = (post) => {
        setPostToDelete(post);
        setDeleteModalOpen(true);
    };

    const handleImageError = (e) => {
        e.target.src = "https://via.placeholder.com/150";
        console.error("Gambar gagal dimuat:", e.target.src);
    };

    // Format URL gambar dengan benar
    const getImageUrl = (path) => {
        if (!path) return "https://via.placeholder.com/150";

        // Jika sudah full URL, langsung pakai
        if (path.startsWith('http')) return path;

        // Gunakan URL backend langsung
        const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

        // Handle berbagai format path
        if (path.startsWith('/static')) {
            return `${backendUrl}${path}`;
        }

        if (path.startsWith('static/')) {
            return `${backendUrl}/${path}`;
        }

        return `${backendUrl}/static/uploads/feeds/${path.split('/').pop()}`;
    };
    const handleSubmit = async () => {
        if (!currentPost.title_postingan || !currentPost.deskripsi_postingan ||
            !currentPost.text_postingan || !currentPost.kategori || !currentPost.keyword) {
            toast.warning("Semua field wajib diisi kecuali thumbnail");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title_postingan", currentPost.title_postingan);
            formData.append("deskripsi_postingan", currentPost.deskripsi_postingan);
            formData.append("text_postingan", currentPost.text_postingan);
            formData.append("kategori", currentPost.kategori);
            formData.append("keyword", currentPost.keyword);

            if (imageFile) {
                formData.append("thumbnail", imageFile);
            } else if (!isEdit) {
                formData.append("thumbnail", "");
            }

            let response;
            if (isEdit) {
                formData.append("keepExistingImage", !imageFile ? "true" : "false");
                response = await PostService.updatePost(currentPost.id, formData);
            } else {
                response = await PostService.createPost(formData);
            }

            setOpen(false);
            await fetchPosts();
            toast.success(`Postingan berhasil ${isEdit ? "diupdate" : "dibuat"}`);
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.response?.data?.message || `Gagal ${isEdit ? "mengupdate" : "membuat"} postingan`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // UI Helpers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentPost(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const toggleDescription = (id) => {
        setShowFullDescription(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner className="h-12 w-12" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Typography variant="h2" className="text-2xl font-bold mb-6">
                Kelola Postingan
            </Typography>

            {/* Search and Add Button */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="w-full md:w-1/2">
                    <Input
                        label="Cari Postingan..."
                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button className="flex items-center gap-2" onClick={handleOpen}>
                    <PlusIcon className="h-5 w-5" /> Tambah Postingan
                </Button>
            </div>

            {/* Posts Table */}
            <Card>
                <CardBody>
                    {posts.length === 0 ? (
                        <Typography className="text-center py-8">
                            Tidak ada postingan ditemukan
                        </Typography>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max table-auto">
                                {/* Table Header */}
                                <thead>
                                    <tr>
                                        {["Thumbnail", "Judul", "Deskripsi", "Kategori", "Aksi"].map((head) => (
                                            <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                                <Typography variant="small" className="font-normal leading-none opacity-70">
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                {/* Table Body */}
                                <tbody>
                                    {posts.map((post) => (
                                        <tr key={post.id}>
                                            <td className="p-4 border-b border-blue-gray-50">
                                                <Avatar
                                                    src={getImageUrl(post.Thumbnail_postingan)}
                                                    alt={post.title_postingan}
                                                    size="lg"
                                                    variant="rounded"
                                                    onError={(e) => {
                                                        console.error('Error loading image:', {
                                                            originalSrc: post.Thumbnail_postingan,
                                                            processedSrc: getImageUrl(post.Thumbnail_postingan),
                                                            error: e
                                                        });
                                                        e.target.src = "https://via.placeholder.com/150";
                                                    }}
                                                    onLoad={(e) => {
                                                        console.log('Image loaded successfully:', e.target.src);
                                                    }}
                                                />
                                            </td>
                                            <td className="p-4 border-b border-blue-gray-50">
                                                <Typography variant="small" className="font-medium">
                                                    {post.title_postingan}
                                                </Typography>
                                            </td>
                                            <td className="p-4 border-b border-blue-gray-50">
                                                <div className="flex items-start">
                                                    <Typography variant="small" className="font-normal">
                                                        {showFullDescription[post.id]
                                                            ? post.deskripsi_postingan
                                                            : `${post.deskripsi_postingan.substring(0, 50)}...`}
                                                    </Typography>
                                                    <Tooltip content={showFullDescription[post.id] ? "Sembunyikan" : "Lihat Selengkapnya"}>
                                                        <IconButton
                                                            variant="text"
                                                            size="sm"
                                                            onClick={() => toggleDescription(post.id)}
                                                            className="ml-2"
                                                        >
                                                            <InformationCircleIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </td>
                                            <td className="p-4 border-b border-blue-gray-50">
                                                <Chip
                                                    value={post.kategori}
                                                    color={
                                                        post.kategori === "Pengumuman" ? "blue" :
                                                            post.kategori === "Prestasi" ? "green" : "amber"
                                                    }
                                                />
                                            </td>
                                            <td className="p-4 border-b border-blue-gray-50">
                                                <div className="flex gap-2">
                                                    <Tooltip content="Edit">
                                                        <IconButton
                                                            variant="text"
                                                            color="blue"
                                                            size="sm"
                                                            onClick={() => handleEdit(post)}
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip content="Hapus">
                                                        <IconButton
                                                            variant="text"
                                                            color="red"
                                                            size="sm"
                                                            onClick={() => handleDelete(post.id)}
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Add/Edit Modal */}
            <Dialog open={open} handler={handleOpen} size="xl">
                <DialogHeader>
                    {isEdit ? "Edit Postingan" : "Tambah Postingan Baru"}
                </DialogHeader>
                <DialogBody divider className="overflow-y-auto max-h-[80vh]">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Image Upload */}
                        <div>
                            <Typography variant="h6" className="mb-2">
                                Thumbnail Postingan {!isEdit && "(Opsional)"}
                            </Typography>
                            <div className="flex flex-col items-start gap-4">
                                {imagePreview && (
                                    <Avatar
                                        src={imagePreview}
                                        alt="Preview"
                                        size="xxl"
                                        variant="rounded"
                                        className="border border-gray-300"
                                    />
                                )}
                                <div className="relative">
                                    <input
                                        id="thumbnail-upload"
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="blue"
                                        className="flex items-center gap-2"
                                        component="label"
                                        htmlFor="thumbnail-upload"
                                    >
                                        <PhotoIcon className="h-5 w-5" />
                                        {imagePreview ? "Ganti Gambar" : "Unggah Gambar"}
                                    </Button>
                                </div>
                                {isEdit && !imageFile && (
                                    <Typography variant="small" color="gray" className="italic">
                                        Biarkan kosong jika tidak ingin mengubah gambar
                                    </Typography>
                                )}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <Input
                            label="Judul Postingan *"
                            name="title_postingan"
                            value={currentPost.title_postingan}
                            onChange={handleChange}
                            required
                        />

                        <Textarea
                            label="Deskripsi Singkat *"
                            name="deskripsi_postingan"
                            value={currentPost.deskripsi_postingan}
                            onChange={handleChange}
                            rows={3}
                            required
                        />

                        <Textarea
                            label="Konten Lengkap *"
                            name="text_postingan"
                            rows={8}
                            value={currentPost.text_postingan}
                            onChange={handleChange}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Kategori *"
                                value={currentPost.kategori}
                                onChange={(value) => setCurrentPost(prev => ({ ...prev, kategori: value }))}
                                required
                            >
                                <Option value="Pengumuman">Pengumuman</Option>
                                <Option value="Prestasi">Prestasi</Option>
                                <Option value="Kegiatan">Kegiatan</Option>
                            </Select>

                            <Input
                                label="Keywords (pisahkan dengan koma) *"
                                name="keyword"
                                value={currentPost.keyword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                        disabled={isSubmitting}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <Spinner className="h-4 w-4" />
                                Menyimpan...
                            </div>
                        ) : isEdit ? "Update" : "Simpan"}
                    </Button>
                </DialogFooter>
            </Dialog>
            {/* Modal Konfirmasi Hapus */}
            <Dialog open={deleteModalOpen} handler={setDeleteModalOpen}>
                <DialogHeader>Konfirmasi Penghapusan</DialogHeader>
                <DialogBody>
                    Apakah Anda yakin ingin menghapus postingan ini? Aksi ini tidak dapat dibatalkan.
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="blue-gray"
                        onClick={() => setDeleteModalOpen(false)}
                        className="mr-1"
                    >
                        Batal
                    </Button>
                    <Button
                        variant="gradient"
                        color="red"
                        onClick={async () => {
                            try {
                                await PostService.deletePost(postToDelete.id);
                                setPosts(posts.filter(post => post.id !== postToDelete.id));
                                toast.success("Postingan berhasil dihapus");
                            } catch (error) {
                                console.error("Error deleting post:", error);
                                toast.error("Gagal menghapus postingan");
                            } finally {
                                setDeleteModalOpen(false);
                            }
                        }}
                    >
                        Hapus
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>

    );
};

export default ManageFeedPage;