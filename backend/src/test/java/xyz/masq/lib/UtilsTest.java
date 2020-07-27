package xyz.masq.lib;

import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class UtilsTest {

    // Test verification code generation.
    @RepeatedTest(10)
    public void verificationCodeTest() {
        String code = Utils.generateVerificationCode();
        System.out.println(code);
        assertEquals(6, code.length());
    }

    @Test
    public void bcryptTest() {
        String plain = "Hello world";
        String hashed = Utils.bcrypt(plain);
        String fake = "Hello world!";
        System.out.println(hashed);
        assertTrue(Utils.checkBcrypt(plain, hashed));
        assertFalse(Utils.checkBcrypt(fake, hashed));
    }

}
