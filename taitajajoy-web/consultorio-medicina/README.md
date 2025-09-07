# Consultorio de Medicina Tradicional

Este proyecto es una aplicación web para un consultorio de medicina tradicional. La aplicación permite a los usuarios explorar productos, leer testimonios, consultar precios, ver resultados de tratamientos y realizar reservas. Además, incluye una funcionalidad para redirigir a los usuarios a WhatsApp para confirmar citas.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

- **src/main/java/com/consultorio/controllers**: Contiene los servlets que manejan las solicitudes del usuario.
  - `ProductoServlet.java`: Maneja las solicitudes relacionadas con los productos.
  - `TestimonioServlet.java`: Gestiona las solicitudes de testimonios.
  - `PrecioServlet.java`: Maneja las solicitudes de precios de servicios.
  - `ResultadoServlet.java`: Gestiona las solicitudes de resultados de tratamientos.
  - `ReservaServlet.java`: Maneja las solicitudes de reservas.
  - `WhatsappServlet.java`: Redirige a los usuarios a WhatsApp para confirmar citas.

- **src/main/java/com/consultorio/models**: Contiene las clases modelo que representan los datos del consultorio.
  - `Producto.java`: Representa un producto en el consultorio.
  - `Testimonio.java`: Representa un testimonio de un cliente.
  - `Precio.java`: Representa el precio de un servicio.
  - `Resultado.java`: Representa los resultados de un tratamiento.
  - `Reserva.java`: Representa una reserva de cita.
  - `Usuario.java`: Representa a un usuario del sistema.

- **src/main/resources**: Contiene archivos de configuración.
  - `db.properties`: Configuración de la base de datos.

- **src/main/webapp**: Contiene los archivos HTML y CSS para la interfaz de usuario.
  - `index.html`: Página principal del consultorio.
  - `productos.html`: Lista de productos disponibles.
  - `testimonios.html`: Testimonios de los clientes.
  - `precios.html`: Precios de los servicios ofrecidos.
  - `resultados.html`: Resultados de tratamientos realizados.
  - `reservas.html`: Permite a los usuarios realizar reservas.
  - `confirmacion.html`: Muestra una confirmación después de realizar una reserva.
  - `css/estilos.css`: Estilos CSS para el diseño de la página web.

- **pom.xml**: Configuración del proyecto Maven, incluyendo las dependencias necesarias.

## Requisitos

- Java 8 o superior
- Maven
- MySQL

## Instalación

1. Clona este repositorio en tu máquina local.
2. Configura la base de datos en `src/main/resources/db.properties`.
3. Ejecuta el comando `mvn clean install` para compilar el proyecto.
4. Despliega la aplicación en un servidor compatible con servlets.

## Uso

Accede a la página principal en tu navegador y navega a través de las diferentes secciones para explorar los productos, testimonios, precios, resultados y realizar reservas.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.