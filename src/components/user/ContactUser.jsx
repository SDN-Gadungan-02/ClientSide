// src/components/ContactUser.jsx
import React from "react";
import {
    Typography,
    Card,
    CardBody,
    CardHeader,
    List,
    ListItem,
    ListItemPrefix
} from "@material-tailwind/react";
import {
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon
} from "@heroicons/react/24/solid";

export default function ContactUser() {
    return (
        <div className="relative py-20 overflow-hidden min-h-[600px]">
            {/* Background Image dengan efek parallax - PERUBAHAN DI SINI */}
            <div
                className="fixed inset-0 -z-10 bg-fixed bg-center bg-cover opacity-20"
                style={{
                    backgroundImage: "url('https://img.freepik.com/premium-vector/hand-drawn-school-education-seamless-pattern_698782-394.jpg?w=2000')",
                    transform: "translate3d(0,0,0)"
                }}
            ></div>
            {/* Konten Contact */}
            <div className="container mx-auto px-4 relative z-10">
                <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <CardHeader color="blue" floated={false} shadow={false} className="text-center p-6">
                        <Typography variant="h3" className="text-white">
                            Hubungi Kami
                        </Typography>
                    </CardHeader>

                    <CardBody className="px-8 pb-6">
                        {/* Kontak dalam satu baris memanjang */}
                        <div className="flex flex-col md:flex-row gap-1 mb-8 overflow-hidden">
                            <div className="bg-blue-gray-50/50 rounded-lg p-4 min-w-[250px] flex-2">
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                                        <MapPinIcon className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <Typography color="gray" className="font-normal">
                                            Jl. Cincin Kota No.8, Karangsari<br />
                                        </Typography>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-gray-50/50 rounded-lg p-4 min-w-[150px] flex-2">
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                                        <PhoneIcon className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <Typography color="gray" className="font-normal">
                                            0287-381820
                                        </Typography>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-gray-50/50 rounded-lg p-4 min-w-[250px] flex-2">
                                <div className="flex items-center">
                                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                                        <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <Typography color="gray" className="font-normal">
                                            sdngadungan02@gmail.com
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Peta di bawah */}
                        <div className="bg-gray-200 rounded-lg overflow-hidden h-[400px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613506864!3d-6.194741395493371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5390917b759%3A0x6b45e839560a85ab!2sMonumen%20Nasional!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Peta Lokasi Sekolah"
                            ></iframe>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}