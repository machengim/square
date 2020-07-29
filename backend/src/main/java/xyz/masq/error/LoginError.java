package xyz.masq.error;

public class LoginError extends RuntimeException {
    public LoginError() {
        super();
    }

    public LoginError(String message) {
        super(message);
    }

    public LoginError(String message, Throwable cause) {
        super(message, cause);
    }
}
