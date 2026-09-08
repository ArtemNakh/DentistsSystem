# DentistsSystem 🦷

**DentistsSystem** — це веб‑система для управління стоматологічною клінікою. Вона дозволяє адмініструвати пацієнтів, лікарів, записи на прийом, а також інтегрувати сучасні інструменти для зручності роботи персоналу та пацієнтів.

---

## 📌 Основні можливості
- **Управління пацієнтами**: створення, редагування та перегляд карток пацієнтів.  
- **Запис на прийом**: інтерактивний календар для бронювання часу.  
- **Управління лікарями**: профілі стоматологів, спеціалізації, графік роботи.  
- **Адмін‑панель**: керування користувачами, ролями та правами доступу.  
- **Інтеграція з Redis**: кешування та оптимізація продуктивності.  
- **MySQL база даних**: зберігання даних у реляційній структурі.  
- **Docker підтримка**: контейнеризація для швидкого розгортання.  

---

## 🏗️ Архітектура
Проєкт побудований за принципами **чистої архітектури** та включає:
- **Backend**: NestJS + TypeORM/Prisma для роботи з MySQL.  
- **Frontend**: React + TailwindCSS для UI.  
- **State Management**: Redux Toolkit + Saga для асинхронних процесів.  
- **Infrastructure**: Docker Compose для запуску MySQL та Redis.  

```mermaid
graph TD
  A[Frontend React] --> B[Backend NestJS]
  B --> C[MySQL Database]
  B --> D[Redis Cache]


```

## 🚀 Запуск проєкту
```bash
# 1. Клонування репозиторію
git clone https://github.com/ArtemNakh/DentistsSystem.git
cd DentistsSystem

# 2. Запуск через Docker
docker-compose up --build

# 3. Локальний запуск без Docker
npm install
npm run start:dev

```

## 📚 Документація API
Swagger доступний за адресою:
```http
http://localhost:3000/api/docs

```

# 🔧 Environment Setup

Створіть файл **`.env`** у корені проєкту та додайте наступні змінні:

Backend

```
# 🌍 Application
ENVIRONMENT=dev
APPLICATION_PORT=4000
APPLICATION_URL=http://localhost:${APPLICATION_PORT}
APPLICATION_ORIGIN=http://localhost:3000

# 🍪 Session & Cookies
COOKIES_SECRET=secret
SESSION_SECRET=secret
SESSION_NAME=session
SESSION_DOMAIN=localhost
SESSION_MAX_AGE=30d
SESSION_HTTP_ONLY=true
SESSION_SECURE=false
SESSION_FOLDER=sessions

# 🗄️ Database (MySQL)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_ROOT_PASSWORD=secret123
MYSQL_USER=appuser
MYSQL_PASSWORD=appuser123
MYSQL_DB=dental_clinic

# ⚡ Redis
REDIS_USER=default
REDIS_PASSWORD=pass123456
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URI=redis://default:pass123456@localhost:6379

# 📧 Mail
MAIL_HOST=test.gmail.com
MAIL_PORT=1111
MAIL_LOGIN=test@test.com
MAIL_PASSWORD=1111 2222 3333 4444

# 📱 Twilio
TWILIO_ACCOUNT_SID=xxxx5a193155f99ff558xxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxe2df8161221a649bc7xxxxxxxxxx
TWILIO_SENDER_PHONE_NUMBER=+19789xxxxxx

```
## 📖 Пояснення .env Backend

- **Application** — базові налаштування середовища та портів.  
- **Session & Cookies** — параметри для роботи з сесіями та кукі.  
- **Database** — доступ до MySQL (користувач, пароль, назва БД).  
- **Redis** — конфігурація кешу та RedisInsight.  
- **Mail** — SMTP налаштування для відправки пошти.  
- **Twilio** — інтеграція з Twilio для SMS/дзвінків.  


## Frontend
```
# 🌍 Application
ENVIRONMENT=dev

NEXT_PUBLIC_API_URL=http://localhost:4000

APPLICATION_PORT=3000
NEXT_PUBLIC_DISABLE_CSP=true

# ⏱️ Session
NEXT_PUBLIC_SESSION_TIMEOUT_MS=9990000
NEXT_PUBLIC_SESSION_EXPIRY_KEY=sessionExpiry

```
## 📖 Пояснення .env Frontend

- Application — базові налаштування середовища та портів.
- NEXT_PUBLIC_API_URL — публічний URL бекенду, який використовується у фронтенді для запитів.
- APPLICATION_PORT — порт, на якому запускається фронтенд‑додаток.
- NEXT_PUBLIC_DISABLE_CSP — прапорець для вимкнення Content Security Policy (корисно під час розробки).
- NEXT_PUBLIC_SESSION_TIMEOUT_MS — час життя сесії у мілісекундах.
- NEXT_PUBLIC_SESSION_EXPIRY_KEY — ключ для зберігання часу завершення сесії у локальному сховищі.

