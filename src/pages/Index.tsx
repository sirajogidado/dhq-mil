import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import RegistrationForm from "@/components/RegistrationForm";
import StatsCards from "@/components/StatsCards";
import heroImage from "@/assets/hero-census.jpg";
import { Shield, Database, Users, Lock, CheckCircle, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-primary leading-tight">
                  Nigeria's Digital
                  <span className="bg-gradient-hero bg-clip-text text-transparent"> Identity</span>
                  <br />Revolution
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Secure, comprehensive citizen and resident registry system powered by advanced AI analytics 
                  and biometric verification for national security and development.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow px-8 py-4 text-lg">
                  <Users className="w-5 h-5 mr-2" />
                  Register as Citizen
                </Button>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg">
                  <Shield className="w-5 h-5 mr-2" />
                  Admin Access
                </Button>
              </div>
              
              <div className="flex items-center space-x-8">
                <div className="flex items-center text-success">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Secure & Encrypted</span>
                </div>
                <div className="flex items-center text-success">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-semibold">AI-Powered Analytics</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-hero rounded-3xl blur-3xl opacity-20"></div>
              <img 
                src={heroImage} 
                alt="Nigerian Digital Identity System" 
                className="relative rounded-3xl shadow-elegant w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Real-Time Registry Statistics</h2>
            <p className="text-lg text-muted-foreground">Live data from across the federation</p>
          </div>
          <StatsCards />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Advanced Registry Capabilities</h2>
            <p className="text-xl text-muted-foreground">Built for security, scalability, and national development</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Biometric Security",
                description: "Advanced fingerprint and iris scanning with military-grade encryption",
                color: "text-primary"
              },
              {
                icon: Database,
                title: "AI Analytics",
                description: "Real-time demographic insights and predictive population modeling",
                color: "text-secondary"
              },
              {
                icon: Users,
                title: "Unified Registry",
                description: "Single platform for citizens and residents with role-based access",
                color: "text-success"
              },
              {
                icon: Lock,
                title: "Data Protection",
                description: "GDPR-compliant with advanced audit trails and access controls",
                color: "text-primary-light"
              },
              {
                icon: CheckCircle,
                title: "Instant Verification",
                description: "Real-time identity verification for government and private services",
                color: "text-secondary-light"
              },
              {
                icon: ArrowRight,
                title: "API Integration",
                description: "Seamless integration with existing government and military systems",
                color: "text-primary"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth group">
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-subtle mb-6 group-hover:shadow-glow transition-smooth ${feature.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-20 px-4 bg-gradient-subtle">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">Complete Your Registration</h2>
            <p className="text-xl text-muted-foreground">Join millions of Nigerians in the digital identity revolution</p>
          </div>
          <RegistrationForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8" />
                <span className="text-xl font-bold">Naija Census Pulse</span>
              </div>
              <p className="text-primary-foreground/80">
                Nigeria's premier digital identity and registry system, securing the future of our nation.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Citizen Registration</li>
                <li>Resident Registry</li>
                <li>Identity Verification</li>
                <li>Biometric Services</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Government</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>Ministry of Interior</li>
                <li>National Population Commission</li>
                <li>Nigerian Military</li>
                <li>Immigration Services</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li>+234 (0) 9 461 4000</li>
                <li>info@naijacensuspulse.gov.ng</li>
                <li>Federal Capital Territory, Abuja</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
            <p className="text-primary-foreground/60">
              © 2024 Federal Republic of Nigeria. All rights reserved. | Built with advanced security protocols.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
