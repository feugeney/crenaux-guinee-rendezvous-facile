
import { useLocation } from 'react-router-dom';
import { MenuItem } from './menuItems';

export const useNavigationState = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/admin') {
      return currentPath === '/admin';
    }
    return currentPath.startsWith(path);
  };

  const hasActiveSubmenu = (item: MenuItem) => {
    if (!item.submenu) return false;
    return item.submenu.some((subItem) => isActive(subItem.url));
  };

  const getNavClass = (path: string) => {
    return isActive(path) 
      ? "bg-gold-100 text-gold-900 font-medium" 
      : "hover:bg-gray-100 text-gray-700 hover:text-gray-900";
  };

  return {
    currentPath,
    isActive,
    hasActiveSubmenu,
    getNavClass
  };
};
