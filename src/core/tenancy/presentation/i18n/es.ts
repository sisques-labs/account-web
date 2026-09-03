import type { TenancyDict } from './en';
import type { WidenStringLiterals } from '@/shared/presentation/i18n/widen-literals';

const dict = {
  admin: {
    nav: {
      apps: 'Apps del ecosistema',
      users: 'Usuarios de la plataforma',
      invites: 'Invitaciones pendientes',
    },
    unauthorized: {
      title: 'No autorizado',
      description: 'No tienes acceso de administrador de plataforma a esta sección.',
    },
  },
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
    error: 'No se han podido cargar las apps. Inténtalo de nuevo.',
  },
  appDetail: {
    columns: {
      tenant: 'Tenant',
      members: 'Miembros',
      created: 'Creado',
    },
    viewMembers: 'Ver miembros',
    createTenant: 'Crear tenant',
    loading: 'Cargando tenants…',
    empty: {
      title: 'Todavía no hay tenants',
      description: 'Los tenants creados para esta app aparecerán aquí.',
    },
    error: 'No se han podido cargar los tenants. Inténtalo de nuevo.',
  },
  createAppDialog: {
    title: 'Nueva app',
    description: 'Registra una nueva app en el ecosistema de Sisqués Labs.',
    name: { label: 'Nombre de la app', placeholder: 'Ej. Gardenia' },
    submit: 'Crear app',
    submitting: 'Creando app…',
    errors: { generic: 'Algo ha salido mal. Inténtalo de nuevo.' },
  },
  createTenantDialog: {
    title: 'Nuevo tenant',
    description: 'Serás el propietario de este tenant.',
    name: { label: 'Nombre del tenant', placeholder: 'Ej. Casa de Marta' },
    submit: 'Crear tenant',
    submitting: 'Creando tenant…',
    errors: { generic: 'Algo ha salido mal. Inténtalo de nuevo.' },
  },
  membersDialog: {
    title: 'Miembros de {name}',
    loading: 'Cargando miembros…',
    empty: 'Todavía no hay miembros.',
    userIdLabel: 'Usuario',
    addMember: {
      title: 'Añadir miembro',
      email: { label: 'Correo electrónico', placeholder: 'persona@ejemplo.com' },
      role: { label: 'Rol' },
      submit: 'Añadir miembro',
      submitting: 'Añadiendo…',
      errors: {
        generic: 'Algo ha salido mal. Inténtalo de nuevo.',
      },
    },
  },
  roles: {
    OWNER: 'Propietario',
    ADMIN: 'Administrador',
    MEMBER: 'Miembro',
  },
  users: {
    title: 'Usuarios de la plataforma',
    columns: { user: 'Usuario', platformAdmin: 'Admin plataforma', tenants: 'Tenants', since: 'Desde' },
    unavailable: {
      title: 'Esta sección todavía no está disponible',
      description: 'account-api todavía no expone un listado de usuarios de la plataforma.',
    },
  },
  invites: {
    title: 'Invitaciones pendientes',
    columns: { email: 'Email', tenant: 'Tenant', role: 'Rol', invitedBy: 'Invitado por', expires: 'Expira' },
    unavailable: {
      title: 'Esta sección todavía no está disponible',
      description: 'account-api todavía no implementa invitaciones de tenant.',
    },
  },
  validation: {
    nameRequired: 'Introduce un nombre de tenant.',
    emailInvalid: 'Introduce un correo electrónico válido.',
    roleRequired: 'Selecciona un rol.',
  },
} satisfies WidenStringLiterals<TenancyDict>;

export default dict;
