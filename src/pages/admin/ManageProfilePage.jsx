import React, { useState } from "react";
import {
    Card,
    CardBody,
    Typography,
    Button,
    Input,
    Textarea,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Avatar,
    Chip,
    Select,
    Tooltip,
    IconButton
} from "@material-tailwind/react";
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    CheckIcon,
    XMarkIcon,
    UserCircleIcon,
    PhotoIcon
} from "@heroicons/react/24/solid";

const ManageProfilePage = () => {
    // Data contoh (sesuaikan dengan struktur tabel profileskolah)
    const initialTeachers = [
        {
            id: 1,
            nama_guru: "Budi Santoso",
            pas_foto: "https://source.unsplash.com/random/300x300/?teacher",
            NIP: "198003102003121002",
            keterangan_guru: "Guru Matematika Kelas X-XII",
            status: "active",
            created_at: "2023-05-10",
            updated_at: "2023-05-10",
            author: 1
        },
        {
            id: 2,
            nama_guru: "Ani Wijaya",
            pas_foto: "https://source.unsplash.com/random/300x300/?teacher,female",
            NIP: "198512152006042001",
            keterangan_guru: "Guru Bahasa Inggris",
            status: "active",
            created_at: "2023-05-12",
            updated_at: "2023-05-12",
            author: 1
        }
    ];

    // State management
    const [teachers, setTeachers] = useState(initialTeachers);
    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState({
        nama_guru: "",
        pas_foto: "",
        NIP: "",
        keterangan_guru: "",
        status: "active"
    });
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [profileToDelete, setProfileToDelete] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [errors, setErrors] = useState({});

    // Handle modal
    const handleOpenModal = (profile = null) => {
        if (profile) {
            setCurrentProfile(profile);
            setImagePreview(profile.pas_foto);
            setIsEditing(true);
        } else {
            setCurrentProfile({
                nama_guru: "",
                pas_foto: "",
                NIP: "",
                keterangan_guru: "",
                status: "active"
            });
            setImagePreview("");
            setIsEditing(false);
        }
        setErrors({});
        setOpenModal(true);
    };

    const handleCloseModal = () => setOpenModal(false);

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setCurrentProfile({
                    ...currentProfile,
                    pas_foto: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentTeacher({
            ...currentTeacher,
            [name]: value
        });
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};
        if (!currentTeacher.nama_guru) newErrors.nama_guru = "Nama wajib diisi";
        if (!currentTeacher.NIP) newErrors.NIP = "NIP wajib diisi";
        if (!currentTeacher.pas_foto) newErrors.pas_foto = "Foto wajib diupload";
        return newErrors;
    };

    // Save teacher
    const handleSaveTeacher = () => {
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        if (isEditing) {
            setTeachers(teachers.map(t =>
                t.id === currentTeacher.id ? currentTeacher : t
            ));
        } else {
            setTeachers([...teachers, {
                ...currentTeacher,
                id: Math.max(...teachers.map(t => t.id)) + 1,
                created_at: new Date().toISOString().split('T')[0],
                updated_at: new Date().toISOString().split('T')[0],
                author: 1 // ID admin yang login
            }]);
        }
        handleCloseModal();
    };

    // Delete teacher
    const handleDeleteTeacher = (id) => {
        setTeacherToDelete(id);
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        setTeachers(teachers.filter(t => t.id !== teacherToDelete));
        setOpenDeleteModal(false);
    };

    return (
        <div className="container mx-auto p-4">
            {/* Modal Tambah/Edit */}
            <Dialog open={openModal} handler={handleCloseModal} size="xl">
                <DialogHeader>
                    {isEditing ? "Edit Data Guru" : "Tambah Guru Baru"}
                </DialogHeader>
                <DialogBody divider className="grid gap-4">
                    {/* Foto Profil */}
                    <div>
                        <Typography variant="h6" className="mb-2">
                            Pas Foto
                        </Typography>
                        <div className="flex items-center gap-4">
                            <Avatar
                                src={imagePreview || "/default-avatar.jpg"}
                                alt="Preview Foto"
                                size="xxl"
                                className="border-2 border-gray-300"
                            />
                            <label className="cursor-pointer">
                                <Button
                                    variant="outlined"
                                    color="blue"
                                    className="flex items-center gap-2"
                                >
                                    <PhotoIcon className="h-5 w-5" />
                                    {imagePreview ? "Ganti Foto" : "Upload Foto"}
                                </Button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>
                        {errors.pas_foto && (
                            <Typography color="red" variant="small">
                                {errors.pas_foto}
                            </Typography>
                        )}
                    </div>

                    <Input
                        label="Nama Lengkap"
                        name="nama_guru"
                        value={currentTeacher.nama_guru}
                        onChange={handleChange}
                        error={!!errors.nama_guru}
                        icon={<UserCircleIcon className="h-5 w-5" />}
                    />
                    {errors.nama_guru && (
                        <Typography color="red" variant="small">
                            {errors.nama_guru}
                        </Typography>
                    )}

                    <Input
                        label="NIP"
                        name="NIP"
                        value={currentTeacher.NIP}
                        onChange={handleChange}
                        error={!!errors.NIP}
                    />
                    {errors.NIP && (
                        <Typography color="red" variant="small">
                            {errors.NIP}
                        </Typography>
                    )}

                    <Textarea
                        label="Keterangan (Jabatan/Mata Pelajaran)"
                        name="keterangan_guru"
                        value={currentTeacher.keterangan_guru}
                        onChange={handleChange}
                        rows={3}
                    />

                    <Select
                        label="Status"
                        value={currentTeacher.status}
                        onChange={(value) => setCurrentTeacher({
                            ...currentTeacher,
                            status: value
                        })}
                    >
                        <Option value="active">Aktif</Option>
                        <Option value="inactive">Non-Aktif</Option>
                    </Select>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleCloseModal}
                        className="mr-1"
                    >
                        <XMarkIcon className="h-5 w-5" /> Batal
                    </Button>
                    <Button
                        color="green"
                        onClick={handleSaveTeacher}
                    >
                        <CheckIcon className="h-5 w-5" /> {isEditing ? "Update" : "Simpan"}
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Modal Hapus */}
            <Dialog open={openDeleteModal} handler={() => setOpenDeleteModal(false)}>
                <DialogHeader>Konfirmasi Hapus</DialogHeader>
                <DialogBody>
                    Apakah Anda yakin ingin menghapus data guru ini?
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="blue-gray"
                        onClick={() => setOpenDeleteModal(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        color="red"
                        onClick={confirmDelete}
                    >
                        Hapus
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Konten Utama */}
            <Typography variant="h2" className="text-2xl font-bold mb-6">
                Manajemen Guru
            </Typography>

            <Card>
                <CardBody>
                    <div className="flex justify-between items-center mb-6">
                        <Typography variant="h5" className="font-bold">
                            Daftar Guru
                        </Typography>
                        <Button
                            className="flex items-center gap-2"
                            onClick={() => handleOpenModal()}
                        >
                            <PlusIcon className="h-5 w-5" /> Tambah Guru
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max">
                            <thead>
                                <tr>
                                    <th className="p-4 text-left bg-blue-gray-50">Foto</th>
                                    <th className="p-4 text-left bg-blue-gray-50">Nama</th>
                                    <th className="p-4 text-left bg-blue-gray-50">NIP</th>
                                    <th className="p-4 text-left bg-blue-gray-50">Keterangan</th>
                                    <th className="p-4 text-left bg-blue-gray-50">Status</th>
                                    <th className="p-4 text-left bg-blue-gray-50">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map((teacher) => (
                                    <tr key={teacher.id} className="border-b border-blue-gray-100">
                                        <td className="p-4">
                                            <Avatar
                                                src={teacher.pas_foto}
                                                alt={teacher.nama_guru}
                                                size="md"
                                                className="border border-gray-300"
                                            />
                                        </td>
                                        <td className="p-4">{teacher.nama_guru}</td>
                                        <td className="p-4">{teacher.NIP}</td>
                                        <td className="p-4">{teacher.keterangan_guru}</td>
                                        <td className="p-4">
                                            <Chip
                                                value={teacher.status === "active" ? "Aktif" : "Non-Aktif"}
                                                color={teacher.status === "active" ? "green" : "red"}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <Tooltip content="Edit">
                                                    <IconButton
                                                        variant="text"
                                                        color="blue"
                                                        onClick={() => handleOpenModal(teacher)}
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip content="Hapus">
                                                    <IconButton
                                                        variant="text"
                                                        color="red"
                                                        onClick={() => handleDeleteTeacher(teacher.id)}
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
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
        </div>
    );
};

export default ManageProfilePage;