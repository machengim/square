package xyz.masq.annotation;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import xyz.masq.error.AuthError;
import xyz.masq.lib.Utils;
import xyz.masq.service.SessionService;
import java.lang.reflect.Method;

@Aspect
@Component
@Slf4j
public class AuthAspect {

    @Autowired
    private SessionService sessionService;

    // Need full path to work with annotation in different package.
    @Before("@annotation(xyz.masq.annotation.Auth)")
    public void authUserIdentity(JoinPoint joinPoint) throws Throwable {
        // Admin can pass any authorization so no need for further check.
        if (checkAdmin()) return;

        String value = getAnnotationValue(joinPoint);
        if (value.equals("admin")) {
            throw new AuthError("Admin permission required.");
        } else if (value.equals("owner") && !checkOwner(joinPoint)) {
            throw new AuthError("Owner permission required.");
        } else if (value.equals("logged") && !checkLogged()) {
            throw new AuthError("Only available to logged user.");
        }

    }

    private String getAnnotationValue(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        Auth auth = method.getAnnotation(Auth.class);
        return auth.value();
    }

    private boolean checkAdmin() {
        return sessionService.readIntByKey("type") == 99;
    }

    private boolean checkLogged() {
        int uid = sessionService.readIntByKey("uid");
        return uid > 0;
    }

    private boolean checkOwner(JoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        if (args == null || args.length == 0) {
            log.info("No uid found in request, owner checking process aborted.");
            return false;
        }
        int uid = Utils.parsePositiveInt(args[0].toString());
        if (uid <= 0) {
            log.info("Invalid uid in request when checking owner.");
            return false;
        }

        return uid == sessionService.readIntByKey("uid");
    }
}
