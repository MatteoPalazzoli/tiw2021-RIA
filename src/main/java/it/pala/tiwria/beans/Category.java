package it.pala.tiwria.beans;

public class Category {

    private final String id;
    private final String name;

    public Category(String id, String name){
        this.name = name;
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public String getId() { return id; }

    public String getHTMLSpaces(){
        StringBuilder result = new StringBuilder();
        for(int i=0; i<id.length(); i++){
            result.append("&nbsp;");
        }
        return result.toString();
    }

    @Override
    public String toString(){
        return id+" "+name;
    }
}
