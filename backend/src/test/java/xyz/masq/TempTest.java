package xyz.masq;

import org.junit.jupiter.api.Test;
import redis.clients.jedis.Jedis;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;


import static org.junit.jupiter.api.Assertions.assertEquals;

public class TempTest {
    public static void main(String[] args) {

    }

    public static void rsaKey() throws NoSuchAlgorithmException, InvalidKeySpecException, NoSuchPaddingException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
        kpg.initialize(2048);
        KeyPair kp = kpg.generateKeyPair();
        Key privateKey = kp.getPrivate();
        Key publicKey = kp.getPublic();

        Base64.Encoder encoder = Base64.getEncoder();
        String privateKeyStr = encoder.encodeToString(privateKey.getEncoded());
        System.out.println(privateKeyStr);

        byte[] keyBytes = Base64.getDecoder().decode(privateKeyStr.getBytes());
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        System.out.println(kf.generatePrivate(spec));

        String plain = "Hello world!";
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);

        byte[] encryptBytes = cipher.doFinal(plain.getBytes());
        System.out.println(Base64.getEncoder().encodeToString(encryptBytes));

        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        byte[] deryptedBytes = cipher.doFinal(encryptBytes);
        System.out.println(new String(deryptedBytes));
    }

    public static void redisConn(String url, int port) {
        Jedis jedis = new Jedis(url, port);
        jedis.auth("qwer1234");
        jedis.set("uid", "123456");
    }
}