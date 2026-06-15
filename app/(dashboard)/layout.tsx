import Navbar from "./_components/navbar";
import OrgSidebar from "./_components/org-sidebar";
import Sidebar from "./_components/sidebar";

interface DashboardProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardProps) => {
  return (
    <main className="h-screen">
      <Sidebar />
      <div className="pl-15 h-full">
        <div className="flex gap-x-3 h-full">
          <OrgSidebar />
          <div className="h-full flex-1">
          <Navbar />
          {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
