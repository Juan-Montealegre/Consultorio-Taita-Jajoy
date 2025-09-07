package com.consultorio.controllers;

import com.consultorio.models.Precio;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/precios")
public class PrecioServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Precio> precios = obtenerPrecios();
        request.setAttribute("precios", precios);
        request.getRequestDispatcher("/precios.html").forward(request, response);
    }

    private List<Precio> obtenerPrecios() {
        // Aquí se debería implementar la lógica para obtener los precios desde la base de datos
        return null; // Retornar la lista de precios obtenida
    }
}