import React, { useState } from 'react';
import { AcademicCapIcon, XIcon, MenuIcon } from './Icons';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  // NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  // NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { useAuth } from '@/hooks/userContext';
export const Header: React.FC = () => {
  const {isLoggedIn,logout} = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studyGroupOpen, setStudyGroupOpen] = useState(false); 

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between whitespace-nowrap px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 text-slate-900">
          <div className="size-8 text-[#1993e5]">
            <AcademicCapIcon />
          </div>
          <a href='/' className="text-xl font-bold leading-tight tracking-tight">AcadNet</a>
        </div>
        
        <nav className="hidden lg:flex items-center gap-8">
          <a className="text-slate-700 hover:text-[#1993e5] text-sm font-medium leading-normal transition-colors" href="/">Home</a>
          <NavigationMenu >
            <NavigationMenuList >
              <NavigationMenuItem >
                <NavigationMenuTrigger className='bg-transparent'>Study Group</NavigationMenuTrigger>
                <NavigationMenuContent className='cursor-pointer '>
                  <NavigationMenuLink className='hover:text-[#1993e5]' asChild><Link to={'/create'} >Create Group</Link></NavigationMenuLink>
                  <NavigationMenuLink className='hover:text-[#1993e5]' asChild><Link to={'join'}>Join Group</Link></NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <a className="text-slate-700 hover:text-[#1993e5] text-sm font-medium leading-normal transition-colors" href="#">Resources</a>
          <a className="text-slate-700 hover:text-[#1993e5] text-sm font-medium leading-normal transition-colors" href="#">About</a>
        </nav>
        
        <div className="flex items-center gap-3">
          <button 
            className="flex lg:hidden items-center justify-center size-10 rounded-full text-slate-700 hover:bg-slate-200 transition-colors"
            onClick={toggleMenu}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
      {isLoggedIn() ? (
        <>
          
          <a href='' onClick={logout} className="hidden sm:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 text-slate-900 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-300 transition-colors">
            <span className="truncate">Logout</span>
          </a>
          </>
      ):(
        <>
          <Link to={'/register'} className="hidden sm:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#1993e5] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#137abd] transition-colors">
            <span className="truncate">Sign Up</span>
          </Link>
          
          <Link to={'/login'} className="hidden sm:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 text-slate-900 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-300 transition-colors">
            <span className="truncate">Log In</span>
          </Link></>
      )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-white/90 backdrop-blur-2xl shadow-lg z-50 p-4">
          <nav className="flex flex-col space-y-4">
            <a className="text-slate-700 hover:text-[#1993e5] text-sm font-medium py-2 transition-colors" href="/">Home</a>
            {/* Collapsible Study Group for mobile */}
            <div>
              <button
                className="w-full flex items-center justify-between text-slate-700 hover:text-[#1993e5] text-sm font-medium py-2 transition-colors"
                onClick={() => setStudyGroupOpen(open => !open)}
              >
                <span>Study Group</span>
                {/* <span>{studyGroupOpen ? "▲" : "▼"}</span> */}
              </button>
              {studyGroupOpen && (
                <div className="pl-4 flex flex-col space-y-2">
                  <Link
                    to={'/create'}
                    className="text-slate-700 hover:text-[#1993e5] text-sm font-medium py-1 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Group
                  </Link>
                  <Link
                    to={'/join'}
                    className="text-slate-700 hover:text-[#1993e5] text-sm font-medium py-1 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Join Group
                  </Link>
                </div>
              )}
            </div>
            <a className="text-slate-700 hover:text-[#1993e5] text-sm font-medium py-2 transition-colors" href="#">Resources</a>
            <a className="text-slate-700 hover:text-[#1993e5] text-sm font-medium py-2 transition-colors" href="#">About</a>
            <div className="flex space-x-3 pt-2">
              {isLoggedIn() ? (
                  <button onClick={logout} className="flex-1 flex items-center justify-center rounded-lg h-10 px-4 bg-[#1993e5] text-slate-50 text-sm font-bold hover:bg-[#137abd] transition-colors">
                  Logout
                </button>
              ):(
                <>
              <Link to={'/register'}>
                <button className="flex-1 flex items-center justify-center rounded-lg h-10 px-4 bg-[#1993e5] text-slate-50 text-sm font-bold hover:bg-[#137abd] transition-colors">
                  Sign Up
                </button>
              </Link>
              <Link to={'/login'}>
                <button className="flex-1 flex items-center justify-center rounded-lg h-10 px-4 bg-slate-200 text-slate-900 text-sm font-bold hover:bg-slate-300 transition-colors">
                  Log In
                </button>
              </Link>
              </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};