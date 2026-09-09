import type { AuthDict } from './en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

const dict = {
  register: {
    title: 'Crea tu cuenta',
    description: 'Regístrate en Sisques Account para empezar.',
    email: { label: 'Correo electrónico', placeholder: 'tucorreo@ejemplo.com' },
    password: { label: 'Contraseña', placeholder: 'Al menos 8 caracteres' },
    displayName: { label: 'Nombre visible (opcional)', placeholder: 'Jane Doe' },
    submit: 'Crear cuenta',
    submitting: 'Creando cuenta…',
    errors: {
      emailAlreadyRegistered: 'Este correo ya está registrado. Prueba a iniciar sesión.',
      generic: 'Algo ha salido mal. Inténtalo de nuevo.',
    },
    loginLink: '¿Ya tienes cuenta? Inicia sesión',
  },
  login: {
    title: 'Iniciar sesión',
    description: 'Bienvenido de nuevo a Sisques Account.',
    email: { label: 'Correo electrónico', placeholder: 'tucorreo@ejemplo.com' },
    password: { label: 'Contraseña', placeholder: 'Tu contraseña' },
    submit: 'Iniciar sesión',
    submitting: 'Iniciando sesión…',
    errors: {
      invalidCredentials: 'Correo o contraseña incorrectos.',
      generic: 'Algo ha salido mal. Inténtalo de nuevo.',
    },
    registerLink: '¿No tienes cuenta? Regístrate',
    forgotPasswordLink: '¿Olvidaste tu contraseña?',
  },
  forgotPassword: {
    title: 'Recupera tu contraseña',
    description: 'Te enviamos un enlace para restablecerla.',
    email: { label: 'Correo electrónico', placeholder: 'tucorreo@ejemplo.com' },
    submit: 'Enviar enlace de recuperación',
    unavailable: 'Esta función no está disponible todavía.',
    backToLoginLink: 'Volver a iniciar sesión',
  },
  validation: {
    emailInvalid: 'Introduce un correo electrónico válido.',
    passwordTooShort: 'La contraseña debe tener al menos 8 caracteres.',
    passwordRequired: 'Introduce tu contraseña.',
  },
} satisfies WidenStringLiterals<AuthDict>;

export default dict;
