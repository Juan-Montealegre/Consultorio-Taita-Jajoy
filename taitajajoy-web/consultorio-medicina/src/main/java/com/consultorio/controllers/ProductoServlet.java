package com.consultorio.controllers;

import com.consultorio.models.Producto;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/productos")
public class ProductoServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Aquí se obtendrán los productos de la base de datos
        List<Producto> productos = obtenerProductos();
        request.setAttribute("productos", productos);
        request.getRequestDispatcher("/productos.html").forward(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Aquí se manejará la adición de un nuevo producto
        String nombre = request.getParameter("nombre");
        String descripcion = request.getParameter("descripcion");
        agregarProducto(new Producto(nombre, descripcion));
        response.sendRedirect("productos");
    }

    private List<Producto> obtenerProductos() {
        // Lógica para obtener productos de la base de datos
        return null; // Reemplazar con la implementación real
    }

    private void agregarProducto(Producto producto) {
        // Lógica para agregar un producto a la base de datos
    }
}