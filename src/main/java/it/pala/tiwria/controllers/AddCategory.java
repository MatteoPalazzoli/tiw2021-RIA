package it.pala.tiwria.controllers;

import it.pala.tiwria.dao.CategoryDAO;
import it.pala.tiwria.exceptions.DuplicateCategoryException;
import it.pala.tiwria.exceptions.NoSuchCategoryException;
import org.apache.commons.text.StringEscapeUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet(name="AddCategory", value="/AddCategory")
@MultipartConfig
public class AddCategory extends Controller {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) {
        response.setContentType("text/html");
        PrintWriter out;
        response.setCharacterEncoding(UTF8);
        try{
            out = response.getWriter();
        } catch (IOException e){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }
        response.setStatus(HttpServletResponse.SC_OK);
        out.print("GET used");
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) {
        PrintWriter out;
        try{
            out = response.getWriter();
        } catch (IOException e){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }
        response.setCharacterEncoding(UTF8);
        response.setContentType("text/html");

        String name = StringEscapeUtils.escapeJava(request.getParameter("name"));
        String father = StringEscapeUtils.escapeJava(request.getParameter("father"));
        String errorMsg = "";

        if(emptyField(name) || emptyField(father)){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Details must be not null or empty");
            return;
        }

        CategoryDAO dao = new CategoryDAO(connection);
        try {
            dao.createCategory(name, father);
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("Could not add the category.");
            return;
        } catch (NoSuchCategoryException | IndexOutOfBoundsException e){
            errorMsg = e.getMessage();
        } catch (DuplicateCategoryException e){
            errorMsg = "Category "+name+" already exists.";
        }
        response.setStatus(HttpServletResponse.SC_OK);
        out.println(errorMsg);
    }
}
