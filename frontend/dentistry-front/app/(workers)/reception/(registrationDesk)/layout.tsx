import HeaderAdmin from "./components/Header";

export default function RegesterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* HEader */}
      <HeaderAdmin />

      {/* Body */}
      <div className=" flex-1 w-full h-full bg-linear-to-l from-[#874FD1] to-[#6F6697]">
        {children}
      </div>

      {/* Footer */}
    </div>
  );
}
