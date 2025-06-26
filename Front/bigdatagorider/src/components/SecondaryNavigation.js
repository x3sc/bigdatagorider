"use client";
import { useRouter, usePathname } from 'next/navigation';
import { Button, Card, CardBody } from "@heroui/react";
import styles from '../app/styles/SecondaryNavigation.module.css';

export default function SecondaryNavigation({ currentPage, userType, userName }) {
    const router = useRouter();
    const pathname = usePathname();

    const getNavigationItems = () => {
        if (userType === 'prestador') {
            return [
                {
                    href: "/Prestador/ServicosPublicados",
                    label: "Buscar Serviços",
                    icon: "🔍",
                },
                {
                    href: "/Prestador/Dashboard",
                    label: "Meus Serviços", 
                    icon: "📋",
                },
                {
                    href: "/Prestador/CadastrarVeiculos",
                    label: "Meus Veículos",
                    icon: "🚛",
                },
                {
                    href: "/Prestador/Assinatura",
                    label: "Assinatura",
                    icon: "⭐",
                }
            ];
        } else if (userType === 'cliente') {
            return [
                {
                    href: "/Cliente/CriarServico",
                    label: "Criar Novo Serviço",
                    icon: "➕",
                },
                {
                    href: "/Cliente/Dashboard",
                    label: "Meus Serviços", 
                    icon: "📋",
                },
                {
                    href: "/Cliente/Assinatura",
                    label: "Assinatura",
                    icon: "⭐",
                }
            ];
        }
        return [];
    };

    const navigationItems = getNavigationItems();

    return (
        <Card className={styles.navigationCard}>
            <CardBody>
                <div className={styles.headerInfo}>
                    <h2>Olá, {userName}!</h2>
                    <p>Página atual: {currentPage}</p>
                </div>
                <div className={styles.mainActions}>
                    {navigationItems.map((item, index) => (
                        <Button
                            key={`nav-${index}-${item.href}`}
                            color="danger"
                            variant={pathname === item.href ? "solid" : "bordered"}
                            size="lg"
                            startContent={<span>{item.icon}</span>}
                            onPress={() => router.push(item.href)}
                            className={pathname === item.href ? styles.primaryAction : ''}
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}
