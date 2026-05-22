import ClientFooter from "./components/footer";
import HeaderClient from "./components/header";
import ProtectedRoute from "./ProtectedRoute";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProtectedRoute>
        <div className="relative bg-white min-h-screen flex flex-col">
          {/* Yellow background */}
          <div className="absolute inset-0 flex justify-end pointer-events-none z-0">
            <div className="w-2/3 h-full bg-yellow-500 rounded-b-[1000px] rounded-br-none" />
          </div>

          {/* Header */}
          <div className="relative z-20">
            <HeaderClient />
          </div>

          {/* Content */}
          <div className="relative z-10 flex justify-center ">
            <div className="w-full max-w-full rounded-lg p-6">{children}</div>
          </div>

          {/* Footer */}
          <div className="relative z-0 mt-auto">
            <ClientFooter />
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}
