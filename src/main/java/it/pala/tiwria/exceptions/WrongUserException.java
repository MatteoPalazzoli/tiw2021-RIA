package it.pala.tiwria.exceptions;

public class WrongUserException extends Exception {

    public WrongUserException(){ super(); }

    public WrongUserException(String cause) { super(cause); }

}
