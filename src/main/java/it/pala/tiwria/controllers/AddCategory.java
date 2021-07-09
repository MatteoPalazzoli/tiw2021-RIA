package it.pala.tiwria.controllers;

import it.pala.tiwria.dao.CategoryDAO;
import it.pala.tiwria.exceptions.DuplicateCategoryException;
import it.pala.tiwria.exceptions.NoSuchCategoryException;
import org.apache.commons.text.StringEscapeUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

@WebServlet(name="AddCategory", value="/AddCategory")
public class AddCategory extends Controller {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.getWriter().println("getted");
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String name = StringEscapeUtils.escapeJava(request.getParameter("name"));
        String father = StringEscapeUtils.escapeJava(request.getParameter("father"));
        String errorMsg = "";

        if(emptyField(name) || emptyField(father)){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Details must be not null or empty");
            return;
        }

        CategoryDAO dao = new CategoryDAO(connection);
        try {
            dao.createCategory(name, father);
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("Could not add the category.");
            return;
        } catch (NoSuchCategoryException | IndexOutOfBoundsException e){
            errorMsg = e.getMessage();
        } catch (DuplicateCategoryException e){
            errorMsg = "Category "+name+" already exists.";
        }
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType(APP_TYPE);
        response.setCharacterEncoding(UTF8);
        response.getWriter().println(errorMsg);
    }
}
