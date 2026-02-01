# Guía Lógica de Autenticación (Sin Código)

Flujo para conectar el panel de administrador con el backend.

## 1. Administrador Predeterminado
Al inicializar la app, ya existe este usuario admin predeterminado:
*   **Email:** `admin@admin.com`
*   **Contraseña:** `admin`

---

## 2. Pasos para Entrar al Panel (LOGIN)

1.  **Formulario de Login:** En la pantalla de inicio de sesión, el usuario ingresa su email y contraseña.
2.  **Petición al Backend:** El frontend envía estos datos (email y password) a la ruta de "Login".
3.  **Recibir Token:**
    *   Si los datos son correctos, el backend responde con un "Token"
    *   Si son incorrectos, dará error.
4.  **Guardar la Llave:** El frontend debe guardar este Token en la memoria del navegador.
5.  **Entrar:** Una vez guardado, se deberá redirigir al usuario al Panel de Administración.

---

## 3. Pasos para Registrar Admin Nuevo (REGISTER)

*Opcional: Si queres crear más administradores desde tu sistema.*

1.  **Datos del Nuevo Admin:** en Postman en rutas /api/v1/register -> /api/v1/login.
2.  **Enviar Solicitud:** Envías los datos a la ruta de "Register" y luego los usas en la ruta de "Login", tal como se muestra en endpoints.MD.
3.  **Confirmación:** El backend crea el usuario. Ahora este nuevo usuario puede seguir los pasos del **Punto 2 (Login)** para entrar.

---

## 4. Usar el Panel

Cada vez que quieras cargar datos privados (como la lista de reservas) dentro del panel:

1.  **Recuperar la Llave:** El frontend busca el Token que guardaste en el paso 2.
2.  **Pedir Datos:** Al pedirle información al backend, le das el Token para demostrar que eres admin.
3.  **Acceso Permitido:** El backend verifica el Token y te entrega la información.
