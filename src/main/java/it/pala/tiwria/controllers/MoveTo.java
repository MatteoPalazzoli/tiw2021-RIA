package it.pala.tiwria.controllers;

import it.pala.tiwria.dao.CategoryDAO;
import it.pala.tiwria.exceptions.IllegalMoveException;
import it.pala.tiwria.exceptions.NoSuchCategoryException;
import org.apache.commons.text.StringEscapeUtils;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet(name="MoveTo", value="/Move")
@MultipartConfig
public class MoveTo extends Controller {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response){
        PrintWriter out;
        response.setCharacterEncoding(UTF8);
        response.setContentType("text/html");
        try{
            out = response.getWriter();
        } catch (IOException e){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        String listStr = StringEscapeUtils.escapeJava(request.getParameter("list"));
        String[] ids = listStr.split(",");
        //couples of values are sent
        if(ids.length % 2 != 0){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Missing values (odd number of values sent).");
            return;
        }
        String fromId, toId;
        for(int i=0; i<ids.length; i++){
            fromId = ids[i].substring(3);
            toId = ids[i+1].substring(3);
            try{
                //number check
                Integer.parseInt(fromId);
                Integer.parseInt(toId);
            } catch(NumberFormatException e){
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("Illegal arguments (not numbers).");
                return;
            }
            //father under child check
            if(toId.startsWith(fromId)){
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("Cannot move a father under a child (\""+fromId+"\" to \""+toId+"\"). ");
                return;
            }

            CategoryDAO dao = new CategoryDAO(connection);
            try {
                dao.updateCategory(fromId, toId);
            } catch (SQLException e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.println("[SQL] Could not move the category from "+fromId+" to "+toId+".");
                return;
            } catch (NoSuchCategoryException | IllegalMoveException | IndexOutOfBoundsException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println(e.getMessage());
                return;
            }
            response.setStatus(HttpServletResponse.SC_OK);
            out.println("Moved \""+fromId+"\" to \""+toId+"\". ");
        }
    }
}
