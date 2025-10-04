import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Shield, Bell, Trash2, Eye, EyeOff, FileText, CheckCircle, Clock, AlertCircle, Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showKycDialog, setShowKycDialog] = useState(false);
  
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

  // Mock KYC status
  const [kycStatus] = useState({
    status: "pendente", // aprovado, pendente, rejeitado
    progress: 60,
    documents: [
      { name: "CPF", status: "aprovado", required: true },
      { name: "RG", status: "pendente", required: true },
      { name: "Comprovante de Residência", status: "pendente", required: true },
      { name: "Comprovante de Renda", status: "aprovado", required: false }
    ]
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

  const handleKycUpload = () => {
    toast({
      title: "Documento enviado!",
      description: "Seus documentos foram enviados para análise.",
    });
    setShowKycDialog(false);
  };

  const getKycStatusBadge = (status: string) => {
    switch (status) {
      case "aprovado":
        return <Badge className="bg-success/10 text-success">✅ Aprovado</Badge>;
      case "pendente":
        return <Badge className="bg-warning/10 text-warning">⏳ Pendente</Badge>;
      case "rejeitado":
        return <Badge className="bg-destructive/10 text-destructive">❌ Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getKycStatusIcon = (status: string) => {
    switch (status) {
      case "aprovado":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "pendente":
        return <Clock className="h-5 w-5 text-warning" />;
      case "rejeitado":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <DashboardLayout title="Configurações">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* KYC - Verificação de Identidade */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  Verificação de Identidade (KYC)
                </CardTitle>
                <CardDescription>
                  Complete sua verificação para ter acesso a todas as funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Status da Verificação</h3>
                    <p className="text-sm text-muted-foreground">
                      {kycStatus.progress}% concluído
                    </p>
                  </div>
                  {getKycStatusBadge(kycStatus.status)}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{kycStatus.progress}%</span>
                  </div>
                  <Progress value={kycStatus.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kycStatus.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getKycStatusIcon(doc.status)}
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          {doc.required && (
                            <p className="text-xs text-muted-foreground">Obrigatório</p>
                          )}
                        </div>
                      </div>
                      {getKycStatusBadge(doc.status)}
                    </div>
                  ))}
                </div>

                <Dialog open={showKycDialog} onOpenChange={setShowKycDialog}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary text-white w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Enviar Documentos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Enviar Documentos para Verificação</DialogTitle>
                      <DialogDescription>
                        Faça upload dos documentos necessários para completar sua verificação
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>RG ou CNH (Frente)</Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                            <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Clique para fazer upload</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>RG ou CNH (Verso)</Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                            <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Clique para fazer upload</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Comprovante de Residência</Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                            <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Clique para fazer upload</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Comprovante de Renda (Opcional)</Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                            <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Clique para fazer upload</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Dicas para uma aprovação rápida:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Certifique-se de que os documentos estão legíveis</li>
                          <li>• Evite reflexos e sombras nas fotos</li>
                          <li>• O comprovante de residência deve ter no máximo 3 meses</li>
                          <li>• Todos os documentos devem estar dentro do prazo de validade</li>
                        </ul>
                      </div>

                      <Button onClick={handleKycUpload} className="w-full">
                        Enviar Documentos
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

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
      </div>
    </DashboardLayout>
  );
};

export default Settings;