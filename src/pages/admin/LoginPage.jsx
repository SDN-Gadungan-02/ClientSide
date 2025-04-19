import React, { useState } from 'react';
import { Input, Button, Typography, Card, CardBody } from '@material-tailwind/react';
import logo from '../../assets/react.svg'; // Sesuaikan path logo

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempted with:', { username, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-row items-center gap-36"> {/* Horizontal Layout */}
                {/* Logo on the left */}
                <div className="flex justify-center items-center">
                    <img src={logo} alt="Logo" className="h-52 w-52" />
                </div>

                {/* Login form */}
                <Card className="w-full max-w-md py-6">
                    <CardBody className="p-8">
                        <Typography variant="h4" className="text-center mb-8 text-gray-800">
                            Login
                        </Typography>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Input
                                    label="Username"
                                    size="lg"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Input
                                    type="password"
                                    label="Password"
                                    size="lg"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                className="mt-6 bg-blue-500 hover:bg-blue-600"
                            >
                                Login
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
