export default function AuthClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative min-h-screen bg-white ">
        <div className="absolute  top-0 right-0 w-2/3 h-full rounded-b-[1000px] rounded-br-none bg-yellow-500 z-10" />
        <div className="  absolute top-1/2 left-1/2 w-80 h-auto bg-gray-200 z-20  transform -translate-x-1/2 -translate-y-1/2 rounded-lg">
          {children}
        </div>
      </div>
    </>
  );
}
