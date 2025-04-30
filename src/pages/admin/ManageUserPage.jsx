import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Typography,
    Button,
    Input,
    Select,
    Option,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Tooltip,
    IconButton,
    Chip
} from "@material-tailwind/react";
import {
    PencilIcon,
    TrashIcon,
    PlusIcon,
    CheckIcon,
    XMarkIcon,
    UserCircleIcon,
    EnvelopeIcon,
    LockClosedIcon
} from "@heroicons/react/24/solid";
import { toast } from 'react-toastify';

import api from '../../utils/api'; // Import your API instance

const ManageUserPage = () => {
    // State Management
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        username: "",
        email: "",
        password: "",
        role: "admin",
    });
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [errors, setErrors] = useState({});

    // Fetch users from API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users'); // Gunakan instance api yang sudah ada
            setUsers(response.data.data);
        } catch (error) {
            if (error.response?.status === 401) {
                // Handle unauthorized
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            console.error('Error fetching users:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Buka Modal Tambah/Edit
    const handleOpenModal = (user = null) => {
        if (user) {
            setCurrentUser({
                ...user,
                password: '' // Clear password when editing
            });
            setIsEditing(true);
        } else {
            setCurrentUser({
                username: "",
                email: "",
                password: "",
                role: "admin",
            });
            setIsEditing(false);
        }
        setErrors({});
        setOpenModal(true);
    };

    // Tutup Modal
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // Buka Modal Hapus
    const handleOpenDeleteModal = (id) => {
        setUserToDelete(id);
        setOpenDeleteModal(true);
    };

    // Tutup Modal Hapus
    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setUserToDelete(null);
    };

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser({
            ...currentUser,
            [name]: value
        });
    };

    // Validasi Form
    const validateForm = () => {
        const newErrors = {};
        if (!currentUser.username.trim()) newErrors.username = "Nama wajib diisi";
        if (!currentUser.email.trim()) newErrors.email = "Email wajib diisi";
        if (!currentUser.password && !isEditing) newErrors.password = "Password wajib diisi";
        return newErrors;
    };

    // Simpan Data
    const handleSaveUser = async () => {
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            if (isEditing) {
                await axios.put(`${API_URL}/api/users/${currentUser.id}`, currentUser); // Added /users
            } else {
                await axios.post(`${API_URL}/api/users`, currentUser); // Added /users
            }

            fetchUsers(); // Refresh user list
            handleCloseModal();
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error(error.response?.data?.message || 'Failed to save user');
        }
    };

    // Hapus Data
    const handleDeleteUser = async () => {
        try {
            await axios.delete(`${API_URL}/api/users/${userToDelete}`)
            toast.success('User deleted successfully');
            fetchUsers(); // Refresh user list
            handleCloseDeleteModal();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    return (
        <div className="container mx-auto p-4">
            {/* Modal Tambah/Edit */}
            <Dialog open={openModal} handler={handleCloseModal} size="lg">
                <DialogHeader>
                    {isEditing ? "Edit Pengguna" : "Tambah Pengguna Baru"}
                </DialogHeader>
                <DialogBody divider className="grid gap-4">
                    <Input
                        label="Nama Lengkap"
                        name="username"
                        value={currentUser.username}
                        onChange={handleChange}
                        error={!!errors.username}
                        icon={<UserCircleIcon className="h-5 w-5" />}
                    />
                    {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}

                    <Input
                        label="Email"
                        name="email"
                        value={currentUser.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        icon={<EnvelopeIcon className="h-5 w-5" />}
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}

                    {!isEditing && (
                        <>
                            <Input
                                type="password"
                                label="Password"
                                name="password"
                                value={currentUser.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                icon={<LockClosedIcon className="h-5 w-5" />}
                            />
                            {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                        </>
                    )}

                    <Select
                        label="Role"
                        value={currentUser.role}
                        onChange={(value) => setCurrentUser({ ...currentUser, role: value })}
                    >
                        <Option value="superadmin">Super Admin</Option>
                        <Option value="admin">Admin</Option>
                    </Select>


                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={handleCloseModal} className="mr-1">
                        <XMarkIcon className="h-5 w-5 mr-1" /> Batal
                    </Button>
                    <Button color="green" onClick={handleSaveUser}>
                        <CheckIcon className="h-5 w-5 mr-1" /> {isEditing ? "Update" : "Simpan"}
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Modal Hapus */}
            <Dialog open={openDeleteModal} handler={handleCloseDeleteModal} size="sm">
                <DialogHeader>Konfirmasi Hapus</DialogHeader>
                <DialogBody>
                    Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="blue-gray" onClick={handleCloseDeleteModal}>
                        Batal
                    </Button>
                    <Button color="red" onClick={handleDeleteUser}>
                        Hapus
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Konten Utama */}
            <Typography variant="h2" className="text-2xl font-bold mb-6">
                Manajemen Pengguna
            </Typography>

            <Card className="mb-6">
                <CardBody>
                    <div className="flex justify-between items-center mb-6">
                        <Typography variant="h5" className="font-bold">
                            Daftar Pengguna
                        </Typography>
                        <Button
                            className="flex items-center gap-2"
                            onClick={() => handleOpenModal()}
                        >
                            <PlusIcon className="h-5 w-5" /> Tambah Pengguna
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <Typography>Loading...</Typography>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max">
                                <thead>
                                    <tr>
                                        <th className="p-4 text-left bg-blue-gray-50">Username</th>
                                        <th className="p-4 text-left bg-blue-gray-50">Email</th>
                                        <th className="p-4 text-left bg-blue-gray-50">Role</th>

                                        <th className="p-4 text-left bg-blue-gray-50">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user.id} className="border-b border-blue-gray-100">
                                                <td className="p-4">{user.username}</td>
                                                <td className="p-4">{user.email}</td>
                                                <td className="p-4">
                                                    <Chip
                                                        value={user.role}
                                                        color={
                                                            user.role === "superadmin" ? "amber" :
                                                                user.role === "admin" ? "blue" : "green"
                                                        }
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <Tooltip content="Edit">
                                                            <IconButton
                                                                variant="text"
                                                                color="blue"
                                                                onClick={() => handleOpenModal(user)}
                                                            >
                                                                <PencilIcon className="h-5 w-5" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip content="Hapus">
                                                            <IconButton
                                                                variant="text"
                                                                color="red"
                                                                onClick={() => handleOpenDeleteModal(user.id)}
                                                            >
                                                                <TrashIcon className="h-5 w-5" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="p-4 text-center">
                                                Tidak ada data pengguna
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default ManageUserPage;