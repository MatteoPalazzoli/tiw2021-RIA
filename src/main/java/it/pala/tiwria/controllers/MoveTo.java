package it.pala.tiwria.controllers;

import it.pala.tiwria.beans.Category;
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
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@WebServlet(name="MoveTo", value="/Move")
@MultipartConfig
public class MoveTo extends Controller {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.sendRedirect(getServletContext().getContextPath()+"/Home");
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
        Pattern regExp = Pattern.compile("^cat\\d+$");
        String listStr = StringEscapeUtils.escapeJava(request.getParameter("list"));
        /* null check */
        if(listStr == null){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Missing values.");
            return;
        }
        List<String> ids = Arrays.asList(listStr.split(","));
        CategoryDAO dao = new CategoryDAO(connection);
        List<String> list;
        /* pattern check */
        if(ids.size() % 2 != 0 || !ids.stream().allMatch(c -> regExp.matcher(c).find())){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Input is missing or invalid: no action taken.");
            return;
        }
        ids = ids.stream().map(c -> c.substring(3)).collect(Collectors.toList());
        try{
            list = dao.getTree().stream().map(Category::getId).collect(Collectors.toList());
        } catch (SQLException e) {
            e.printStackTrace();
            return;
        }
        /* present check */
        if(ids.stream().anyMatch(c -> !list.contains(c))){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Some of the categories don't exist: no action taken.");
            return;
        }
        String fromId, toId;
        /* illegal move check */
        for(int i=0; i<ids.size(); i+=2){
            fromId = ids.get(i);
            toId = ids.get(i+1);
            if(toId.startsWith(fromId)){
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("Cannot move a father under a child (\""+fromId+"\" to \""+toId+"\").\nNo action taken.");
                return;
            }
        }
        /* perform */
        for(int i=0; i<ids.size(); i+=2){
            fromId = ids.get(i);
            toId = ids.get(i+1);
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
