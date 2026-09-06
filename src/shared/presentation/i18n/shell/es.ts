import type { ShellDict } from './en';
import type { WidenStringLiterals } from '../widen-literals';

const dict = {
  welcome: {
    title: 'Plantilla Next.js DDD',
    description: 'Todavía no hay bounded contexts — añade el primero bajo src/core/ para definir el patrón.',
  },
  error: {
    title: 'Algo ha salido mal',
    description: 'Se ha producido un error inesperado al cargar esta página.',
    retry: 'Inténtalo de nuevo',
  },
} satisfies WidenStringLiterals<ShellDict>;

export default dict;
