package it.pala.tiwria.controllers;

import it.pala.tiwria.dao.UserDAO;
import it.pala.tiwria.exceptions.WrongUserException;
import org.apache.commons.text.StringEscapeUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.Map;

@WebServlet(name="CheckLogin", value={"/CheckLogin"})
@MultipartConfig
public class CheckLogin extends Controller {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        doPost(request, response);
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String user, pwd, name = "";
        PrintWriter out;
        response.setCharacterEncoding(UTF8);

        try{
            out = response.getWriter();
        } catch (IOException e){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        if(request.getSession().getAttribute("user") != null){
            response.setStatus(HttpServletResponse.SC_OK);
            out.println(name);
            return;
        }

        user = StringEscapeUtils.escapeJava(request.getParameter("username"));
        pwd = StringEscapeUtils.escapeJava(request.getParameter("pwd"));
        if(emptyField(user) || emptyField(pwd)){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("text/html");
            out.println("Empty or null credentials.");
            return;
        }

        // query db to authenticate for user
        UserDAO userDao = new UserDAO(connection);
        try {
            name = userDao.checkCredentials(user, pwd);
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("Internal server error, retry later");
            return;
        } catch (WrongUserException e){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.println("Invalid credentials.");
            return;
        }

        response.setContentType("text/html");
        request.getSession().setAttribute("user", name);
        response.setStatus(HttpServletResponse.SC_OK);
        out.println(name);
    }

}