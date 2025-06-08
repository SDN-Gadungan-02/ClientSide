import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TeacherService from "../../services/teacherService";
import {
    Card, CardBody, Typography, Button, Input, Textarea,
    Select, Option, Dialog, DialogHeader, DialogBody, DialogFooter,
    Chip, Tooltip, IconButton, Avatar, Spinner
} from "@material-tailwind/react";
import {
    PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon,
    CheckIcon, XMarkIcon, UserCircleIcon, PhotoIcon
} from "@heroicons/react/24/solid";

const ManageTeacherPage = () => {
    const [state, setState] = useState({
        teachers: [],
        loading: true,
        searchTerm: "",
        openModal: false,
        isEditing: false,
        currentTeacher: {
            id: "",
            nama_guru: "",
            pas_foto: "",
            nip: "",
            keterangan_guru: "",
        },
        openDeleteModal: false,
        teacherToDelete: null,
        imagePreview: "",
        imageFile: null,
        isSubmitting: false,
        errors: {}
    });

    const navigate = useNavigate();

    const {
        teachers, loading, searchTerm, openModal, isEditing, currentTeacher,
        openDeleteModal, teacherToDelete, imagePreview, imageFile, isSubmitting, errors
    } = state;

    const setStateValue = (key, value) => {
        setState(prev => ({ ...prev, [key]: value }));
    };

    const [searchDebounce, setSearchDebounce] = useState(null);

    const fetchTeachers = async (search = "") => {
        try {
            setStateValue("loading", true);
            const response = await TeacherService.getTeachers(search);
            // Pastikan teachers selalu array
            const data = response.data;
            setStateValue("teachers", Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching teachers:", error);
            toast.error("Gagal memuat data guru");
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/login");
            }
            // Jika error, pastikan teachers tetap array
            setStateValue("teachers", []);
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
            fetchTeachers(searchTerm);
        }, 500); // 500ms delay

        setSearchDebounce(timer);

        // Cleanup function
        return () => {
            if (searchDebounce) {
                clearTimeout(searchDebounce);
            }
        };
    }, [searchTerm]);


    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchTeachers();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleOpenModal = (teacher = null) => {
        if (teacher) {
            setStateValue("currentTeacher", teacher);
            setStateValue("imagePreview", teacher.pas_foto || "");
            setStateValue("isEditing", true);
        } else {
            setStateValue("currentTeacher", {
                id: "",
                nama_guru: "",
                pas_foto: "",
                nip: "",
                keterangan_guru: "",
            });
            setStateValue("imagePreview", "");
            setStateValue("imageFile", null);
            setStateValue("isEditing", false);
        }
        setStateValue("errors", {});
        setStateValue("openModal", true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setStateValue("imageFile", file);
            const reader = new FileReader();
            reader.onloadend = () => setStateValue("imagePreview", reader.result);
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!currentTeacher.nama_guru) newErrors.nama_guru = "Nama wajib diisi";
        if (!currentTeacher.nip) newErrors.nip = "NIP wajib diisi";
        return newErrors;
    };

    const handleSaveTeacher = async () => {
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setStateValue("errors", formErrors);
            return;
        }

        setStateValue("isSubmitting", true);

        try {
            const formData = new FormData();
            formData.append("nama_guru", currentTeacher.nama_guru);
            formData.append("nip", currentTeacher.nip);
            formData.append("keterangan_guru", currentTeacher.keterangan_guru);

            if (imageFile) {
                formData.append("pas_foto", imageFile);
            } else if (isEditing && currentTeacher.pas_foto) {
                formData.append("keepExistingImage", "true");
            }

            // Cek token sebelum mengirim
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            if (isEditing) {
                await TeacherService.updateTeacher(currentTeacher.id, formData);
            } else {
                await TeacherService.createTeacher(formData);
            }

            setStateValue("openModal", false);
            await fetchTeachers();
            toast.success(`Guru berhasil ${isEditing ? "diupdate" : "ditambahkan"}`);
        } catch (error) {
            console.error("Full error:", error);

            if (error.response?.status === 403) {
                toast.error("Akses ditolak. Anda tidak memiliki izin untuk tindakan ini.");
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(`Gagal ${isEditing ? "mengupdate" : "menambahkan"} guru`);
            }
        } finally {
            setStateValue("isSubmitting", false);
        }
    };

    const handleDeleteTeacher = async () => {
        try {
            await TeacherService.deleteTeacher(teacherToDelete);
            setStateValue("teachers", teachers.filter(t => t.id !== teacherToDelete));
            setStateValue("openDeleteModal", false);
            toast.success("Guru berhasil dihapus");
        } catch (error) {
            console.error("Error deleting teacher:", error);
            toast.error("Gagal menghapus guru");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStateValue("currentTeacher", { ...currentTeacher, [name]: value });
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
                Manajemen Guru
            </Typography>



            <Card>
                <CardBody>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="w-full">
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <div className="relative flex-1">
                                    <Input
                                        label="Cari Guru..."
                                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                        value={searchTerm}
                                        onChange={(e) => setStateValue("searchTerm", e.target.value)}
                                        placeholder="Nama, NIP, atau keterangan..."
                                    />
                                    {searchTerm && (
                                        <IconButton
                                            variant="text"
                                            size="sm"
                                            className="!absolute right-1 top-1/2 transform -translate-y-1/2"
                                            onClick={() => setStateValue("searchTerm", "")}
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                        </IconButton>
                                    )}
                                </div>

                                <Button
                                    className="md:w-auto flex items-center gap-2"
                                    onClick={() => handleOpenModal()}
                                >
                                    <PlusIcon className="h-5 w-5" /> Tambah Guru
                                </Button>
                            </div>
                        </div>
                    </div>
                    {teachers.length === 0 ? (
                        <Typography className="text-center py-8">
                            Tidak ada data guru ditemukan
                        </Typography>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max table-auto">
                                <thead>
                                    <tr>
                                        {["Foto", "Nama", "NIP", "Keterangan", "Aksi"].map((head) => (
                                            <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                                <Typography variant="small" className="font-normal leading-none opacity-70 text-center">
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {teachers.map((teacher) => (
                                        <tr key={teacher.id} className="border-b border-blue-gray-100 text-center">
                                            <td className="p-4">
                                                <Avatar
                                                    src={teacher.pas_foto || "/default-avatar.jpg"}
                                                    alt={teacher.nama_guru}
                                                    size="md"
                                                    className="border border-gray-300"
                                                />
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" className="font-medium">
                                                    {teacher.nama_guru}
                                                </Typography>
                                            </td>
                                            <td className="p-4">{teacher.nip}</td>
                                            <td className="p-4">{teacher.keterangan_guru}</td>

                                            <td className="p-4">
                                                <div className="flex gap-2 justify-center">
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
                                                            onClick={() => {
                                                                setStateValue("teacherToDelete", teacher.id);
                                                                setStateValue("openDeleteModal", true);
                                                            }}
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
                    )}
                </CardBody>
            </Card>

            {/* Add/Edit Modal */}
            <Dialog open={openModal} handler={() => setStateValue("openModal", false)} size="xl">
                <DialogHeader>
                    {isEditing ? "Edit Data Guru" : "Tambah Guru Baru"}
                </DialogHeader>
                <DialogBody divider className="grid gap-4">
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
                            <div>
                                <input
                                    type="file"
                                    id="file-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                <div className="relative">
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
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Input
                        label="Nama Lengkap *"
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
                        name="nip"
                        type="number"
                        value={currentTeacher.nip}
                        onChange={handleChange}
                        error={!!errors.nip}
                    />
                    {errors.nip && (
                        <Typography color="red" variant="small">
                            {errors.nip}
                        </Typography>
                    )}

                    <Textarea
                        label="Keterangan (Jabatan/Mata Pelajaran)"
                        name="keterangan_guru"
                        value={currentTeacher.keterangan_guru}
                        onChange={handleChange}
                        rows={3}
                    />


                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setStateValue("openModal", false)}
                        className="mr-1"
                        disabled={isSubmitting}
                    >
                        <XMarkIcon className="h-5 w-5" /> Batal
                    </Button>
                    <Button
                        color="green"
                        onClick={handleSaveTeacher}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <Spinner className="h-4 w-4" />
                                Menyimpan...
                            </div>
                        ) : (
                            <>
                                <CheckIcon className="h-5 w-5" /> {isEditing ? "Update" : "Simpan"}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={openDeleteModal} handler={() => setStateValue("openDeleteModal", false)}>
                <DialogHeader>Konfirmasi Hapus</DialogHeader>
                <DialogBody>
                    Apakah Anda yakin ingin menghapus data guru ini?
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="blue-gray"
                        onClick={() => setStateValue("openDeleteModal", false)}
                        className="mr-1"
                    >
                        Batal
                    </Button>
                    <Button
                        color="red"
                        onClick={handleDeleteTeacher}
                    >
                        Hapus
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default ManageTeacherPage;