const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth');
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
  
      // Guarda la información del usuario en Firestore
      const userRef = collection(firestore, 'users');
      await addDoc(userRef, {
        uid: user.uid,
        name: name,
        email: email,
      });
  
      req.flash('success_msg', '¡Registro exitoso! Inicia sesión.');
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
    await signInWithEmailAndPassword(auth, email, password);
    req.flash('success_msg', '¡Sesión iniciada!');
    res.redirect('/crud'); // Redirige al "crud" o la página que desees.
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    req.flash('error_msg', 'Error al iniciar sesión');
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
};
module.exports = userCtrol;
