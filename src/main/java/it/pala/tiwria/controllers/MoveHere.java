package it.pala.tiwria.controllers;

import it.pala.tiwria.dao.CategoryDAO;
import it.pala.tiwria.exceptions.IllegalMoveException;
import it.pala.tiwria.exceptions.NoSuchCategoryException;
import org.apache.commons.text.StringEscapeUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

@WebServlet(name="MoveHere", value="/MoveHere")
public class MoveHere extends Controller {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String fromId = StringEscapeUtils.escapeJava(request.getParameter("fromid"));
        String toId = StringEscapeUtils.escapeJava(request.getParameter("toid"));

        if(emptyField(fromId) || emptyField(toId)){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Details must be not null or empty");
            return;
        }

        CategoryDAO dao = new CategoryDAO(connection);
        try {
            dao.updateCategory(fromId, toId);
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("Could not move the category.");
            return;
        } catch (NoSuchCategoryException | IllegalMoveException | IndexOutOfBoundsException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println(e.getMessage());
            return;
        }

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType(APP_TYPE);
        response.setCharacterEncoding(UTF8);
    }
}
