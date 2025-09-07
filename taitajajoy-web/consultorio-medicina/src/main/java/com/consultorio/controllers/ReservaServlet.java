package com.consultorio.controllers;

import com.consultorio.models.Reserva;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/reservas")
public class ReservaServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String fecha = request.getParameter("fecha");
        String cliente = request.getParameter("cliente");

        Reserva reserva = new Reserva();
        reserva.setFecha(fecha);
        reserva.setCliente(cliente);

        // Aquí se debería agregar la lógica para guardar la reserva en la base de datos

        response.sendRedirect("confirmacion.html");
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Aquí se podría agregar lógica para mostrar reservas existentes si es necesario
    }
}