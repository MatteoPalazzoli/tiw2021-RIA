package it.pala.tiwria.controllers;

import it.pala.tiwria.dao.CategoryDAO;
import it.pala.tiwria.exceptions.DuplicateCategoryException;
import it.pala.tiwria.exceptions.NoSuchCategoryException;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.sql.SQLException;

@WebServlet(name="AddCategory", value="/AddCategory")
@MultipartConfig
public class AddCategory extends Controller {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.sendRedirect(getServletContext().getContextPath()+"/Home");
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws UnsupportedEncodingException {
        PrintWriter out;
        try{
            out = response.getWriter();
        } catch (IOException e){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }
        request.setCharacterEncoding(UTF8);
        response.setCharacterEncoding(UTF8);
        response.setContentType("text/html");

        String name = request.getParameter("name");
        String father = request.getParameter("father");

        if(emptyField(name) || emptyField(father)){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Details must be not null or empty");
            return;
        }

        CategoryDAO dao = new CategoryDAO(connection);
        try {
            dao.createCategory(name, father);
        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("Could not add the category.");
            return;
        } catch (NoSuchCategoryException | IndexOutOfBoundsException e){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println(e.getMessage());
            return;
        } catch (DuplicateCategoryException e){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Category "+name+" already exists.");
            return;
        }
        response.setStatus(HttpServletResponse.SC_OK);
        out.println("Category added.");
    }
}
