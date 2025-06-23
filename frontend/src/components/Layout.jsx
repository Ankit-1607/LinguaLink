import { Children } from "react"
import Navbar from "./NavBar.jsx"
import Sidebar from "./Sidebar.jsx"
const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="min-h-screen flex">
        {showSidebar && <Sidebar />}

        <div className='flex-1 flex flex-col'>
          <Navbar />

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout