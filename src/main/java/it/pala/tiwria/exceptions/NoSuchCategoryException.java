package it.pala.tiwria.exceptions;

public class NoSuchCategoryException extends Exception{

    public NoSuchCategoryException() {
        super();
    }

    public NoSuchCategoryException(String message) {
        super(message);
    }
}
