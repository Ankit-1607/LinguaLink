import React from 'react';
import { Home, Bell, UserPlus, LogOut, MessageCircle } from 'lucide-react';
import useAuthUser from '../hooks/useAuthUser.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { logout } from '../lib/api.js';
import useLogout from '../hooks/useLogout.js';

const Navbar = () => {
  const { authUser } = useAuthUser();
  const profileImageUrl = authUser?.profilePic;

  const currentLocation = window.location.pathname;
  const isChatPage =  currentLocation.startsWith('/chat');

  const {logoutMutation, isPending, error} = useLogout();
  const links = [
    {label:'Home', icon: <Home className="w-5 h-5 mr-2" />, href: '/' },
    {label:'Notifications', icon: <Bell className="w-5 h-5 mr-2" />, href: '/notifications' },
    {label:'Friend Requests', icon: <UserPlus className="w-5 h-5 mr-2" />, href: '/friend-requests' },
  ];


  return (
  <>
    <nav className="w-full bg-base-100 shadow flex items-center gap-2 px-6 py-3">
      <div className="w-64 flex-shrink-0 flex items-center">
        {isChatPage && (
          <div className="text-2xl font-extrabold text-primary tracking-wide flex items-center">
            <MessageCircle className="w-6 h-6 mr-2 inline" />
            LinguaLink
          </div>
        )}
      </div>
      <div className="flex-1 flex items-center justify-end gap-2">
        {links.map((link) => (
          <a
          href={link.href}
          key={link.label}
          className={`flex items-center px-4 py-2 rounded-lg text-base-content hover:bg-base-200 transition-colors font-medium ${currentLocation === link.href ? 'btn-active' : ''}`}
          >
            {link.icon}
          </a>
          
        ))}
        <a
          href="/profile"
          className="flex items-center hover:ring-2 ring-primary rounded-full transition"
          aria-label="Profile"
          >
          <img
            src={profileImageUrl}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
            />
        </a>
        <button
          onClick={logoutMutation}
          disabled={isPending}
          >
          <LogOut className="w-5 h-5 mr-2" />
        </button>
      
      </div>

    </nav>
  </>
  );
};

export default Navbar;