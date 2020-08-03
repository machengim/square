package xyz.masq.lib;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Hex;
import org.springframework.security.crypto.bcrypt.BCrypt;

import javax.imageio.ImageIO;
import javax.validation.ConstraintValidatorContext;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Random;
import java.util.UUID;
import java.util.regex.Pattern;

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

    public static String readJsonValue(String jsonStr, String key) {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode node = null;
        try {
            node = mapper.readTree(jsonStr);
        } catch (JsonProcessingException e) {
            log.info("Cannot read value of [" + key + "] form json string: " + jsonStr);
        }

        return (node == null)? null: node.get(key).textValue();
    }

    public static boolean checkUname(String uname) {
        if (uname.length() > 32) return false;
        String pattern = ("^[a-zA-Z0-9_ ]*");
        return Pattern.matches(pattern, uname);
    }

    public static boolean checkPassword(String pw) {
        if (pw == null || pw.length() < 8) return false;

        return Pattern.matches(".*\\d.*", pw) && Pattern.matches(".*[a-zA-Z]+.*", pw)
                && !Pattern.matches(".*\\s.*", pw);
    }

    public static String sha256(String text) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] result = digest.digest(text.getBytes(StandardCharsets.UTF_8));
        return Hex.encodeHexString(result);
    }
}
