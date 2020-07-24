package xyz.masq.lib;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.*;
import java.security.spec.EncodedKeySpec;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class Security {

    public static KeyPair generateRsaKeyPair()
            throws NoSuchAlgorithmException {

        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
        kpg.initialize(2048);
        return kpg.generateKeyPair();
    }

    public static String encodeKeyBase64(Key key) {
        return Base64.getEncoder().encodeToString(key.getEncoded());
    }

    // op == 0 means private key, 1 means public.
    public static Key decodeKeyBase64(String keyStr, int op)
            throws NoSuchAlgorithmException, InvalidKeySpecException {

        byte[] keyBytes = Base64.getDecoder().decode(keyStr.getBytes());
        EncodedKeySpec spec = (op == 0)? new PKCS8EncodedKeySpec(keyBytes):
                new X509EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return (op == 0)? kf.generatePrivate(spec): kf.generatePublic(spec);
    }

    // public key required. Note input string must be shorter than 245 bytes.
    public static String encryptText(String plainStr, Key key)
            throws NoSuchPaddingException, NoSuchAlgorithmException,
            InvalidKeyException, BadPaddingException, IllegalBlockSizeException {

        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        byte[] encryptBytes = cipher.doFinal(plainStr.getBytes());
        return Base64.getEncoder().encodeToString(encryptBytes);
    }

    // private key required.
    public static String decryptText(String decryptStr, Key key)
            throws NoSuchPaddingException, NoSuchAlgorithmException,
            InvalidKeyException, BadPaddingException, IllegalBlockSizeException {

        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(Cipher.DECRYPT_MODE, key);
        byte[] cipherBytes = Base64.getDecoder().decode(decryptStr);
        byte[] decryptBytes = cipher.doFinal(cipherBytes);
        return new String(decryptBytes);
    }
}
