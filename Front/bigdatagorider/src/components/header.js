"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../app/styles/Header.module.css';
import { Button } from "@heroui/react";

export default function Header() {
    const [user, setUser] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');
        
        if (token && userType) {
            setUser({ token, userType });
        } else {
            setUser(null);
        }
    }, [pathname]); // Re-check on route change

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        setUser(null);
        router.push('/Login');
    };

    const getMenuItems = () => {
        if (!user) {
            return [
                { href: "/", label: "Início" },
                { href: "/sobre", label: "Sobre Nós" }
            ];
        }
        if (user.userType === 'prestador') {
            return [
                { href: "/", label: "Início" },
                { href: "/Prestador/ServicosPublicados", label: "Buscar Serviços" },
                { href: "/Prestador/Dashboard", label: "Meus Serviços" },
                { href: "/Prestador/CadastrarVeiculos", label: "Meus Veículos" },
                { href: "/Prestador/Assinatura", label: "Assinatura" },
                { href: "/sobre", label: "Sobre Nós" }
            ];
        }
        if (user.userType === 'cliente') {
            return [
                { href: "/", label: "Início" },
                { href: "/Cliente/CriarServico", label: "Criar Novo Serviço" },
                { href: "/Cliente/Dashboard", label: "Meus Serviços" },
                { href: "/Cliente/Assinatura", label: "Assinatura" },
                { href: "/sobre", label: "Sobre Nós" }
            ];
        }
        return [
            { href: "/", label: "Início" },
            { href: "/sobre", label: "Sobre Nós" }
        ];
    };

    return (
        <nav className={`${styles.header} ${isVisible ? styles.visible : styles.hidden}`}>
            <div className={styles.logoContainer}>
                <Link href="/">
                    <Image 
                        src="/assets/home/LOGO.png" 
                        className={styles.logo}
                        width={100}
                        height={100}
                        alt="Logo GoRide"
                    />
                </Link>
            </div>
            
            <div className={styles.menuContainer}>
                <ul className={styles.menu}>
                    {getMenuItems().map((item, index) => (
                        <li key={`${item.href}-${index}`}>
                            <Link 
                                href={item.href} 
                                className={`${styles.menuItem} ${pathname === item.href ? styles.menuItemActive : ''}`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.actions}>
                {user ? (
                    <>
                        <Link href={user.userType === 'cliente' ? '/Cliente/Perfil' : '/Prestador/Perfil'} passHref>
                            <div style={{ cursor: 'pointer' }}>
                                <Image src="/assets/editar-perfil/foto.png" alt="Perfil" width={40} height={40} style={{ borderRadius: '50%' }} />
                            </div>
                        </Link>
                        <Button onClick={handleLogout} variant="outline" color="danger">
                            Sair
                        </Button>
                    </>
                ) : (
                    <>
                        <Link href="/Login" passHref>
                            <Button color="danger">
                                Fazer Login
                            </Button>
                        </Link>
                        <Link href="/Cadastro" passHref>
                            <Button variant="outline" color="danger">
                                Cadastre-se
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
