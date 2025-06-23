import { Loader2 } from 'lucide-react';
import themeStore from '../lib/themeStore';

const PageLoader = () => {
  const {theme} = themeStore();
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200" data-theme={theme}>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#539aa0] animate-spin" />
        <span className="text-lg text-[#68c1c8] font-semibold">Loading, please wait...</span>
      </div>
    </div>
  );
};

export default PageLoader;
