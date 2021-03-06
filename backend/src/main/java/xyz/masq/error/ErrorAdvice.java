package xyz.masq.error;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
@Slf4j
public class ErrorAdvice {

    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public String notFound(Exception e) {
        log.error("Page not found: " + e);
        return "Resource not found.";
    }

    @ExceptionHandler({AuthError.class, GenericError.class})
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public String handleLoginFailed(Exception e) {
        log.error("Auth or session failed: " + e.getMessage());
        return e.getMessage();
    }

}
