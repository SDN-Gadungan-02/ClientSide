import React, { useState } from "react";
import {
    Card,
    CardBody,
    Typography,
    Button,
    Input,
    Textarea,
    Select,
    Option,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Chip,
    Tooltip,
    IconButton,
    Avatar
} from "@material-tailwind/react";
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    InformationCircleIcon,
    PhotoIcon
} from "@heroicons/react/24/solid";

const ManageFeedPage = () => {
    // Data contoh postingan
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: "Penerimaan Siswa Baru 2023",
            thumbnail: "https://source.unsplash.com/random/300x200/?school",
            description: "Informasi lengkap mengenai penerimaan siswa baru tahun ajaran 2023/2024 termasuk jadwal, persyaratan, dan prosedur pendaftaran.",
            content: "Lorem ipsum dolor sit amet...",
            category: "Pengumuman",
            keywords: "PSB, Pendaftaran",
            createdAt: "2023-05-15",
            author: "Admin"
        },
        {
            id: 2,
            title: "Juara Lomba Sains Nasional",
            thumbnail: "https://source.unsplash.com/random/300x200/?science",
            description: "Siswa SDN Gadungan 02 meraih juara 1 dalam lomba sains tingkat nasional yang diselenggarakan oleh Kementerian Pendidikan.",
            content: "Lorem ipsum dolor sit amet...",
            category: "Prestasi",
            keywords: "Sains, Kompetisi",
            createdAt: "2023-06-20",
            author: "Admin"
        }
    ]);

    // State untuk modal
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentPost, setCurrentPost] = useState({
        title: "",
        thumbnail: "",
        description: "",
        content: "",
        category: "",
        keywords: ""
    });

    // State untuk preview deskripsi
    const [showFullDescription, setShowFullDescription] = useState({});
    const [imagePreview, setImagePreview] = useState("");

    // Handle modal
    const handleOpen = () => {
        setOpen(!open);
        if (!open) {
            setIsEdit(false);
            setCurrentPost({
                title: "",
                thumbnail: "",
                description: "",
                content: "",
                category: "",
                keywords: ""
            });
            setImagePreview("");
        }
    };

    // Handle edit
    const handleEdit = (post) => {
        setCurrentPost(post);
        setImagePreview(post.thumbnail);
        setIsEdit(true);
        setOpen(true);
    };

    // Handle delete
    const handleDelete = (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus postingan ini?")) {
            setPosts(posts.filter(post => post.id !== id));
        }
    };

    // Handle submit
    const handleSubmit = () => {
        if (isEdit) {
            // Update existing post
            setPosts(posts.map(post =>
                post.id === currentPost.id ? currentPost : post
            ));
        } else {
            // Add new post
            const newPost = {
                ...currentPost,
                id: posts.length + 1,
                createdAt: new Date().toISOString().split('T')[0],
                author: "Admin"
            };
            setPosts([...posts, newPost]);
        }
        setOpen(false);
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentPost({
            ...currentPost,
            [name]: value
        });
    };

    // Handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setCurrentPost({
                    ...currentPost,
                    thumbnail: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Toggle deskripsi lengkap
    const toggleDescription = (id) => {
        setShowFullDescription({
            ...showFullDescription,
            [id]: !showFullDescription[id]
        });
    };

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
                    />
                </div>
                <Button
                    className="flex items-center gap-2"
                    onClick={handleOpen}
                >
                    <PlusIcon className="h-5 w-5" />
                    Tambah Postingan
                </Button>
            </div>

            {/* Posts Table */}
            <Card>
                <CardBody>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max table-auto">
                            <thead>
                                <tr>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                            Thumbnail
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                            Judul
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                            Deskripsi
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                            Kategori
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                            Aksi
                                        </Typography>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post) => (
                                    <tr key={post.id}>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <Avatar
                                                src={post.thumbnail}
                                                alt={post.title}
                                                size="lg"
                                                variant="rounded"
                                                className="border border-gray-300"
                                            />
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {post.title}
                                            </Typography>
                                        </td>
                                        <td className="p-4 border-b border-blue-gray-50">
                                            <div className="flex items-start">
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {showFullDescription[post.id]
                                                        ? post.description
                                                        : `${post.description.substring(0, 50)}...`}
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
                                                value={post.category}
                                                color={post.category === "Pengumuman" ? "blue" : "green"}
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
                                                <Tooltip content="Preview">
                                                    <IconButton
                                                        variant="text"
                                                        color="purple"
                                                        size="sm"
                                                    >
                                                        <EyeIcon className="h-4 w-4" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>

            {/* Modal untuk Tambah/Edit Postingan */}
            <Dialog open={open} handler={handleOpen} size="xl">
                <DialogHeader>
                    {isEdit ? "Edit Postingan" : "Tambah Postingan Baru"}
                </DialogHeader>
                <DialogBody divider className="overflow-y-auto max-h-[80vh]">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Image Preview and Upload */}
                        <div>
                            <Typography variant="h6" className="mb-2">
                                Thumbnail Postingan
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
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <Button
                                        variant="outlined"
                                        color="blue"
                                        className="flex items-center gap-2"
                                    >
                                        <PhotoIcon className="h-5 w-5" />
                                        {imagePreview ? "Ganti Gambar" : "Unggah Gambar"}
                                    </Button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <Input
                            label="Judul Postingan"
                            name="title"
                            value={currentPost.title}
                            onChange={handleChange}
                        />

                        <Textarea
                            label="Deskripsi Singkat"
                            name="description"
                            value={currentPost.description}
                            onChange={handleChange}
                            rows={3}
                        />

                        <Textarea
                            label="Konten Lengkap"
                            name="content"
                            rows={8}
                            value={currentPost.content}
                            onChange={handleChange}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                label="Kategori"
                                name="category"
                                value={currentPost.category}
                                onChange={(value) => setCurrentPost({ ...currentPost, category: value })}
                            >
                                <Option value="Pengumuman">Pengumuman</Option>
                                <Option value="Prestasi">Prestasi</Option>
                                <Option value="Kegiatan">Kegiatan</Option>
                            </Select>

                            <Input
                                label="Keywords (pisahkan dengan koma)"
                                name="keywords"
                                value={currentPost.keywords}
                                onChange={handleChange}
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
                    >
                        <span>Batal</span>
                    </Button>
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={handleSubmit}
                    >
                        <span>{isEdit ? "Update" : "Simpan"}</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ManageFeedPage;