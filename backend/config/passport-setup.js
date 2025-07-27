// backend/config/passport-setup.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../database/setup');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Lógica para encontrar o crear un usuario
      try {
        let user = await User.findOne({ where: { email: profile.emails[0].value } });

        if (user) {
          // El usuario ya existe
          done(null, user);
        } else {
          // Si el usuario no existe, lo creamos
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            // No guardamos contraseña para usuarios de Google
          });
          done(null, newUser);
        }
      } catch (error) {
        done(error, null);
      }
    }
  )
);