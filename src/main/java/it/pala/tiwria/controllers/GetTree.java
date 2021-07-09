package it.pala.tiwria.controllers;

import com.google.gson.Gson;
import it.pala.tiwria.beans.Category;
import it.pala.tiwria.dao.CategoryDAO;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet(name="GetTree", value={"/GetTree"})
public class GetTree extends Controller {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        CategoryDAO dao = new CategoryDAO(connection);
        List<Category> categories;
        try{
            categories = dao.getTree();
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType(APP_TYPE);
            response.setCharacterEncoding(UTF8);
            response.getWriter().println("Not possible to retrieve the categories");
            return;
        }

        Gson gson = new Gson();
        String json = gson.toJson(categories);
        response.setContentType(APP_TYPE);
        response.setCharacterEncoding(UTF8);
        response.getWriter().write(json);
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        doGet(request, response);
    }
}
