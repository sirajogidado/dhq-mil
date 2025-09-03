import { Button } from "@/components/ui/button";
import { Shield, Users, FileText } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl shadow-elegant">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">NIMADS</h1>
              <p className="text-sm text-muted-foreground">National Integrated Military & Demographic System</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <Users className="w-4 h-4 mr-2" />
              Citizens
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              <FileText className="w-4 h-4 mr-2" />
              Residents
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Admin Portal
            </Button>
            <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
              Register Now
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;