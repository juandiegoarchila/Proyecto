const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification  } = require('firebase/auth');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const app = require('../config/Conexion');

const userCtrol = {};

userCtrol.rendersignupForm = (req, res) => {
  res.render('users/signup');
};
userCtrol.signup = async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  if (password !== confirm_password) {
    req.flash('error_msg', 'Las contraseñas no coinciden');
    return res.redirect('/users/signup');
  }

  if (password.length < 6) {
    req.flash('error_msg', 'La contraseña debe tener al menos 6 caracteres');
    return res.redirect('/users/signup');
  }

  try {
    // Crea un nuevo usuario con Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Envía un correo de verificación al usuario
    await sendEmailVerification(user);

    // Guarda la información del usuario en Firestore
    const userRef = collection(firestore, 'users');
    await addDoc(userRef, {
      uid: user.uid,
      name: name,
      email: email,
    });

    req.flash('success_msg', '¡Registro exitoso! Se ha enviado un correo de verificación a tu dirección de correo electrónico.');
    res.redirect('/users/signin');
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    req.flash('error_msg', 'Error al crear el usuario');
    res.redirect('/users/signup');
  }
};


userCtrol.rendersigninForm = (req, res) => {
  res.render('users/signin');
};

userCtrol.signin = async (req, res, next) => {
  const { email, password } = req.body;
  const auth = getAuth(app);

  try {
    // Inicia sesión con Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      // El usuario no ha verificado su correo electrónico
      req.flash('error_msg', 'Debes verificar tu correo electrónico antes de iniciar sesión.');
      return res.redirect('/users/signin');
    }

    req.flash('success_msg', '¡Sesión iniciada!');
    res.redirect('/crud'); // Redirige al "crud" o la página que desees.
  } catch (error) {
    console.error('Usuario o contraseña incorrectos', error);
    req.flash('error_msg', 'Usuario o contraseña incorrectos');
    res.redirect('/users/signin');
  }
};


userCtrol.logout = (req, res) => {
  const auth = getAuth(app);

  signOut(auth)
    .then(() => {
      req.flash('success_msg', 'Sesión cerrada exitosamente');
      res.redirect('/users/signin');
    })
    .catch((error) => {
      console.error('Error al cerrar sesión:', error);
      req.flash('error_msg', 'Error al cerrar sesión');
      res.redirect('/');
    });
},

// Renderiza el formulario para restablecer la contraseña
userCtrol.renderForgotPasswordForm = (req, res) => {
  res.render('users/forgot-password');
};

// Procesa la solicitud de restablecimiento de contraseña
userCtrol.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const auth = getAuth(app);

  try {
    // Envía un correo electrónico para restablecer la contraseña
    await sendPasswordResetEmail(auth, email);
    req.flash('success_msg', 'Se ha enviado un correo electrónico para restablecer tu contraseña.');
    res.redirect('/users/signin'); // Redirige a la página de inicio de sesión.
  } catch (error) {
    console.error('Error al enviar el correo electrónico de restablecimiento de contraseña:', error);
    req.flash('error_msg', 'Error al enviar el correo electrónico de restablecimiento de contraseña');
    res.redirect('/users/forgot-password');
  }
};
module.exports = userCtrol;