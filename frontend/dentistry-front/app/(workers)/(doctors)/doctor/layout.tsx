import HeaderDoctor from "./components/Header";

interface RegesterLayoutProps {
  children: React.ReactNode;
}

export default function RegesterLayout({ children }: RegesterLayoutProps) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* HEader */}
      <HeaderDoctor />

      {/* Body */}
      <div className=" flex-1 w-full h-full bg-linear-to-l from-[#874FD1] to-[#6F6697]">
        {children}
      </div>

      {/* Footer */}
    </div>
  );
}
