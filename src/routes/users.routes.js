const express = require('express');
const router = express.Router();
const userCtrol = require('../controllers/UsersController');

// Ruta para mostrar el formulario de registro
router.get('/signup', userCtrol.rendersignupForm);

// Ruta para manejar el registro de usuarios
router.post('/signup', userCtrol.signup);

// Ruta para mostrar el formulario de inicio de sesión
router.get('/signin', userCtrol.rendersigninForm);

// Ruta para manejar el inicio de sesión de usuarios
router.post('/signin', userCtrol.signin);

router.get('/logout', userCtrol.logout);
// Ruta para mostrar el formulario de restablecimiento de contraseña
router.get('/forgot-password', userCtrol.renderForgotPasswordForm);

// Ruta para manejar la solicitud de restablecimiento de contraseña
router.post('/forgot-password', userCtrol.forgotPassword);


module.exports = router;
