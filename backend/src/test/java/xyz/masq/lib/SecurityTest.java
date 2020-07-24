package xyz.masq.lib;

import org.junit.jupiter.api.RepeatedTest;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.KeyPair;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SecurityTest {

    @RepeatedTest(10)
    public void rsaEncryptTest()
            throws NoSuchAlgorithmException, InvalidKeySpecException,
            IllegalBlockSizeException, InvalidKeyException,
            BadPaddingException, NoSuchPaddingException {

        KeyPair kp = Security.generateRsaKeyPair();

        String privateKeyStr = Security.encodeKeyBase64(kp.getPrivate());
        String publicKeyStr = Security.encodeKeyBase64(kp.getPublic());
        System.out.println(publicKeyStr + "\n" + privateKeyStr);

        Key privateKey = Security.decodeKeyBase64(privateKeyStr, 0);
        Key publicKey = Security.decodeKeyBase64(publicKeyStr, 1);
        System.out.println(publicKey + "\n" + privateKey);

        String plain = generateRandomStr();
        System.out.println(plain);
        String cipher = Security.encryptText(plain, publicKey);
        String decipher = Security.decryptText(cipher, privateKey);
        assertEquals(plain, decipher);
    }

    // Generate a random string to test rsa encryption
    private static String generateRandomStr() {
        int MAX_LENGTH = 240;   // actual max length is 245 in rsa encryption.
        int length = new Random().nextInt(MAX_LENGTH);
        int leftLimit = 48;     // char '0'.
        int rightLimit = 122;   // char 'z'.
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int n = leftLimit + new Random().nextInt(rightLimit - leftLimit + 1);
            sb.append((char)n);
        }

        return sb.toString();
    }
}
