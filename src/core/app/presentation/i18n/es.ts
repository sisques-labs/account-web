import type { AppDict } from './en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

const dict = {
  apps: {
    title: 'Apps del ecosistema',
    createApp: 'Crear app',
    connected: 'Conectada',
    tenantsLabel: 'tenants',
    usersLabel: 'usuarios',
    viewTenants: 'Ver tenants →',
    loading: 'Cargando apps…',
    empty: {
      title: 'Todavía no hay apps',
      description: 'Las apps creadas en account-api aparecerán aquí.',
    },
  },
  createAppDialog: {
    title: 'Nueva app',
    description: 'Registra una nueva app en el ecosistema de Sisqués Labs.',
    name: { label: 'Nombre de la app', placeholder: 'Ej. Gardenia' },
    submit: 'Crear app',
    submitting: 'Creando app…',
    errors: { generic: 'Algo ha salido mal. Inténtalo de nuevo.' },
  },
  validation: {
    nameRequired: 'Introduce un nombre de app.',
  },
} satisfies WidenStringLiterals<AppDict>;

export default dict;
