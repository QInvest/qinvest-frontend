import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  TrendingUp,
  Target,
  Bell,
  Settings,
  CreditCard,
  Building2,
  Eye,
  AlertCircle
} from "lucide-react";
import { mockCarteira } from "@/data/mockData";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  showBalance?: boolean;
}

export function DashboardLayout({ children, title, showBalance = true }: DashboardLayoutProps) {
  const location = useLocation();

  const navigationItems = [
    {
      to: "/dashboard",
      icon: TrendingUp,
      label: "Dashboard",
      active: location.pathname === "/dashboard"
    },
    {
      to: "/opportunities",
      icon: Target,
      label: "Oportunidades",
      active: location.pathname === "/opportunities"
    },
    {
      to: "/meus-investimentos",
      icon: Eye,
      label: "Meus Investimentos",
      active: location.pathname === "/meus-investimentos"
    },
    {
      to: "/wallet",
      icon: CreditCard,
      label: "Carteira Virtual",
      active: location.pathname === "/wallet"
    },
    {
      to: "/minha-empresa",
      icon: Building2,
      label: "Minha Empresa",
      active: location.pathname === "/minha-empresa"
    }
  ];

  return (
    <div className="min-h-screen bg-muted/30 font-inter">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo />
            <div className="hidden md:block h-6 w-px bg-border" />
            <h1 className="hidden md:block text-xl font-semibold">
              {title || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {showBalance && (
              <div className="text-right hidden sm:block">
                <div className="text-sm text-muted-foreground">Saldo disponível</div>
                <div className="text-2xl font-bold text-success">
                  R$ {mockCarteira.saldoDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            )}
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" asChild>
              <Link to="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-border h-[calc(100vh-4rem)] sticky top-16 hidden lg:block">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}