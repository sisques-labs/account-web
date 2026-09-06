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
    notFound: {
      title: 'App no encontrada',
      description: 'Esta app no existe o ya no está disponible.',
    },
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
