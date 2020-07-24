package xyz.masq.lib;

import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class UtilsTest {

    // Test verification code generation.
    @RepeatedTest(10)
    public void verificationCodeTest() {
        String code = Utils.generateVerificationCode();
        System.out.println(code);
        assertEquals(6, code.length());
    }
}
