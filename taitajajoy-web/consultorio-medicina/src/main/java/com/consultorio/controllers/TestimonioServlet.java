package com.consultorio.controllers;

import com.consultorio.models.Testimonio;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/testimonios")
public class TestimonioServlet extends HttpServlet {

    private TestimonioService testimonioService;

    @Override
    public void init() throws ServletException {
        testimonioService = new TestimonioService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Testimonio> testimonios = testimonioService.obtenerTestimonios();
        request.setAttribute("testimonios", testimonios);
        request.getRequestDispatcher("/testimonios.html").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String nombre = request.getParameter("nombre");
        String contenido = request.getParameter("contenido");

        Testimonio testimonio = new Testimonio();
        testimonio.setNombre(nombre);
        testimonio.setContenido(contenido);

        testimonioService.agregarTestimonio(testimonio);
        response.sendRedirect("testimonios");
    }
}