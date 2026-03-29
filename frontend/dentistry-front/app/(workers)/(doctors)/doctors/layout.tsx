import { SpecialtyType } from "@/lib/redux/modules/Specialties/Entities/Specialties/Specialties.interface";
import HeaderAdmin from "./components/Header";
import ProtectedRoute from "./ProtectedRoute";

interface RegesterLayoutProps {
  children: React.ReactNode;
}

export default function RegesterLayout({ children }: RegesterLayoutProps) {
  return (
   <ProtectedRoute allowedRoles={[SpecialtyType.DOCTOR]}>
      <div className="w-full min-h-screen flex flex-col">
        {/* HEader */}
        <HeaderAdmin />

        {/* Body */}
        <div className=" flex-1 w-full h-full bg-linear-to-l from-[#874FD1] to-[#6F6697]">
          {children}
        </div>

        {/* Footer */}
      </div>
    </ProtectedRoute>
  );
}
