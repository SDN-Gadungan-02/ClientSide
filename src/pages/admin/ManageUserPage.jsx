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
    MagnifyingGlassIcon,
    LockClosedIcon
} from "@heroicons/react/24/solid";
import { toast } from 'react-toastify';
import UserService from "../../services/userService";

const ManageUserPage = () => {
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
    const [currentUserId, setCurrentUserId] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchDebounce, setSearchDebounce] = useState(null);


    const fetchUsers = async (search = "") => {
        try {
            setLoading(true);
            const response = await UserService.getUsers(search);

            // Pastikan response.data.data adalah array
            if (Array.isArray(response.data?.data)) {
                setUsers(response.data.data);
            } else {
                console.error('Invalid users data format:', response.data);
                toast.error('Invalid users data format');
                setUsers([]); // Set ke array kosong jika format tidak sesuai
            }
        } catch (error) {
            console.error('Error fetching users:', error);

            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                toast.error(error.response?.data?.message || 'Failed to fetch users');
            }
        } finally {
            setLoading(false); // Pastikan loading selalu di-set ke false
        }
    };

    useEffect(() => {
        // Clear previous debounce timer
        if (searchDebounce) {
            clearTimeout(searchDebounce);
        }

        // Set new debounce timer
        const timer = setTimeout(() => {
            fetchUsers(searchTerm);
        }, 500); // 500ms delay

        setSearchDebounce(timer);

        // Cleanup function
        return () => {
            if (searchDebounce) {
                clearTimeout(searchDebounce);
            }
        };
    }, [searchTerm]);

    // Tambahkan useEffect untuk debug
    useEffect(() => {
        console.log('Users state:', users);
        console.log('Loading state:', loading);
    }, [users, loading]);

    const handleSaveUser = async () => {
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            // Siapkan data yang akan dikirim
            const userData = {
                username: currentUser.username,
                email: currentUser.email,
                role: currentUser.role
            };

            // Jika mode edit dan ada password baru, tambahkan password
            if (isEditing && currentUser.password) {
                userData.password = currentUser.password;
            }
            // Jika mode create, wajib ada password
            else if (!isEditing) {
                userData.password = currentUser.password;
            }

            if (isEditing) {
                await UserService.updateUser(currentUser.id, userData);
                toast.success('User updated successfully');
            } else {
                await UserService.createUser(userData);
                toast.success('User created successfully');
            }

            fetchUsers();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error(error.response?.data?.message || 'Failed to save user');
        }
    };

    useEffect(() => {
        // Get current user ID from localStorage or wherever you store it
        const userData = JSON.parse(localStorage.getItem('user')); // adjust this based on how you store user data
        if (userData) {
            setCurrentUserId(userData.id);
        }
        fetchUsers();
    }, []);

    const handleDeleteUser = async () => {
        if (userToDelete === currentUserId) {
            toast.error('Anda tidak dapat menghapus akun sendiri');
            handleCloseDeleteModal();
            return;
        }

        try {
            await UserService.deleteUser(userToDelete);
            toast.success('User deleted successfully');
            fetchUsers();
            handleCloseDeleteModal();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            // Mode edit - isi form dengan data user yang dipilih
            setCurrentUser({
                id: user.id,
                username: user.username,
                email: user.email,
                password: "", // Password tidak ditampilkan saat edit
                role: user.role
            });
            setIsEditing(true);
        } else {
            // Mode tambah baru - reset form
            setCurrentUser({
                username: "",
                email: "",
                password: "",
                role: "admin",
            });
            setIsEditing(false);
        }
        setOpenModal(true);
        setErrors({}); // Reset error state
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenDeleteModal = (id) => {
        setUserToDelete(id);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setUserToDelete(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser({
            ...currentUser,
            [name]: value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!currentUser.username.trim()) newErrors.username = "Nama wajib diisi";
        if (!currentUser.email.trim()) newErrors.email = "Email wajib diisi";
        if (!currentUser.password && !isEditing) newErrors.password = "Password wajib diisi";
        return newErrors;
    };

    return (
        <div className="container mx-auto p-4">
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
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="w-full">

                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <div className="relative flex-1">
                                    <Input
                                        label="Cari Pengguna..."
                                        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Nama, email, atau role..."
                                    />
                                    {searchTerm && (
                                        <IconButton
                                            variant="text"
                                            size="sm"
                                            className="!absolute right-1 top-1/2 transform -translate-y-1/2"
                                            onClick={() => setSearchTerm("")}
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                        </IconButton>
                                    )}
                                </div>

                                <Button
                                    className="md:w-auto flex items-center gap-2"
                                    onClick={() => handleOpenModal()}
                                >
                                    <PlusIcon className="h-5 w-5" /> Tambah Pengguna
                                </Button>
                            </div>
                        </div>
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
                                        <th className="p-4 text-center bg-blue-gray-50">Username</th>
                                        <th className="p-4 text-center bg-blue-gray-50">Email</th>
                                        <th className="p-4 text-center bg-blue-gray-50">Role</th>

                                        <th className="p-4 text-center bg-blue-gray-50">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user.id} className="border-b border-blue-gray-100">
                                                <td className="p-4 text-center">{user.username}</td>
                                                <td className="p-4 text-center">{user.email}</td>
                                                <td className="p-4 text-center">
                                                    <Chip
                                                        value={user.role}
                                                        color={
                                                            user.role === "superadmin" ? "amber" :
                                                                user.role === "admin" ? "blue" : "green"
                                                        }
                                                        className="text-center"
                                                    />
                                                </td>
                                                <td className="p-4 justify-center flex gap-2">
                                                    <div className="flex gap-2">
                                                        <Tooltip content="Edit">
                                                            <IconButton
                                                                variant="text"
                                                                color="yellow"
                                                                onClick={() => {
                                                                    const userToEdit = users.find(u => u.id === user.id);
                                                                    handleOpenModal(userToEdit);
                                                                }}
                                                            >
                                                                <PencilIcon className="h-5 w-5" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip content={user.id === currentUserId ? "Anda tidak dapat menghapus akun sendiri" : "Hapus"}>
                                                            <IconButton
                                                                variant="text"
                                                                color="red"
                                                                onClick={() => handleOpenDeleteModal(user.id)}
                                                                disabled={user.id === currentUserId}
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