

export default function ClientMain() {
  return (
    <>
    <div className="relative z-10 pt-20 px-6"></div>
      <div className="w-full h-full flex flex-col items-center justify-center  px-6">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 drop-shadow-lg">
            Чому варто обрати нашу стоматологію
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Ми поєднуємо професіоналізм лікарів із сучасними технологіями
            управління клінікою, щоб забезпечити вам комфорт, безпеку та якісне
            лікування. Наш підхід базується на прозорості, довірі та турботі про
            кожного пацієнта. Ми прагнемо зробити стоматологію доступною,
            зрозумілою та максимально ефективною для вас і вашої родини.
          </p>
        </header>

        {/* Recommendations Section */}
        <section className="grid lg:grid-cols-3 gap-8 mb-20 w-full items-stretch">
          <div className="bg-white border-2 border-gray-100 rounded-xl shadow-xl p-8 hover:scale-105 transition-transform">
            <h3 className="text-2xl font-bold text-yellow-600 mb-4">
              Економте час
            </h3>
            <p className="text-gray-700">
              Онлайн‑бронь та автоматичні нагадування допоможуть уникнути
              пропусків. Ви можете легко планувати візити без зайвих дзвінків,
              отримувати підтвердження та нагадування прямо на телефон чи email.
            </p>
          </div>

          <div className="bg-white  border-2 border-gray-100 rounded-xl shadow-xl p-8 hover:scale-105 transition-transform">
            <h3 className="text-2xl font-bold text-yellow-600 mb-4">
              Безпека даних
            </h3>
            <p className="text-gray-700">
              Ваші дані захищені сучасними технологіями аутентифікації та
              шифрування. Ми дбаємо про конфіденційність та гарантуємо, що вся
              інформація про лікування зберігається у безпечному середовищі.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-xl shadow-xl p-8 hover:scale-105 transition-transform">
            <h3 className="text-2xl font-bold text-yellow-600 mb-4">
              Прозора інформація
            </h3>
            <p className="text-gray-700">
              Переглядайте історію лікування, вартість послуг та профілі лікарів
              у зручному форматі. Ви завжди знаєте, що і чому робиться, та які
              витрати очікувати.
            </p>
          </div>

          {/* Extra cards */}
          <div className="col-span-3 flex justify-center gap-8">
            <div className="bg-white  border-2 border-gray-100 rounded-xl shadow-xl p-8 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold text-yellow-600 mb-4">
                Зручні платежі
              </h3>
              <p className="text-gray-700">
                Оплачуйте онлайн або в клініці без зайвих черг. Ми пропонуємо
                гнучкі варіанти оплати, щоб процес був максимально простим та
                комфортним для вас.
              </p>
            </div>

            <div className="bg-white  border-2 border-gray-100 rounded-xl shadow-xl p-8 hover:scale-105 transition-transform">
              <h3 className="text-2xl font-bold text-yellow-600 mb-4">
                Турбота про вас
              </h3>
              <p className="text-gray-700">
                Система нагадувань та комунікації допомагає завжди бути на
                зв’язку з клінікою. Ми підтримуємо вас на кожному етапі —
                від консультації до завершення лікування.
              </p>
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Ваші переваги з нами
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Обравши нашу стоматологію, ви отримуєте сучасний сервіс, який
            підвищує комфорт, економить ваш час та гарантує якість лікування.
            Ми створили систему, яка працює для вас і разом з вами. Наші лікарі
            постійно вдосконалюють свої навички, а технології дозволяють
            забезпечити точність діагностики та ефективність процедур. Ми
            прагнемо, щоб кожен пацієнт відчував себе впевнено та спокійно,
            знаючи, що його здоров’я у надійних руках.
          </p>
        </section>

        {/* Call to Action */}
        <div className="text-center mb-12">
          <button className="bg-yellow-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-600 transition-colors">
            Запишіться на прийом зараз
          </button>
          <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
            Не відкладайте турботу про своє здоров’я. Наша команда готова
            допомогти вам зробити перший крок до здорової та красивої усмішки
            вже сьогодні.
          </p>
        </div>
      </div>
    </>
  );
}
