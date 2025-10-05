import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, TrendingUp, Users, CheckCircle, Target, Banknote } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-inter">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Investimentos P2P simples, seguros e acessíveis
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto">
              Conectamos empresas que precisam de crédito com investidores que buscam rentabilidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <Button size="lg" className="gradient-primary text-white shadow-elegant h-12 sm:h-14" asChild>
                <Link to="/login">
                  Quero Investir
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white h-12 sm:h-14" asChild>
                <Link to="/login">
                  Quero Crédito
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Por que escolher a Qinvest?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa para conectar oportunidades de investimento
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* PMEs Access Credit */}
            <Card className="text-center shadow-card hover:shadow-card-hover transition-all duration-300 border-0">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Banknote className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">PMEs acessam crédito</CardTitle>
                <CardDescription className="text-lg">
                  Empresas obtêm financiamento rápido e sem burocracria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Análise em até 48h
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Taxas competitivas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Processo 100% digital
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Investors Diversify */}
            <Card className="text-center shadow-card hover:shadow-card-hover transition-all duration-300 border-0">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-success/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-2xl mb-2">Investidores diversificam carteira</CardTitle>
                <CardDescription className="text-lg">
                  Rentabilidade atrativa com diversificação de riscos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Rentabilidade até 15% a.a.
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Investimento mínimo R$ 100
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Análise de risco detalhada
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Transparency and Security */}
            <Card className="text-center shadow-card hover:shadow-card-hover transition-all duration-300 border-0">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">Transparência e segurança</CardTitle>
                <CardDescription className="text-lg">
                  Tecnologia avançada para proteger seus investimentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Criptografia SSL 256 bits
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Relatórios em tempo real
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-success mr-2" />
                    Compliance rigoroso
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">R$ 50M+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Volume investido</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-success mb-2">2.500+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Investidores ativos</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">800+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Empresas financiadas</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-success mb-2">12.5%</div>
              <div className="text-sm sm:text-base text-muted-foreground">Rentabilidade média</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-r from-primary to-success">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de investidores e empresas que já confiam na Qinvest
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-elegant h-12 sm:h-14" asChild>
            <Link to="/register">
              Criar Conta Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}