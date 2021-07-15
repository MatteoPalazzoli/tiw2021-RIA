package it.pala.tiwria.filters;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@WebFilter(filterName="Checker", value={"/home.html", "/GetTree", "/AddCategory", "/Move"})
public class Checker implements Filter {

    /**
     * Default constructor.
     */
    public Checker() {
        // TODO Auto-generated constructor stub
    }

    /**
     * @see javax.servlet.Filter#destroy()
     */
    @Override
    public void destroy() {
        // TODO Auto-generated method stub
    }

    /**
     * @see javax.servlet.Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
     */
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        String loginPath = req.getServletContext().getContextPath() + "/index.html";
        String checkPath = req.getServletContext().getContextPath() + "/CheckLogin";

        System.out.println("Filter: "+req.getRequestURI()+", by "+req.getSession().getAttribute("user"));

        HttpSession s = req.getSession();
        if (!req.getRequestURI().equals(loginPath)
                && !req.getRequestURI().equals(checkPath)
                && (s.isNew() || s.getAttribute("user") == null)) {
            res.setStatus(HttpServletResponse.SC_FORBIDDEN);
            res.sendRedirect(loginPath);
            return;
        }

        // pass the request along the filter chain
        chain.doFilter(request, response);
    }

    /**
     * @see javax.servlet.Filter#init(FilterConfig)
     */
    @Override
    public void init(FilterConfig fConfig) throws ServletException {
        // TODO Auto-generated method stub
    }
}
