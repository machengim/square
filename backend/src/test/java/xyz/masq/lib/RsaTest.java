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

public class RsaTest {

    @RepeatedTest(10)
    public void rsaEncryptTest()
            throws NoSuchAlgorithmException, InvalidKeySpecException,
            IllegalBlockSizeException, InvalidKeyException,
            BadPaddingException, NoSuchPaddingException {

        KeyPair kp = Rsa.generateRsaKeyPair();

        String privateKeyStr = Rsa.encodeKeyBase64(kp.getPrivate());
        String publicKeyStr = Rsa.encodeKeyBase64(kp.getPublic());
        System.out.println(publicKeyStr + "\n" + privateKeyStr);

        Key privateKey = Rsa.decodeKeyBase64(privateKeyStr, 0);
        Key publicKey = Rsa.decodeKeyBase64(publicKeyStr, 1);
        System.out.println(publicKey + "\n" + privateKey);

        String plain = generateRandomStr();
        System.out.println(plain);
        String cipher = Rsa.encryptText(plain, publicKey);
        String decipher = Rsa.decryptText(cipher, privateKey);
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
