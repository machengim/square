package xyz.masq.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
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
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Base64;


@Service
@Slf4j
@PropertySource("classpath:site.properties")
public class AttachmentService {

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Value("${site.attachments.path}")
    private String rootPath;

    // TODO: generate thumbnail.
    public int processImage(PostRequest postRequest, int pid) {
        String[] parts = postRequest.getImage().split(",");
        String suffix = parts[0].split("[/;]")[1];
        String filename = getRandomFilename(suffix) + "-o." + suffix;
        File output = new File(filename);

        try {
            BufferedImage image = readImageFromStr(parts[1]);
            ImageIO.write(image, suffix, output);
        } catch (IOException e) {
            throw new GenericError("Cannot read image content from post request: " + postRequest);
        }

        // Considering remove 'ctime' filed in 'attachment' table in db.
        Attachment attachment = new Attachment();
        attachment.setPid(pid);
        attachment.setUrl(filename);
        attachment.setThumbnail("");    // No thumbnail for now.
        attachment = attachmentRepository.save(attachment);

        return attachment.getAid();
    }

    private String getRandomFilename(String suffix) {
        String directory = prepareDirectory();
        String filename = directory + File.separator +  Utils.generateUuid();
        // Construct file path: attachments/2020/07/abcd1234-o.png;
        while(new File(filename + "-o." + suffix).exists()) {
            filename = directory + File.separator +  Utils.generateUuid();
        }

        // Note this only returns the filename without suffix like "-o.png" or "-s.jpg".
        return filename;
    }

    private String prepareDirectory() {
        LocalDate date = LocalDate.now(ZoneOffset.UTC);
        String path = rootPath + File.separator + date.getYear() + File.separator + date.getMonthValue();
        File f = new File(path);
        if (!f.exists() || !f.isDirectory()) {
            if (!f.mkdirs()){   // use 'mkdirs()' to create all necessary directories.
                throw new GenericError("Cannot create directory at " + date);
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

}
