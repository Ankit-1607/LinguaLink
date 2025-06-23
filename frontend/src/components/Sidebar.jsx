import { Home, Users, Ban, Bell, Flame, User2Icon, User, Users2, Palette, BellIcon } from 'lucide-react';
import useAuthUser from '../hooks/useAuthUser';
import React from 'react';

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const currentLocation = window.location.pathname;
  console.log('Current location:', currentLocation);

  const streak = authUser?.streak.count ?? 0; // nullish coalescing operator- if streak is undefined or null, default to 0

  const links = [
    {label:'Home', icon: <Home className="w-5 h-5 mr-2" />, href: '/' },
    {label:'Profile', icon: <User2Icon className="w-5 h-5 mr-2" />, href: '/profile' },
    {label:'Friends', icon: <Users className="w-5 h-5 mr-2" />, href: '/friends' },
    {label:'Blocked users', icon: <Ban className="w-5 h-5 mr-2" />, href: '/blocked' },
    {label:'Themes', icon: <Palette className="w-5 h-5 mr-2" />, href: '/themes' },
    {label:'Notifications', icon: <Bell className="w-5 h-5 mr-2" />, href: '/notifications' },
  ];

  return (
    <aside className="flex flex-col justify-between w-64 bg-base-100 shadow-lg py-6 px-4 h-screen sticky top-0">
      <div>
        <div className="text-2xl font-extrabold text-primary mb-8 text-center tracking-wide">
          {/* assigning new classes to the icon */}
          {React.cloneElement(
            links.find(link => link.href === currentLocation)?.icon,
            { className: "w-6 h-6 mr-2 inline" }
          )}LinguaLink
        </div>
        <nav className="flex flex-col gap-2">
          {links.map(link => (
            <a
              key={link.label}
              href={link.href}
              className={`flex items-center px-4 py-2 rounded-lg text-base-content hover:bg-base-200 transition-colors font-medium ${currentLocation === link.href ? 'btn-active' : ''}`}
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-col items-center mb-2">
        <div className="flex items-center justify-center bg-secondary text-secondary-content rounded-full w-12 h-12 mb-1">
          <Flame className="w-7 h-7" />
        </div>
        <div className="text-md font-semibold text-secondary ">
          {streak} day streak
        </div>
      </div>

      <div className="text-center text-md text-base-content">
        <p className="mb-1">Logged in as:</p>
        <p className="font-semibold">{authUser?.fullName}</p>
      </div>
    </aside>
  );
};

export default Sidebar;