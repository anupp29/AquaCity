import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, Plus, BarChart3, Menu, LogOut, Building2, ExternalLink, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useWaterBodies } from '@/contexts/WaterBodyContext';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Water Bodies', href: '/list', icon: List },
  { name: 'Add Record', href: '/add', icon: Plus },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Methodology', href: '/methodology', icon: BookOpen },
];

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, signOut } = useWaterBodies();

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  const LogoBlock = () => (
    <div className="flex items-center gap-2.5">
      <img src="/logo.svg" alt="AquaCity logo" className="h-9 w-9" />
      <div>
        <h2 className="font-extrabold text-foreground leading-tight tracking-tight">AquaCity</h2>
        <p className="text-[10px] font-medium text-muted-foreground leading-none">SDG 11 · Urban Water Infrastructure</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-mist">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full py-6 px-4 space-y-2">
                  <div className="px-4 mb-6">
                    <LogoBlock />
                  </div>
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/">
              <LogoBlock />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {!user && (
              <Link to="/auth">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="container flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 py-8 pr-8">
          <nav className="sticky top-24 space-y-2">
            <NavLinks />
            {user && (
              <Button 
                onClick={signOut}
                variant="ghost" 
                className="w-full justify-start gap-3 px-4 py-3 text-muted-foreground hover:text-foreground mt-4"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </Button>
            )}

            {/* Data attribution sidebar card */}
            <div className="mt-8 p-4 rounded-lg bg-secondary/60 border border-border space-y-2">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Data Sources</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Water quality data extracted from <span className="font-semibold text-foreground">AI Kosh</span> national data platform and validated against CPCB / MoEFCC standards.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">CPCB</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">MoSPI</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">NITI Aayog</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">AI Kosh</span>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-8">
          <div className="max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 backdrop-blur">
        <div className="container py-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">AquaCity</span> — Supporting UN SDG 11: Sustainable Cities & Communities
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a href="https://sdgindiaindex.niti.gov.in/#/ranking" target="_blank" rel="noopener noreferrer" className="hover:text-foreground flex items-center gap-1">
                NITI Aayog SDG Index <ExternalLink className="h-3 w-3" />
              </a>
              <a href="https://www.sdgindia2030.mospi.gov.in/dashboard/overview" target="_blank" rel="noopener noreferrer" className="hover:text-foreground flex items-center gap-1">
                MoSPI Dashboard <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Data sourced from AI Kosh · Methodology aligned with CPCB Water Quality Standards & IS 10500 · Industry best practices per MoEFCC guidelines
          </p>
        </div>
      </footer>
    </div>
  );
};
