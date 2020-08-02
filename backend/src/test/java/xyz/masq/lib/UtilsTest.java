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

    @Test
    public void passwordTest() {
        String pw = "11111111a";
        assertTrue(Utils.checkPassword(pw));
        pw = "111AA111";
        assertTrue(Utils.checkPassword(pw));
        pw = "aa11aa+-";
        assertTrue(Utils.checkPassword(pw));

        pw = "aa 11aa+-";
        assertFalse(Utils.checkPassword(pw));
        pw = "123abc";
        assertFalse(Utils.checkPassword(pw));
    }

}
