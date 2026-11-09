# Sistema de Rehabilitación Cognitiva

Aplicación web en Next.js, TypeScript y Tailwind CSS para apoyar progresivamente la gestión de rehabilitación cognitiva. Esta primera etapa implementa acceso de especialistas y administración de datos básicos de pacientes.

## Arquitectura actual

- **Next.js App Router** para rutas y composición de páginas.
- **TypeScript** para tipado estático.
- **Tailwind CSS** y componentes reutilizables para la interfaz.
- **Supabase Auth** para autenticación de especialistas.
- **Supabase PostgreSQL** para registros administrativos.
- **Row Level Security (RLS)** como control de acceso en la base de datos. El cliente web utiliza únicamente la clave `anon` pública; nunca debe incluirse `service_role` en el navegador.

Los datos de pacientes en esta etapa se limitan a nombre, edad opcional y localidad opcional. No se guardan diagnósticos, notas, objetivos ni resultados clínicos. Los datos se consultan directamente desde Supabase; no hay una base de datos simulada.

## Requisitos para ejecutar

- Node.js 20 o posterior y npm.
- Proyecto Supabase configurado.
- Cuenta creada en Supabase Auth y perfil de especialista autorizado según los pasos siguientes.

## Configuración local

1. Instala dependencias: `npm install`.
2. Copia `.env.example` a `.env.local`.
3. En Supabase, copia la URL del proyecto y la clave pública `anon` a las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Ejecuta el SQL de `supabase/migrations/202611090001_initial_schema.sql` en el SQL Editor de Supabase.
5. Crea la cuenta del especialista desde Supabase Auth (no existe registro público en la aplicación).
6. Autoriza explícitamente esa cuenta como especialista mediante el procedimiento de abajo.
7. Inicia la aplicación: `npm run dev`.

## Autorizar un especialista

Después de crear la cuenta en Supabase Auth, usa su UUID (`auth.users.id`) para insertar el perfil desde el SQL Editor con privilegios administrativos. Reemplaza el UUID de ejemplo:

```sql
insert into public.profiles (id, role)
values ('00000000-0000-0000-0000-000000000000', 'specialist')
on conflict (id) do update set role = excluded.role;
```

La aplicación solo permite acceder al área privada a cuentas con un registro `profiles` y rol `specialist`. No se proporciona una operación de autoasignación de roles.

## Comprobaciones

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Estas comprobaciones deben ejecutarse localmente después de configurar dependencias y variables de entorno. No se afirma que se hayan ejecutado en el entorno de creación del repositorio.

## Próximas etapas

1. Revisar requisitos de privacidad, consentimiento, retención y auditoría antes de ampliar los datos personales.
2. Definir los flujos y permisos del rol paciente.
3. Especificar y validar con especialistas las actividades y sesiones antes de implementar funciones clínicas.
4. Incorporar pruebas automatizadas y despliegue una vez acordados los entornos.
