package it.pala.tiwria.controllers;

import it.pala.tiwria.utils.ConnectionHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import java.sql.Connection;
import java.sql.SQLException;

public class Controller extends HttpServlet {

    Connection connection;
    static final String APP_JSON = "application/json";
    static final String UTF8 = "UTF-8";

    @Override
    public void init() throws ServletException {
        connection = ConnectionHandler.getConnection(getServletContext());
    }

    public static boolean emptyField(String s){
        return s==null || s.isEmpty();
    }

    @Override
    public void destroy(){
        try {
            ConnectionHandler.closeConnection(connection);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
