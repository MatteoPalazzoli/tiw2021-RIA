package it.pala.tiwria.controllers;

import org.apache.commons.text.StringEscapeUtils;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

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
        out.println("Sent: "+listStr);
        String[] ids = listStr.split(",");
        if(ids.length % 2 != 0){
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.println("Missing values");
            return;
        }
        String fromId, toId;
        for(int i=0; i<ids.length; i++){
            fromId = ids[i];
            toId = ids[i+1];
            if(toId.startsWith(fromId)){
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("Cannot move a father under a child.");
                return;
            }
            //TODO
        }
    }
}
