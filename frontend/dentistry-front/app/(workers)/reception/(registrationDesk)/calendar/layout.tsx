import "../../../../globals.css";
export default function CalendarAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <div className="min-h-screen w-full bg-linear-to-r from-[#874FD1] to-[#7562A5]"> {children} </div>
  );
}
