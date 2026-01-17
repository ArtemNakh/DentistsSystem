export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center h-screen  bg-linear-to-r from-gray-500 to-purple-700">
      <div className=" p-6 rounded-lg bg-soft-purple-5 border-2 border-gray-400">
        {children}
      </div>
    </div>
  );
}
