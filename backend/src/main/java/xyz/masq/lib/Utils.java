package xyz.masq.lib;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCrypt;
import javax.validation.ConstraintValidatorContext;
import java.util.Random;
import java.util.UUID;

@Slf4j
public class Utils {

    public static String generateUuid() {
        return UUID.randomUUID().toString();
    }

    public static String generateVerificationCode() {
        int code = new Random().nextInt(999999);
        return String.format("%06d", code);
    }

    public static String bcrypt(String plain) {
        return BCrypt.hashpw(plain, BCrypt.gensalt());
    }

    public static boolean checkBcrypt(String current, String saved) {
        return BCrypt.checkpw(current, saved);
    }

    public static void validationErrorMessage(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
                .addConstraintViolation();
    }

    public static int parsePositiveInt(String string) {
        if (string == null || string.length() == 0) return -1;
        int value = -1;
        try {
            value = Integer.parseInt(string);
        } catch (NumberFormatException e) {
            log.info("Cannot parse int from: " + string);
        }

        return value;
    }

}
