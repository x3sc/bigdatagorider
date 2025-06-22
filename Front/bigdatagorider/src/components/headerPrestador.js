"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User } from '@heroui/react';
import { useState, useEffect } from 'react';
import styles from './headerPrestador.module.css';

const HeaderPrestador = () => {
    const router = useRouter();
    const [userName, setUserName] = useState('Prestador');

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userName');
        router.push('/Login');
    };

    const handleNavigation = (path) => {
        router.push(path);
    };

    return (
        <Navbar 
            maxWidth="full" 
            className={styles.navbar}
            height="70px"
        >
            <NavbarBrand>
                <div className={styles.logo}>
                    <Image 
                        src="/assets/home/LOGO.png" 
                        alt="BigData Go Rider" 
                        width={120} 
                        height={40} 
                        priority
                    />
                </div>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Button
                        variant="light"
                        startContent={<span>📊</span>}
                        onPress={() => handleNavigation('/Prestador/Dashboard')}
                    >
                        Dashboard
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Button
                        variant="light"
                        startContent={<span>🔍</span>}
                        onPress={() => handleNavigation('/Prestador/ServicosPublicados')}
                    >
                        Buscar Serviços
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Button
                        variant="light"
                        startContent={<span>🚛</span>}
                        onPress={() => handleNavigation('/Prestador/CadastrarVeiculos')}
                    >
                        Meus Veículos
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <Button
                        variant="light"
                        startContent={<span>⭐</span>}
                        onPress={() => handleNavigation('/Prestador/Assinatura')}
                    >
                        Assinatura
                    </Button>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <User
                            as="button"
                            avatarProps={{
                                isBordered: true,
                                src: "/assets/prestador/avatar-placeholder.png",
                                fallback: "P"
                            }}
                            className="transition-transform"
                            description="Prestador de Serviços"
                            name={userName}
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem 
                            key="profile" 
                            className="h-14 gap-2"
                            textValue="Signed in"
                        >
                            <p className="font-semibold">Logado como</p>
                            <p className="font-semibold">{userName}</p>
                        </DropdownItem>
                        <DropdownItem 
                            key="profile_page"
                            startContent={<span>👤</span>}
                            onPress={() => handleNavigation('/Prestador/Perfil')}
                        >
                            Meu Perfil
                        </DropdownItem>
                        <DropdownItem 
                            key="settings"
                            startContent={<span>⚙️</span>}
                        >
                            Configurações
                        </DropdownItem>
                        <DropdownItem 
                            key="help"
                            startContent={<span>❓</span>}
                        >
                            Ajuda & Feedback
                        </DropdownItem>
                        <DropdownItem 
                            key="logout" 
                            color="danger"
                            startContent={<span>🚪</span>}
                            onPress={handleLogout}
                        >
                            Sair
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
    );
};

export default HeaderPrestador;
