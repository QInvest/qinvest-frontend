import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Shield, Bell, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Header } from "@/components/layout/header";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    investmentAlerts: true,
    marketingEmails: false,
  });

  const [userInfo] = useState({
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    cpf: "123.456.789-00"
  });

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    toast({
      title: "Configuração atualizada",
      description: "Suas preferências foram salvas com sucesso.",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Senha alterada!",
      description: "Sua senha foi atualizada com sucesso.",
    });
    setShowChangePasswordDialog(false);
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Conta excluída",
      description: "Sua conta foi excluída com sucesso.",
      variant: "destructive"
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Informações Pessoais
                </CardTitle>
                <CardDescription>
                  Suas informações básicas cadastradas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" value={userInfo.name} readOnly />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={userInfo.email} readOnly />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" value={userInfo.phone} readOnly />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" value={userInfo.cpf} readOnly />
                </div>
                <p className="text-sm text-muted-foreground">
                  Para alterar essas informações, entre em contato com nosso suporte.
                </p>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  Segurança
                </CardTitle>
                <CardDescription>
                  Configurações de segurança da sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="password">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value="••••••••"
                      readOnly
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Dialog open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Alterar Senha
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Alterar Senha</DialogTitle>
                      <DialogDescription>
                        Digite sua senha atual e a nova senha
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Senha Atual</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="new-password">Nova Senha</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button onClick={handleChangePassword} className="w-full">
                        Alterar Senha
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-6 w-6" />
                  Notificações
                </CardTitle>
                <CardDescription>
                  Configure como você deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notificações por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba atualizações importantes por email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">Notificações por SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba alertas importantes via SMS
                    </p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="investment-alerts">Alertas de Investimento</Label>
                    <p className="text-sm text-muted-foreground">
                      Seja notificado sobre novas oportunidades
                    </p>
                  </div>
                  <Switch
                    id="investment-alerts"
                    checked={settings.investmentAlerts}
                    onCheckedChange={(checked) => handleSettingChange("investmentAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-emails">Emails de Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba promoções e conteúdo educativo
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => handleSettingChange("marketingEmails", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-6 w-6" />
                  Zona de Perigo
                </CardTitle>
                <CardDescription>
                  Ações irreversíveis da sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Excluir Conta
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente excluídos.
                        Você perderá acesso a todos os seus investimentos e não poderá recuperar sua conta.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Sim, excluir minha conta
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <p className="text-xs text-muted-foreground mt-2">
                  Esta ação é irreversível. Certifique-se de que realmente deseja excluir sua conta.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;