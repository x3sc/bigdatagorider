"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../app/styles/Header.module.css';
import { Button } from "@heroui/react";

export default function Header() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');
        if (token && userType) {
            setUser({ token, userType });
        } else {
            setUser(null);
        }
    }, []); // Dependência vazia para rodar apenas no client-side

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        setUser(null);
        router.push('/Login');
    };

    const getDashboardLink = () => {
        if (!user) return "/";
        return user.userType === 'cliente' ? '/Cliente/Dashboard' : '/Prestador/Dashboard';
    };

    return (
        <nav className={styles.header}>
            <div>
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
            <div>
                <ul className={styles.menu}>
                    <li><Link href="/" className={styles.menuItem}>Início</Link></li>
                    {user && (
                        <li><Link href={getDashboardLink()} className={styles.menuItem}>Dashboard</Link></li>
                    )}
                    <li><Link href="/sobre" className={styles.menuItem}>Sobre Nós</Link></li>
                </ul>
            </div>
            <div className={styles.actions}>
                {user ? (
                    <>
                        <Link href="/Prestador/Perfil" passHref>
                            <Button variant="outline" color="danger">Meu Perfil</Button>
                        </Link>
                        <Button color="danger" onClick={handleLogout}>
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