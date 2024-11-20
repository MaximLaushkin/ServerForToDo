const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Создаем приложение Express
const app = express();
const PORT = process.env.PORT || 3000;

// Подключение к MongoDB
const MONGO_URL = 'mongodb+srv://admin:admin@cluster0.hqgmb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Например, MongoDB Atlas
mongoose.connect(MONGO_URL)
  .then(() => console.log('Подключено к MongoDB'))
  .catch((err) => console.error('Ошибка подключения к MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.json()); // Для обработки JSON-запросов

// Схема для пользователя
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Роут для регистрации
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Проверка пароля
        if (password.length < 6) {
            return res.status(400).json({ message: 'Пароль должен содержать минимум 6 символов' });
        }

        // Создание нового пользователя
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Такой email уже зарегистрирован' });
        }
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});