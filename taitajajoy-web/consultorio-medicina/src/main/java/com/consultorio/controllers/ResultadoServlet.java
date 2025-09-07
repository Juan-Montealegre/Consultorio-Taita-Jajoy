package com.consultorio.controllers;

import com.consultorio.models.Resultado;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@WebServlet("/resultados")
public class ResultadoServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Aquí se obtendrán los resultados de los tratamientos desde la base de datos
        List<Resultado> resultados = obtenerResultados();
        
        // Se establecerá la lista de resultados como atributo de la solicitud
        request.setAttribute("resultados", resultados);
        
        // Se redirige a la página de resultados
        request.getRequestDispatcher("/resultados.html").forward(request, response);
    }

    private List<Resultado> obtenerResultados() {
        // Lógica para obtener resultados de la base de datos
        // Este método debe conectarse a la base de datos y recuperar los resultados
        return null; // Reemplazar con la lógica real
    }
}