package it.pala.tiwria.dao;

import it.pala.tiwria.beans.Category;
import it.pala.tiwria.exceptions.DuplicateCategoryException;
import it.pala.tiwria.exceptions.IllegalMoveException;
import it.pala.tiwria.exceptions.NoSuchCategoryException;

import java.sql.*;
import java.util.LinkedList;
import java.util.List;

public class CategoryDAO {

    private final Connection connection;

    public CategoryDAO(Connection connection){
        this.connection = connection;
    }

    /**
     * @param category Name of a category
     * @return Category's ID
     * @throws NoSuchCategoryException if the category is not found
     */
    private Category findCategory(String category, ParamType type) throws NoSuchCategoryException {
        String param;
        String toFind;
        if(type == ParamType.ID){
            param = "ID";
            toFind = "Name";
        } else {
            param = "Name";
            toFind = "ID";
        }
        String query = "SELECT "+toFind+" FROM category WHERE "+param+" = ?";
        try (PreparedStatement pStatement = connection.prepareStatement(query)) {
            pStatement.setString(1, category);
            try(ResultSet result = pStatement.executeQuery()){
                result.next();
                return type==ParamType.ID ?
                        new Category(category, result.getString(toFind)) :
                        new Category(result.getString(toFind), category);
            }
        } catch (SQLException e){
            e.printStackTrace();
            throw new NoSuchCategoryException(param+" \""+category+"\" doesn't exists.");
        }
    }

    private String findNextChildId(String father) throws SQLException, NoSuchCategoryException, IndexOutOfBoundsException {
        String query;
        ResultSet result;
        if(father.equals("Root")){
            query = "SELECT CAST(MAX(ID) AS UNSIGNED)+1 AS NextChildID FROM category WHERE ID LIKE '_'";
        } else {
            String subQuery = "(SELECT ID FROM category WHERE Name = ?)";
            try (PreparedStatement pStatement = connection.prepareStatement(subQuery)) {
                pStatement.setString(1, father);
                //pStatement.toString() starts with some additional information;
                //So we cut it starting from the 43rd character.
                subQuery = pStatement.toString().substring(43);
            }
            query = "SELECT CAST((SELECT MAX(ID) FROM category WHERE ID LIKE CONCAT("+subQuery+", \"_\")) AS UNSIGNED) + 1 AS NextChildID";
        }
        try (Statement statement = connection.prepareStatement(query)) {
            result = statement.executeQuery(query);
            result.next();
            String id = result.getString("NextChildID");
            if(id==null){ id = findCategory(father, ParamType.NAME).getId()+"1"; }
            if(id.endsWith("0")){
                throw new IndexOutOfBoundsException("Maximum of 9 (sub-)categories reached.");
            }
            return id;
        }
    }

    /**
     * Retrieves the complete tree sorted by ID and returns it as a list.
     * @return Sorted List of categories
     * @throws SQLException if there is a database error
     */
    public List<Category> getTree() throws SQLException {
        List<Category> categories = new LinkedList<>();
        String query = "SELECT ID, Name FROM category WHERE ID <> 0 ORDER BY ID";
        ResultSet result;
        //no need for preparing
        try (Statement statement = connection.prepareStatement(query)) {
            result = statement.executeQuery(query);
            while(result.next()){
                categories.add(new Category(
                        result.getString("ID"),
                        result.getString("Name")));
            }
        }
        return categories;
    }

    public void createCategory(String name, String father) throws SQLException, NoSuchCategoryException, DuplicateCategoryException, IndexOutOfBoundsException {
        String query = "INSERT INTO category (ID, Name) VALUES (?, ?)";
        if(isPresent(name, ParamType.NAME)) throw new DuplicateCategoryException();
        if(!isPresent(father, ParamType.NAME)) throw new NoSuchCategoryException("Category "+father+" doesn't exists.");
        try(PreparedStatement pStatement = connection.prepareStatement(query)){
            pStatement.setString(1, findNextChildId(father));
            pStatement.setString(2, name);
            pStatement.executeUpdate();
        }
    }

    private boolean isPresent(String category, ParamType type) throws SQLException {
        String param = type == ParamType.ID ? "ID" : "Name";
        String query = "SELECT ID FROM category WHERE "+param+" = '"+category+"'";
        ResultSet set;
        try(Statement s = connection.prepareStatement(query)){
            set = s.executeQuery(query);
            return set.next();
        }
    }

    /**
     * Returns a portion of the tree given its father's ID
     * @param id father's ID
     * @return tree
     * @throws SQLException if a database error occurs
     */
    private List<String> getTree(String id) throws SQLException {
        List<String> categories = new LinkedList<>();
        String id2 = id
                .replace("!", "!!")
                .replace("%", "!%")
                .replace("_", "!_")
                .replace("[", "![");
        String query = "SELECT ID FROM category WHERE ID LIKE ? ESCAPE '!' ORDER BY ID";
        ResultSet result;
        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setString(1, id2+"%");
            result = statement.executeQuery();
            while(result.next()){
                categories.add(result.getString("ID"));
            }
        }
        return categories;
    }

    /**
     * Moves a category under a new father.
     * @param id category's ID
     * @param destinationId new father's ID
     * @throws SQLException if there's a database error
     * @throws NoSuchCategoryException if the new father doesn't exist
     */
    public void updateCategory(String id, String destinationId) throws SQLException, NoSuchCategoryException, IllegalMoveException, IndexOutOfBoundsException {
        if(!isPresent(id, ParamType.ID)) throw new NoSuchCategoryException("Category "+id+" doesn't exists.");
        if(!isPresent(destinationId, ParamType.ID)) throw new NoSuchCategoryException("Category "+destinationId+" doesn't exists.");
        if(destinationId.startsWith(id)){
            if(id.length() != destinationId.length()) throw new IllegalMoveException("Cannot move a father ("+id+") under one of its children ("+destinationId+")");
            else return; //ids are equal
        }
        if(id.equals("0")) throw new IllegalMoveException("Cannot move Root");
        List<String> ids = getTree(id);
        Category destination = findCategory(destinationId, ParamType.ID);
        String newFather = findNextChildId(destination.getName());

        for(String i : ids){
            String newId = i.replaceFirst(id, newFather);
            String query = "UPDATE category SET ID = ? WHERE ID = ?";
            try (PreparedStatement statement = connection.prepareStatement(query)) {
                statement.setString(1, newId);
                statement.setString(2, i);
                statement.executeUpdate();
            }
        }
    }
}
