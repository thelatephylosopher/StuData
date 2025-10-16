import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavBarProps {
  userName?: string;
  userRole?: string;
  userImage?: string;
}

export default function NavBar({ 
  userName = "Dr. Sarah Johnson", 
  userRole = "Academic Administrator",
  userImage 
}: NavBarProps) {
  const [location] = useLocation();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b border-card-border shadow-sm">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <a className="text-2xl font-semibold text-foreground hover-elevate active-elevate-2 px-2 py-1 rounded-md" data-testid="link-home">
              Studata
            </a>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/">
              <a 
                className={`text-sm font-medium px-3 py-2 rounded-md hover-elevate active-elevate-2 ${
                  location === "/" ? "text-primary" : "text-foreground"
                }`}
                data-testid="link-homepage"
              >
                Homepage
              </a>
            </Link>
            <Link href="/about">
              <a 
                className={`text-sm font-medium px-3 py-2 rounded-md hover-elevate active-elevate-2 ${
                  location === "/about" ? "text-primary" : "text-foreground"
                }`}
                data-testid="link-about"
              >
                About
              </a>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-3" data-testid="profile-section">
          <Avatar className="w-10 h-10">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {userName.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground" data-testid="text-username">{userName}</span>
            <span className="text-xs text-muted-foreground" data-testid="text-userrole">{userRole}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
