export default function AuthClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative bg-white min-h-dvh">
        {/* Yellow background */}
        <div className="absolute inset-0 flex justify-end pointer-events-none z-10">
          <div className="w-2/3 h-full bg-yellow-500 rounded-b-[1000px] rounded-br-none" />
        </div>

        {/* Content */}
        <div className="relative z-20 flex justify-center py-20">
          <div className="w-full max-w-md bg-gray-200 rounded-lg p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
