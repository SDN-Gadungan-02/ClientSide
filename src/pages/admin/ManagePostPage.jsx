import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PostService from "../../services/postService";
import {
    Card, CardBody, Typography, Button, Input, Textarea,
    Select, Option, Dialog, DialogHeader, DialogBody, DialogFooter,
    Chip, Tooltip, IconButton, Avatar, Spinner
} from "@material-tailwind/react";
import {
    PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon,
    InformationCircleIcon, PhotoIcon
} from "@heroicons/react/24/solid";



const ManagePostPage = () => {

    const [searchDebounce, setSearchDebounce] = useState(null);

    const [state, setState] = useState({
        posts: [],
        loading: true,
        searchTerm: "",
        open: false,
        isEdit: false,
        currentPost: {
            id: "",
            title_postingan: "",
            thumbnail_postingan: "",
            deskripsi_postingan: "",
            text_postingan: "",
            kategori: "",
            keyword: "",
        },
        showFullDescription: {},
        imagePreview: "",
        imageFile: null,
        isSubmitting: false,
        deleteModalOpen: false,
        postToDelete: null
    });

    const navigate = useNavigate();

    const {
        posts, loading, searchTerm, open, isEdit, currentPost,
        showFullDescription, imagePreview, imageFile, isSubmitting,
        deleteModalOpen, postToDelete
    } = state;

    const setStateValue = (key, value) => {
        setState(prev => ({ ...prev, [key]: value }));
    };

    const getImageUrl = (path) => {
        if (!path) return "https://via.placeholder.com/150";
        if (path.startsWith('http')) return path;
        const cleanPath = path.replace(/^[\\/]+/, '');
        return `${window.location.origin}/${cleanPath}`;
    };

    const fetchPosts = async (search = "") => {
        try {
            setStateValue("loading", true);
            const data = await PostService.getPosts(search);
            setStateValue("posts", data.data || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast.error("Gagal memuat postingan");
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
        } finally {
            setStateValue("loading", false);
        }
    };

    useEffect(() => {
        // Clear previous debounce timer
        if (searchDebounce) {
            clearTimeout(searchDebounce);
        }

        // Set new debounce timer
        const timer = setTimeout(() => {
            fetchPosts(searchTerm);
        }, 500); // 500ms delay

        setSearchDebounce(timer);

        // Cleanup function
        return () => {
            if (searchDebounce) {
                clearTimeout(searchDebounce);
            }
        };
    }, [searchTerm]);

    const handleSubmit = async () => {
        const requiredFields = [
            currentPost.title_postingan,
            currentPost.deskripsi_postingan,
            currentPost.text_postingan,
            currentPost.kategori,
            currentPost.keyword
        ];

        if (requiredFields.some(field => !field)) {
            toast.warning("Semua field wajib diisi kecuali thumbnail");
            return;
        }

        setStateValue("isSubmitting", true);

        try {
            const formData = new FormData();
            formData.append("title_postingan", currentPost.title_postingan);
            formData.append("deskripsi_postingan", currentPost.deskripsi_postingan);
            formData.append("text_postingan", currentPost.text_postingan);
            formData.append("kategori", currentPost.kategori);
            formData.append("keyword", currentPost.keyword);

            // Dapatkan user ID dari localStorage atau context
            const user = JSON.parse(localStorage.getItem("user"));
            if (user && user.id) {
                formData.append("author", user.id);
            }

            // Gunakan field name 'thumbnail_postingan'
            if (imageFile) {
                formData.append("thumbnail_postingan", imageFile);
            } else if (isEdit) {
                formData.append("keepExistingImage", "true");
            }

            // Log FormData untuk debugging
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            if (isEdit) {
                await PostService.updatePost(currentPost.id, formData);
            } else {
                await PostService.createPost(formData);
            }

            setStateValue("open", false);
            await fetchPosts();
            toast.success(`Postingan berhasil ${isEdit ? "diupdate" : "dibuat"}`);
        } catch (error) {
            console.error("Error:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                toast.error(error.response?.data?.message ||
                    `Gagal ${isEdit ? "mengupdate" : "membuat"} postingan`);
            }
        } finally {
            setStateValue("isSubmitting", false);
        }
    };

    const handleDelete = async () => {
        try {
            await PostService.deletePost(postToDelete.id);
            setStateValue("posts", posts.filter(post => post.id !== postToDelete.id));
            toast.success("Post deleted successfully");
            setStateValue("deleteModalOpen", false);
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post");
        }
    };

    const handleOpen = () => {
        const newOpen = !open;
        setStateValue("open", newOpen);

        if (!newOpen) {
            setStateValue("isEdit", false);
            setStateValue("currentPost", {
                id: "",
                title_postingan: "",
                thumbnail_postingan: "",
                deskripsi_postingan: "",
                text_postingan: "",
                kategori: "",
                keyword: "",
            });
            setStateValue("imagePreview", "");
            setStateValue("imageFile", null);
        }
    };

    const handleEdit = (post) => {
        setStateValue("currentPost", post);
        setStateValue("imagePreview", post.thumbnail_postingan || "");
        setStateValue("isEdit", true);
        setStateValue("open", true);
    };

    const handleDeleteClick = (post) => {
        setStateValue("postToDelete", post);
        setStateValue("deleteModalOpen", true);
    };

    const handleImageError = (e) => {
        e.target.src = "https://via.placeholder.com/150";
        console.error("Gambar gagal dimuat:", e.target.src);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStateValue("currentPost", { ...currentPost, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match('image.*')) {
            toast.warning('Hanya file gambar yang diperbolehkan');
            return;
        }

        // Validate file size (e.g., 2MB limit)
        if (file.size > 2 * 1024 * 1024) {
            toast.warning('Ukuran gambar maksimal 2MB');
            return;
        }

        setStateValue("imageFile", file);
        const reader = new FileReader();
        reader.onloadend = () => setStateValue("imagePreview", reader.result);
        reader.readAsDataURL(file);
    };

    const toggleDescription = (id) => {
        setStateValue("showFullDescription", {
            ...showFullDescription,
            [id]: !showFullDescription[id]
        });
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchPosts();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const renderLoading = () => (
        <div className="flex justify-center items-center h-screen">
            <Spinner className="h-12 w-12" />
        </div>
    );

    const renderTable = () => (
        <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-center"> {/* Tambahkan text-center di sini */}
                <thead>
                    <tr>
                        {["Thumbnail", "Judul", "Deskripsi", "Kategori", "Aksi"].map((head) => (
                            <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-center"> {/* Tambahkan text-center */}
                                <Typography variant="small" className="font-normal leading-none opacity-70">
                                    {head}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr key={post.id}>
                            <td className="p-4 border-b border-blue-gray-50 text-center"> {/* Tambahkan text-center */}
                                <div className="flex justify-center"> {/* Tambahkan div wrapper untuk avatar */}
                                    <Avatar
                                        src={getImageUrl(post.thumbnail_postingan)}
                                        alt={post.title_postingan}
                                        size="lg"
                                        variant="rounded"
                                        onError={handleImageError}
                                    />
                                </div>
                            </td>
                            <td className="p-4 border-b border-blue-gray-50 text-center"> {/* Tambahkan text-center */}
                                <Typography variant="small" className="font-medium">
                                    {post.title_postingan}
                                </Typography>
                            </td>
                            <td className="p-4 border-b border-blue-gray-50 text-center"> {/* Tambahkan text-center */}
                                <div className="flex items-center justify-center"> {/* Perubahan di sini */}
                                    <Typography variant="small" className="font-normal">
                                        {showFullDescription[post.id]
                                            ? post.deskripsi_postingan
                                            : `${post.deskripsi_postingan.substring(0, 100)}...`}
                                    </Typography>
                                </div>
                            </td>
                            <td className="p-4 border-b border-blue-gray-50 text-center"> {/* Tambahkan text-center */}
                                <div className="flex justify-center"> {/* Tambahkan div wrapper untuk chip */}
                                    <Chip
                                        value={post.kategori}
                                        color={
                                            post.kategori === "Prestasi" ? "green" :
                                                post.kategori === "Pengumuman" ? "blue" :
                                                    post.kategori === "Kegiatan" ? "amber" : "gray"
                                        }
                                    />
                                </div>
                            </td>
                            <td className="p-4 border-b border-blue-gray-50 text-center"> {/* Tambahkan text-center */}
                                <div className="flex justify-center gap-2"> {/* Tambahkan justify-center */}
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
                                            onClick={() => handleDeleteClick(post)}
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
    );

    const renderEmptyState = () => (
        <Typography className="text-center py-8">
            Tidak ada postingan ditemukan
        </Typography>
    );

    const renderImageUpload = () => (
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
    );

    if (loading) return renderLoading();

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
                        onChange={(e) => setStateValue("searchTerm", e.target.value)}
                        placeholder="Cari berdasarkan judul, deskripsi, atau kategori..."
                        className="w-full md:w-1/2"
                    />
                </div>
                <Button className="flex items-center gap-2" onClick={handleOpen}>
                    <PlusIcon className="h-5 w-5" /> Tambah Postingan
                </Button>
            </div>

            {/* Posts Table */}
            <Card>
                <CardBody>
                    {posts.length === 0 ? renderEmptyState() : renderTable()}
                </CardBody>
            </Card>

            {/* Add/Edit Modal */}
            <Dialog open={open} handler={handleOpen} size="xl">
                <DialogHeader>
                    {isEdit ? "Edit Postingan" : "Tambah Postingan Baru"}
                </DialogHeader>
                <DialogBody divider className="overflow-y-auto max-h-[80vh]">

                    <div className="grid grid-cols-1 gap-6">
                        {renderImageUpload()}
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
                                onChange={(value) => setStateValue("currentPost", { ...currentPost, kategori: value })}
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

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} handler={() => setStateValue("deleteModalOpen", false)}>
                <DialogHeader>Konfirmasi Penghapusan</DialogHeader>
                <DialogBody>
                    Apakah Anda yakin ingin menghapus postingan ini? Aksi ini tidak dapat dibatalkan.
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="blue-gray"
                        onClick={() => setStateValue("deleteModalOpen", false)}
                        className="mr-1"
                    >
                        Batal
                    </Button>
                    <Button
                        variant="gradient"
                        color="red"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ManagePostPage;