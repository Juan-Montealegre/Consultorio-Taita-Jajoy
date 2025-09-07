package com.consultorio.controllers;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;

@WebServlet("/whatsapp")
public class WhatsappServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String message = "Hola, me gustaría confirmar una cita.";
        String phoneNumber = "123456789"; // Reemplazar con el número de WhatsApp del consultorio
        String url = "https://wa.me/" + phoneNumber + "?text=" + URLEncoder.encode(message, "UTF-8");
        
        response.sendRedirect(url);
    }
}