export default function ClientFooter() {
  return (
    <>
      <footer className="w-full bg-gray-800 text-gray-200 py-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Наша стоматологія</h3>
            <p className="text-sm leading-relaxed">
              Ми поєднуємо сучасні технології та професійний досвід, щоб
              забезпечити комфортне лікування та здорову усмішку для кожного
              пацієнта.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Навігація</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-yellow-400">Про нас</a></li>
              <li><a href="/services" className="hover:text-yellow-400">Послуги</a></li>
                {/* <li><a href="/contacts" className="hover:text-yellow-400">Контакти</a></li>
                <li><a href="/faq" className="hover:text-yellow-400">Питання та відповіді</a></li> */}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакти</h3>
            <ul className="space-y-2 text-sm">
              <li>📍 м. Запоріжжя, вул. Прикладна, 10</li>
              <li>📞 +380 (XX) XXX-XX-XX</li>
              <li>✉️ info@stomatology.com</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ми в соцмережах</h3>
            <ul className="flex space-x-4 text-sm">
              <li><a href="#" className="hover:text-yellow-400">Facebook</a></li>
              <li><a href="#" className="hover:text-yellow-400">Instagram</a></li>
              <li><a href="#" className="hover:text-yellow-400">YouTube</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>© 2026 Наша стоматологія. Усі права захищено.</p>
          <p className="mt-2">Розроблено з турботою про пацієнтів ❤️</p>
        </div>
      </footer>
    </>
  );
}
