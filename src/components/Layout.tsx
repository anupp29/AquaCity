import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplets, LayoutDashboard, List, Plus, BarChart3, Menu, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useWaterBodies } from '@/contexts/WaterBodyContext';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Water Bodies', href: '/list', icon: List },
  { name: 'Add New', href: '/add', icon: Plus },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
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
                  <div className="flex items-center gap-2 px-4 mb-6">
                    <div className="bg-gradient-water p-2 rounded-lg">
                      <Droplets className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-foreground">SDG 6 Water Watch</h2>
                      <p className="text-xs text-muted-foreground">Clean Water • Maharashtra</p>
                    </div>
                  </div>
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-gradient-water p-2 rounded-lg">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg text-foreground">SDG 6 Water Watch</h1>
                <p className="text-xs text-muted-foreground">Clean Water • Maharashtra</p>
              </div>
            </Link>
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
        <div className="container py-6">
          <p className="text-center text-sm text-muted-foreground">
            Maharashtra Water Body Health Reporter - Monitoring water quality for a healthier tomorrow
          </p>
        </div>
      </footer>
    </div>
  );
};
