import type { ShellDict } from './en';
import type { WidenStringLiterals } from '../widen-literals';

const dict = {
  welcome: {
    title: 'Plantilla Next.js DDD',
    description: 'Todavía no hay bounded contexts — añade el primero bajo src/core/ para definir el patrón.',
  },
} satisfies WidenStringLiterals<ShellDict>;

export default dict;
