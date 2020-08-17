package xyz.masq.service;

import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;
import xyz.masq.entity.Attachment;
import xyz.masq.entity.PostRequest;
import xyz.masq.error.GenericError;
import xyz.masq.lib.Utils;
import xyz.masq.repository.AttachmentRepository;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;


@Service
@Slf4j
@PropertySource("classpath:site.properties")
public class AttachmentService {

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Value("${site.attachments.path.parent}")
    private String rootPath;

    @Value("${site.attachments.thumbnail.size}")
    private int thumbnailSize;

    @Value("${site.attachments.link.life}")
    private int linkLife;

    @Value("${spring.redis.password}")
    private String redisPass;

    final private String attachmentsFolder = "attachments";

    public List<Attachment> signPostAttachments(int pid) {
        Jedis jedis = new Jedis();
        jedis.auth(redisPass);
        String key =  jedis.get("current_key");
        jedis.close();
        if (key == null) {
            log.info("Cannot retrieve current key from redis to sign url.");
            return null;
        }

        List<Attachment> attachments = attachmentRepository.findByPidOrderByAid(pid);
        for (Attachment attachment: attachments) {
            signAttachment(attachment, key);
        }

        return attachments;
    }

    public void processImage(PostRequest postRequest, int pid) {
        String[] parts = postRequest.getImage().split(",");
        String suffix = parts[0].split("[/;]")[1];
        String filename = getRandomFilename(suffix);
        boolean hasThumb = saveImage(filename, suffix, parts[1]);
        recordToDb(pid, filename, suffix, hasThumb);
    }

    private String getRandomFilename(String suffix) {
        String directory = prepareDirectory();
        String filename = directory + File.separator +  Utils.generateUuid();
        // Construct file path: attachments/2020/08/abcd1234-o.png;
        while(new File(filename + "-o." + suffix).exists()) {
            filename = directory + File.separator +  Utils.generateUuid();
        }

        // Note this only returns the filename without suffix like "-o.png" or "-s.jpg".
        return filename;
    }

    private String prepareDirectory() {
        LocalDate date = LocalDate.now(ZoneOffset.UTC);
        String path = rootPath + File.separator + attachmentsFolder + File.separator + date.getYear()
                + File.separator + date.getMonthValue();
        File f = new File(path);
        if (!f.exists() || !f.isDirectory()) {
            if (!f.mkdirs()){   // use 'mkdirs()' to create all necessary directories.
                throw new GenericError("Cannot create path at " + path);
            }
        }

        return path;
    }

    private BufferedImage readImageFromStr(String imageStr) throws IOException {
        byte[] imageBytes = Base64.getDecoder().decode(imageStr);
        ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
        BufferedImage image = ImageIO.read(bis);
        bis.close();

        return image;
    }

    private boolean saveImage(String filename, String suffix, String imageBody) {
        File origin = new File(filename + "." + suffix);
        boolean hasThumb = false;

        try {
            BufferedImage image = readImageFromStr(imageBody);
            ImageIO.write(image, suffix, origin);

            if (image.getWidth() > thumbnailSize || image.getHeight() > thumbnailSize) {
                File thumb = new File(filename + "-s." + suffix);
                BufferedImage thumbnail = Thumbnails.of(image).size(thumbnailSize, thumbnailSize).asBufferedImage();
                ImageIO.write(image, suffix, thumb);
                hasThumb = true;
            }
        } catch (IOException e) {
            throw new GenericError("Cannot read image content from post request: ");
        }

        return hasThumb;
    }

    private void recordToDb(int pid, String filename, String suffix, boolean hasThumb){
        Attachment attachment = new Attachment();
        attachment.setPid(pid);
        // Note the final "/" mark is necessary to work with REST api. remove it for test.
        String filenameRight = attachmentsFolder + filename.split(attachmentsFolder)[1];
        attachment.setUrl(filenameRight + "." + suffix);
        if (hasThumb) {
            attachment.setThumbnail(filenameRight + "-s." + suffix);
        } else {
            attachment.setThumbnail(filenameRight + "." + suffix);
        }

        attachmentRepository.save(attachment);
    }

    private void signAttachment(Attachment attachment, String key) {
        String url = signUrl(attachment.getUrl(), key);
        attachment.setUrl(url);
        url = signUrl(attachment.getThumbnail(), key);
        attachment.setThumbnail(url);
    }

    private String signUrl(String url, String key) {
        String[] parts = url.split("/");
        assert (parts.length > 1);
        String filename = parts[parts.length - 1];

        Instant instant = Instant.now().plusSeconds(linkLife);
        String expireTime = DateTimeFormatter.ISO_INSTANT.format(instant);
        String sign = getSignStr(filename, expireTime, key);

        return url + "?expire=" + expireTime + "&sign=" + sign;
    }

    private String getSignStr(String filename, String expireTime, String key) {
        String sign = null;
        try {
            sign = Utils.sha256(filename + expireTime + key);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        return sign;
    }

    public boolean checkSignedUrl(String filename, String expire, String sign) {
        Instant expireInstant = Instant.parse(expire);
        if (expireInstant.compareTo(Instant.now()) < 0) return false;

        Jedis jedis = new Jedis();
        jedis.auth(redisPass);
        String currentKey = jedis.get("current_key");
        String previousKey = jedis.get("previous_key");
        jedis.close();
        if (currentKey == null) {
            throw new GenericError("Cannot get key from redis to check signed url.");
        }
        if (getSignStr(filename, expire, currentKey).equals(sign))  return true;
        if (previousKey != null && getSignStr(filename, expire, currentKey).equals(sign)) return true;

        return false;
    }

}
